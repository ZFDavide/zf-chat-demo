import React, { useState } from "react";
import Chat from "./Chat";

function App() {
  const [showChat, setShowChat] = useState(false);

  return (
    <div style={{
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: "linear-gradient(to bottom right, #f0f4ff, #dbe9ff)",
      minHeight: "100vh",
      padding: "40px"
    }}>
      <header style={{
        backgroundColor: "#ffffff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        marginBottom: "30px"
      }}>
        <h1 style={{ color: "#2a60c3", marginBottom: "10px" }}>💼 ZF Chat Demo</h1>
        <p style={{ color: "#444" }}>
          Sito dimostrativo per testare l’assistente AI fiscale.
        </p>
      </header>

      <main style={{
        backgroundColor: "#ffffff",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ marginBottom: "15px", color: "#333" }}>🚀 Funzionalità disponibili</h2>
        <ul style={{ lineHeight: "1.8" }}>
          <li>✅ Risposte automatiche a domande fiscali in campo IVA</li>
          <li>✅ Contatto di un professionista in caso di domande troppo complesse</li>
          <li>✅ Non è consentito porre domande al di fuori dell’ambito di competenza dell’IA.</li>
        </ul>

        <button
          onClick={() => setShowChat(true)}
          style={{
            marginTop: "30px",
            padding: "12px 24px",
            fontSize: "16px",
            backgroundColor: "#2a60c3",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Avvia la chat fiscale! 
        </button>

        {showChat && <Chat />}
      </main>

      <footer style={{ textAlign: "center", marginTop: "40px", color: "#888" }}>
        © 2025 ZF Srl - Progetto dimostrativo
      </footer>
    </div>
  );
}

export default App;
