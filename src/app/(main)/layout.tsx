import Navbar from "@/components/molecules/navbar";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
