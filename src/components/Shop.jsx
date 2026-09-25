import React, { useState, useEffect, useMemo } from 'react';
import {
    ShoppingCart,
    X,
    Plus,
    Minus,
    MessageCircle,
    Info,
    ChevronLeft,
    CheckCircle2
} from 'lucide-react';

import cbMenu from "../assets/img/menu/cb_menu.png";
import clfMenu from "../assets/img/menu/clf_menu.png";
import mlfMenu from "../assets/img/menu/mlf_menu.jpg";


// Mock data for our drinks menu
const MENU_DATA = [
    {
        id: 'd1',
        name: 'Cold Brew Coffee',
        category: 'Coffee',
        price: 20000,
        description: 'A smooth and refreshing cold brew coffee, perfect for a hot day. Served over ice with a hint of sweetness.',
        image: cbMenu,
        tags: ['Best Seller', 'Black Coffe', 'Smooth']
    },
    {
        id: 'd2',
        name: 'Coffee Latte',
        category: 'Latte',
        price: 21000,
        description: 'Premium Japanese matcha whisked with fresh milk and a shot of our signature espresso.',
        image: clfMenu,
        tags: ['Creamy', 'Sweet']
    },
    {
        id: 'd3',
        name: 'Matcha Latte',
        category: 'Latte',
        price: 22000,
        description: 'Premium Japanese matcha whisked with fresh milk and a shot of our signature espresso.',
        image: mlfMenu,
        tags: ['Earthy', 'Creamy', 'Sweet']
    },
];

// Formatting helper
const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(number);
};

// WhatsApp Config - Replace with your actual number
const WHATSAPP_NUMBER = "6289527422433"; // Example format: Country code + number (no +)

