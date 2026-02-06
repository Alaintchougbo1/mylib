'use client';

import { useState, ReactNode } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from '@/components/ui/Sidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:ml-64">
        {/* Mobile Header with Hamburger */}
        <div className="lg:hidden sticky top-16 z-30 bg-white border-b border-border">
          <div className="flex items-center gap-4 px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-background rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-text-secondary" />
            </button>
            <h2 className="text-lg font-display font-semibold text-text-primary">
              Administration
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="container-page">
          {children}
        </div>
      </div>
    </div>
  );
}
