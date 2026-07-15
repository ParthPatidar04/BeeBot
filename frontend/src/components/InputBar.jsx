import { useState } from "react";
import { Paperclip, Sparkles, Wand2, Image, Telescope, ArrowUp } from "lucide-react";

const PILLS = [
  { label: "Reasoning", icon: Wand2 },
  { label: "Create Image", icon: Image },
  { label: "Deep Research", icon: Telescope },
];

export default function InputBar({ onSend, disabled }) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-100 p-4">
      <div className="flex items-start gap-2 px-1 pt-1">
        <Sparkles size={16} className="text-accent mt-0.5 shrink-0" />
        <textarea
          rows={2}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Initiate a query or send a command to the AI..."
          className="flex-1 resize-none bg-transparent text-sm text-ink placeholder-muted outline-none"
        />
      </div>

      <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-50">
        <div className="flex items-center gap-2">
          <button className="p-2 text-muted hover:text-ink rounded-full hover:bg-gray-50 transition">
            <Paperclip size={16} />
          </button>
          {PILLS.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-full px-3 py-1.5 hover:bg-gray-50 transition"
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        <button
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-dark text-white shadow-sm disabled:opacity-40 transition"
        >
          <ArrowUp size={16} />
        </button>
      </div>
    </div>
  );
}

// 