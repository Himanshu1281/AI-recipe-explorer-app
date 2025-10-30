import React from 'react';

interface EmptyStateProps {
  Icon: React.FC<{ className?: string }>;
  title: string;
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ Icon, title, message }) => {
  return (
    <div className="text-center py-20 px-6 bg-gray-100 dark:bg-gray-800/50 rounded-lg max-w-3xl mx-auto">
      <Icon className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500" />
      <h3 className="mt-4 text-2xl font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
      <p className="mt-2 text-gray-500 dark:text-gray-400">{message}</p>
    </div>
  );
};

export default EmptyState;
