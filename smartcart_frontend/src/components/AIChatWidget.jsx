import { useEffect, useRef, useState } from "react";
import { chatWithAI } from "../api/apiService";
import "./AIChatWidget.css";

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("smartcart_chat");
    return saved
      ? JSON.parse(saved)
      : [{ role: "ai", text: "Hi 👋 I’m SmartCart AI. Ask me for product recommendations!" }];
  });

  const boxRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("smartcart_chat", JSON.stringify(messages));
    setTimeout(() => {
      if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }, 50);
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await chatWithAI({ message: userMsg.text });
      const aiText = res.data?.reply || "No reply received.";

      setMessages((prev) => [...prev, { role: "ai", text: aiText }]);
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "Chat failed";

      setMessages((prev) => [...prev, { role: "ai", text: `❌ ${errorMsg}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const clearChat = () => {
    const start = [
      { role: "ai", text: "Hi 👋 I’m SmartCart AI. Ask me for product recommendations!" },
    ];
    setMessages(start);
    localStorage.setItem("smartcart_chat", JSON.stringify(start));
  };

  return (
    <>
      <button className="ai-chat-fab" onClick={() => setOpen((p) => !p)}>
        {open ? "✖" : "💬"}
      </button>

      {open && (
        <div className="ai-chat-window">
          <div className="ai-chat-header">
            <div>
              <h4>SmartCart AI</h4>
              <p>{loading ? "Typing..." : "Ask about laptops, keyboards, mouse"}</p>
            </div>
            <button className="ai-clear-btn" onClick={clearChat}>
              Clear
            </button>
          </div>

          <div className="ai-chat-body" ref={boxRef}>
            {messages.map((m, i) => (
              <div key={i} className={`ai-msg ${m.role === "user" ? "user" : "ai"}`}>
                {m.text}
              </div>
            ))}
          </div>

          <div className="ai-chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              disabled={loading}
            />
            <button onClick={sendMessage} disabled={loading}>
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
