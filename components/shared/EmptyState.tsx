import React from "react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title = "No Data Found",
  description = "There is nothing to show here yet.",
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
      {icon && <div className="mb-4 text-gray-400">{icon}</div>}
      <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
      <p className="text-gray-500 mt-2">{description}</p>
    </div>
  );
}
