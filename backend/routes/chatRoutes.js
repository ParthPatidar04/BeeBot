import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Chat from "../models/Chat.js";
import protect from "../middleware/auth.js";

const router = express.Router();
router.use(protect);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @route   GET /api/chats
// @desc    Fetch all chat sessions for the logged-in user (sidebar list)
router.get("/", async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.userId })
      .select("title createdAt updatedAt")
      .sort({ updatedAt: -1 });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/chats
// @desc    Create a new chat session
router.post("/", async (req, res) => {
  try {
    const chat = await Chat.create({ user: req.userId, title: "New Chat" });
    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/chats/:id
// @desc    Fetch a single chat session with full message history
router.get("/:id", async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, user: req.userId });
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   PUT /api/chats/:id
// @desc    Rename a chat session title
router.put("/:id", async (req, res) => {
  try {
    const { title } = req.body;
    const chat = await Chat.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { title },
      { new: true }
    );
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   DELETE /api/chats/:id
// @desc    Delete a chat session
router.delete("/:id", async (req, res) => {
  try {
    const chat = await Chat.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    res.json({ message: "Chat deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/chats/:id/message
// @desc    Send a user prompt to Gemini and save both messages,
//          maintaining conversation context within this chat session
router.post("/:id/message", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    const chat = await Chat.findOne({ _id: req.params.id, user: req.userId });
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    // Build context from prior messages for the Gemini chat session
    const history = chat.messages.map((m) => ({
      role: m.role,
      parts: [{ text: m.content }],
    }));

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const geminiChat = model.startChat({ history });

    const result = await geminiChat.sendMessage(message);
    const aiReply = result.response.text();

    // Save both the user message and the AI reply
    chat.messages.push({ role: "user", content: message });
    chat.messages.push({ role: "model", content: aiReply });

    // Auto-title the chat from the first user message (like ChatGPT)
    if (chat.title === "New Chat") {
      chat.title =
        message.length > 40 ? message.slice(0, 40) + "..." : message;
    }

    await chat.save();

    res.json({
      reply: aiReply,
      title: chat.title,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
