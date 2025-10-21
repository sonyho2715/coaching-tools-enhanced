import React, { useState } from 'react';
import { useCoaching } from '../contexts/CoachingContext';
import { Plus, UserPlus, Trash2, Users } from 'lucide-react';

const ClientSelector = () => {
  const {
    clients,
    currentClientId,
    loadClient,
    createNewClient,
    deleteClient
  } = useCoaching();

  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientAge, setNewClientAge] = useState('');
  const [newClientLocation, setNewClientLocation] = useState('');

  const handleCreateClient = (e) => {
    e.preventDefault();
    if (newClientName.trim()) {
      createNewClient(newClientName.trim(), newClientAge, newClientLocation);
      setNewClientName('');
      setNewClientAge('');
      setNewClientLocation('');
      setShowNewClientForm(false);
    }
  };

  const handleDeleteClient = (clientId, clientName) => {
    if (window.confirm(`Bạn có chắc muốn xóa khách hàng "${clientName}"? Tất cả dữ liệu sẽ bị mất.`)) {
      deleteClient(clientId);
    }
  };

  return (
    <div className="border-b border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-800">Khách Hàng</h3>
        </div>
        <button
          onClick={() => setShowNewClientForm(!showNewClientForm)}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition"
          title="Tạo khách hàng mới"
        >
          <Plus className="w-5 h-5 text-blue-600" />
        </button>
      </div>

      {showNewClientForm && (
        <form onSubmit={handleCreateClient} className="mb-3 p-3 bg-gray-50 rounded-lg space-y-2">
          <input
            type="text"
            value={newClientName}
            onChange={(e) => setNewClientName(e.target.value)}
            placeholder="Tên khách hàng *"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            value={newClientAge}
            onChange={(e) => setNewClientAge(e.target.value)}
            placeholder="Tuổi (tùy chọn)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={newClientLocation}
            onChange={(e) => setNewClientLocation(e.target.value)}
            placeholder="Địa điểm (tùy chọn)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              <UserPlus className="w-4 h-4 inline mr-1" />
              Tạo
            </button>
            <button
              type="button"
              onClick={() => {
                setShowNewClientForm(false);
                setNewClientName('');
                setNewClientAge('');
                setNewClientLocation('');
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
            >
              Hủy
            </button>
          </div>
        </form>
      )}

      <div className="space-y-1 max-h-48 overflow-y-auto">
        {clients.length === 0 ? (
          <p className="text-sm text-gray-500 italic text-center py-3">
            Chưa có khách hàng nào.<br />Nhấn + để tạo mới.
          </p>
        ) : (
          clients.map(client => (
            <div
              key={client.id}
              className={`group flex items-center justify-between p-2 rounded-lg transition cursor-pointer ${
                currentClientId === client.id
                  ? 'bg-blue-100 border border-blue-300'
                  : 'hover:bg-gray-100'
              }`}
            >
              <div
                onClick={() => loadClient(client.id)}
                className="flex-1"
              >
                <p className="text-sm font-medium text-gray-800">{client.name}</p>
                <p className="text-xs text-gray-500">
                  {client.sessions?.length || 0} phiên
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClient(client.id, client.name);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition"
                title="Xóa khách hàng"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClientSelector;
