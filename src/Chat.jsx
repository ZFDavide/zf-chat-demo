import React, { useState } from "react";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const userMessage = { role: "user", content: userInput };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setUserInput("");
    setLoading(true);

    try {
      // 1. Crea un thread
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

      // 2. Crea un run nel thread
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

      // 3. Attendi che il run sia completato (polling)
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
      }

      if (status === "failed") {
        throw new Error("Run fallito");
      }

      // 4. Ottieni i messaggi del thread
      const messagesRes = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          "OpenAI-Beta": "assistants=v1"
        },
      });

      const messagesData = await messagesRes.json();
      const lastMessage = messagesData.data.find(msg => msg.role === "assistant");

      setMessages((prev) => [...prev, { role: "assistant", content: lastMessage?.content[0]?.text?.value || "Nessuna risposta." }]);
    } catch (error) {
      console.error("Errore:", error);
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
    </div>
  );
}

export default Chat;
