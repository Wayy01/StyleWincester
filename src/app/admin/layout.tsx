import type { Metadata } from "next";
import { Toaster } from "sonner";
import { adminFontVariables, fontVariables } from "../fonts";
import "../globals.css";
import "./admin.css";

export const metadata: Metadata = {
  title: { default: "Administrare", template: "%s · Administrare Style Wincester" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro" className={`${fontVariables} ${adminFontVariables}`}>
      <body className="admin min-h-dvh">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            unstyled: false,
            style: {
              borderRadius: "12px",
              background: "var(--surface)",
              color: "var(--color-ink)",
              border: "1px solid var(--line-strong)",
              boxShadow: "0 8px 24px -12px rgba(21,17,14,0.25)",
              fontFamily: "var(--font-sans)",
              fontSize: "0.875rem",
            },
          }}
        />
      </body>
    </html>
  );
}