export default function App() {
    // --- State Management ---
    // Cart stored in LocalStorage
    const [cart, setCart] = useState(() => {
        try {
            const savedCart = localStorage.getItem('blobbyCart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error("Error reading cart from local storage:", error);
            return [];
        }
    });

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All');
    const [showNotification, setShowNotification] = useState(false);

    // Categories derived from data
    const categories = useMemo(() => {
        const cats = new Set(MENU_DATA.map(item => item.category));
        return ['All', ...Array.from(cats)];
    }, []);

    const filteredMenu = useMemo(() => {
        if (activeCategory === 'All') return MENU_DATA;
        return MENU_DATA.filter(item => item.category === activeCategory);
    }, [activeCategory]);

    const cartTotal = useMemo(() => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }, [cart]);

    const cartItemCount = useMemo(() => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    }, [cart]);

    // --- Effects ---
    useEffect(() => {
        try {
            localStorage.setItem('blobbyCart', JSON.stringify(cart));
        } catch (error) {
            console.error("Error saving cart to local storage:", error);
        }
    }, [cart]);

    // Notification timeout
    useEffect(() => {
        if (showNotification) {
            const timer = setTimeout(() => setShowNotification(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [showNotification]);

    // Prevent body scroll when modals are open
    useEffect(() => {
        if (isCartOpen || selectedProduct) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isCartOpen, selectedProduct]);

    // --- Actions ---
    const handleAddToCart = (product, quantity = 1) => {
        setCart(prevCart => {
            const existingItemIndex = prevCart.findIndex(item => item.id === product.id);
            if (existingItemIndex >= 0) {
                // Update quantity if item exists
                const newCart = [...prevCart];
                newCart[existingItemIndex].quantity += quantity;
                return newCart;
            } else {
                // Add new item
                return [...prevCart, { ...product, quantity }];
            }
        });
        
        // Close product modal if open
        if (selectedProduct) setSelectedProduct(null);
        setShowNotification(true);
    };

    const handleUpdateCartItem = (id, newQuantity) => {
        if (newQuantity < 1) {
            setCart(prevCart => prevCart.filter(item => item.id !== id));
        } else {
            setCart(prevCart => prevCart.map(item => 
                item.id === id ? { ...item, quantity: newQuantity } : item
            ));
        }
    };

    const handleClearCart = () => {
        setCart([]);
    };

    const handleDirectBuy = (product) => {
        const quantity = 1;
        const total = product.price * quantity;
        
        // Format message as requested
        const message = `Halo, saya ingin pesan:
- ${product.name} (${quantity}x)

Total Pesanan: ${quantity} item
Total Harga: ${formatRupiah(total)}

Apakah bisa diproses?`;

        const encodedMessage = encodeURIComponent(message);
        const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
        window.open(waUrl, '_blank');
    };

    const handleCheckoutCart = () => {
        if (cart.length === 0) return;

        let orderListText = cart.map(item => 
            `- ${item.name} (${item.quantity}x) : ${formatRupiah(item.price * item.quantity)}`
        ).join('\n');

        // Format message as requested
        const message = `Halo, saya ingin pesan:
${orderListText}

Total Pesanan: ${cartItemCount} item
Total Harga: ${formatRupiah(cartTotal)}

Apakah bisa diproses?`;

        const encodedMessage = encodeURIComponent(message);
        const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
        window.open(waUrl, '_blank');
    };

    const ProductModal = () => {
        if (!selectedProduct) return null;
        
        // Local state for modal quantity
        const [modalQty, setModalQty] = useState(1);

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
                <div 
                    className="bg-white rounded-3xl overflow-hidden w-full max-w-md shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
                    role="dialog"
                    aria-modal="true"
                >
                    {/* Header Image */}
                    <div className="relative h-64 w-full bg-gray-100">
                        <img 
                            src={selectedProduct.image} 
                            alt={selectedProduct.name}
                            className="w-full h-full object-cover"
                        />
                        <button 
                            onClick={() => setSelectedProduct(null)}
                            className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
                            aria-label="Close details"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 overflow-y-auto">
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="text-2xl font-bold text-gray-800">{selectedProduct.name}</h2>
                        </div>
                        
                        <p className="text-xl font-semibold text-emerald-600 mb-4">
                            {formatRupiah(selectedProduct.price)}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {selectedProduct.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <p className="text-gray-600 leading-relaxed mb-6">
                            {selectedProduct.description}
                        </p>

                        {/* Quantity Selector inside modal */}
                        <div className="flex items-center justify-between py-4 border-t border-b border-gray-100 mb-6">
                            <span className="font-medium text-gray-700">Jumlah</span>
                            <div className="flex items-center gap-4 bg-gray-50 rounded-full p-1 border border-gray-200">
                                <button 
                                    onClick={() => setModalQty(Math.max(1, modalQty - 1))}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="w-4 text-center font-semibold">{modalQty}</span>
                                <button 
                                    onClick={() => setModalQty(modalQty + 1)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
                        <button 
                            onClick={() => handleDirectBuy(selectedProduct)}
                            className="flex-1 py-3 px-4 bg-[#25D366] text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#128C7E] transition shadow-sm"
                        >
                            <MessageCircle size={18} />
                            Beli Langsung
                        </button>
                        <button 
                            onClick={() => handleAddToCart(selectedProduct, modalQty)}
                            className="flex-1 py-3 px-4 bg-gray-900 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition shadow-sm"
                        >
                            <ShoppingCart size={18} />
                            + Keranjang
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const CartSidebar = () => {
        return (
            <>
                {/* Backdrop */}
                {isCartOpen && (
                    <div 
                        className="fixed inset-0 bg-black/40 z-40 transition-opacity backdrop-blur-sm"
                        onClick={() => setIsCartOpen(false)}
                    />
                )}
                
                {/* Sidebar */}
                <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    
                    {/* Cart Header */}
                    <div className="flex items-center justify-between p-5 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 -ml-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full transition"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                Keranjang
                                {cartItemCount > 0 && (
                                    <span className="bg-emerald-100 text-emerald-800 text-xs py-1 px-2.5 rounded-full">
                                        {cartItemCount} item
                                    </span>
                                )}
                            </h2>
                        </div>
                        {cart.length > 0 && (
                            <button 
                                onClick={handleClearCart}
                                className="text-sm text-red-500 font-medium hover:text-red-700 hover:underline"
                            >
                                Hapus Semua
                            </button>
                        )}
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-5">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-4">
                                <ShoppingCart size={64} className="opacity-20" />
                                <div>
                                    <p className="text-lg font-medium text-gray-600">Keranjang masih kosong</p>
                                    <p className="text-sm mt-1">Pilih minuman segar favoritmu dulu yuk!</p>
                                </div>
                                <button 
                                    onClick={() => setIsCartOpen(false)}
                                    className="mt-4 px-6 py-2 bg-gray-100 text-gray-800 rounded-full font-medium hover:bg-gray-200 transition"
                                >
                                    Lihat Menu
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {cart.map(item => (
                                    <div key={item.id} className="flex gap-4 items-center group">
                                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-800 truncate">{item.name}</h3>
                                            <p className="text-emerald-600 font-medium text-sm mt-1">
                                                {formatRupiah(item.price)}
                                            </p>
                                            
                                            {/* Qty Controller in Cart */}
                                            <div className="flex items-center gap-3 mt-2">
                                                <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                                                    <button 
                                                        onClick={() => handleUpdateCartItem(item.id, item.quantity - 1)}
                                                        className="w-7 h-7 flex items-center justify-center rounded-md bg-white text-gray-600 shadow-sm hover:text-red-500 transition"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                    <button 
                                                        onClick={() => handleUpdateCartItem(item.id, item.quantity + 1)}
                                                        className="w-7 h-7 flex items-center justify-center rounded-md bg-white text-gray-600 shadow-sm hover:text-emerald-500 transition"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="text-right">
                                            <p className="font-bold text-gray-800">
                                                {formatRupiah(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Cart Footer / Checkout */}
                    {cart.length > 0 && (
                        <div className="border-t border-gray-100 p-5 bg-gray-50">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-600 font-medium">Total Pembayaran</span>
                                <span className="text-2xl font-bold text-gray-900">{formatRupiah(cartTotal)}</span>
                            </div>
                            
                            <button 
                                onClick={handleCheckoutCart}
                                className="w-full py-4 px-4 bg-[#25D366] text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#128C7E] transition shadow-lg shadow-green-200"
                            >
                                <MessageCircle size={22} />
                                Pesan via WhatsApp
                            </button>
                            <p className="text-center text-xs text-gray-500 mt-3 flex items-center justify-center gap-1">
                                <Info size={12} />
                                Anda akan diarahkan ke WhatsApp
                            </p>
                        </div>
                    )}
                </div>
            </>
        );
    };

    return (
        <div className="min-h-screen bg-[#faf9f6] text-gray-900 font-sans selection:bg-emerald-200">
            
            {/* Navigation Header */}
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button 
                        onClick={() => setIsCartOpen(true)}
                        className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-full transition"
                        aria-label="Open cart"
                    >
                        <ShoppingCart size={24} />
                        {cartItemCount > 0 && (
                            <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                                {cartItemCount}
                            </span>
                        )}
                    </button>
                </div>
            </header>

            {/* Notification Toast */}
            <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 pointer-events-none ${showNotification ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                <div className="bg-gray-900 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    Berhasil ditambahkan ke keranjang
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-4 py-8 pb-24">
                {/* Hero Section */}
                <div className="mb-10 text-center">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
                        Menu
                    </h2>
                    <p className="text-gray-500 max-w-lg mx-auto">
                        Pilih menu favoritmu, tambahkan ke keranjang, dan pesan langsung dengan mudah melalui WhatsApp.
                    </p>
                </div>

                {/* Categories */}
                <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 pb-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                                activeCategory === cat 
                                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' 
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Menu Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMenu.map(product => (
                        <div 
                            key={product.id} 
                            className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
                        >
                            {/* Product Image Area */}
                            <div 
                                className="relative h-56 overflow-hidden bg-gray-100 cursor-pointer"
                                onClick={() => setSelectedProduct(product)}
                            >
                                <img 
                                    src={product.image} 
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur text-gray-900 text-sm font-semibold px-4 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0">
                                        Lihat Detail
                                    </div>
                                </div>
                                <div className="absolute top-3 left-3 flex gap-1 flex-wrap max-w-[80%]">
                                     {product.tags.slice(0,1).map(tag => (
                                        <span key={tag} className="px-2 py-1 bg-white/80 backdrop-blur-md text-gray-800 text-[10px] font-bold uppercase tracking-wider rounded">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="p-5 flex flex-col flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">{product.category}</p>
                                        <h3 className="text-lg font-bold text-gray-800 leading-tight">{product.name}</h3>
                                    </div>
                                </div>
                                
                                <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                                    {product.description}
                                </p>

                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                    <span className="text-lg font-bold text-emerald-600">
                                        {formatRupiah(product.price)}
                                    </span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddToCart(product);
                                        }}
                                        className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-emerald-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                                        aria-label="Add to cart"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {filteredMenu.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        Tidak ada menu dalam kategori ini.
                    </div>
                )}
            </main>

            {/* Floating Cart Button for Mobile (Optional, if header isn't enough) */}
            <div className="fixed bottom-6 right-6 md:hidden z-20">
                <button
                     onClick={() => setIsCartOpen(true)}
                     className="w-14 h-14 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-gray-800 transition-transform active:scale-95"
                >
                    <ShoppingCart size={24} />
                    {cartItemCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">
                            {cartItemCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Modals and Overlays */}
            <ProductModal />
            <CartSidebar />
            
            {/* Utility Styles for hiding scrollbar but keeping functionality */}
            <style dangerouslySetInnerHTML={{__html: `
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}} />
        </div>
    );
}