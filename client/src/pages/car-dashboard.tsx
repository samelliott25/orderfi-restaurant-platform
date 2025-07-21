import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Car, Gauge, Timer, DollarSign, Users } from 'lucide-react';
import { StandardLayout } from '@/components/StandardLayout';

interface DashboardMetrics {
  orderVelocity: number; // orders per hour - perfect for speedometer!
  maxOrderCapacity: number; // max orders/hour kitchen can handle
  cogs: number;
  laborCost: number;
  customerSatisfaction: number;
  tableTurnover: number;
  dailySales: { current: number; target: number };
}

const CarDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    orderVelocity: 85, // Current orders per hour
    maxOrderCapacity: 120, // Max kitchen capacity (orders/hour)
    cogs: 32,
    laborCost: 28,
    customerSatisfaction: 4.2,
    tableTurnover: 2.8,
    dailySales: { current: 8500, target: 12000 }
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        orderVelocity: Math.max(0, Math.min(prev.maxOrderCapacity, prev.orderVelocity + Math.random() * 10 - 5)),
        maxOrderCapacity: prev.maxOrderCapacity,
        cogs: Math.max(20, Math.min(45, prev.cogs + Math.random() * 2 - 1)),
        laborCost: Math.max(15, Math.min(40, prev.laborCost + Math.random() * 1 - 0.5)),
        customerSatisfaction: Math.max(1, Math.min(5, prev.customerSatisfaction + Math.random() * 0.2 - 0.1)),
        tableTurnover: Math.max(0, Math.min(5, prev.tableTurnover + Math.random() * 0.2 - 0.1)),
        dailySales: {
          current: Math.max(0, prev.dailySales.current + Math.random() * 200 - 100),
          target: prev.dailySales.target
        }
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const velocityPercentage = (metrics.orderVelocity / metrics.maxOrderCapacity) * 100;

  return (
    <StandardLayout>
      <div className="car-dashboard-container">
        {/* Header */}
        <div className="dashboard-header liquid-glass-header">
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
          {/* Order Velocity Speedometer */}
          <div className="gauge-container large-gauge liquid-glass-card">
            <div className="gauge-title">Order Velocity (Orders/Hour)</div>
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
                  className={`speedometer-needle ${velocityPercentage > 85 ? 'danger' : velocityPercentage > 70 ? 'warning' : 'normal'}`}
                  style={{ transform: `rotate(${-90 + (velocityPercentage * 1.8)}deg)` }}
                />
                <div className="needle-center" />
                <div className="gauge-display">
                  <div className="primary-value">{metrics.orderVelocity.toFixed(0)} ord/hr</div>
                  <div className="secondary-value">{velocityPercentage.toFixed(1)}% of capacity ({metrics.maxOrderCapacity})</div>
                </div>
              </div>
            </div>
          </div>

          {/* COGS Tachometer */}
          <div className="gauge-container medium-gauge liquid-glass-card">
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
          <div className="gauge-container medium-gauge liquid-glass-card">
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
          <div className="gauge-container warning-lights liquid-glass-card">
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
          <div className="gauge-container odometer-gauge liquid-glass-card">
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

          {/* Daily Sales Progress Bar */}
          <div className="gauge-container sales-progress liquid-glass-card">
            <div className="gauge-title">Daily Sales Progress</div>
            <div className="progress-container">
              <div className="sales-amount">
                <div className="current-sales">${metrics.dailySales.current.toLocaleString()}</div>
                <div className="target-sales">Target: ${metrics.dailySales.target.toLocaleString()}</div>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${Math.min(100, (metrics.dailySales.current / metrics.dailySales.target) * 100)}%`,
                    backgroundColor: (metrics.dailySales.current / metrics.dailySales.target) >= 1 ? '#4caf50' : 
                                   (metrics.dailySales.current / metrics.dailySales.target) >= 0.8 ? '#ffc107' : 
                                   '#f44336'
                  }}
                />
              </div>
              <div className="progress-percentage">
                {((metrics.dailySales.current / metrics.dailySales.target) * 100).toFixed(1)}% Complete
              </div>
            </div>
          </div>

          {/* Additional KPIs */}
          <div className="gauge-container kpi-panel liquid-glass-card">
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
                <div className="kpi-value">{metrics.orderVelocity.toFixed(0)}</div>
                <div className="kpi-label">Orders/Hour</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .car-dashboard-container {
          min-height: 100vh;
          padding: 1rem;
          font-family: 'Segoe UI', -apple-system, sans-serif;
          position: relative;
          overflow-x: auto;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding: 1rem;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: hsl(var(--primary));
          text-decoration: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .back-button:hover {
          background: rgba(245, 166, 35, 0.1);
          transform: translateX(-2px);
        }

        .dashboard-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.5rem;
          font-weight: 300;
          color: hsl(var(--foreground));
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .gauge-container {
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
        }

        .large-gauge {
          grid-column: span 2;
        }

        .gauge-title {
          text-align: center;
          font-size: 1.1rem;
          font-weight: 300;
          color: hsl(var(--muted-foreground));
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
              hsl(var(--muted)) 180deg);
          position: relative;
          border: 8px solid hsl(var(--border));
          box-shadow: 
            0 0 30px rgba(0, 0, 0, 0.3),
            inset 0 0 30px rgba(0, 0, 0, 0.2);
        }

        .gauge-face::before {
          content: '';
          position: absolute;
          top: 20px;
          left: 20px;
          right: 20px;
          bottom: 20px;
          background: hsl(var(--card));
          border-radius: 50%;
          border: 2px solid hsl(var(--border));
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
          color: hsl(var(--foreground));
          font-weight: 500;
        }

        .speedometer-needle {
          position: absolute;
          width: 4px;
          height: 120px;
          background: linear-gradient(to top, hsl(var(--muted-foreground)), hsl(var(--foreground)));
          top: 50%;
          left: 50%;
          transform-origin: 50% 100%;
          border-radius: 2px;
          transition: transform 1s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 10;
          box-shadow: 0 0 10px rgba(245, 166, 35, 0.5);
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
          color: hsl(var(--primary));
          text-shadow: 0 0 10px rgba(245, 166, 35, 0.5);
        }

        .secondary-value {
          font-size: 0.9rem;
          color: hsl(var(--muted-foreground));
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
          background: hsl(var(--card));
          position: relative;
          border: 6px solid hsl(var(--border));
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.2);
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
          color: hsl(var(--primary));
        }

        .tach-label {
          font-size: 0.8rem;
          color: hsl(var(--muted-foreground));
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
          background: hsl(var(--muted));
          border: 3px solid hsl(var(--border));
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
          color: hsl(var(--muted-foreground));
          font-weight: bold;
        }

        .fuel-display {
          text-align: center;
        }

        .fuel-value {
          font-size: 1.6rem;
          font-weight: 600;
          color: hsl(var(--primary));
        }

        .fuel-status {
          font-size: 0.9rem;
          color: hsl(var(--muted-foreground));
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
          background: hsl(var(--muted));
          border: 2px solid hsl(var(--border));
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
          color: hsl(var(--primary));
        }

        .satisfaction-label {
          font-size: 0.9rem;
          color: hsl(var(--muted-foreground));
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
          background: hsl(var(--card));
          border: 2px solid hsl(var(--border));
          border-radius: 10px;
          padding: 1rem;
          margin-bottom: 1rem;
          font-family: 'Courier New', monospace;
          font-size: 2.5rem;
          font-weight: bold;
          color: hsl(var(--primary));
          text-shadow: 0 0 10px rgba(245, 166, 35, 0.5);
        }

        .odometer-digit {
          min-width: 40px;
          text-align: center;
          transition: all 0.5s ease;
        }

        .odometer-decimal {
          margin: 0 5px;
          color: hsl(var(--muted-foreground));
        }

        .odometer-label {
          font-size: 0.9rem;
          color: hsl(var(--muted-foreground));
          margin-bottom: 0.5rem;
        }

        .odometer-trend {
          font-size: 0.8rem;
          font-weight: bold;
          padding: 4px 12px;
          border-radius: 15px;
          display: inline-block;
          background: rgba(245, 166, 35, 0.1);
          color: hsl(var(--primary));
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
          background: rgba(255, 255, 255, 0.03);
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .kpi-icon {
          width: 24px;
          height: 24px;
          color: hsl(var(--primary));
          margin: 0 auto 0.5rem;
        }

        .kpi-value {
          font-size: 1.4rem;
          font-weight: 600;
          color: hsl(var(--foreground));
          margin-bottom: 0.25rem;
        }

        .kpi-label {
          font-size: 0.8rem;
          color: hsl(var(--muted-foreground));
        }

        /* Sales Progress Styles */
        .progress-container {
          padding: 1.5rem;
          text-align: center;
        }

        .sales-amount {
          margin-bottom: 1.5rem;
        }

        .current-sales {
          font-size: 2rem;
          font-weight: 600;
          color: hsl(var(--primary));
          text-shadow: 0 0 10px rgba(245, 166, 35, 0.5);
        }

        .target-sales {
          font-size: 1rem;
          color: hsl(var(--muted-foreground));
          margin-top: 0.5rem;
        }

        .progress-bar {
          width: 100%;
          height: 20px;
          background: hsl(var(--muted));
          border-radius: 10px;
          overflow: hidden;
          border: 2px solid hsl(var(--border));
          margin: 1rem 0;
          position: relative;
        }

        .progress-fill {
          height: 100%;
          border-radius: 8px;
          transition: width 1s ease-out, background-color 0.3s ease;
          position: relative;
        }

        .progress-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          animation: progressShine 2s infinite;
        }

        @keyframes progressShine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .progress-percentage {
          font-size: 1.1rem;
          font-weight: 600;
          color: hsl(var(--foreground));
          margin-top: 0.5rem;
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

          .sales-progress {
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