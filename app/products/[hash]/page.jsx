'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Shield, CheckCircle, XCircle, AlertTriangle, Package, Calendar, MapPin, Tag, Weight, Factory, Hash, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductPage() {
  const params = useParams();
  const hash = params?.hash;
  const [isValid, setIsValid] = useState(null);
  const [ipfsData, setIpfsData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const verifyAndFetch = async () => {
      try {
        setLoading(true);
        const ipfsResponse = await fetch(`/api/ipfs/find/${hash}`);
          const result = await ipfsResponse.json()
          console.log("The result on verify product page is",result);
          const productData=result.data;
          console.log("The product data is",productData);
          //here you need to get the contract id and pass it to the verifyCID api
        const res = await fetch('/api/contract/verifyCID', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ipfsHash: hash, contractId: productData.contractId }),
        });

        if (!res.ok) throw new Error('Verification failed');
        const { success } = await res.json();
        setIsValid(success);

        if (success) {
          // const ipfsResponse = await fetch(`/api/ipfs/find/${hash}`);
          // const result = await ipfsResponse.json()
          // if (!result.success) throw new Error('Failed to fetch data from IPFS');
          setIpfsData(productData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (hash) verifyAndFetch();
  }, [hash]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  // Helper function for displaying product details
  const renderDetail = (icon, label, value) => {
    if (!value) return null;
    
    return (
      <motion.div 
        className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
        variants={itemVariants}
      >
        <div className="text-indigo-600 mt-1">{icon}</div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="font-medium">{value}</p>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div 
      className="p-6 max-w-7xl mx-auto bg-white rounded-xl shadow-lg my-8 border border-black "
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div 
        className="flex items-center mb-6"
        variants={itemVariants}
      >
        <Shield className="text-indigo-600 mr-3" size={28} />
        <h1 className="text-2xl font-bold text-gray-800">Product Verification</h1>
      </motion.div>

      {/* Hash Display */}
      <motion.div 
        className="p-4 bg-gray-50 rounded-lg mb-6 flex items-center gap-2"
        variants={itemVariants}
      >
        <Hash size={16} className="text-gray-600" />
        <div className="flex-1">
          <p className="text-xs text-gray-500 mb-1">Product Identifier</p>
          <p className="font-mono text-black text-sm break-all">{hash}</p>
        </div>
      </motion.div>

      {/* Verification Status */}
      {loading ? (
        <motion.div 
          className="flex justify-center my-8"
          variants={itemVariants}
        >
          <div className="animate-pulse flex items-center">
            <div className="h-8 w-8 bg-indigo-200 rounded-full mr-3"></div>
            <div className="h-4 w-32 bg-indigo-100 rounded"></div>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          className={`p-4 rounded-lg mb-6 flex items-center ${
            isValid ? 'bg-green-50' : isValid === false ? 'bg-red-50' : 'bg-gray-50'
          }`}
          variants={itemVariants}
        >
          {isValid === true && (
            <>
              <CheckCircle className="text-green-600 mr-3" size={24} />
              <div>
                <p className="font-semibold text-green-800">Blockchain Verified</p>
                <p className="text-sm text-green-600">This product is authentic and data is verified</p>
              </div>
            </>
          )}
          {isValid === false && (
            <>
              <XCircle className="text-red-600 mr-3" size={24} />
              <div>
                <p className="font-semibold text-red-800">Verification Failed</p>
                <p className="text-sm text-red-600">This product could not be verified on the blockchain</p>
              </div>
            </>
          )}
          {error && (
            <>
              <AlertTriangle className="text-amber-600 mr-3" size={24} />
              <div>
                <p className="font-semibold text-amber-800">Error Occurred</p>
                <p className="text-sm text-amber-600">{error}</p>
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* Product Details */}
      {ipfsData && (
        <motion.div
          className="mt-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 
            className="text-xl font-semibold mb-4 text-black flex items-center"
            variants={itemVariants}
          >
            <Package className="mr-2 text-indigo-600" size={20} />
            Product Details
          </motion.h2>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black"
            variants={containerVariants}
          >
            {renderDetail(<Package size={18} />, "Product Name", ipfsData.product_name)}
            {renderDetail(<Tag size={18} />, "Serial Number", ipfsData.serial_number)}
            {renderDetail(<Hash size={18} />, "Batch Number", ipfsData.batch_number)}
            {renderDetail(<MapPin size={18} />, "Location", ipfsData.location)}
            {renderDetail(<Calendar size={18} />, "Date", ipfsData.date)}
            {renderDetail(<Tag size={18} />, "Price", ipfsData.productPrice ? `$${ipfsData.productPrice}` : null)}
            {renderDetail(<Factory size={18} />, "Manufacturer", ipfsData.man_name)}
            {renderDetail(<Clock size={18} />, "Timestamp", new Date(ipfsData.timestamp).toLocaleString())}
          </motion.div>
          
          <motion.div 
            className="mt-8 text-center text-sm text-black"
            variants={itemVariants}
          >
            <p>Secured by blockchain technology</p>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}