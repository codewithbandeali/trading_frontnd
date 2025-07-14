import React, { useState, useEffect } from 'react';
import { Bell, Plus, Check, Trash2, Edit2, AlertCircle } from 'lucide-react';
import API from '../services/api';

interface Alert {
  id: number;
  title: string;
  type: "price" | "volume" | "indicator" | "news";
  condition: "above" | "below" | "crosses" | "equals";
  value: string;
  symbol: string;
  raw_text?: string;        // NEW – free-text rule
  is_active: boolean;
  triggered: boolean;
  read: boolean;
  created_at: string;
}


const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'price',
    condition: 'above',
    value: '',
    symbol: '',
    isActive: true
  });

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const { data } = await API.get("alerts/");
      let normalised: Alert[] = [];
      if (Array.isArray(data)) {
        normalised = data;
      } else if (data?.results) {
        normalised = data.results;
      } else if (data) {
        normalised = [data];
      } else {
        normalised = [];
      }
      setAlerts(normalised);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const handleCreateAlert = async () => {
    try {
       const payload = {                 // API expects snake_case
          ...formData,
          is_active: formData.isActive,
          raw_text: formData.title,
        };
        const { data } = await API.post<Alert>("alerts/", payload);
        setAlerts((a) => [...a, data]);
        setShowCreateModal(false);
        resetForm();
      } catch (err) {
        console.error("createAlert:", err);
      }
    };

    const handleUpdateAlert = async () => {
        if (!editingAlert) return;
        try {
          const payload = {
            ...formData,
            is_active: formData.isActive,
            raw_text: formData.title,
        };
          const { data } = await API.put<Alert>(`alerts/${editingAlert.id}/`, payload);
          setAlerts((prev) => prev.map((a) => (a.id === data.id ? data : a)));
          setEditingAlert(null);
          setShowCreateModal(false);
          resetForm();
        } catch (err) {
          console.error("updateAlert:", err);
        }
      };

  const handleDeleteAlert = async (id: number) => {
    try {
      await API.delete(`alerts/${id}/`);
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error("deleteAlert:", error);

    }
  };

  const handleToggleAlert = async (id: number, isActive: boolean) => {
    try {
      const { data } = await API.post<Alert>(`alerts/${id}/toggle/`);
          // server returns the updated alert (preferred)
          if (data) {
            setAlerts(prev => prev.map(a => (a.id === id ? data : a)));
          } else {
            // fallback – optimistic toggle
            setAlerts(prev =>
              prev.map(a =>
                a.id === id ? { ...a, is_active: !a.is_active } : a
              )
            );
          }
    } catch (error) {
      console.error('Error toggling alert:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
      try {
        await API.post("alerts/mark-all-read/");
        setAlerts(prev => prev.map(a => ({ ...a, read: true })));
      } catch (err) {
        console.error("markAllRead:", err);
      }
    };

  const handleMarkAsRead = async (id: number) => {
    try {
      await API.post(`alerts/${id}/mark-read/`);
      setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a)),
    );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'price',
      condition: 'above',
      value: '',
      symbol: '',
      isActive: true
    });
  };

  const unreadCount = alerts.filter(alert => !alert.read).length;

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold">Alerts</h1>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Mark all as read
            </button>
            <button
              onClick={() => {
                setEditingAlert(null);
                resetForm();
                setShowCreateModal(true);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Alert
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {alerts.length === 0 ? (
            <div className="text-center py-12 bg-gray-800 rounded-lg">
              <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No alerts configured yet</p>
              <p className="text-gray-500 text-sm mt-2">Create your first alert to get started</p>
            </div>
          ) : (
            alerts.map(alert => (
              <div
                key={alert.id}
                className={`bg-gray-800 rounded-lg p-4 border ${
                  !alert.read ? 'border-blue-500' : 'border-gray-700'
                } ${!alert.is_active ? 'opacity-50' : ''}`}
                onClick={() => !alert.read && handleMarkAsRead(alert.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{alert.title}</h3>
                      {!alert.read && (
                        <span className="bg-blue-500 text-xs px-2 py-1 rounded">NEW</span>
                      )}
                      {alert.triggered && (
                        <span className="bg-green-500 text-xs px-2 py-1 rounded">TRIGGERED</span>
                      )}
                    </div>
                    <div className="flex gap-4 text-sm text-gray-400">
                      <span className="capitalize">{alert.type}</span>
                     <span>{alert.symbol}</span>
                      <span>{alert.condition} {alert.value}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Created: {new Date(alert.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleAlert(alert.id, alert.is_active);
                      }}
                      className={`px-3 py-1 rounded ${
                        alert.is_active 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                    >
                      {alert.is_active ? "Active" : "Inactive"}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingAlert(alert);
                        setFormData({
                          title: alert.title,
                          type: alert.type,
                          condition: alert.condition,
                          value: alert.value,
                          symbol: alert.symbol,
                          isActive: alert.is_active
                        });
                        setShowCreateModal(true);
                      }}
                      className="p-2 bg-gray-700 hover:bg-gray-600 rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAlert(alert.id);
                      }}
                      className="p-2 bg-red-600 hover:bg-red-700 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create/Edit Alert Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">
              {editingAlert ? 'Edit Alert' : 'Create New Alert'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Alert title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Symbol</label>
                <input
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="BTC, ETH, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Alert Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="price">Price Alert</option>
                  <option value="volume">Volume Alert</option>
                  <option value="indicator">Technical Indicator</option>
                  <option value="news">News Alert</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Condition</label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="above">Above</option>
                  <option value="below">Below</option>
                  <option value="crosses">Crosses</option>
                  <option value="equals">Equals</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Value</label>
                <input
                  type="text"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Target value"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="isActive" className="text-sm">Active</label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={editingAlert ? handleUpdateAlert : handleCreateAlert}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                {editingAlert ? 'Update' : 'Create'}
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingAlert(null);
                  resetForm();
                }}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerts;