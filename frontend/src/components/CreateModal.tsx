import React, { ReactNode } from 'react';
import Modal from './Modal';

interface CreateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  children: ReactNode;
  isLoading?: boolean;
}

export default function CreateModal({
  open,
  onClose,
  onSubmit,
  title,
  children,
  isLoading = false
}: CreateModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      onPrimary={onSubmit}
      primaryLabel={isLoading ? 'Creating...' : 'Create'}
      secondaryLabel="Cancel"
      onSecondary={onClose}
    >
      {children}
    </Modal>
  );
}