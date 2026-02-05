'use client';

import { motion } from 'framer-motion';
import { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
}

export default function Card({ children, hover = true, className = '', ...props }: CardProps) {
  const Component = hover ? motion.div : 'div';
  
  const hoverProps = hover ? {
    whileHover: { y: -4, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' },
    transition: { duration: 0.3 }
  } : {};

  return (
    <Component
      className={`card ${className}`}
      {...(hover ? hoverProps : {})}
      {...props}
    >
      {children}
    </Component>
  );
}

export function BookCard({
  title,
  author,
  disponible,
  imageUrl,
  onAction,
  actionLabel = 'Voir détails'
}: {
  title: string;
  author: string;
  disponible: boolean;
  imageUrl?: string;
  onAction?: () => void;
  actionLabel?: string;
}) {
  return (
    <motion.div
      className={`card-book ${onAction ? 'cursor-pointer' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={onAction ? { y: -8, scale: 1.02 } : {}}
      whileTap={onAction ? { scale: 0.98 } : {}}
      onClick={onAction}
    >
      <div className="relative h-64 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg overflow-hidden mb-4">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="card-book-image w-full h-full object-cover"
          />
        ) : (
          <div className="card-book-image flex items-center justify-center h-full">
            <svg className="w-24 h-24 text-primary/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-display font-semibold text-text-primary line-clamp-2">{title}</h3>
        <p className="text-sm text-text-muted">par {author}</p>

        <div className="flex items-center justify-between pt-4">
          {disponible ? (
            <span className="badge-success">Disponible</span>
          ) : (
            <span className="badge-error">Indisponible</span>
          )}

          {onAction && (
            <span className="text-sm font-semibold text-primary group-hover:text-primary-light transition-colors flex items-center gap-1">
              {actionLabel}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
