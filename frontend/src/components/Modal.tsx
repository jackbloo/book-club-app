import {useRef, ReactNode }from 'react';
import ReactDOM from 'react-dom';
import { useOutsideClick } from '../hooks/useOutsideClick';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
  primaryLabel?: string;
  onPrimary?: () => Promise<void> | void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}

export default function Modal({
  open,
  onClose,
  title = 'Modal title',
  children,
  primaryLabel = 'Confirm',
  onPrimary = () => {},
  secondaryLabel = 'Cancel',
  onSecondary = () => {},
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useOutsideClick(dialogRef, onClose);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
      aria-modal="true"
      role="dialog"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/35 backdrop-blur-sm" />

      {/* Dialog */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-lg ring-1 ring-black/5 overflow-hidden"
        aria-labelledby="vercel-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 id="vercel-modal-title" className="text-sm font-semibold text-gray-900">
            {title}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 rounded-md p-1 hover:bg-gray-100 transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 text-sm text-gray-700">
          {children}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={() => {
              onSecondary?.();
              onClose?.();
            }}
            className="px-3 py-1 rounded-md text-sm font-medium bg-transparent text-gray-700 hover:bg-gray-50 transition"
          >
            {secondaryLabel}
          </button>

          <button
            onClick={onPrimary}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-[#234C6A] text-white shadow-sm hover:shadow-md hover:bg-[#1d3f58] transition"
          >
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}