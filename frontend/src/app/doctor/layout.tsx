export default function DoctorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* TODO: Add Sidebar and Header components */}
      <aside className="w-64 border-r border-border p-4">Doctor Sidebar Placeholder</aside>
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b border-border p-4">Doctor Header Placeholder</header>
        <div className="flex-1 p-6 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
