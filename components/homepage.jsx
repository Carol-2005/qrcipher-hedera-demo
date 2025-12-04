// "use client";

// import Link from "next/link";
// import { ArrowRight, Home } from "lucide-react";
// import { useState } from "react";

// export default function NavigationButtons() {
//     const [hoveredButton, setHoveredButton] = useState(null);
    
//     return (
//         <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
//             <div className="flex gap-6 max-w-sm w-full">
//                 <Link href="/create-new-product" className="block flex-1">
//                     <button
//                         className="w-full aspect-square bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md p-4 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg flex flex-col items-center justify-center text-white"
//                         onMouseEnter={() => setHoveredButton('home')}
//                         onMouseLeave={() => setHoveredButton(null)}
//                     >
//                         <Home 
//                             size={24} 
//                             className={`mb-2 transition-transform duration-300 ${hoveredButton === 'home' ? 'scale-110' : ''}`} 
//                         />
//                         <span className="text-sm font-medium mt-1">Add New Product</span>
//                     </button>
//                 </Link>
                
//                 <Link href="/productlist" className="block flex-1">
//                     <button
//                         className="w-full aspect-square bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-md p-4 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg flex flex-col items-center justify-center text-white"
//                         onMouseEnter={() => setHoveredButton('dashboard')}
//                         onMouseLeave={() => setHoveredButton(null)}
//                     >
//                         <ArrowRight 
//                             size={24} 
//                             className={`mb-2 transition-transform duration-300 ${hoveredButton === 'dashboard' ? 'translate-x-1' : ''}`} 
//                         />
//                         <span className="text-sm font-medium mt-1">Add more of existing Product</span>
//                     </button>
//                 </Link>
//             </div>
//         </div>
//     );
// }
"use client";
import Link from "next/link";
import { Package, ListChecks, Search, Shield, TrendingUp, Layers } from "lucide-react";
import { useState } from "react";

export default function Homepage() {
    const [hoveredCard, setHoveredCard] = useState(null);
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                    <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
                    <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
                </div>
                
                <div className="relative px-6 py-12 max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16 pt-8">
                        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/30 rounded-full px-4 py-2 mb-6">
                            <Shield className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-blue-300 font-medium">Blockchain-Powered Transparency</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                            Supply Chain Tracking
                        </h1>
                        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                            Immutable tracking and verification for your entire product lifecycle
                        </p>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 max-w-4xl mx-auto">
                        {[
                            { icon: Shield, label: "Secure", value: "100%" },
                            { icon: Layers, label: "Blockchain Verified", value: "Real-time" },
                            { icon: TrendingUp, label: "Transparency", value: "Total" }
                        ].map((stat, index) => (
                            <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 text-center">
                                <stat.icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-sm text-slate-400">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Main Action Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
                        {/* Add New Product Card */}
                        <Link href="/create-new-product" className="block flex-1">
                        <div
                            className="group relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 shadow-2xl transition-all duration-300 cursor-pointer hover:shadow-blue-500/50 hover:scale-[1.02]"
                            onMouseEnter={() => setHoveredCard('new')}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <div className="absolute inset-0 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative">
                                <div className="bg-white/10 backdrop-blur-sm w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <Package className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Add New Product</h3>
                                <p className="text-blue-100 mb-6">
                                    Register a new product on the blockchain and start tracking its journey
                                </p>
                                <div className="flex items-center text-white font-medium group-hover:gap-2 gap-1 transition-all duration-300">
                                    <span>Get Started</span>
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        </Link>
                        {/* Add Existing Product Card */}
                        <Link href="/productlist" className="block flex-1">
                        <div
                            className="group relative bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-8 shadow-2xl transition-all duration-300 cursor-pointer hover:shadow-emerald-500/50 hover:scale-[1.02]"
                            onMouseEnter={() => setHoveredCard('existing')}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <div className="absolute inset-0 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative">
                                <div className="bg-white/10 backdrop-blur-sm w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <ListChecks className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Update Existing Product</h3>
                                <p className="text-emerald-100 mb-6">
                                    Add inventory or update status for products already in the supply chain
                                </p>
                                <div className="flex items-center text-white font-medium group-hover:gap-2 gap-1 transition-all duration-300">
                                    <span>View Products</span>
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        </Link>
                    </div>

                    {/* Track Product Section
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <Search className="w-6 h-6 text-blue-400" />
                                <h3 className="text-xl font-bold text-white">Track Your Product</h3>
                            </div>
                            <p className="text-slate-300 mb-6">
                                Enter a product ID or scan QR code to view its complete journey on the blockchain
                            </p>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    placeholder="Enter Product ID or Transaction Hash..."
                                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                />
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 flex items-center gap-2">
                                    <Search className="w-5 h-5" />
                                    <span>Track</span>
                                </button>
                            </div>
                        </div>
                    </div> */}

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-12">
                        {[
                            {
                                icon: Shield,
                                title: "Immutable Records",
                                description: "Every transaction is permanently recorded on the blockchain"
                            },
                            {
                                icon: Layers,
                                title: "Full Traceability",
                                description: "Track products from origin to destination with complete transparency"
                            },
                            {
                                icon: TrendingUp,
                                title: "Real-time Updates",
                                description: "Instant verification and status updates across the supply chain"
                            }
                        ].map((feature, index) => (
                            <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
                                <feature.icon className="w-8 h-8 text-blue-400 mb-3" />
                                <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                                <p className="text-slate-400 text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}