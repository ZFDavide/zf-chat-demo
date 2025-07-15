import React, { useState, useEffect } from "react";
import "./Chat.css";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [thinkingDots, setThinkingDots] = useState(".");
  const [debug, setDebug] = useState([]);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setThinkingDots((prev) => (prev.length >= 3 ? "." : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, [loading]);

  const logDebug = (msg) => setDebug((prev) => [...prev, msg]);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const userMessage = { role: "user", content: userInput };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setUserInput("");
    setLoading(true);
    setDebug(["Inizio processo di risposta..."]);

    try {
      logDebug("Creo il thread...");
      const threadRes = await fetch("https://api.openai.com/v1/threads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          "OpenAI-Beta": "assistants=v2",
        },
        body: JSON.stringify({ messages: [{ role: "user", content: userInput }] }),
      });

      const thread = await threadRes.json();
      const threadId = thread.id;
      logDebug("Thread creato: " + threadId);

      logDebug("Avvio run...");
      const runRes = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          "OpenAI-Beta": "assistants=v2",
        },
        body: JSON.stringify({ assistant_id: process.env.REACT_APP_ASSISTANT_ID }),
      });

      const run = await runRes.json();
      const runId = run.id;
      logDebug("Run avviato: " + runId);

      let status = "in_progress";
      while (status !== "completed" && status !== "failed") {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const statusRes = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            "OpenAI-Beta": "assistants=v2",
          },
        });
        const statusData = await statusRes.json();
        status = statusData.status;
        logDebug("Stato corrente del run: " + status);
      }

      if (status === "failed") {
        throw new Error("Run fallito");
      }

      logDebug("Recupero i messaggi del thread...");
      const messagesRes = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          "OpenAI-Beta": "assistants=v2",
        },
      });

      const messagesData = await messagesRes.json();
      const lastMessage = messagesData.data.find((msg) => msg.role === "assistant");

      logDebug("Risposta trovata.");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: lastMessage?.content[0]?.text?.value || "Nessuna risposta.",
        },
      ]);
    } catch (error) {
      console.error("Errore:", error);
      logDebug("Errore nella comunicazione: " + error.message);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Errore nella comunicazione con l'assistente." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <span className="label">{msg.role === "user" ? "🙋‍♂️:" : "🤖:"}</span>
            <span>{msg.content.replace(/【\\d+:\\d+†source】/g, '')}</span>
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <span className="label">🤖 AI:</span> <span className="typing-dots">Sto pensando{thinkingDots}</span>
          </div>
        )}
      </div>

      <div className="chat-input">
        <input
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Scrivi una domanda fiscale..."
        />
        <button onClick={handleSend}>Invia</button>
      </div>
      
      {/* debug 
      debug.length > 0 && (
        <div className="debug-box">
          <strong>Debug log:</strong>
          <ul>
            {debug.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>
      )*/}
    </div>
  );
}

export default Chat;
