import Navbar from "@/components/molecules/navbar";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div>
      <Navbar />
      <div className="flex bg-white ">{children}</div>;
    </div>
  );
}
