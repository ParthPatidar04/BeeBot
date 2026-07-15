import { useMemo, useState } from "react";
import { Search, Home, Compass, BookOpen, Clock, ChevronsUpDown, LogOut } from "lucide-react";
import ChatHistoryItem from "./ChatHistoryItem.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const NAV_ITEMS = [
  { label: "Home", icon: Home },
  { label: "Explore", icon: Compass },
  { label: "Library", icon: BookOpen },
  { label: "History", icon: Clock },
];

// Group chats into human-friendly date buckets, newest first
function groupChatsByDate(chats) {
  const groups = { Today: [], Yesterday: [], "7 Days Ago": [], Older: [] };
  const now = new Date();

  chats.forEach((chat) => {
    const updated = new Date(chat.updatedAt);
    const diffDays = Math.floor((now - updated) / (1000 * 60 * 60 * 24));

    if (diffDays < 1) groups["Today"].push(chat);
    else if (diffDays < 2) groups["Yesterday"].push(chat);
    else if (diffDays < 7) groups["7 Days Ago"].push(chat);
    else groups["Older"].push(chat);
  });

  return Object.entries(groups).filter(([, items]) => items.length > 0);
}

export default function Sidebar({
  chats,
  activeChatId,
  onSelectChat,
  onRenameChat,
  onDeleteChat,
}) {
  const { user, logout } = useAuth();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return chats;
    return chats.filter((c) =>
      c.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [chats, search]);

  const grouped = useMemo(() => groupChatsByDate(filtered), [filtered]);

  return (
    <aside className="w-[260px] shrink-0 h-full bg-white rounded-3xl flex flex-col p-4 border border-gray-100">
      {/* Logo */}
      <div className="flex items-center gap-2 px-2 mb-5">
        <span className="text-xl">🐝</span>
        <span className="text-lg font-bold text-ink tracking-tight">BeeBot</span>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 mb-5">
        <Search size={15} className="text-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          className="bg-transparent text-sm text-ink placeholder-muted outline-none flex-1"
        />
        <kbd className="text-[11px] text-muted">⌘</kbd>
      </div>

      {/* Nav */}
      <nav className="space-y-1 mb-6">
        {NAV_ITEMS.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-ink transition"
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </nav>

      {/* Chat history */}
      <div className="flex-1 overflow-y-auto scroll-thin -mr-2 pr-2">
        {grouped.length === 0 && (
          <p className="text-xs text-muted px-2">No chats yet</p>
        )}
        {grouped.map(([label, items]) => (
          <div key={label} className="mb-4">
            <p className="text-[11px] font-medium text-muted px-2 mb-1">
              {label}
            </p>
            <div className="space-y-0.5">
              {items.map((chat) => (
                <ChatHistoryItem
                  key={chat._id}
                  chat={chat}
                  isActive={chat._id === activeChatId}
                  onSelect={onSelectChat}
                  onRename={onRenameChat}
                  onDelete={onDeleteChat}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Profile footer */}
      <div className="relative pt-3 mt-2 border-t border-gray-100">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition"
        >
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-8 h-8 rounded-full bg-gray-100 shrink-0"
          />
          <div className="flex-1 text-left min-w-0">
            <p className="text-sm font-medium text-ink truncate">
              {user?.name}
            </p>
            <p className="text-xs text-muted truncate">{user?.email}</p>
          </div>
          <ChevronsUpDown size={14} className="text-muted shrink-0" />
        </button>

        {menuOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-100 rounded-xl shadow-md p-1">
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 rounded-lg hover:bg-red-50 transition"
            >
              <LogOut size={14} />
              Log out
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
