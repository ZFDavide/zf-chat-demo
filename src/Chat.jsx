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
      const response = await fetch("https://api.openai.com/v1/assistants/" + process.env.REACT_APP_ASSISTANT_ID + "/runs", {
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
        { role: "assistant", content: "Errore nella comunicazione con l'assistente." },
      ]);
    }
  };

  return (
    <div style={{ marginTop: "30px", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", background: "#f9f9f9" }}>
      <div style={{ marginBottom: "10px", maxHeight: "200px", overflowY: "auto" }}>
        {messages.map((msg, idx) => (
          <div key={idx}><strong>{msg.role === "user" ? "Tu" : "AI"}:</strong> {msg.content}</div>
        ))}
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
