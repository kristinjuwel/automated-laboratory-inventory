interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div>
      <div className="flex bg-white ">{children}</div>;
    </div>
  );
}
