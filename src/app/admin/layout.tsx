import { ReactNode } from 'react';

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="w-full px-4 md:px-6">
      {children}
    </div>
  );
} 