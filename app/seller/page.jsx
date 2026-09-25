"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const initialProducts = [
  {
    id: "prod-1",
    name: "Wireless Noise-Canceling Headphones",
    category: "Electronics",
    price: 199.99,
    stock: 45,
    sales: 128,
    status: "Active",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    description: "High fidelity audio with premium noise cancellation.",
  },
  {
    id: "prod-2",
    name: "Minimalist Mechanical Keyboard",
    category: "Electronics",
    price: 129.50,
    stock: 18,
    sales: 84,
    status: "Active",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80",
    description: "Tactile switches with customizable RGB backlighting.",
  },
  {
    id: "prod-3",
    name: "Ergonomic Leather Desk Chair",
    category: "Furniture",
    price: 280.00,
    stock: 6,
    sales: 32,
    status: "Low Stock",
    image: "https://images.unsplash.com/photo-1580481072645-022f9a6d1270?w=500&q=80",
    description: "Full lumbar support with genuine top-grain leather.",
  },
  {
    id: "prod-4",
    name: "Smart Fitness Watch Ultra",
    category: "Electronics",
    price: 249.99,
    stock: 0,
    sales: 95,
    status: "Out of Stock",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
    description: "Track health metrics, GPS routes, and heart rate 24/7.",
  },
  {
    id: "prod-5",
    name: "Ceramic Minimalist Coffee Mug",
    category: "Home & Kitchen",
    price: 24.99,
    stock: 120,
    sales: 210,
    status: "Active",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80",
    description: "Handcrafted matte finish stoneware ceramic mug.",
  },
];

const initialOrders = [
  {
    id: "ORD-9021",
    customer: "Sarah Jenkins",
    email: "sarah.j@example.com",
    items: "Wireless Headphones x1",
    total: 199.99,
    status: "Pending",
    date: "2025-02-18",
  },
  {
    id: "ORD-9020",
    customer: "Michael Chang",
    email: "m.chang@example.com",
    items: "Mechanical Keyboard x1, Coffee Mug x2",
    total: 179.48,
    status: "Processing",
    date: "2025-02-18",
  },
  {
    id: "ORD-9019",
    customer: "Emma Watson",
    email: "emma.w@example.com",
    items: "Ergonomic Leather Desk Chair x1",
    total: 280.00,
    status: "Shipped",
    date: "2025-02-17",
  },
  {
    id: "ORD-9018",
    customer: "David Smith",
    email: "dsmith@example.com",
    items: "Smart Fitness Watch Ultra x1",
    total: 249.99,
    status: "Delivered",
    date: "2025-02-16",
  },
];

export default function SellerPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Form State for new product
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Electronics",
    price: "",
    stock: "",
    image: "",
    description: "",
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const categories = ["All", "Electronics", "Furniture", "Home & Kitchen", "Apparel"];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      alert("Please fill in all required fields.");
      return;
    }

    const priceNum = parseFloat(newProduct.price);
    const stockNum = parseInt(newProduct.stock, 10);
    const status = stockNum === 0 ? "Out of Stock" : stockNum < 10 ? "Low Stock" : "Active";

    const createdProduct = {
      id: `prod-${Date.now()}`,
      name: newProduct.name,
      category: newProduct.category,
      price: priceNum,
      stock: stockNum,
      sales: 0,
      status: status,
      image: newProduct.image.trim() || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80",
      description: newProduct.description || "No description provided.",
    };

    setProducts([createdProduct, ...products]);
    setNewProduct({
      name: "",
      category: "Electronics",
      price: "",
      stock: "",
      image: "",
      description: "",
    });
    setIsAddModalOpen(false);
    showToast(`"${createdProduct.name}" has been successfully listed!`);
  };

  const handleDeleteProduct = (id, name) => {
    if (confirm(`Are you sure you want to remove "${name}" from your listings?`)) {
      setProducts(products.filter((p) => p.id !== id));
      showToast(`Product "${name}" deleted.`);
    }
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showToast(`Order ${orderId} status updated to ${newStatus}`);
  };

  const totalRevenue = products.reduce((acc, p) => acc + p.price * p.sales, 0) + 12850;
  const totalSalesCount = products.reduce((acc, p) => acc + p.sales, 0) + 142;
  const activeListingsCount = products.filter((p) => p.status !== "Out of Stock").length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#06142E] via-[#1b1e42] to-[#381932] border-b border-slate-800 py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-purple-900/30">
                SD
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-slate-900 rounded-full flex items-center justify-center" title="Verified Seller">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Starlight Marketplace</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-900/80 text-purple-200 border border-purple-700">
                  Pro Seller
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Manage your inventory, track orders, and boost your sales performance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-purple-600/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add New Product</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-8 space-y-8">
        {/* KPI Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl relative overflow-hidden group hover:border-slate-700 transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">Total Revenue</p>
                <h3 className="text-2xl font-bold text-white mt-1">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
              </div>
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-emerald-400 font-medium">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>+14.8% from last month</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl relative overflow-hidden group hover:border-slate-700 transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">Total Orders</p>
                <h3 className="text-2xl font-bold text-white mt-1">{totalSalesCount}</h3>
              </div>
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4L5 11z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-indigo-400 font-medium">
              <span>{orders.filter(o => o.status === 'Pending').length} pending fulfillment</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl relative overflow-hidden group hover:border-slate-700 transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">Active Products</p>
                <h3 className="text-2xl font-bold text-white mt-1">{activeListingsCount}</h3>
              </div>
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-amber-400 font-medium">
              <span>{products.filter(p => p.stock < 10 && p.stock > 0).length} low in stock</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl relative overflow-hidden group hover:border-slate-700 transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">Seller Rating</p>
                <h3 className="text-2xl font-bold text-white mt-1">4.9 / 5.0</h3>
              </div>
              <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
                <svg className="w-6 h-6 fill-current text-purple-400" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-purple-400 font-medium">
              <span>Based on 148 customer reviews</span>
            </div>
          </motion.div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex items-center border-b border-slate-800 space-x-2 sm:space-x-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-4 px-2 text-sm font-semibold transition-all duration-200 border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === "overview"
                ? "border-purple-500 text-purple-400"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Overview
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`pb-4 px-2 text-sm font-semibold transition-all duration-200 border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === "products"
                ? "border-purple-500 text-purple-400"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-4 px-2 text-sm font-semibold transition-all duration-200 border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === "orders"
                ? "border-purple-500 text-purple-400"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4L5 11z" />
            </svg>
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`pb-4 px-2 text-sm font-semibold transition-all duration-200 border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === "settings"
                ? "border-purple-500 text-purple-400"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Store Settings
          </button>
        </div>

        {/* TAB CONTENTS */}

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Orders Overview */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-white">Recent Orders</h2>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition"
                  >
                    View All Orders →
                  </button>
                </div>
                <div className="divide-y divide-slate-800">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="py-3.5 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-purple-300">{order.id}</span>
                          <span className="text-sm font-medium text-slate-200">{order.customer}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{order.items}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-white">${order.total.toFixed(2)}</p>
                        <span
                          className={`inline-block px-2 py-0.5 mt-1 rounded text-[10px] font-semibold uppercase tracking-wider ${
                            order.status === "Delivered"
                              ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800"
                              : order.status === "Shipped"
                              ? "bg-blue-950/80 text-blue-400 border border-blue-800"
                              : order.status === "Processing"
                              ? "bg-amber-950/80 text-amber-400 border border-amber-800"
                              : "bg-slate-800 text-slate-300 border border-slate-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Best Selling Products */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-white">Top Performing Products</h2>
                  <button
                    onClick={() => setActiveTab("products")}
                    className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition"
                  >
                    Manage Inventory →
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {products.slice(0, 4).map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center space-x-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-14 h-14 rounded-lg object-cover bg-slate-800"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-200 truncate">{p.name}</p>
                        <p className="text-xs text-slate-400">${p.price.toFixed(2)}</p>
                        <p className="text-xs text-emerald-400 font-medium mt-0.5">{p.sales} units sold</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions & Store Health Sidebar */}
            <div className="space-y-6">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-bold text-white mb-4">Quick Seller Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="w-full text-left px-4 py-3 bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white rounded-xl transition flex items-center justify-between group"
                  >
                    <span className="text-sm font-medium">List New Product</span>
                    <span className="text-purple-400 group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="w-full text-left px-4 py-3 bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white rounded-xl transition flex items-center justify-between group"
                  >
                    <span className="text-sm font-medium">Fulfill Pending Orders</span>
                    <span className="text-purple-400 group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("settings")}
                    className="w-full text-left px-4 py-3 bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white rounded-xl transition flex items-center justify-between group"
                  >
                    <span className="text-sm font-medium">Configure Payouts</span>
                    <span className="text-purple-400 group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-950/40 to-slate-900/90 border border-purple-900/40 rounded-2xl p-6 shadow-xl">
                <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300 mb-2">Seller Health Status</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">Order Fulfillment Rate</span>
                      <span className="text-emerald-400 font-bold">98.5%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: "98.5%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">On-Time Shipping</span>
                      <span className="text-purple-400 font-bold">96.0%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full" style={{ width: "96%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === "products" && (
          <div className="space-y-6">
            {/* Filter and Search controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search products by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 pl-10 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
                <svg className="w-4 h-4 text-slate-500 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-xs text-slate-400 font-medium">Category:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
                <p className="text-slate-400 text-sm">No products found matching your search criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col group hover:border-slate-700 transition"
                  >
                    <div className="relative h-48 bg-slate-950 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span
                        className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold shadow-md ${
                          product.status === "Active"
                            ? "bg-emerald-900/90 text-emerald-200 border border-emerald-700"
                            : product.status === "Low Stock"
                            ? "bg-amber-900/90 text-amber-200 border border-amber-700"
                            : "bg-red-900/90 text-red-200 border border-red-700"
                        }`}
                      >
                        {product.status}
                      </span>
                      <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-950/80 backdrop-blur-md text-slate-300">
                        {product.category}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="font-bold text-lg text-white group-hover:text-purple-300 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                          {product.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                        <div>
                          <p className="text-xs text-slate-500">Price</p>
                          <p className="text-lg font-bold text-white">${product.price.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-500">Stock</p>
                          <p className="text-sm font-semibold text-slate-300">{product.stock} units</p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => {
                            const newStock = prompt(`Update stock count for ${product.name}:`, product.stock);
                            if (newStock !== null && !isNaN(parseInt(newStock))) {
                              const updatedStock = parseInt(newStock);
                              const newStatus = updatedStock === 0 ? "Out of Stock" : updatedStock < 10 ? "Low Stock" : "Active";
                              setProducts(
                                products.map((p) => (p.id === product.id ? { ...p, stock: updatedStock, status: newStatus } : p))
                              );
                              showToast(`Stock updated for ${product.name}`);
                            }
                          }}
                          className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
                        >
                          Quick Stock Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id, product.name)}
                          className="px-3 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-900/50 rounded-xl text-xs font-semibold transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === "orders" && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Order Management</h2>
                <p className="text-xs text-slate-400 mt-0.5">Track and update customer order states</p>
              </div>
              <span className="text-xs bg-purple-950 text-purple-300 px-3 py-1 rounded-full border border-purple-800 font-medium">
                {orders.length} Total Orders
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-6">Order ID</th>
                    <th className="py-3.5 px-6">Customer</th>
                    <th className="py-3.5 px-6">Items</th>
                    <th className="py-3.5 px-6">Total</th>
                    <th className="py-3.5 px-6">Date</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="py-4 px-6 font-mono font-semibold text-purple-400">{order.id}</td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-100">{order.customer}</div>
                        <div className="text-xs text-slate-500">{order.email}</div>
                      </td>
                      <td className="py-4 px-6 text-slate-300 max-w-xs truncate">{order.items}</td>
                      <td className="py-4 px-6 font-bold text-white">${order.total.toFixed(2)}</td>
                      <td className="py-4 px-6 text-xs text-slate-400">{order.date}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                            order.status === "Delivered"
                              ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800"
                              : order.status === "Shipped"
                              ? "bg-blue-950/80 text-blue-400 border border-blue-800"
                              : order.status === "Processing"
                              ? "bg-amber-950/80 text-amber-400 border border-amber-800"
                              : "bg-slate-800 text-slate-300 border border-slate-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-purple-500"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && (
          <div className="max-w-3xl mx-auto bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Store Settings & Info</h2>
              <p className="text-sm text-slate-400 mt-1">Configure your public store details and payment preferences.</p>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Store Front Name
                </label>
                <input
                  type="text"
                  defaultValue="Starlight Marketplace"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Support Email
                </label>
                <input
                  type="email"
                  defaultValue="support@starlight.store"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Store Bio / Description
                </label>
                <textarea
                  rows={3}
                  defaultValue="Premium electronics, handcrafted goods, and high quality lifestyle products delivered fast."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => showToast("Store settings saved successfully.")}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition shadow-lg shadow-purple-600/20"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ADD PRODUCT MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white">List New Product</h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-slate-400 hover:text-white transition"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wireless Gaming Mouse"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
                    >
                      <option value="Electronics">Electronics</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Home & Kitchen">Home & Kitchen</option>
                      <option value="Apparel">Apparel</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Price ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="49.99"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Stock Units *</label>
                    <input
                      type="number"
                      required
                      placeholder="25"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Image URL</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of the product features..."
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl transition shadow-lg shadow-purple-600/30"
                  >
                    Publish Product
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 bg-slate-900 border border-purple-500/50 text-white text-sm px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 z-50"
          >
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
