import React, { useEffect, useState } from 'react';
import { X, Shield, Lock, Smartphone, RefreshCw } from 'lucide-react';
import { getSecurityLogs, SecurityAuditRecord } from '../../utils/security';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityAuditModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<SecurityAuditRecord[]>([]);

  const refreshLogs = () => {
    setLogs(getSecurityLogs());
  };

  useEffect(() => {
    if (isOpen) {
      refreshLogs();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#F4F7F2]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Security & Access Telemetry</h3>
              <p className="text-xs text-slate-500">Live Login Defense & Audit Records</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={refreshLogs}
              title="Refresh Logs"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Security Policy Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800 mb-1">
                <Lock className="w-3.5 h-3.5 text-emerald-700" />
                Brute-Force Guard
              </div>
              <p className="text-slate-500 text-[11px]">
                5 failed attempts trigger a 30s hardware lockout to prevent dictionary assaults.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800 mb-1">
                <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
                Role-Gated RBAC
              </div>
              <p className="text-slate-500 text-[11px]">
                Strict segregation between Fruit Logistics, Farmer Harvests, and Agri Suppliers.
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Recent Login & Security Events
            </h4>

            {logs.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No recent security incidents recorded. System running normally.
              </div>
            ) : (
              <div className="space-y-2">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900">{log.email}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 capitalize font-mono">
                          {log.role}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {log.timestamp} · {log.deviceInfo}
                      </div>
                    </div>

                    <div>
                      {log.status === 'SUCCESS' && (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Authorized
                        </span>
                      )}
                      {log.status === 'FAILED_PASSWORD' && (
                        <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          Bad Password
                        </span>
                      )}
                      {log.status === 'ACCOUNT_LOCKED' && (
                        <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Lockout Triggered
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
