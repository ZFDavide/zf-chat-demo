import React from "react";

function App() {
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
          Questo è un sito dimostrativo per testare l’integrazione della nostra assistente AI fiscale.
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
          <li>✅ Interfaccia semplice e moderna</li>
          <li>✅ Risposte automatiche a domande fiscali</li>
          <li>🔒 Privacy garantita (demo)</li>
        </ul>

        <button style={{
          marginTop: "30px",
          padding: "12px 24px",
          fontSize: "16px",
          backgroundColor: "#2a60c3",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer"
        }}>
          Simula una chat fiscale
        </button>
      </main>

      <footer style={{ textAlign: "center", marginTop: "40px", color: "#888" }}>
        © 2025 ZF Srl - Progetto dimostrativo
      </footer>
    </div>
  );
}

export default App;
