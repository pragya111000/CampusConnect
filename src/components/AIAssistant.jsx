import { useEffect, useRef, useState } from "react";
import { apiPost } from "../api.js";
import "./AIAssistant.css";

const WELCOME_TEXT =
  "Hi! 👋 I'm CampusConnect Assistant. Ask me anything about your college.";

const SUGGESTED_QUESTIONS = [
  "Who is the HOD of AIML?",
  "Show faculty information",
  "What departments are available?",
  "How can I contact the helpdesk?",
];

const MAX_LENGTH = 500; // the backend also checks this

const welcomeMessage = { id: 0, role: "assistant", text: WELCOME_TEXT, kind: "welcome" };

function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([welcomeMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState(""); // "ai" or "basic", sent by the backend

  const nextId = useRef(1);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  const addMessage = (role, text, kind = "normal") => {
    const message = { id: nextId.current++, role, text, kind };
    setMessages((current) => [...current, message]);
  };

  // Keep the newest message in view.
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading, isOpen]);

  // Put the cursor in the text box when the chat opens.
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current && inputRef.current.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const sendMessage = async (rawText) => {
    const text = rawText.trim();

    if (!text || loading) return;

    // Earlier chat (without the welcome text and error messages) so the
    // assistant understands follow-up questions like "and who teaches it?".
    const history = messages
      .filter((m) => m.kind === "normal")
      .slice(-6)
      .map((m) => ({ role: m.role, content: m.text }));

    addMessage("user", text);
    setInput("");
    setLoading(true);

    try {
      const data = await apiPost("/api/assistant", { message: text, history });

      addMessage("assistant", data.answer);
      setMode(data.mode);
    } catch (error) {
      console.error("Assistant error:", error);

      addMessage(
        "assistant",
        error instanceof TypeError
          ? "I can't reach the server right now. Please check that the backend is running and try again."
          : error.message,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  const startNewChat = () => {
    setMessages([welcomeMessage]);
    setInput("");
    setMode("");
  };

  const onlyWelcome = messages.length === 1;

  return (
    <div className="assistant-widget" onKeyDown={handleKeyDown}>
      <section
        id="assistant-panel"
        className={isOpen ? "assistant-panel open" : "assistant-panel"}
        role="dialog"
        aria-label="CampusConnect Assistant chat"
        aria-hidden={!isOpen}
      >
        <header className="assistant-header">
          <div>
            <h2>🤖 CampusConnect Assistant</h2>
            <p>
              {mode === "ai" && "AI answers, based on your college data"}
              {mode === "basic" && "Answers looked up from your college data"}
              {mode === "" && "Answers come from your college data"}
            </p>
          </div>

          <div className="assistant-header-buttons">
            <button type="button" onClick={startNewChat} aria-label="Start a new chat">
              New chat
            </button>

            <button type="button" onClick={() => setIsOpen(false)} aria-label="Close assistant">
              ✕
            </button>
          </div>
        </header>

        <div
          className="assistant-messages"
          ref={listRef}
          role="log"
          aria-live="polite"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`assistant-message ${message.role}${
                message.kind === "error" ? " error" : ""
              }`}
            >
              {message.text}
            </div>
          ))}

          {loading && (
            <div className="assistant-message assistant typing" role="status" aria-label="Assistant is typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}

          {onlyWelcome && !loading && (
            <div className="assistant-suggestions">
              <p>Try asking:</p>

              {SUGGESTED_QUESTIONS.map((question) => (
                <button
                  key={question}
                  type="button"
                  className="chip"
                  onClick={() => sendMessage(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          )}
        </div>

        <form className="assistant-form" onSubmit={handleSubmit}>
          <label htmlFor="assistant-input" className="visually-hidden">
            Type your question
          </label>

          <input
            id="assistant-input"
            ref={inputRef}
            type="text"
            placeholder="Ask about faculty, notices, subjects..."
            value={input}
            maxLength={MAX_LENGTH}
            onChange={(event) => setInput(event.target.value)}
            disabled={loading}
            autoComplete="off"
          />

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || input.trim() === ""}
          >
            Send
          </button>
        </form>
      </section>

      <button
        type="button"
        className="assistant-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="assistant-panel"
      >
        {isOpen ? "✕ Close" : "🤖 Ask CampusConnect"}
      </button>
    </div>
  );
}

export default AIAssistant;
