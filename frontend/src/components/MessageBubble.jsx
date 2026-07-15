export default function MessageBubble({ role, content }) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      {!isUser && (
        <span className="w-7 h-7 rounded-full bg-gradient-to-br from-accent to-emerald-300 flex items-center justify-center text-xs mr-2 shrink-0">
          🐝
        </span>
      )}
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-ink text-white rounded-tr-sm"
            : "bg-white border border-gray-100 text-ink rounded-tl-sm"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
