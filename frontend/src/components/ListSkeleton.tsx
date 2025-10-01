import React, { ReactNode } from 'react';

interface ListSkeletonProps {
  count?: number;
  children?: ReactNode;
}

export default function ListSkeleton({ count = 3, children }: ListSkeletonProps) {
  if (children) {
    return (
      <ul className="space-y-2">
        {Array.from({ length: count }).map((_, index) => (
          <li key={index}>{children}</li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="space-y-2">
      {Array.from({ length: count }).map((_, index) => (
        <li key={index} className="p-3 border rounded flex justify-between items-start shadow-sm animate-pulse">
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
          <div className="flex gap-2 ml-4">
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
          </div>
        </li>
      ))}
    </ul>
  );
}