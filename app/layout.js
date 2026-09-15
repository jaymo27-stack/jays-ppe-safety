import './globals.css';
import { CartProvider } from '../components/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: "Jay's PPE & Safety | Industrial Safety Supplier",
  description:
    "Your complete industrial safety supplier. Safety helmets, boots, gloves, worksuits, hi-vis jackets, first aid kits and more. Protect. Equip. Work Safely.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body" style={{ '--font-display': "'Oswald', sans-serif", '--font-body': "'Inter', sans-serif" }}>
        <CartProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
