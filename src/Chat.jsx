import React, { useState } from "react";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [debug, setDebug] = useState([]);

  const logDebug = (msg) => setDebug(prev => [...prev, msg]);

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
          "OpenAI-Beta": "assistants=v1"
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
          "OpenAI-Beta": "assistants=v1"
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
            "OpenAI-Beta": "assistants=v1"
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
          "OpenAI-Beta": "assistants=v1"
        },
      });

      const messagesData = await messagesRes.json();
      const lastMessage = messagesData.data.find(msg => msg.role === "assistant");

      logDebug("Risposta trovata.");
      setMessages((prev) => [...prev, { role: "assistant", content: lastMessage?.content[0]?.text?.value || "Nessuna risposta." }]);
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
    <div style={{ marginTop: "30px", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", background: "#f9f9f9" }}>
      <div style={{ marginBottom: "10px", maxHeight: "200px", overflowY: "auto" }}>
        {messages.map((msg, idx) => (
          <div key={idx}><strong>{msg.role === "user" ? "Tu" : "AI"}:</strong> {msg.content}</div>
        ))}
        {loading && <div><strong>AI:</strong> Sto pensando...</div>}
      </div>
      <input
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Scrivi una domanda fiscale..."
        style={{ padding: "8px", width: "70%" }}
      />
      <button onClick={handleSend} style={{ padding: "8px 16px", marginLeft: "10px" }}>Invia</button>

      {debug.length > 0 && (
        <div style={{ marginTop: "20px", padding: "10px", background: "#eef", borderRadius: "6px" }}>
          <strong>Debug log:</strong>
          <ul>
            {debug.map((line, i) => <li key={i}>{line}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Chat;
