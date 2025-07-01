import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palette, Check } from "lucide-react";

export interface InventoryTheme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
}

export const inventoryThemes: InventoryTheme[] = [
  {
    name: "OrderFi Classic",
    primary: "hsl(25, 95%, 53%)", // Orange
    secondary: "hsl(220, 13%, 91%)",
    accent: "hsl(340, 82%, 52%)",
    background: "hsl(0, 0%, 100%)",
    surface: "hsl(0, 0%, 98%)",
    text: "hsl(224, 71%, 4%)",
    muted: "hsl(215, 16%, 47%)",
    success: "hsl(142, 76%, 36%)",
    warning: "hsl(38, 92%, 50%)",
    danger: "hsl(0, 84%, 60%)",
    info: "hsl(221, 83%, 53%)"
  },
  {
    name: "Forest Green",
    primary: "hsl(142, 76%, 36%)", // Green
    secondary: "hsl(138, 76%, 97%)",
    accent: "hsl(162, 73%, 46%)",
    background: "hsl(0, 0%, 100%)",
    surface: "hsl(138, 76%, 98%)",
    text: "hsl(240, 10%, 4%)",
    muted: "hsl(240, 5%, 65%)",
    success: "hsl(142, 76%, 36%)",
    warning: "hsl(43, 96%, 56%)",
    danger: "hsl(0, 84%, 60%)",
    info: "hsl(200, 98%, 39%)"
  },
  {
    name: "Ocean Blue",
    primary: "hsl(221, 83%, 53%)", // Blue
    secondary: "hsl(210, 40%, 98%)",
    accent: "hsl(262, 83%, 58%)",
    background: "hsl(0, 0%, 100%)",
    surface: "hsl(210, 40%, 99%)",
    text: "hsl(222, 84%, 5%)",
    muted: "hsl(215, 16%, 47%)",
    success: "hsl(142, 76%, 36%)",
    warning: "hsl(38, 92%, 50%)",
    danger: "hsl(0, 84%, 60%)",
    info: "hsl(221, 83%, 53%)"
  },
  {
    name: "Purple Premium",
    primary: "hsl(262, 83%, 58%)", // Purple
    secondary: "hsl(270, 20%, 98%)",
    accent: "hsl(316, 70%, 68%)",
    background: "hsl(0, 0%, 100%)",
    surface: "hsl(270, 20%, 99%)",
    text: "hsl(224, 71%, 4%)",
    muted: "hsl(215, 16%, 47%)",
    success: "hsl(142, 76%, 36%)",
    warning: "hsl(38, 92%, 50%)",
    danger: "hsl(0, 84%, 60%)",
    info: "hsl(262, 83%, 58%)"
  },
  {
    name: "Rose Gold",
    primary: "hsl(340, 82%, 52%)", // Rose
    secondary: "hsl(330, 85%, 96%)",
    accent: "hsl(346, 77%, 49%)",
    background: "hsl(0, 0%, 100%)",
    surface: "hsl(330, 85%, 98%)",
    text: "hsl(224, 71%, 4%)",
    muted: "hsl(215, 16%, 47%)",
    success: "hsl(142, 76%, 36%)",
    warning: "hsl(38, 92%, 50%)",
    danger: "hsl(0, 84%, 60%)",
    info: "hsl(340, 82%, 52%)"
  },
  {
    name: "Slate Professional",
    primary: "hsl(215, 28%, 17%)", // Dark slate
    secondary: "hsl(210, 40%, 98%)",
    accent: "hsl(217, 91%, 60%)",
    background: "hsl(0, 0%, 100%)",
    surface: "hsl(210, 40%, 99%)",
    text: "hsl(222, 84%, 5%)",
    muted: "hsl(215, 16%, 47%)",
    success: "hsl(142, 76%, 36%)",
    warning: "hsl(38, 92%, 50%)",
    danger: "hsl(0, 84%, 60%)",
    info: "hsl(215, 28%, 17%)"
  },
  {
    name: "Emerald Fresh",
    primary: "hsl(160, 84%, 39%)", // Emerald
    secondary: "hsl(152, 76%, 97%)",
    accent: "hsl(174, 72%, 56%)",
    background: "hsl(0, 0%, 100%)",
    surface: "hsl(152, 76%, 98%)",
    text: "hsl(240, 10%, 4%)",
    muted: "hsl(240, 5%, 65%)",
    success: "hsl(160, 84%, 39%)",
    warning: "hsl(43, 96%, 56%)",
    danger: "hsl(0, 84%, 60%)",
    info: "hsl(160, 84%, 39%)"
  },
  {
    name: "Sunset Warm",
    primary: "hsl(17, 88%, 40%)", // Deep orange
    secondary: "hsl(24, 70%, 95%)",
    accent: "hsl(45, 93%, 47%)",
    background: "hsl(0, 0%, 100%)",
    surface: "hsl(24, 70%, 97%)",
    text: "hsl(224, 71%, 4%)",
    muted: "hsl(215, 16%, 47%)",
    success: "hsl(142, 76%, 36%)",
    warning: "hsl(45, 93%, 47%)",
    danger: "hsl(0, 84%, 60%)",
    info: "hsl(17, 88%, 40%)"
  }
];

interface ThemeSelectorProps {
  onThemeChange: (theme: InventoryTheme) => void;
  currentTheme: InventoryTheme;
}

export function ThemeSelector({ onThemeChange, currentTheme }: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <Palette className="h-4 w-4" />
        {currentTheme.name}
      </Button>

      {isOpen && (
        <Card className="absolute top-full left-0 mt-2 z-50 w-80 max-h-96 overflow-y-auto">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Choose Color Theme</h3>
            <div className="grid gap-3">
              {inventoryThemes.map((theme) => (
                <div
                  key={theme.name}
                  className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    currentTheme.name === theme.name ? 'border-2 border-blue-500' : 'border-gray-200'
                  }`}
                  onClick={() => {
                    onThemeChange(theme);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{theme.name}</span>
                    {currentTheme.name === theme.name && (
                      <Check className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                  
                  <div className="flex gap-1 mb-2">
                    <div 
                      className="w-6 h-6 rounded-full border"
                      style={{ backgroundColor: theme.primary }}
                      title="Primary"
                    />
                    <div 
                      className="w-6 h-6 rounded-full border"
                      style={{ backgroundColor: theme.accent }}
                      title="Accent"
                    />
                    <div 
                      className="w-6 h-6 rounded-full border"
                      style={{ backgroundColor: theme.success }}
                      title="Success"
                    />
                    <div 
                      className="w-6 h-6 rounded-full border"
                      style={{ backgroundColor: theme.warning }}
                      title="Warning"
                    />
                    <div 
                      className="w-6 h-6 rounded-full border"
                      style={{ backgroundColor: theme.danger }}
                      title="Danger"
                    />
                  </div>
                  
                  <div className="flex gap-1">
                    <Badge variant="outline" style={{ color: theme.primary, borderColor: theme.primary }}>
                      Sample
                    </Badge>
                    <Badge variant="secondary" style={{ backgroundColor: theme.secondary }}>
                      Theme
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}