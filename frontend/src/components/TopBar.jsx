import { ChevronDown, Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function TopBar({ onNewChat }) {
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-between mb-8">
      <button className="flex items-center gap-2 bg-white border border-gray-100 rounded-full pl-2 pr-3 py-1.5 shadow-sm">
        <span className="w-6 h-6 rounded-full bg-gradient-to-br from-accent to-emerald-300 flex items-center justify-center text-xs">
          🐝
        </span>
        <span className="text-sm font-medium text-ink">iBeeBot 4o</span>
        <ChevronDown size={14} className="text-muted" />
      </button>

      <div className="flex items-center gap-3">
        <button
          onClick={onNewChat}
          className="flex items-center gap-1.5 bg-ink text-white text-sm font-medium rounded-full px-4 py-2 hover:bg-black transition"
        >
          <Plus size={15} />
          New Chat
        </button>
        <img
          src={user?.avatar}
          alt={user?.name}
          className="w-9 h-9 rounded-full bg-gray-100 border border-gray-100"
        />
      </div>
    </div>
  );
}
