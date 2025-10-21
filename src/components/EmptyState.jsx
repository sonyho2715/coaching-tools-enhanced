import React from 'react';
import { FileX, UserX, FolderX, AlertCircle } from 'lucide-react';

const EmptyState = ({
  type = 'default',
  title = 'Không có dữ liệu',
  description = 'Chưa có dữ liệu để hiển thị',
  action = null,
  icon: CustomIcon = null
}) => {
  const icons = {
    clients: UserX,
    sessions: FileX,
    data: FolderX,
    error: AlertCircle,
    default: FileX
  };

  const Icon = CustomIcon || icons[type];

  return (
    <div className="text-center py-12 px-4">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
        <Icon className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
};

export default EmptyState;
