export const metadata = {
  title: 'Student Supplies',
  description: 'Online Store',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
