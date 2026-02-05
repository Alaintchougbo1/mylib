'use client';

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import Button from './Button';

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string | ReactNode;
  variant?: 'success' | 'error' | 'warning' | 'info';
  confirmText?: string;
}

export default function AlertDialog({
  isOpen,
  onClose,
  title,
  message,
  variant = 'info',
  confirmText = 'OK',
}: AlertDialogProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          icon: <CheckCircle className="w-6 h-6" />,
          color: 'text-success',
          title: title || 'Succès',
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-6 h-6" />,
          color: 'text-error',
          title: title || 'Erreur',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-6 h-6" />,
          color: 'text-warning',
          title: title || 'Attention',
        };
      case 'info':
      default:
        return {
          icon: <Info className="w-6 h-6" />,
          color: 'text-info',
          title: title || 'Information',
        };
    }
  };

  const { icon, color, title: defaultTitle } = getVariantStyles();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-[1001] p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-border">
              <div className="flex items-start gap-4 mb-4">
                <div className={`flex-shrink-0 ${color}`}>
                  {icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-display font-semibold text-text-primary mb-2">
                    {title || defaultTitle}
                  </h3>
                  <div className="text-text-secondary text-sm leading-relaxed">
                    {message}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="flex-shrink-0 text-text-muted hover:text-text-primary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex justify-end mt-6">
                <Button onClick={onClose} variant="primary">
                  {confirmText}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
