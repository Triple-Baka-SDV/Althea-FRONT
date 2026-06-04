import { Outlet } from "@remix-run/react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function ProduitsLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
