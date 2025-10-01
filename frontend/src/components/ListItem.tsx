import React, { ReactNode } from 'react';
import { SquarePen, Trash2 } from 'lucide-react';

interface ListItemProps {
  id: number;
  onEdit: (item: any) => void;
  onDelete: (id: number) => void;
  children: ReactNode;
  className?: string;
  editLabel?: string;
  deleteLabel?: string;
}

export default function ListItem({ 
  id,
  onEdit, 
  onDelete, 
  children,
  className = "",
  editLabel = "Edit",
  deleteLabel = "Delete"
}: ListItemProps) {
  return (
    <li className={`p-3 border rounded flex justify-between items-start shadow-sm ${className}`}>
      <div className="flex-1">
        {children}
      </div>
      <div className="flex gap-2 ml-4">
        <button 
          onClick={() => onEdit({ id })} 
          className="text-sm px-2 py-1 border rounded shadow-sm hover:bg-gray-50 transition"
          aria-label={editLabel}
        >
          <SquarePen size={16} />
        </button>
        <button 
          onClick={() => onDelete(id)} 
          className="text-sm px-2 py-1 border rounded text-red-600 shadow-sm hover:bg-red-50 transition"
          aria-label={deleteLabel}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </li>
  );
}