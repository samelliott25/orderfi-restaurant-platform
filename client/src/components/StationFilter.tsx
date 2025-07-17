import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChefHat, Filter, Users, Clock } from 'lucide-react';
import { Station } from '@/hooks/useStationRouting';

interface StationFilterProps {
  stations: Station[];
  selectedStation: string | null;
  onStationSelect: (stationId: string | null) => void;
  stationStats: Record<string, any>;
  showUnassigned: boolean;
  onShowUnassignedChange: (show: boolean) => void;
}

export const StationFilter: React.FC<StationFilterProps> = ({
  stations,
  selectedStation,
  onStationSelect,
  stationStats,
  showUnassigned,
  onShowUnassignedChange
}) => {
  const enabledStations = stations.filter(s => s.enabled);

  return (
    <div className="space-y-4">
      {/* Station Selection */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium">Filter by Station:</span>
        </div>
        
        <Select value={selectedStation || 'all'} onValueChange={(value) => onStationSelect(value === 'all' ? null : value)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Stations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stations</SelectItem>
            {enabledStations.map(station => (
              <SelectItem key={station.id} value={station.id}>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: station.color }}
                  />
                  {station.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant={showUnassigned ? "default" : "outline"}
          size="sm"
          onClick={() => onShowUnassignedChange(!showUnassigned)}
          className="ml-4"
        >
          <Users className="w-4 h-4 mr-2" />
          Unassigned
        </Button>
      </div>

      {/* Station Status Pills */}
      <div className="flex flex-wrap gap-2">
        {enabledStations.map(station => {
          const stats = stationStats[station.id];
          const isSelected = selectedStation === station.id;
          
          return (
            <button
              key={station.id}
              onClick={() => onStationSelect(isSelected ? null : station.id)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg border transition-all
                ${isSelected 
                  ? 'bg-white shadow-lg border-gray-300' 
                  : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                }
              `}
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: station.color }}
              />
              <span className="text-sm font-medium">{station.name}</span>
              
              {stats && (
                <div className="flex items-center gap-1 ml-2">
                  <Badge variant="secondary" className="text-xs">
                    {stats.activeOrders}
                  </Badge>
                  {stats.avgPrepTime > 0 && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {stats.avgPrepTime}m
                    </div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Station Info */}
      {selectedStation && (
        <div className="p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-gray-600" />
              <span className="font-medium">
                {stations.find(s => s.id === selectedStation)?.name} Orders
              </span>
            </div>
            
            {stationStats[selectedStation] && (
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Active: {stationStats[selectedStation].activeOrders}</span>
                <span>Avg Time: {stationStats[selectedStation].avgPrepTime}m</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StationFilter;