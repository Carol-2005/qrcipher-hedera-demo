"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, MapPin, DollarSign, Search, RefreshCw, AlertCircle, Database, Eye, Edit, Trash2, Calendar, Hash, Coins } from 'lucide-react';

export default function ProductsList() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const router = useRouter();

    const fetchProducts = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
  
            const response = await fetch('/api/product/fetchAll');
            const data = await response.json();
            
            setProducts(data.products);
            setFilteredProducts(data.products);
        } catch (err) {
            setError('Failed to fetch products from database');
            console.error('Error fetching products:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        let filtered = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.location.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Sort products
        filtered.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];
            
            if (sortBy === 'price') {
                aValue = parseFloat(aValue);
                bValue = parseFloat(bValue);
            }
            
            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        setFilteredProducts(filtered);
    }, [searchTerm, products, sortBy, sortOrder]);

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const handleCreateButtonClick = (productId) => {
        router.push(`/main/${productId}`);
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Products Database</h1>
                    <p className="mt-3 text-xl text-gray-600">View and manage all registered products</p>
                </div>

                {/* Controls */}
                <div className="bg-white shadow-lg rounded-xl border border-gray-100 mb-6">
                    <div className="px-6 py-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search products, locations, or manufacturers..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-black"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
                                >
                                    <option value="productName">Name</option>
                                    <option value="location">Location</option>
                                    <option value="price">Price</option>
                                    <option value="createdAt">Date</option>
                                </select>
                                
                                <button
                                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    {sortOrder === 'asc' ? '↑' : '↓'}
                                </button>
                                
                                <button
                                    onClick={fetchProducts}
                                    disabled={isLoading}
                                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                                    Refresh
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
                    <div className="bg-indigo-50 px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-indigo-800 flex items-center">
                                <Database className="h-5 w-5 mr-2 text-indigo-600" />
                                All Products ({filteredProducts.length})
                            </h2>
                        </div>
                    </div>

                    <div className="px-6 py-6">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center h-64 py-8">
                                <div className="bg-indigo-50 rounded-full p-6 shadow-md">
                                    <Database className="h-12 w-12 text-indigo-400 animate-pulse" />
                                </div>
                                <p className="mt-6 text-gray-500 text-center font-medium">Loading products from database...</p>
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <AlertCircle className="h-5 w-5 text-red-400" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">Database Error</h3>
                                        <div className="mt-2 text-sm text-red-700">{error}</div>
                                    </div>
                                </div>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 py-8">
                                <div className="bg-gray-50 rounded-full p-6 shadow-md">
                                    <Package className="h-12 w-12 text-gray-300" />
                                </div>
                                <p className="mt-6 text-gray-500 text-center font-medium">
                                    {searchTerm ? 'No products match your search' : 'No products found in database'}
                                </p>
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="mt-3 text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                                    >
                                        Clear search
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map((product) => (
                                    <div
                                        key={product._id}
                                        className="bg-gray-50 rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                    {product.name}
                                                </h3>
                                                <div className="space-y-2">
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <MapPin className="h-4 w-4 mr-2 text-indigo-500" />
                                                        {product.location}
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                                                        ${product.price}
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                                                        {new Date(product.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="border-t border-gray-200 pt-4">
                                            <div className="flex items-center justify-between">
                                                <div className="text-xs text-gray-500">
                                                    ID: {product._id.substring(0, 8)}...
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => alert(`Viewing details for ${product.name}`)}
                                                        className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                    >
                                                        <Eye className="h-3 w-3 mr-1" />
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={() => handleCreateButtonClick(product._id)}
                                                        className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                    >
                                                        <Coins className="h-3 w-3 mr-1" />
                                                        Create
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Summary Stats */}
                {!isLoading && !error && products.length > 0 && (
                    <div className="mt-6 bg-white shadow-lg rounded-xl border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Summary</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-indigo-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-indigo-600">{products.length}</div>
                                <div className="text-sm text-indigo-800">Total Products</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    ${products.reduce((sum, p) => sum + parseFloat(p.price), 0).toFixed(2)}
                                </div>
                                <div className="text-sm text-green-800">Total Value</div>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-purple-600">
                                    {new Set(products.map(p => p.location)).size}
                                </div>
                                <div className="text-sm text-purple-800">Unique Locations</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}