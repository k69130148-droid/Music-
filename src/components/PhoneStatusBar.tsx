import React, { useState, useEffect } from 'react';
import { SimCard } from '../types/phone';
import { Wifi, Battery } from 'lucide-react';

interface PhoneStatusBarProps {
  simCards: SimCard[];
  activeSimSlot?: 'sim1' | 'sim2';
}

export const PhoneStatusBar: React.FC<PhoneStatusBarProps> = ({ simCards }) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('ar-SA', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const sim1 = simCards.find(s => s.id === 'sim1');
  const sim2 = simCards.find(s => s.id === 'sim2');

  return (
    <div className="w-full px-5 py-2 flex items-center justify-between text-xs select-none font-medium z-30 transition-colors">
      {/* Time */}
      <div className="font-semibold text-sm tabular-nums tracking-wide">
        {timeStr || '12:00'}
      </div>

      {/* Dual SIM & Network Status Indicator */}
      <div className="flex items-center gap-3.5">
        {/* SIM 1 & SIM 2 mini signal indicators */}
        <div className="flex items-center gap-2">
          {sim1 && (
            <div className="flex items-center gap-1" title={`${sim1.carrierName} (${sim1.networkType})`}>
              <span className="text-[10px] font-bold px-1 py-0.5 rounded bg-emerald-500/20 text-emerald-400">1</span>
              <div className="flex items-end gap-0.5 h-3">
                {[1, 2, 3, 4, 5].map((bar) => (
                  <span
                    key={bar}
                    className={`w-[2.5px] rounded-xs ${
                      bar <= sim1.signalBars ? 'bg-emerald-400' : 'bg-slate-500/30'
                    }`}
                    style={{ height: `${bar * 20}%` }}
                  />
                ))}
              </div>
              <span className="text-[10px] font-mono opacity-80">{sim1.networkType}</span>
            </div>
          )}

          {sim2 && (
            <div className="flex items-center gap-1" title={`${sim2.carrierName} (${sim2.networkType})`}>
              <span className="text-[10px] font-bold px-1 py-0.5 rounded bg-rose-500/20 text-rose-400">2</span>
              <div className="flex items-end gap-0.5 h-3">
                {[1, 2, 3, 4, 5].map((bar) => (
                  <span
                    key={bar}
                    className={`w-[2.5px] rounded-xs ${
                      bar <= sim2.signalBars ? 'bg-rose-400' : 'bg-slate-500/30'
                    }`}
                    style={{ height: `${bar * 20}%` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* WiFi & Battery */}
        <div className="flex items-center gap-1.5 opacity-90">
          <Wifi className="w-3.5 h-3.5 text-current" />
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-mono tabular-nums">98%</span>
            <Battery className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
