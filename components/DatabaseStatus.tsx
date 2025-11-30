import React, { useEffect, useState } from 'react';
import { checkDatabaseHealth, DBHealthStatus } from '../utils/dbHealthCheck';
import { AlertCircle, CheckCircle2, XCircle, Info } from 'lucide-react';

const DatabaseStatus: React.FC = () => {
  const [status, setStatus] = useState<DBHealthStatus | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      setIsChecking(true);
      const healthStatus = await checkDatabaseHealth();
      setStatus(healthStatus);
      setIsChecking(false);
    };

    checkStatus();
  }, []);

  if (isChecking || !status) {
    return (
      <div className="flex items-center space-x-2 text-xs text-[#737373]">
        <div className="w-2 h-2 bg-[#E6E9EF] rounded-full animate-pulse" />
        <span>Checking database...</span>
      </div>
    );
  }

  if (status.isConfigured && status.isConnected && status.hasTables) {
    return (
      <div className="flex items-center space-x-2 text-xs text-green-600 dark:text-green-400">
        <CheckCircle2 className="w-3 h-3" />
        <span>Database connected</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 text-xs text-yellow-600 dark:text-yellow-400">
      <AlertCircle className="w-3 h-3" />
      <span>Using localStorage</span>
      {status.error && (
        <div className="group relative">
          <Info className="w-3 h-3 cursor-help" />
          <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-white dark:bg-[#1e293b] border border-[#E6E9EF] dark:border-[#334155] rounded-lg shadow-lg text-xs text-[#2E2E2E] dark:text-[#e2e8f0] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
            {status.error}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabaseStatus;

