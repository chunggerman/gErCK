import Link from "next/link";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        style={{
          width: 220,
          borderRight: "1px solid #eee",
          padding: "16px",
        }}
      >
        <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Link href="./assistant">Assistant</Link>
          <Link href="./documents">Documents</Link>
          <Link href="./settings">Settings</Link>
          <Link href="./templates">Templates</Link>
          <span style={{ opacity: 0.4 }}>Assistants (coming later)</span>
        </nav>
      </aside>

      <main style={{ flex: 1 }}>
        <header
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid #eee",
            marginBottom: 16,
          }}
        >
          <strong>Workspace: default</strong>
        </header>

        <div style={{ padding: "16px" }}>{children}</div>
      </main>
    </div>
  );
}
