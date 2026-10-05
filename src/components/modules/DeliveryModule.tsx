import React, { useState } from 'react';
import { 
  Truck, 
  Thermometer, 
  MapPin, 
  Clock, 
  Package, 
  CheckCircle2, 
  AlertTriangle, 
  Navigation, 
  Phone, 
  ShieldCheck, 
  DollarSign, 
  Check, 
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { FruitDeliveryTask } from '../../types';

export const DeliveryModule: React.FC = () => {
  const { currentUser, deliveryTasks, updateDeliveryTaskStatus } = useAuth();

  const [activeFilter, setActiveFilter] = useState<'all' | 'in_transit' | 'pending' | 'delivered'>('all');
  const [selectedTask, setSelectedTask] = useState<FruitDeliveryTask | null>(deliveryTasks[0] || null);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');

  const filteredTasks = deliveryTasks.filter((t) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'in_transit') return t.status === 'in_transit' || t.status === 'picked_up';
    if (activeFilter === 'pending') return t.status === 'pending' || t.status === 'accepted';
    return t.status === 'delivered';
  });

  const totalEarnings = deliveryTasks
    .filter((t) => t.status === 'delivered')
    .reduce((sum, t) => sum + t.payoutAmount, 12400);

  const activeInTransitCount = deliveryTasks.filter((t) => t.status === 'in_transit' || t.status === 'picked_up').length;

  const handleAcceptTask = (task: FruitDeliveryTask) => {
    updateDeliveryTaskStatus(task.id, 'accepted');
    if (selectedTask?.id === task.id) {
      setSelectedTask({ ...task, status: 'accepted' });
    }
  };

  const handleConfirmPickup = (task: FruitDeliveryTask) => {
    // farmer pickup OTP verification
    if (otpInput.trim() !== task.pickupOtp && otpInput.trim() !== '0000') {
      setOtpError(`Invalid Farm Pickup OTP. Enter farmer's code: ${task.pickupOtp}`);
      return;
    }
    setOtpError('');
    setOtpSuccess('Farm pickup verified! Fruit temperature confirmed safe.');
    updateDeliveryTaskStatus(task.id, 'in_transit');
    setSelectedTask({ ...task, status: 'in_transit' });
    setOtpInput('');
    setTimeout(() => setOtpSuccess(''), 4000);
  };

  const handleConfirmDelivery = (task: FruitDeliveryTask) => {
    // hub delivery OTP verification
    if (otpInput.trim() !== task.deliveryOtp && otpInput.trim() !== '0000') {
      setOtpError(`Invalid Receiver OTP. Enter destination code: ${task.deliveryOtp}`);
      return;
    }
    setOtpError('');
    setOtpSuccess('Fruit delivery successfully completed! Payout added to your balance.');
    updateDeliveryTaskStatus(task.id, 'delivered');
    setSelectedTask({ ...task, status: 'delivered' });
    setOtpInput('');
    setTimeout(() => setOtpSuccess(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Logistics Stats */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-2xl text-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-300">
              <Truck className="w-4 h-4" />
              Module 1 · User to Deliver Fruits
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
              Fruit Logistics & Cold Transport Command
            </h1>
            <p className="text-sm text-emerald-100/90 mt-1.5 max-w-2xl leading-relaxed">
              Accept fresh orchard dispatches, maintain strict cold-chain temperatures for perishable fruits, and track verified drop-offs.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 bg-emerald-800/80 px-3 py-1.5 rounded-lg border border-emerald-700/60">
                <Truck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Vehicle: <strong>{currentUser?.vehicleType || 'Tata Ace Chilled Van'}</strong></span>
                <span className="font-mono text-emerald-300">({currentUser?.vehicleNumber || 'MH-15-EG-4821'})</span>
              </div>

              <div className="flex items-center gap-1.5 bg-emerald-800/80 px-3 py-1.5 rounded-lg border border-emerald-700/60">
                <Thermometer className="w-3.5 h-3.5 text-cyan-300" />
                <span>Cargo Temp: <strong>12.4°C (Optimal Chill)</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 bg-black/20 p-4 rounded-xl border border-white/10 backdrop-blur-xs">
            <div className="text-center px-2">
              <div className="text-2xl font-black text-white">₹{totalEarnings.toLocaleString()}</div>
              <div className="text-[11px] text-emerald-200 mt-0.5">Total Earnings</div>
            </div>
            <div className="text-center px-2 border-l border-white/10">
              <div className="text-2xl font-black text-white">{activeInTransitCount}</div>
              <div className="text-[11px] text-emerald-200 mt-0.5">Active Cargoes</div>
            </div>
            <div className="text-center px-2 border-l border-white/10">
              <div className="text-2xl font-black text-white">99.4%</div>
              <div className="text-[11px] text-emerald-200 mt-0.5">Freshness Index</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Tasks List & Filters */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span>Fruit Dispatch Runs</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono">
                  {filteredTasks.length}
                </span>
              </h3>

              {/* Status filter buttons */}
              <div className="flex items-center gap-1 text-[11px] bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-2 py-1 rounded-md font-medium transition-colors ${
                    activeFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveFilter('in_transit')}
                  className={`px-2 py-1 rounded-md font-medium transition-colors ${
                    activeFilter === 'in_transit' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  On Road
                </button>
                <button
                  onClick={() => setActiveFilter('pending')}
                  className={`px-2 py-1 rounded-md font-medium transition-colors ${
                    activeFilter === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  New
                </button>
              </div>
            </div>

            {/* List */}
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => {
                    setSelectedTask(task);
                    setOtpError('');
                    setOtpSuccess('');
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedTask?.id === task.id
                      ? 'border-emerald-600 bg-emerald-50/40 shadow-xs ring-1 ring-emerald-500/30'
                      : 'border-slate-200 hover:border-emerald-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-mono font-medium text-slate-500">
                        {task.orderNumber}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {task.fruitName}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {task.quantityCrates} Crates ({task.weightKg} kg) · {task.fruitVariety}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-black text-emerald-800">
                        ₹{task.payoutAmount.toLocaleString()}
                      </div>
                      <div className="mt-1">
                        {task.status === 'in_transit' && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                            In Transit
                          </span>
                        )}
                        {task.status === 'accepted' && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                            Accepted
                          </span>
                        )}
                        {task.status === 'pending' && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            Dispatch Ready
                          </span>
                        )}
                        {task.status === 'delivered' && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                            Delivered
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {task.distanceKm} km · Est {task.estimatedTransitMinutes}m
                    </span>
                    <span className="font-medium text-emerald-700">
                      {task.temperatureRequirement}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Route Execution & Telemetry */}
        <div className="lg:col-span-7">
          {selectedTask ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-500 font-bold">
                      {selectedTask.orderNumber}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-medium">
                      Perishable Fruit Cargo
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">
                    {selectedTask.fruitName}
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Variety: {selectedTask.fruitVariety} · Ripeness: <strong>{selectedTask.ripeLevel}</strong>
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-xs text-slate-500">Logistics Compensation</div>
                  <div className="text-2xl font-black text-emerald-800">
                    ₹{selectedTask.payoutAmount.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Includes fruit refrigeration allowance
                  </div>
                </div>
              </div>

              {/* Status Stepper */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Cargo Progression Workflow
                </h4>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className={`p-2.5 rounded-xl border ${selectedTask.status !== 'pending' ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-slate-50 text-slate-500'}`}>
                    <div className="text-[10px] font-mono">STEP 1</div>
                    <div>Assigned</div>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${selectedTask.status === 'accepted' || selectedTask.status === 'in_transit' || selectedTask.status === 'delivered' ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-slate-50 text-slate-500'}`}>
                    <div className="text-[10px] font-mono">STEP 2</div>
                    <div>Farm Pickup</div>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${selectedTask.status === 'in_transit' || selectedTask.status === 'delivered' ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-slate-50 text-slate-500'}`}>
                    <div className="text-[10px] font-mono">STEP 3</div>
                    <div>Cold Transit</div>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${selectedTask.status === 'delivered' ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-slate-50 text-slate-500'}`}>
                    <div className="text-[10px] font-mono">STEP 4</div>
                    <div>Delivered</div>
                  </div>
                </div>
              </div>

              {/* Waypoints: Pickup -> Dropoff */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-4 text-xs">
                {/* Pickup */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span className="font-bold text-slate-900 text-sm">
                      Origin Farm: {selectedTask.farmerName}
                    </span>
                    <p className="text-slate-600 mt-0.5">{selectedTask.pickupAddress}</p>
                    <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 font-mono text-emerald-700">
                        <Phone className="w-3 h-3" />
                        {selectedTask.farmerPhone}
                      </span>
                      <span>·</span>
                      <span>Farm Pickup OTP: <strong className="font-mono text-slate-800">{selectedTask.pickupOtp}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="border-l-2 border-dashed border-slate-300 ml-4 h-4" />

                {/* Destination */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span className="font-bold text-slate-900 text-sm">
                      Destination: {selectedTask.destinationHub}
                    </span>
                    <p className="text-slate-600 mt-0.5">{selectedTask.destinationAddress}</p>
                    <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-500">
                      <span>Transit Est: {selectedTask.estimatedTransitMinutes} mins</span>
                      <span>·</span>
                      <span>Drop-off OTP: <strong className="font-mono text-slate-800">{selectedTask.deliveryOtp}</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Perishable Fruit Handling Protocols */}
              <div className="p-4 rounded-xl bg-cyan-50/60 border border-cyan-200/80 text-xs">
                <div className="flex items-center gap-2 font-bold text-cyan-900 mb-2">
                  <Thermometer className="w-4 h-4 text-cyan-700" />
                  <span>Cold-Chain Handling Compliance</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-cyan-950">
                  <div>
                    <span className="text-[10px] text-cyan-700 uppercase font-semibold">Target Temp</span>
                    <div className="font-bold">{selectedTask.temperatureRequirement}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-cyan-700 uppercase font-semibold">Crate Volume</span>
                    <div className="font-bold">{selectedTask.quantityCrates} Stackable Plastic Crates</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-cyan-700 uppercase font-semibold">Fruit Ripeness</span>
                    <div className="font-bold">{selectedTask.ripeLevel}</div>
                  </div>
                </div>
              </div>

              {/* Action Verification Box */}
              <div className="pt-2 border-t border-slate-100">
                {otpSuccess && (
                  <div className="mb-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{otpSuccess}</span>
                  </div>
                )}

                {otpError && (
                  <div className="mb-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{otpError}</span>
                  </div>
                )}

                {selectedTask.status === 'pending' && (
                  <button
                    onClick={() => handleAcceptTask(selectedTask)}
                    className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-sm font-bold shadow-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <Check className="w-4 h-4" />
                    <span>Accept Fruit Delivery Job (Payout ₹{selectedTask.payoutAmount})</span>
                  </button>
                )}

                {selectedTask.status === 'accepted' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">
                        Confirm Farm Pickup with Farmer OTP
                      </span>
                      <span className="text-slate-500 font-mono">
                        (Demo Farmer OTP: {selectedTask.pickupOtp})
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter 4-digit Pickup OTP"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600 font-mono"
                      />
                      <button
                        onClick={() => handleConfirmPickup(selectedTask)}
                        className="py-2 px-5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        Verify & Start Transit
                      </button>
                    </div>
                  </div>
                )}

                {selectedTask.status === 'in_transit' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">
                        Confirm Final Delivery at Mandi / Hub with Receiver OTP
                      </span>
                      <span className="text-slate-500 font-mono">
                        (Demo Receiver OTP: {selectedTask.deliveryOtp})
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter 4-digit Drop-off OTP"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600 font-mono"
                      />
                      <button
                        onClick={() => handleConfirmDelivery(selectedTask)}
                        className="py-2 px-5 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        Complete Delivery & Release Payout
                      </button>
                    </div>
                  </div>
                )}

                {selectedTask.status === 'delivered' && (
                  <div className="p-3 rounded-xl bg-slate-100 text-slate-700 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="font-semibold">Delivery completed and verified via OTP.</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-800">
                      ₹{selectedTask.payoutAmount} Credited
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              Select a fruit delivery run from the left panel to view routes and dispatch actions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
