'use client';

import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant: 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export default function Badge({ children, variant, className = '' }: BadgeProps) {
  const variantClasses = {
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    info: 'badge-info',
  };

  return (
    <span className={`${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: 'en_attente' | 'approuvee' | 'refusee' | 'retournee' }) {
  const statusConfig = {
    en_attente: { label: 'En attente', variant: 'warning' as const },
    approuvee: { label: 'Approuvée', variant: 'success' as const },
    refusee: { label: 'Refusée', variant: 'error' as const },
    retournee: { label: 'Retournée', variant: 'info' as const },
  };

  const config = statusConfig[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
