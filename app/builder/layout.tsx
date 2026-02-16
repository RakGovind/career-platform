import { AppNav } from "@/components/AppNav";

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-shell">
      <AppNav />
      {children}
    </div>
  );
}
