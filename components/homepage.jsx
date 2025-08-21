"use client";

import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";
import { useState } from "react";

export default function NavigationButtons() {
    const [hoveredButton, setHoveredButton] = useState(null);
    
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="flex gap-6 max-w-sm w-full">
                <Link href="/create-new-product" className="block flex-1">
                    <button
                        className="w-full aspect-square bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md p-4 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg flex flex-col items-center justify-center text-white"
                        onMouseEnter={() => setHoveredButton('home')}
                        onMouseLeave={() => setHoveredButton(null)}
                    >
                        <Home 
                            size={24} 
                            className={`mb-2 transition-transform duration-300 ${hoveredButton === 'home' ? 'scale-110' : ''}`} 
                        />
                        <span className="text-sm font-medium mt-1">Add New Product</span>
                    </button>
                </Link>
                
                <Link href="/productlist" className="block flex-1">
                    <button
                        className="w-full aspect-square bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-md p-4 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg flex flex-col items-center justify-center text-white"
                        onMouseEnter={() => setHoveredButton('dashboard')}
                        onMouseLeave={() => setHoveredButton(null)}
                    >
                        <ArrowRight 
                            size={24} 
                            className={`mb-2 transition-transform duration-300 ${hoveredButton === 'dashboard' ? 'translate-x-1' : ''}`} 
                        />
                        <span className="text-sm font-medium mt-1">Add more of existing Product</span>
                    </button>
                </Link>
            </div>
        </div>
    );
}