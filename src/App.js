import React, { useState } from "react";
import Chat from "./Chat";

function App() {
  const [showChat, setShowChat] = useState(false);

  return (
    <div style={{ fontFamily: "Arial", padding: "40px" }}>
      <h1 style={{ color: "#2a60c3" }}>🤖 ZF ChatAI</h1>
      <p>Benvenuto nella chat di ZF. Tramite questa chat puoi fare tutte le domande che vuoi in ambito fiscale!!</p>
      <button
        onClick={() => setShowChat(true)}
        style={{ padding: "12px", background: "#2a60c3", color: "#fff", border: "none", borderRadius: "6px" }}
      >
        Clicca per iniziare
      </button>
      {showChat && <Chat />}
    </div>
  );
}

export default App;
