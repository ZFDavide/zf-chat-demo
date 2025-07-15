import React, { useState } from "react";
import Chat from "./Chat";

function App() {
  const [showChat, setShowChat] = useState(false);

  return (
    <div style={{ fontFamily: "Arial", padding: "40px" }}>
      <h1 style={{ color: "#2a60c3" }}>ZF Chat DEMO Funzionante</h1>
      <p>Benvenuto nella chat fiscale ZF. Clicca per iniziare una simulazione.</p>
      <button
        onClick={() => setShowChat(true)}
        style={{ padding: "12px", background: "#2a60c3", color: "#fff", border: "none", borderRadius: "6px" }}
      >
        Simula una chat fiscale
      </button>
      {showChat && <Chat />}
    </div>
  );
}

export default App;
