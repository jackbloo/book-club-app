import React, { ReactNode } from 'react';
import Modal from './Modal';

interface EditModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  children: ReactNode;
  isLoading?: boolean;
}

export default function EditModal({
  open,
  onClose,
  onSubmit,
  title,
  children,
  isLoading = false
}: EditModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      onPrimary={onSubmit}
      primaryLabel={isLoading ? 'Updating...' : 'Update'}
      secondaryLabel="Cancel"
      onSecondary={onClose}
    >
      {children}
    </Modal>
  );
}