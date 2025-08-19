"use client";

import { useState } from 'react';
import { Package, MapPin, DollarSign, Database, FileText, AlertCircle, Check } from 'lucide-react';
import axios from 'axios';

export default function SimpleProductForm() {
    const [formData, setFormData] = useState({
        productName: '',
        location: '',
        price: ''
    });

    const [response, setResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
    
        try {
            const response = await axios.post('/api/product/createProduct', {
                ...formData
            });

            const result = await response.data;

            if (!result || !result.success) {
                throw new Error('failed to create product');
            }
            
            setResponse({
                success: true,
                productId: result.id,
                message: 'Successfully created the Product'
            });
            
        } catch (err) {
            
            setError(err.message);
            console.error("Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            productName: '',
            location: '',
            price: ''
        });
        setResponse(null);
        setError(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Create New Product</h1>
                    <p className="mt-3 text-xl text-gray-600 max-w-2xl mx-auto">Enter basic product information to get started</p>
                </div>

                <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 max-w-2xl mx-auto">
                    <div className="bg-indigo-50 px-6 py-4 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-indigo-800 flex items-center">
                            <Package className="h-5 w-5 mr-2 text-indigo-600" />
                            Product Information
                        </h2>
                    </div>
                    
                    <div className="px-6 py-6">
                        {!response ? (
                            <div>
                                <div className="space-y-6">
                                    <div>
                                        <label htmlFor="productName" className="text-sm font-medium text-gray-700 flex items-center">
                                            <Package className="h-4 w-4 mr-2 text-indigo-500" />
                                            Product Name
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <input
                                                type="text"
                                                name="productName"
                                                id="productName"
                                                required
                                                value={formData.productName}
                                                onChange={handleChange}
                                                className="w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-lg p-3 border text-black"
                                                placeholder="Enter product name"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="location" className="text-sm font-medium text-gray-700 flex items-center">
                                            <MapPin className="h-4 w-4 mr-2 text-indigo-500" />
                                            Location
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <input
                                                type="text"
                                                name="location"
                                                id="location"
                                                required
                                                value={formData.location}
                                                onChange={handleChange}
                                                className="w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-lg p-3 border text-black"
                                                placeholder="Product location"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="price" className="text-sm font-medium text-gray-700 flex items-center">
                                            <DollarSign className="h-4 w-4 mr-2 text-indigo-500" />
                                            Price
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm">$</span>
                                            </div>
                                            <input
                                                type="number"
                                                name="price"
                                                id="price"
                                                step="0.01"
                                                required
                                                value={formData.price}
                                                onChange={handleChange}
                                                className="w-full pl-7 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-lg p-3 border text-black"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <AlertCircle className="h-5 w-5 text-red-400" />
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-red-800">Error Creating Product</h3>
                                                <div className="mt-2 text-sm text-red-700">{error}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-8">
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isLoading}
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 transition-colors duration-200"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Creating Product...
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                <Database className="h-5 w-5 mr-2" />
                                                Create Product
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <Check className="h-5 w-5 text-green-400" />
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-green-800">Product Created Successfully</h3>
                                            <div className="mt-2 text-sm text-green-700">{response.message}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-indigo-500">
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT NAME</p>
                                        <p className="font-medium text-gray-900 text-lg">{formData.productName}</p>
                                    </div>
                                    
                                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-indigo-500">
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">LOCATION</p>
                                        <p className="font-medium text-gray-900">{formData.location}</p>
                                    </div>
                                    
                                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-indigo-500">
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">PRICE</p>
                                        <p className="font-medium text-gray-900">${formData.price}</p>
                                    </div>
                                    
                                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-green-500">
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT ID</p>
                                        <p className="font-mono text-sm text-gray-800">{response.productId}</p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-5 mt-6">
                                    <button 
                                        onClick={resetForm}
                                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
                                    >
                                        <Package className="h-4 w-4 mr-2 text-gray-500" />
                                        Create Another Product
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}