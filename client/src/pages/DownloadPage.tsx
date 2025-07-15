import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, Calendar, Clock } from 'lucide-react';

export function DownloadPage() {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch('/api/download/project-summary');
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Mimi_Waitress_Project_Summary.html';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto pt-20">
        <Card className="bg-background border-border shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <FileText className="h-16 w-16 text-foreground" />
            </div>
            <CardTitle className="text-2xl text-foreground">Project Summary</CardTitle>
            <CardDescription className="text-muted-foreground">
              Download your comprehensive project documentation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-foreground">
                <Calendar className="h-4 w-4" />
                <span>Generated: June 19, 2025</span>
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <Clock className="h-4 w-4" />
                <span>Development: 3 Days</span>
              </div>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">Document Contents:</h3>
              <ul className="text-sm text-foreground space-y-1">
                <li>• Executive Summary & Technical Architecture</li>
                <li>• Complete Development Timeline (15 pages)</li>
                <li>• Investment Analysis & ROI Projections</li>
                <li>• Feature Inventory & Business Impact</li>
                <li>• Blockchain Statistics & Metrics</li>
                <li>• Next Phase Recommendations</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-foreground mb-2">How to Convert to PDF:</h3>
              <ol className="text-sm text-foreground space-y-1">
                <li>1. Download the HTML file below</li>
                <li>2. Open it in any web browser</li>
                <li>3. Press Ctrl+P (Windows) or Cmd+P (Mac)</li>
                <li>4. Select "Save as PDF" from destination</li>
                <li>5. Enable "Background graphics" for best formatting</li>
              </ol>
            </div>

            <Button 
              onClick={handleDownload}
              disabled={downloading}
              className="w-full bg-primary hover:bg-primary/90 text-white"
              size="lg"
            >
              <Download className="mr-2 h-5 w-5" />
              {downloading ? 'Downloading...' : 'Download Project Summary (HTML)'}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              File size: ~500KB | Format: HTML (PDF-ready)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}