import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Package, Clock, CheckCircle, XCircle, Search } from "lucide-react";
import SecurityProtection from "./SecurityProtection";
import Sidebar from "./Sidebar";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Filter by local identifier (cookie or localStorage) so the user sees only their orders
    fetchOrders();
  }, []);

  const getClientKey = () => {
    // Use a stable client key from localStorage, create if missing
    let key = localStorage.getItem('client_key');
    if (!key) {
      key = `ck_${Math.random().toString(36).slice(2)}_${Date.now()}`;
      localStorage.setItem('client_key', key);
    }
    return key;
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API}/orders`);
      const all = response.data || [];
      const key = getClientKey();
      // Show only orders that match this device's client key or contain it in telegram_username (fallback)
      const mine = all.filter(o => (o.client_key && o.client_key === key) || (o.telegram_username && o.telegram_username.includes(key)));
      setOrders(mine);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "confirmed": return "bg-green-100 text-green-800 border-green-300";
      case "rejected": return "bg-red-100 text-red-800 border-red-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending": return "قيد المراجعة";
      case "confirmed": return "تم التأكيد";
      case "rejected": return "مرفوض";
      default: return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4" />;
      case "confirmed": return <CheckCircle className="w-4 h-4" />;
      case "rejected": return <XCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter(order =>
    order.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.contact_value || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.grade.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900 flex items-center justify-center">
        <SecurityProtection />
        <Sidebar />
        <div className="text-center animate-fadeInUp">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">جاري تحميل طلباتك...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900 transition-colors duration-300">
      <SecurityProtection />
      <Sidebar />
      
      {/* Header */}
      <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowRight className="h-5 w-5" />
              <span>العودة للرئيسية</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">طلباتي</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="البحث في طلباتك..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">لا توجد طلبات</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {searchTerm ? "لا توجد طلبات تطابق البحث" : "لم تقم بإنشاء أي طلبات بعد"}
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-colors"
            >
              إنشاء طلب جديد
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredOrders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl p-6 transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        طلب رقم: {order.id.slice(0, 8).toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="text-sm font-medium">{getStatusText(order.status)}</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">الطالب</p>
                    <p className="text-gray-900 dark:text-white">{order.student_name}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">الصف الدراسي</p>
                    <p className="text-gray-900 dark:text-white">{order.grade}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">نوع الشراء</p>
                    <p className="text-gray-900 dark:text-white">
                      {order.purchase_type === "all" ? "جميع المواد" : `${order.selected_subjects.length} مواد`}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">المبلغ</p>
                    <p className="text-gray-900 dark:text-white font-semibold">${order.total_amount}</p>
                  </div>
                </div>

                {order.status === "confirmed" && (
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700">
                    <p className="text-green-800 dark:text-green-200 text-sm font-medium">
                      ✅ تم إرسال الأسئلة بنجاح! تحقق من {order.contact_method === "telegram" ? "التلغرام" : order.contact_method === "whatsapp" ? "الواتساب" : "الإيميل"}
                    </p>
                  </div>
                )}

                {order.status === "rejected" && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-700">
                    <p className="text-red-800 dark:text-red-200 text-sm font-medium">
                      ❌ تم رفض الطلب. يرجى التواصل معنا للمزيد من التفاصيل
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;