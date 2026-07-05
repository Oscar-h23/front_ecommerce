import { useState } from "react";
import Navbar from "./Navbar";
import CartDrawer from "./CartDrawer";
import Footer from "./Footer";
import ChatbotWidget from "./ChatbotWidget";
import WhatsAppButton from "./WhatsAppButton";

export default function StoreLayout({ children }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onCartToggle={() => setIsCartOpen(true)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <main className="flex-1">{children}</main>
      <Footer />
      <ChatbotWidget />
      <WhatsAppButton />
    </div>
  );
}
