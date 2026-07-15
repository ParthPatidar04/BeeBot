import { useState } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";

export default function ChatHistoryItem({
  chat,
  isActive,
  onSelect,
  onRename,
  onDelete,
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(chat.title);

  const saveEdit = () => {
    const trimmed = title.trim();
    if (trimmed && trimmed !== chat.title) {
      onRename(chat._id, trimmed);
    }
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex items-center gap-1 px-2 py-1.5">
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") saveEdit();
            if (e.key === "Escape") setEditing(false);
          }}
          className="flex-1 text-sm bg-gray-50 border border-accent/40 rounded-lg px-2 py-1 outline-none text-ink"
        />
        <button
          onClick={saveEdit}
          className="text-accent hover:text-accent-dark p-1"
        >
          <Check size={14} />
        </button>
        <button
          onClick={() => setEditing(false)}
          className="text-muted hover:text-ink p-1"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => onSelect(chat._id)}
      className={`group flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer transition ${
        isActive ? "bg-gray-100" : "hover:bg-gray-50"
      }`}
    >
      <p className="text-sm text-gray-600 truncate pr-2">{chat.title}</p>
      <div className="hidden group-hover:flex items-center gap-1 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setEditing(true);
          }}
          className="text-muted hover:text-accent p-1"
          title="Rename"
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(chat._id);
          }}
          className="text-muted hover:text-red-500 p-1"
          title="Delete"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
