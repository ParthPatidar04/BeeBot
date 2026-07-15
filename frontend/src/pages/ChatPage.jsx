import { useCallback, useEffect, useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import Sidebar from "../components/Sidebar.jsx";
import TopBar from "../components/TopBar.jsx";
import InputBar from "../components/InputBar.jsx";
import ChatWindow from "../components/ChatWindow.jsx";

export default function ChatPage() {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);

  const loadChats = useCallback(async () => {
    const { data } = await api.get("/chats");
    setChats(data);
  }, []);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  const selectChat = async (id) => {
    setActiveChatId(id);
    const { data } = await api.get(`/chats/${id}`);
    setMessages(data.messages);
  };

  const startNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
  };

  const renameChat = async (id, title) => {
    await api.put(`/chats/${id}`, { title });
    setChats((prev) => prev.map((c) => (c._id === id ? { ...c, title } : c)));
  };

  const deleteChat = async (id) => {
    await api.delete(`/chats/${id}`);
    setChats((prev) => prev.filter((c) => c._id !== id));
    if (id === activeChatId) startNewChat();
  };

  const sendMessage = async (text) => {
    let chatId = activeChatId;

    // Lazily create a chat session on first message
    if (!chatId) {
      const { data: newChat } = await api.post("/chats");
      chatId = newChat._id;
      setActiveChatId(chatId);
      setChats((prev) => [newChat, ...prev]);
    }

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setSending(true);

    try {
      const { data } = await api.post(`/chats/${chatId}/message`, {
        message: text,
      });
      setMessages((prev) => [...prev, { role: "model", content: data.reply }]);
      setChats((prev) =>
        prev.map((c) => (c._id === chatId ? { ...c, title: data.title } : c))
      );
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content:
            "Sorry, something went wrong reaching the AI. Please try again.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const firstName = user?.name?.split(" ")[0];
  const hasMessages = messages.length > 0;

  return (
    <div className="h-screen w-full bg-canvas p-4 flex gap-4 font-sans">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={selectChat}
        onRenameChat={renameChat}
        onDeleteChat={deleteChat}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <TopBar onNewChat={startNewChat} />

        {hasMessages ? (
          <>
            <ChatWindow messages={messages} loading={sending} />
            <div className="mt-4">
              <InputBar onSend={sendMessage} disabled={sending} />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full gradient-orb mb-6" />
            <h1 className="text-3xl font-bold text-ink text-center leading-tight">
              Good Morning, {firstName}
            </h1>
            <h2 className="text-3xl font-bold text-center leading-tight">
              How Can I <span className="text-accent">Assist You Today?</span>
            </h2>

            <div className="w-full max-w-xl mt-10">
              <InputBar onSend={sendMessage} disabled={sending} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
