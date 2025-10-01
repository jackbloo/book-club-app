import React, { ReactNode } from 'react';
import Modal from './Modal';

interface DeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children?: ReactNode;
  itemName?: string;
  isLoading?: boolean;
}

export default function DeleteModal({
  open,
  onClose,
  onConfirm,
  title,
  children,
  itemName,
  isLoading = false
}: DeleteModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      onPrimary={onConfirm}
      primaryLabel={isLoading ? 'Deleting...' : 'Delete'}
      secondaryLabel="Cancel"
      onSecondary={onClose}
    >
      {children || (
        <p>Are you sure you want to delete{itemName ? ` ${itemName}` : ' this item'}? This action cannot be undone.</p>
      )}
    </Modal>
  );
}