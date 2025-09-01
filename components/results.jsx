import React, { useState, useEffect } from 'react';
import { ExternalLink, Copy, Printer, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const PollingResponseComponent = ({ 
    initialResponse, 
    taskId, 
    onPoll, 
    formData 
}) => {
    const [taskStatus, setTaskStatus] = useState('accepted');
    const [pollingData, setPollingData] = useState(null);
    const [isPolling, setIsPolling] = useState(false);

    useEffect(() => {
        if (initialResponse?.status === 'accepted' && taskId && onPoll) {
            setIsPolling(true);
            setTaskStatus('processing');
            
            const pollInterval = setInterval(async () => {
                try {
                    const result = await onPoll(taskId);
                    
                    if (result.status === 'completed') {
                        setPollingData(result.data);
                        setTaskStatus('completed');
                        setIsPolling(false);
                        clearInterval(pollInterval);
                    } else if (result.status === 'failed') {
                        setTaskStatus('failed');
                        setIsPolling(false);
                        clearInterval(pollInterval);
                    }
                } catch (error) {
                    console.error('Polling error:', error);
                    setTaskStatus('failed');
                    setIsPolling(false);
                    clearInterval(pollInterval);
                }
            }, 2000);

            return () => clearInterval(pollInterval);
        }
    }, [initialResponse, taskId, onPoll]);

    const getStatusIcon = () => {
        switch (taskStatus) {
            case 'accepted':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'processing':
                return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
            case 'completed':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'failed':
                return <XCircle className="h-5 w-5 text-red-500" />;
            default:
                return <Clock className="h-5 w-5 text-gray-500" />;
        }
    };

    const getStatusMessage = () => {
        switch (taskStatus) {
            case 'accepted':
                return 'Task accepted and queued for processing';
            case 'processing':
                return 'Processing your request...';
            case 'completed':
                return 'Task completed successfully';
            case 'failed':
                return 'Task failed to complete';
            default:
                return 'Unknown status';
        }
    };

    const getStatusColor = () => {
        switch (taskStatus) {
            case 'accepted':
                return 'border-green-500 bg-green-50';
            case 'processing':
                return 'border-blue-500 bg-blue-50';
            case 'completed':
                return 'border-green-500 bg-green-50';
            case 'failed':
                return 'border-red-500 bg-red-50';
            default:
                return 'border-gray-500 bg-gray-50';
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-indigo-500">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT</p>
                <p className="font-medium text-gray-900 text-lg">{formData.productName}</p>
            </div>

            <div className={`rounded-lg p-4 border-l-4 ${getStatusColor()}`}>
                <div className="flex items-center space-x-2">
                    {getStatusIcon()}
                    <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</p>
                        <p className="font-medium text-gray-900">{getStatusMessage()}</p>
                    </div>
                </div>
                    
                {taskId && (
                    <div className="mt-2">
                        <p className="text-xs text-gray-600">Task ID: {taskId}</p>
                    </div>
                )}
            </div>

            {taskStatus === 'completed' && pollingData && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-indigo-500">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">ITEMS PROCESSED</p>
                            <p className="font-medium text-gray-900 text-lg">{pollingData.itemCount || 0}</p>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-indigo-500">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">PROCESSING TIME</p>
                            <p className="font-medium text-gray-900 text-lg">{pollingData.processingTime || 'N/A'}</p>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-indigo-500">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">SUCCESS RATE</p>
                            <p className="font-medium text-gray-900 text-lg">{pollingData.successRate || 'N/A'}</p>
                        </div>
                    </div>

                    {pollingData.url && (
                        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-indigo-500">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">TRACKING URL</p>
                            <a 
                                href={pollingData.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-indigo-600 hover:text-indigo-500 font-medium text-sm break-all flex items-center"
                            >
                                {pollingData.url}
                                <ExternalLink className="h-3 w-3 ml-1 inline" />
                            </a>
                        </div>
                    )}

                    {pollingData.hash && (
                        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-indigo-500">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">VERIFICATION HASH</p>
                            <div className="flex items-center">
                                <p className="font-mono text-xs text-gray-800 break-all">{pollingData.hash}</p>
                                <button 
                                    onClick={() => navigator.clipboard.writeText(pollingData.hash)}
                                    className="ml-2 text-gray-400 hover:text-indigo-600"
                                    title="Copy hash"
                                >
                                    <Copy className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {pollingData.ipfsHash && (
                        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-indigo-500">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">IPFS HASH</p>
                            <div className="flex items-center">
                                <p className="font-mono text-xs text-gray-800 break-all">{pollingData.ipfsHash}</p>
                                <button 
                                    onClick={() => navigator.clipboard.writeText(pollingData.ipfsHash)}
                                    className="ml-2 text-gray-400 hover:text-indigo-600"
                                    title="Copy IPFS hash"
                                >
                                    <Copy className="h-4 w-4" />
                                </button>
                            </div>
                            <a 
                                href={`https://ipfs.io/ipfs/${pollingData.ipfsHash}`}
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-indigo-600 hover:text-indigo-500 font-medium text-xs mt-2 inline-flex items-center"
                            >
                                View on IPFS
                                <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                        </div>
                    )}

                    {pollingData.transactionHash && (
                        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-indigo-500">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">CHAIN TRANSACTION HASH</p>
                            <div className="flex items-center">
                                <p className="font-mono text-xs text-gray-800 break-all">{pollingData.transactionHash}</p>
                                <button 
                                    onClick={() => navigator.clipboard.writeText(pollingData.transactionHash)}
                                    className="ml-2 text-gray-400 hover:text-indigo-600"
                                    title="Copy transaction hash"
                                >
                                    <Copy className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between items-center border-t border-gray-200 pt-5 mt-6">
                        <button 
                            onClick={() => window.print()} 
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
                        >
                            <Printer className="h-4 w-4 mr-2 text-gray-500" />
                            Print Details
                        </button>
                        
                        <button 
                            onClick={() => navigator.clipboard.writeText(JSON.stringify({
                                product: formData.productName,
                                taskId: taskId,
                                status: taskStatus,
                                metrics: {
                                itemCount: pollingData.itemCount,
                                processingTime: pollingData.processingTime,
                                successRate: pollingData.successRate
                                },
                                hashes: {
                                verification: pollingData.hash,
                                ipfs: pollingData.ipfsHash,
                                transaction: pollingData.transactionHash
                                }
                            }, null, 2))}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
                        >
                            <Copy className="h-4 w-4 mr-2 text-gray-500" />
                            Copy Data
                        </button>
                    </div>
                </>
            )}

            {taskStatus === 'failed' && (
                <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                    <p className="text-sm text-red-700">
                        The task failed to complete. Please try again or contact support if the issue persists.
                    </p>
                </div>
            )}
        </div>
    );
};