import AdminNav from '../../components/AdminNav';

export const metadata = { title: "Admin | Jay's PPE & Safety" };

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-bone">
      <AdminNav />
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">{children}</div>
    </div>
  );
}
