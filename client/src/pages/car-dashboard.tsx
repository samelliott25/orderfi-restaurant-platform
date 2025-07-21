import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Car, Gauge, Timer, DollarSign, Users } from 'lucide-react';
import { StandardLayout } from '@/components/StandardLayout';

interface DashboardMetrics {
  dailySales: { current: number; target: number };
  cogs: number;
  laborCost: number;
  customerSatisfaction: number;
  tableTurnover: number;
}

const CarDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    dailySales: { current: 8500, target: 12000 },
    cogs: 32,
    laborCost: 28,
    customerSatisfaction: 4.2,
    tableTurnover: 2.8
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        dailySales: {
          current: Math.max(0, prev.dailySales.current + Math.random() * 200 - 100),
          target: prev.dailySales.target
        },
        cogs: Math.max(20, Math.min(45, prev.cogs + Math.random() * 2 - 1)),
        laborCost: Math.max(15, Math.min(40, prev.laborCost + Math.random() * 1 - 0.5)),
        customerSatisfaction: Math.max(1, Math.min(5, prev.customerSatisfaction + Math.random() * 0.2 - 0.1)),
        tableTurnover: Math.max(0, Math.min(5, prev.tableTurnover + Math.random() * 0.2 - 0.1))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const salesPercentage = (metrics.dailySales.current / metrics.dailySales.target) * 100;

  return (
    <StandardLayout>
      <div className="car-dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <Link href="/dashboard-phase2" className="back-button">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="dashboard-title">
            <Car className="h-6 w-6" />
            Restaurant Command Center
          </h1>
        </div>

        {/* Main Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Daily Sales Speedometer */}
          <div className="gauge-container large-gauge">
            <div className="gauge-title">Daily Sales Target</div>
            <div className="speedometer-gauge">
              <div className="gauge-face">
                <div className="speed-markings">
                  {[0, 20, 40, 60, 80, 100].map(mark => (
                    <div 
                      key={mark} 
                      className="speed-mark" 
                      style={{ transform: `rotate(${-90 + (mark * 1.8)}deg)` }}
                    >
                      <span className="mark-number">{mark}</span>
                    </div>
                  ))}
                </div>
                <div 
                  className={`speedometer-needle ${salesPercentage > 85 ? 'danger' : salesPercentage > 70 ? 'warning' : 'normal'}`}
                  style={{ transform: `rotate(${-90 + (salesPercentage * 1.8)}deg)` }}
                />
                <div className="needle-center" />
                <div className="gauge-display">
                  <div className="primary-value">${metrics.dailySales.current.toLocaleString()}</div>
                  <div className="secondary-value">{salesPercentage.toFixed(1)}% of target</div>
                </div>
              </div>
            </div>
          </div>

          {/* COGS Tachometer */}
          <div className="gauge-container medium-gauge">
            <div className="gauge-title">Cost of Goods Sold</div>
            <div className="tachometer-gauge">
              <div className="tach-face">
                <div className="tach-zones">
                  <div className="zone-green" />
                  <div className="zone-yellow" />
                  <div className="zone-red" />
                </div>
                <div 
                  className={`tach-needle ${metrics.cogs > 35 ? 'danger' : metrics.cogs > 32 ? 'warning' : 'normal'}`}
                  style={{ transform: `rotate(${-120 + ((metrics.cogs / 50) * 240)}deg)` }}
                />
                <div className="tach-center" />
                <div className="tach-display">
                  <div className="tach-value">{metrics.cogs.toFixed(1)}%</div>
                  <div className="tach-label">COGS</div>
                </div>
              </div>
            </div>
          </div>

          {/* Labor Cost Fuel Gauge */}
          <div className="gauge-container medium-gauge">
            <div className="gauge-title">Labor Cost %</div>
            <div className="fuel-gauge">
              <div className="fuel-tank">
                <div 
                  className="fuel-level"
                  style={{ height: `${Math.min(100, (metrics.laborCost / 40) * 100)}%` }}
                />
                <div className="fuel-markings">
                  <div className="fuel-mark full">F</div>
                  <div className="fuel-mark half">½</div>
                  <div className="fuel-mark empty">E</div>
                </div>
              </div>
              <div className="fuel-display">
                <div className="fuel-value">{metrics.laborCost.toFixed(1)}%</div>
                <div className="fuel-status">
                  {metrics.laborCost <= 30 ? 'OPTIMAL' : metrics.laborCost <= 35 ? 'CAUTION' : 'CRITICAL'}
                </div>
              </div>
            </div>
          </div>

          {/* Customer Satisfaction Warning Lights */}
          <div className="gauge-container warning-lights">
            <div className="gauge-title">Customer Satisfaction</div>
            <div className="warning-panel">
              {[1, 2, 3, 4, 5].map(star => (
                <div 
                  key={star}
                  className={`warning-light ${star <= Math.floor(metrics.customerSatisfaction) ? 'active' : ''} ${
                    star <= Math.floor(metrics.customerSatisfaction) && metrics.customerSatisfaction >= 4 ? 'green' : 
                    star <= Math.floor(metrics.customerSatisfaction) && metrics.customerSatisfaction >= 3 ? 'yellow' : 'red'
                  }`}
                >
                  ★
                </div>
              ))}
              <div className="satisfaction-display">
                <div className="satisfaction-value">{metrics.customerSatisfaction.toFixed(1)}</div>
                <div className="satisfaction-label">out of 5.0</div>
              </div>
            </div>
          </div>

          {/* Table Turnover Odometer */}
          <div className="gauge-container odometer-gauge">
            <div className="gauge-title">Table Turnover</div>
            <div className="odometer">
              <div className="odometer-display">
                <div className="odometer-digit">
                  {Math.floor(metrics.tableTurnover)}
                </div>
                <div className="odometer-decimal">.</div>
                <div className="odometer-digit">
                  {Math.floor((metrics.tableTurnover % 1) * 10)}
                </div>
              </div>
              <div className="odometer-label">turns/hour</div>
              <div className="odometer-trend">
                {metrics.tableTurnover >= 2.5 ? '↗ GOOD' : metrics.tableTurnover >= 2.0 ? '→ AVG' : '↘ LOW'}
              </div>
            </div>
          </div>

          {/* Additional KPIs */}
          <div className="gauge-container kpi-panel">
            <div className="gauge-title">Key Performance Indicators</div>
            <div className="kpi-grid">
              <div className="kpi-item">
                <DollarSign className="kpi-icon" />
                <div className="kpi-value">$47.50</div>
                <div className="kpi-label">Avg Check</div>
              </div>
              <div className="kpi-item">
                <Users className="kpi-icon" />
                <div className="kpi-value">127</div>
                <div className="kpi-label">Customers Today</div>
              </div>
              <div className="kpi-item">
                <Timer className="kpi-icon" />
                <div className="kpi-value">12.3m</div>
                <div className="kpi-label">Avg Wait</div>
              </div>
              <div className="kpi-item">
                <Gauge className="kpi-icon" />
                <div className="kpi-value">94%</div>
                <div className="kpi-label">Efficiency</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .car-dashboard-container {
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%);
          min-height: 100vh;
          padding: 1rem;
          font-family: 'Segoe UI', -apple-system, sans-serif;
          color: #ffffff;
          position: relative;
          overflow-x: auto;
        }

        .car-dashboard-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 30%, rgba(255, 100, 100, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(100, 255, 100, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(100, 100, 255, 0.05) 0%, transparent 70%);
          pointer-events: none;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 15px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #64b5f6;
          text-decoration: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .back-button:hover {
          background: rgba(100, 181, 246, 0.1);
          transform: translateX(-2px);
        }

        .dashboard-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.5rem;
          font-weight: 300;
          color: #ffffff;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .gauge-container {
          background: linear-gradient(145deg, rgba(30, 30, 30, 0.9), rgba(50, 50, 50, 0.7));
          border-radius: 20px;
          padding: 1.5rem;
          border: 2px solid rgba(100, 100, 100, 0.3);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.6),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
        }

        .gauge-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, transparent 40%, rgba(255, 255, 255, 0.03) 70%);
          pointer-events: none;
        }

        .large-gauge {
          grid-column: span 2;
        }

        .gauge-title {
          text-align: center;
          font-size: 1.1rem;
          font-weight: 300;
          color: #b0b0b0;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* Speedometer Styles */
        .speedometer-gauge {
          position: relative;
          width: 280px;
          height: 280px;
          margin: 0 auto;
        }

        .gauge-face {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: 
            conic-gradient(from 225deg, 
              #4caf50 0deg 126deg,
              #ffc107 126deg 153deg,
              #f44336 153deg 180deg,
              #333 180deg);
          position: relative;
          border: 8px solid #555;
          box-shadow: 
            0 0 30px rgba(0, 0, 0, 0.8),
            inset 0 0 30px rgba(0, 0, 0, 0.5);
        }

        .gauge-face::before {
          content: '';
          position: absolute;
          top: 20px;
          left: 20px;
          right: 20px;
          bottom: 20px;
          background: #1a1a1a;
          border-radius: 50%;
          border: 2px solid #333;
        }

        .speed-markings {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }

        .speed-mark {
          position: absolute;
          width: 2px;
          height: 20px;
          background: rgba(255, 255, 255, 0.8);
          top: 10px;
          left: 50%;
          transform-origin: 50% 130px;
          border-radius: 1px;
        }

        .mark-number {
          position: absolute;
          top: 25px;
          left: -10px;
          font-size: 12px;
          color: #fff;
          font-weight: 500;
        }

        .speedometer-needle {
          position: absolute;
          width: 4px;
          height: 120px;
          background: linear-gradient(to top, #666, #fff);
          top: 50%;
          left: 50%;
          transform-origin: 50% 100%;
          border-radius: 2px;
          transition: transform 1s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 10;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }

        .speedometer-needle.warning {
          background: linear-gradient(to top, #666, #ffc107);
          box-shadow: 0 0 15px rgba(255, 193, 7, 0.8);
        }

        .speedometer-needle.danger {
          background: linear-gradient(to top, #666, #f44336);
          box-shadow: 0 0 15px rgba(244, 67, 54, 0.8);
          animation: dangerPulse 2s infinite;
        }

        @keyframes dangerPulse {
          0%, 100% { box-shadow: 0 0 15px rgba(244, 67, 54, 0.8); }
          50% { box-shadow: 0 0 25px rgba(244, 67, 54, 1); }
        }

        .needle-center {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 16px;
          height: 16px;
          background: radial-gradient(circle, #fff, #999);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          z-index: 15;
          border: 2px solid #333;
        }

        .gauge-display {
          position: absolute;
          bottom: 60px;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          z-index: 5;
        }

        .primary-value {
          font-size: 1.8rem;
          font-weight: 600;
          color: #64b5f6;
          text-shadow: 0 0 10px rgba(100, 181, 246, 0.5);
        }

        .secondary-value {
          font-size: 0.9rem;
          color: #b0b0b0;
          margin-top: 4px;
        }

        /* Tachometer Styles */
        .tachometer-gauge {
          position: relative;
          width: 200px;
          height: 200px;
          margin: 0 auto;
        }

        .tach-face {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: #1a1a1a;
          position: relative;
          border: 6px solid #444;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.8), inset 0 0 20px rgba(0, 0, 0, 0.5);
        }

        .tach-zones {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: conic-gradient(from 240deg, 
            #4caf50 0deg 60deg,
            #ffc107 60deg 90deg,
            #f44336 90deg 120deg,
            transparent 120deg);
          opacity: 0.3;
        }

        .tach-needle {
          position: absolute;
          width: 3px;
          height: 80px;
          background: linear-gradient(to top, #666, #fff);
          top: 50%;
          left: 50%;
          transform-origin: 50% 100%;
          border-radius: 2px;
          transition: transform 1s ease-out;
          z-index: 10;
        }

        .tach-needle.warning {
          background: linear-gradient(to top, #666, #ffc107);
        }

        .tach-needle.danger {
          background: linear-gradient(to top, #666, #f44336);
          animation: dangerPulse 1.5s infinite;
        }

        .tach-center {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 12px;
          height: 12px;
          background: radial-gradient(circle, #fff, #999);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          z-index: 15;
        }

        .tach-display {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
        }

        .tach-value {
          font-size: 1.4rem;
          font-weight: 600;
          color: #ff9800;
        }

        .tach-label {
          font-size: 0.8rem;
          color: #888;
          margin-top: 2px;
        }

        /* Fuel Gauge Styles */
        .fuel-gauge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          height: 200px;
        }

        .fuel-tank {
          width: 40px;
          height: 150px;
          background: #222;
          border: 3px solid #555;
          border-radius: 20px;
          position: relative;
          overflow: hidden;
        }

        .fuel-level {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, #f44336, #ffc107, #4caf50);
          transition: height 1s ease-out;
          border-radius: 0 0 15px 15px;
        }

        .fuel-markings {
          position: absolute;
          right: -25px;
          top: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 10px 0;
        }

        .fuel-mark {
          font-size: 0.8rem;
          color: #888;
          font-weight: bold;
        }

        .fuel-display {
          text-align: center;
        }

        .fuel-value {
          font-size: 1.6rem;
          font-weight: 600;
          color: #4caf50;
        }

        .fuel-status {
          font-size: 0.9rem;
          color: #888;
          margin-top: 8px;
          font-weight: 500;
        }

        /* Warning Lights Styles */
        .warning-panel {
          text-align: center;
          padding: 2rem 0;
        }

        .warning-light {
          display: inline-block;
          width: 30px;
          height: 30px;
          margin: 0 5px;
          border-radius: 50%;
          background: #333;
          border: 2px solid #555;
          line-height: 26px;
          text-align: center;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        .warning-light.active.green {
          background: #4caf50;
          border-color: #4caf50;
          color: white;
          box-shadow: 0 0 15px rgba(76, 175, 80, 0.8);
        }

        .warning-light.active.yellow {
          background: #ffc107;
          border-color: #ffc107;
          color: white;
          box-shadow: 0 0 15px rgba(255, 193, 7, 0.8);
        }

        .warning-light.active.red {
          background: #f44336;
          border-color: #f44336;
          color: white;
          box-shadow: 0 0 15px rgba(244, 67, 54, 0.8);
        }

        .satisfaction-display {
          margin-top: 1rem;
        }

        .satisfaction-value {
          font-size: 1.8rem;
          font-weight: 600;
          color: #64b5f6;
        }

        .satisfaction-label {
          font-size: 0.9rem;
          color: #888;
          margin-top: 4px;
        }

        /* Odometer Styles */
        .odometer {
          text-align: center;
          padding: 2rem 0;
        }

        .odometer-display {
          display: flex;
          justify-content: center;
          align-items: center;
          background: #000;
          border: 2px solid #333;
          border-radius: 10px;
          padding: 1rem;
          margin-bottom: 1rem;
          font-family: 'Courier New', monospace;
          font-size: 2.5rem;
          font-weight: bold;
          color: #00ff00;
          text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
        }

        .odometer-digit {
          min-width: 40px;
          text-align: center;
          transition: all 0.5s ease;
        }

        .odometer-decimal {
          margin: 0 5px;
          color: #888;
        }

        .odometer-label {
          font-size: 0.9rem;
          color: #888;
          margin-bottom: 0.5rem;
        }

        .odometer-trend {
          font-size: 0.8rem;
          font-weight: bold;
          padding: 4px 12px;
          border-radius: 15px;
          display: inline-block;
          background: rgba(100, 181, 246, 0.1);
          color: #64b5f6;
        }

        /* KPI Panel Styles */
        .kpi-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-top: 1rem;
        }

        .kpi-item {
          text-align: center;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .kpi-icon {
          width: 24px;
          height: 24px;
          color: #64b5f6;
          margin: 0 auto 0.5rem;
        }

        .kpi-value {
          font-size: 1.4rem;
          font-weight: 600;
          color: #fff;
          margin-bottom: 0.25rem;
        }

        .kpi-label {
          font-size: 0.8rem;
          color: #888;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .large-gauge {
            grid-column: span 1;
          }

          .speedometer-gauge {
            width: 240px;
            height: 240px;
          }

          .fuel-gauge {
            flex-direction: column;
            height: auto;
            gap: 1rem;
          }

          .fuel-tank {
            width: 150px;
            height: 30px;
            border-radius: 15px;
          }

          .fuel-level {
            border-radius: 12px 0 0 12px;
          }

          .fuel-markings {
            right: auto;
            top: -20px;
            bottom: auto;
            left: 0;
            right: 0;
            flex-direction: row;
            justify-content: space-between;
            padding: 0 10px;
          }

          .kpi-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
          .speedometer-needle,
          .tach-needle,
          .fuel-level,
          .odometer-digit {
            transition: none;
          }

          .warning-light.active.green,
          .warning-light.active.yellow,
          .warning-light.active.red,
          .speedometer-needle.danger,
          .tach-needle.danger {
            animation: none;
          }
        }
      `}</style>
    </StandardLayout>
  );
};

export default CarDashboard;