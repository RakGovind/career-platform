import Link from "next/link";
import { AppNav } from "@/components/AppNav";

export default function Home() {
  return (
    <div className="app-shell">
      <AppNav />
      <main className="home-main">
        <h1 className="home-headline">Build a Resume That Gets Read.</h1>
        <Link href="/builder" className="home-cta">
          Start Building
        </Link>
      </main>
    </div>
  );
}
