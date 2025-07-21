import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Plus, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut,
  Move3D,
  Clock,
  CheckCircle,
  AlertCircle,
  Coffee,
  Utensils
} from 'lucide-react';

interface Table {
  id: string;
  number: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  shape: 'rectangle' | 'circle' | 'square';
  section: string;
  currentOrder?: {
    id: string;
    customerName: string;
    startTime: string;
    items: number;
    total: number;
  };
  reservations?: Array<{
    id: string;
    customerName: string;
    time: string;
    partySize: number;
  }>;
}

interface FloorPlanViewProps {
  tables: Table[];
  onTableUpdate: (tableId: string, updates: Partial<Table>) => void;
  onTableSelect: (table: Table) => void;
  selectedTable?: Table | null;
  viewMode: 'design' | 'operations';
}

const FloorPlanView: React.FC<FloorPlanViewProps> = ({
  tables,
  onTableUpdate,
  onTableSelect,
  selectedTable,
  viewMode = 'operations'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#22c55e'; // green
      case 'occupied': return '#ef4444'; // red
      case 'reserved': return '#f59e0b'; // amber
      case 'cleaning': return '#8b5cf6'; // purple
      default: return '#6b7280'; // gray
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return CheckCircle;
      case 'occupied': return Users;
      case 'reserved': return Clock;
      case 'cleaning': return Coffee;
      default: return AlertCircle;
    }
  };

  const handleTableClick = (table: Table, event: React.MouseEvent) => {
    event.stopPropagation();
    onTableSelect(table);
  };

  const handleTableDragStart = (table: Table, event: React.MouseEvent) => {
    if (viewMode !== 'design') return;
    
    event.preventDefault();
    setIsDragging(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: (event.clientX - rect.left) / zoom - table.x,
        y: (event.clientY - rect.top) / zoom - table.y
      });
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging || !selectedTable || viewMode !== 'design') return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const newX = (event.clientX - rect.left) / zoom - dragOffset.x;
      const newY = (event.clientY - rect.top) / zoom - dragOffset.y;
      
      onTableUpdate(selectedTable.id, { x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const renderTable = (table: Table) => {
    const StatusIcon = getStatusIcon(table.status);
    const isSelected = selectedTable?.id === table.id;
    
    return (
      <div
        key={table.id}
        className={`absolute cursor-pointer transform transition-all duration-200 ${
          isSelected ? 'ring-2 ring-blue-500 scale-105' : ''
        } ${viewMode === 'design' ? 'cursor-move' : 'cursor-pointer'}`}
        style={{
          left: table.x,
          top: table.y,
          width: table.width,
          height: table.height,
          transform: `rotate(${table.rotation}deg)`,
        }}
        onClick={(e) => handleTableClick(table, e)}
        onMouseDown={(e) => handleTableDragStart(table, e)}
      >
        <div 
          className={`liquid-glass-card h-full flex flex-col items-center justify-center relative border-2`}
          style={{ 
            borderColor: getStatusColor(table.status),
            borderRadius: table.shape === 'circle' ? '50%' : '8px'
          }}
        >
          {/* Table Number */}
          <div className="text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-pink-500 w-6 h-6 rounded-full flex items-center justify-center mb-1">
            {table.number}
          </div>
          
          {/* Capacity */}
          <div className="text-xs text-gray-600 dark:text-gray-300 mb-1">
            {table.capacity} seats
          </div>
          
          {/* Status Icon */}
          <StatusIcon 
            className="w-4 h-4 mb-1" 
            style={{ color: getStatusColor(table.status) }}
          />
          
          {/* Current Order Info (compact) */}
          {table.currentOrder && (
            <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-1 py-0.5 rounded">
              ${table.currentOrder.total}
            </div>
          )}
          
          {/* Reservation Info (compact) */}
          {table.reservations && table.reservations.length > 0 && (
            <div className="absolute -bottom-2 -left-2 bg-amber-500 text-white text-xs px-1 py-0.5 rounded">
              {table.reservations.length}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="liquid-glass-card p-4">
      {/* Floor Plan Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="liquid-glass-nav-item">
            {viewMode === 'design' ? 'Design Mode' : 'Operations Mode'}
          </Badge>
          <Badge variant="outline" className="liquid-glass-nav-item">
            {tables.length} Tables
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            className="liquid-glass-nav-item"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          
          <span className="text-sm px-2">{Math.round(zoom * 100)}%</span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.min(2, zoom + 0.1))}
            className="liquid-glass-nav-item"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            className="liquid-glass-nav-item"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          
          {viewMode === 'design' && (
            <Button
              size="sm"
              className="liquid-glass-nav-item"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Table
            </Button>
          )}
        </div>
      </div>
      
      {/* Floor Plan Canvas */}
      <div 
        ref={canvasRef}
        className="relative bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
        style={{ 
          height: '600px',
          transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
          transformOrigin: '0 0'
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 60 }, (_, i) => (
            <div
              key={`v-${i}`}
              className="absolute h-full border-l border-gray-300 dark:border-gray-600"
              style={{ left: i * 20 }}
            />
          ))}
          {Array.from({ length: 30 }, (_, i) => (
            <div
              key={`h-${i}`}
              className="absolute w-full border-t border-gray-300 dark:border-gray-600"
              style={{ top: i * 20 }}
            />
          ))}
        </div>
        
        {/* Restaurant Layout Elements */}
        {/* Kitchen Area */}
        <div className="absolute top-4 left-4 w-48 h-32 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-400">
          <div className="text-center">
            <Utensils className="w-8 h-8 mx-auto mb-2 text-gray-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Kitchen</span>
          </div>
        </div>
        
        {/* Bar Area */}
        <div className="absolute top-4 right-4 w-32 h-48 bg-amber-100 dark:bg-amber-900/20 rounded-lg flex items-center justify-center border-2 border-dashed border-amber-400">
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-2 bg-amber-500 rounded"></div>
            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">Bar</span>
          </div>
        </div>
        
        {/* Render Tables */}
        {tables.map(renderTable)}
        
        {/* Section Labels */}
        <div className="absolute bottom-4 left-4 liquid-glass-card p-2">
          <div className="text-sm font-medium mb-2">Sections:</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Occupied</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-amber-500 rounded"></div>
              <span>Reserved</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span>Cleaning</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloorPlanView;