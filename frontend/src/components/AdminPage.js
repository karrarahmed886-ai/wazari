import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Eye, Check, X, Clock, Search, Filter } from "lucide-react";
import SecurityProtection from "./SecurityProtection";
import ThemeToggle from "./ThemeToggle";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, pending, confirmed, rejected
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API}/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrder = async (orderId, status, adminNotes = "") => {
    setUpdating(true);
    try {
      await axios.put(`${API}/orders/${orderId}`, {
        status,
        admin_notes: adminNotes
      });
      
      // Update local state
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status, admin_notes: adminNotes }
          : order
      ));
      
      setSelectedOrder(null);
      alert(`تم ${status === "confirmed" ? "تأكيد" : "رفض"} الطلب بنجاح`);
    } catch (error) {
      console.error("Error updating order:", error);
      alert("حدث خطأ في تحديث الطلب");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "confirmed": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending": return "في الانتظار";
      case "confirmed": return "مؤكد";
      case "rejected": return "مرفوض";
      default: return status;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === "all" || order.status === filter;
    const matchesSearch = order.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.telegram_username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.card_number.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-3 text-gray-600 hover:text-gray-900"
            >
              <ArrowRight className="h-5 w-5" />
              <span>العودة للموقع</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">لوحة إدارة الطلبات</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
            <div className="text-gray-600">إجمالي الطلبات</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-2xl font-bold text-yellow-600">
              {orders.filter(o => o.status === "pending").length}
            </div>
            <div className="text-gray-600">في الانتظار</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-2xl font-bold text-green-600">
              {orders.filter(o => o.status === "confirmed").length}
            </div>
            <div className="text-gray-600">مؤكد</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-2xl font-bold text-red-600">
              {orders.filter(o => o.status === "rejected").length}
            </div>
            <div className="text-gray-600">مرفوض</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="البحث في الطلبات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">جميع الطلبات</option>
                <option value="pending">في الانتظار</option>
                <option value="confirmed">مؤكد</option>
                <option value="rejected">مرفوض</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الطالب</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الصف</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">النوع</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المبلغ</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">كارت الرصيد</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التاريخ</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">إجراءات</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">{order.student_name}</div>
                        <div className="text-sm text-gray-500">@{order.telegram_username}</div>
                        <div className="text-sm text-gray-500">{order.phone_number}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.grade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.purchase_type === "all" ? "جميع المواد" : "مواد منفردة"}
                      {order.purchase_type === "single" && (
                        <div className="text-xs text-gray-500">
                          {order.selected_subjects.length} مادة
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${order.total_amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {order.card_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          data-testid={`view-order-${order.id}`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {order.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleUpdateOrder(order.id, "confirmed")}
                              disabled={updating}
                              className="text-green-600 hover:text-green-900 p-1 disabled:opacity-50"
                              data-testid={`confirm-order-${order.id}`}
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleUpdateOrder(order.id, "rejected")}
                              disabled={updating}
                              className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50"
                              data-testid={`reject-order-${order.id}`}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Clock className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد طلبات</h3>
              <p className="mt-1 text-sm text-gray-500">لا توجد طلبات تطابق معايير البحث الخاصة بك.</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">تفاصيل الطلب</h3>
            <div className="space-y-3 text-sm">
              <div><strong>رقم الطلب:</strong> {selectedOrder.id.slice(0, 8).toUpperCase()}</div>
              <div><strong>اسم الطالب:</strong> {selectedOrder.student_name}</div>
              <div><strong>التلغرام:</strong> @{selectedOrder.telegram_username}</div>
              <div><strong>الهاتف:</strong> {selectedOrder.phone_number}</div>
              <div><strong>الصف:</strong> {selectedOrder.grade}</div>
              <div><strong>نوع الشراء:</strong> {selectedOrder.purchase_type === "all" ? "جميع المواد" : "مواد منفردة"}</div>
              <div><strong>عدد المواد:</strong> {selectedOrder.selected_subjects.length}</div>
              <div><strong>المبلغ:</strong> ${selectedOrder.total_amount}</div>
              <div><strong>كارت الرصيد:</strong> {selectedOrder.card_number}</div>
              <div><strong>الحالة:</strong> <span className={`px-2 py-1 rounded text-xs ${getStatusColor(selectedOrder.status)}`}>{getStatusText(selectedOrder.status)}</span></div>
              <div><strong>تاريخ الإنشاء:</strong> {formatDate(selectedOrder.created_at)}</div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;