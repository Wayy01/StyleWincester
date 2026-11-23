"use client";

// Last-resort boundary: replaces the root layout, so it can't rely on fonts, CSS or translations.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="ro">
      <body style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", background: "#ece5d8", color: "#15110e", fontFamily: "Georgia, serif", textAlign: "center", padding: 24 }}>
        <div>
          <h1 style={{ fontSize: 48, fontWeight: 300, fontStyle: "italic", margin: 0 }}>Ceva s-a încurcat · Что-то запуталось</h1>
          <button type="button" onClick={reset} style={{ marginTop: 32, padding: "12px 20px", background: "#15110e", color: "#ece5d8", border: 0, cursor: "pointer", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 11 }}>
            Încearcă din nou · Ещё раз
          </button>
        </div>
      </body>
    </html>
  );
}
