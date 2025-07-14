import React, { useState } from "react";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const userMessage = { role: "user", content: userInput };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setUserInput("");

    try {
      const response = await fetch("https://api.openai.com/v1/assistants/YOUR_ASSISTANT_ID/runs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          assistant_id: process.env.REACT_APP_ASSISTANT_ID,
          instructions: "",
          messages: updatedMessages,
        }),
      });

      const data = await response.json();
      const assistantReply = {
        role: "assistant",
        content: data.choices?.[0]?.message?.content || "Errore nella risposta.",
      };

      setMessages((prev) => [...prev, assistantReply]);
    } catch (error) {
      console.error("Errore:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Si è verificato un errore nella comunicazione con l'assistente." },
      ]);
    }
  };

  return (
    <div style={{ marginTop: "40px" }}>
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "16px",
          minHeight: "200px",
          maxHeight: "400px",
          overflowY: "auto",
          marginBottom: "12px",
        }}
      >
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <strong>{msg.role === "user" ? "Tu" : "Assistente"}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Scrivi una domanda fiscale..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={handleSend}
          style={{
            padding: "10px 16px",
            backgroundColor: "#2a60c3",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Invia
        </button>
      </div>
    </div>
  );
}

export default Chat;
