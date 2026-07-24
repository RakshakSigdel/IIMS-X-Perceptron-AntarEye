export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      {/* TODO: Add centered card layout for authentication pages */}
      {children}
    </div>
  );
}
