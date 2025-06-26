import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Printer, Wifi, Settings, CheckCircle, XCircle, AlertTriangle, Plus, Trash2, TestTube, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PrinterConfig {
  id: string;
  name: string;
  type: 'thermal' | 'impact' | 'kds' | 'cloud';
  connectionType: 'usb' | 'ethernet' | 'wifi' | 'cloud';
  ipAddress?: string;
  port?: number;
  apiKey?: string;
  model: string;
  status: 'connected' | 'disconnected' | 'error';
  enabled: boolean;
  isDefault: boolean;
}

interface PrintTemplate {
  id: string;
  name: string;
  type: 'receipt' | 'kitchen' | 'bar';
  width: number;
  fontSize: number;
  includeCustomerInfo: boolean;
  includeOrderTime: boolean;
  includeSpecialInstructions: boolean;
  headerText: string;
  footerText: string;
}

const defaultPrinters: PrinterConfig[] = [
  {
    id: '1',
    name: 'Kitchen Printer',
    type: 'thermal',
    connectionType: 'ethernet',
    ipAddress: '192.168.1.100',
    port: 9100,
    model: 'Epson TM-T88VI',
    status: 'connected',
    enabled: true,
    isDefault: true
  }
];

const defaultTemplates: PrintTemplate[] = [
  {
    id: '1',
    name: 'Kitchen Order',
    type: 'kitchen',
    width: 48,
    fontSize: 12,
    includeCustomerInfo: true,
    includeOrderTime: true,
    includeSpecialInstructions: true,
    headerText: 'KITCHEN ORDER',
    footerText: ''
  }
];

const printerModels = [
  'Epson TM-T88VI',
  'Epson TM-T88VII',
  'Star TSP143III',
  'Bixolon SRP-350III',
  'Epson TM-U220',
  'Star SP700',
  'Custom/Other'
];

export default function KitchenPrinting() {
  const [printers, setPrinters] = useState<PrinterConfig[]>(defaultPrinters);
  const [templates, setTemplates] = useState<PrintTemplate[]>(defaultTemplates);
  const [selectedPrinter, setSelectedPrinter] = useState<PrinterConfig | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<PrintTemplate | null>(null);
  const [testPrintLoading, setTestPrintLoading] = useState(false);
  
  // USB Discovery states
  const [usbPrinters, setUsbPrinters] = useState<any[]>([]);
  const [usbDiscoveryLoading, setUsbDiscoveryLoading] = useState(false);
  
  // Cloud services states
  const [cloudService, setCloudService] = useState('');
  const [cloudApiKey, setCloudApiKey] = useState('');
  const [cloudPrinters, setCloudPrinters] = useState<any[]>([]);
  const [cloudTestLoading, setCloudTestLoading] = useState(false);
  const [cloudDiscoveryLoading, setCloudDiscoveryLoading] = useState(false);
  
  // Driver management states
  const [drivers, setDrivers] = useState<any[]>([]);
  const [driversLoading, setDriversLoading] = useState(false);
  const [installingDriver, setInstallingDriver] = useState<string | null>(null);
  
  const { toast } = useToast();

  // USB Discovery handlers
  const discoverUSBPrinters = async () => {
    setUsbDiscoveryLoading(true);
    try {
      const response = await fetch('/api/kitchen-printing/discover/usb');
      const data = await response.json();
      
      if (response.ok) {
        setUsbPrinters(data.printers);
        toast({
          title: "USB Discovery Complete",
          description: `Found ${data.printers.length} USB printers`
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "USB Discovery Failed",
        description: "Could not scan for USB printers",
        variant: "destructive"
      });
    } finally {
      setUsbDiscoveryLoading(false);
    }
  };

  const configureUSBPrinter = async (printer: any) => {
    try {
      const response = await fetch('/api/kitchen-printing/configure/usb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId: printer.vendorId,
          productId: printer.productId,
          devicePath: printer.devicePath
        })
      });

      if (response.ok) {
        toast({
          title: "USB Printer Configured",
          description: `${printer.manufacturer} ${printer.product} configured successfully`
        });
      } else {
        const data = await response.json();
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Configuration Failed",
        description: "Could not configure USB printer",
        variant: "destructive"
      });
    }
  };

  // Cloud services handlers
  const testCloudConnection = async () => {
    setCloudTestLoading(true);
    try {
      const response = await fetch('/api/kitchen-printing/test/cloud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service: cloudService, apiKey: cloudApiKey })
      });

      if (response.ok) {
        toast({
          title: "Connection Successful",
          description: `Connected to ${cloudService} successfully`
        });
      } else {
        const data = await response.json();
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Could not connect to cloud service",
        variant: "destructive"
      });
    } finally {
      setCloudTestLoading(false);
    }
  };

  const discoverCloudPrinters = async () => {
    setCloudDiscoveryLoading(true);
    try {
      const response = await fetch('/api/kitchen-printing/discover/cloud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          services: [{ service: cloudService, apiKey: cloudApiKey }]
        })
      });

      const data = await response.json();
      if (response.ok) {
        setCloudPrinters(data.printers);
        toast({
          title: "Cloud Discovery Complete",
          description: `Found ${data.printers.length} cloud printers`
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Cloud Discovery Failed",
        description: "Could not find cloud printers",
        variant: "destructive"
      });
    } finally {
      setCloudDiscoveryLoading(false);
    }
  };

  // Driver management handlers
  const loadDrivers = async () => {
    setDriversLoading(true);
    try {
      const response = await fetch('/api/kitchen-printing/drivers');
      const data = await response.json();
      
      if (response.ok) {
        setDrivers(data.drivers);
        toast({
          title: "Drivers Loaded",
          description: `Found ${data.drivers.length} available drivers`
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Driver Load Failed",
        description: "Could not load driver information",
        variant: "destructive"
      });
    } finally {
      setDriversLoading(false);
    }
  };

  const installDriver = async (driverId: string) => {
    setInstallingDriver(driverId);
    try {
      const response = await fetch(`/api/kitchen-printing/drivers/${driverId}/install`, {
        method: 'POST'
      });

      const data = await response.json();
      if (response.ok) {
        toast({
          title: "Driver Installed",
          description: data.message
        });
        // Reload drivers to update status
        await loadDrivers();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Driver Installation Failed",
        description: "Could not install printer driver",
        variant: "destructive"
      });
    } finally {
      setInstallingDriver(null);
    }
  };

  const addPrinter = () => {
    const newPrinter: PrinterConfig = {
      id: Date.now().toString(),
      name: 'New Printer',
      type: 'thermal',
      connectionType: 'ethernet',
      model: 'Epson TM-T88VI',
      status: 'disconnected',
      enabled: false,
      isDefault: false
    };
    setPrinters([...printers, newPrinter]);
    setSelectedPrinter(newPrinter);
  };

  const updatePrinter = (id: string, updates: Partial<PrinterConfig>) => {
    setPrinters(printers.map(p => p.id === id ? { ...p, ...updates } : p));
    if (selectedPrinter?.id === id) {
      setSelectedPrinter({ ...selectedPrinter, ...updates });
    }
  };

  const deletePrinter = (id: string) => {
    setPrinters(printers.filter(p => p.id !== id));
    if (selectedPrinter?.id === id) {
      setSelectedPrinter(null);
    }
  };

  const testPrint = async (printerId: string) => {
    setTestPrintLoading(true);
    try {
      const response = await fetch('/api/kitchen-printing/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ printerId })
      });
      
      if (response.ok) {
        toast({
          title: "Test Print Successful",
          description: "Test order sent to printer successfully"
        });
        updatePrinter(printerId, { status: 'connected' });
      } else {
        throw new Error('Print test failed');
      }
    } catch (error) {
      toast({
        title: "Test Print Failed",
        description: "Could not connect to printer",
        variant: "destructive"
      });
      updatePrinter(printerId, { status: 'error' });
    } finally {
      setTestPrintLoading(false);
    }
  };

  const savePrinterConfig = async () => {
    try {
      const response = await fetch('/api/kitchen-printing/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ printers, templates })
      });
      
      if (response.ok) {
        toast({
          title: "Configuration Saved",
          description: "Printer settings saved successfully"
        });
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Could not save printer configuration",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: '"Playwrite AU VIC", cursive' }}>
              Kitchen Printing
            </h1>
            <p className="text-gray-600">Configure and manage restaurant kitchen printers</p>
          </div>
          <Button onClick={savePrinterConfig} className="bg-orange-500 hover:bg-orange-600">
            <Save className="h-4 w-4 mr-2" />
            Save Configuration
          </Button>
        </div>

        <Tabs defaultValue="printers" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="printers">Printers</TabsTrigger>
            <TabsTrigger value="templates">Print Templates</TabsTrigger>
            <TabsTrigger value="integration">Integration</TabsTrigger>
          </TabsList>

          {/* Printers Tab */}
          <TabsContent value="printers" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Printer List */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Configured Printers</CardTitle>
                    <CardDescription>Manage your kitchen printing devices</CardDescription>
                  </div>
                  <Button onClick={addPrinter} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Printer
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {printers.map((printer) => (
                    <div
                      key={printer.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedPrinter?.id === printer.id 
                          ? 'border-orange-300 bg-orange-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedPrinter(printer)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Printer className="h-5 w-5 text-gray-500" />
                          <div>
                            <div className="font-medium">{printer.name}</div>
                            <div className="text-sm text-gray-500">
                              {printer.model} • {printer.connectionType}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {printer.isDefault && (
                            <Badge variant="outline">Default</Badge>
                          )}
                          {getStatusIcon(printer.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Printer Configuration */}
              {selectedPrinter && (
                <Card>
                  <CardHeader>
                    <CardTitle>Printer Configuration</CardTitle>
                    <CardDescription>Configure settings for {selectedPrinter.name}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="printer-name">Printer Name</Label>
                        <Input
                          id="printer-name"
                          value={selectedPrinter.name}
                          onChange={(e) => updatePrinter(selectedPrinter.id, { name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="printer-model">Model</Label>
                        <Select
                          value={selectedPrinter.model}
                          onValueChange={(value) => updatePrinter(selectedPrinter.id, { model: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {printerModels.map((model) => (
                              <SelectItem key={model} value={model}>{model}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="printer-type">Printer Type</Label>
                        <Select
                          value={selectedPrinter.type}
                          onValueChange={(value: any) => updatePrinter(selectedPrinter.id, { type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="thermal">Thermal Receipt</SelectItem>
                            <SelectItem value="impact">Impact Dot Matrix</SelectItem>
                            <SelectItem value="kds">Kitchen Display System</SelectItem>
                            <SelectItem value="cloud">Cloud Service</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="connection-type">Connection</Label>
                        <Select
                          value={selectedPrinter.connectionType}
                          onValueChange={(value: any) => updatePrinter(selectedPrinter.id, { connectionType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="ethernet">Ethernet</SelectItem>
                            <SelectItem value="wifi">WiFi</SelectItem>
                            <SelectItem value="usb">USB</SelectItem>
                            <SelectItem value="cloud">Cloud Service</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {(selectedPrinter.connectionType === 'ethernet' || selectedPrinter.connectionType === 'wifi') && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="ip-address">IP Address</Label>
                          <Input
                            id="ip-address"
                            value={selectedPrinter.ipAddress || ''}
                            onChange={(e) => updatePrinter(selectedPrinter.id, { ipAddress: e.target.value })}
                            placeholder="192.168.1.100"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="port">Port</Label>
                          <Input
                            id="port"
                            type="number"
                            value={selectedPrinter.port || 9100}
                            onChange={(e) => updatePrinter(selectedPrinter.id, { port: parseInt(e.target.value) })}
                          />
                        </div>
                      </div>
                    )}

                    {selectedPrinter.connectionType === 'cloud' && (
                      <div className="space-y-2">
                        <Label htmlFor="api-key">API Key</Label>
                        <Input
                          id="api-key"
                          type="password"
                          value={selectedPrinter.apiKey || ''}
                          onChange={(e) => updatePrinter(selectedPrinter.id, { apiKey: e.target.value })}
                          placeholder="Enter cloud service API key"
                        />
                      </div>
                    )}

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={selectedPrinter.enabled}
                          onCheckedChange={(checked) => updatePrinter(selectedPrinter.id, { enabled: checked })}
                        />
                        <Label>Enable Printer</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={selectedPrinter.isDefault}
                          onCheckedChange={(checked) => {
                            // Set all printers to not default first
                            setPrinters(printers.map(p => ({ ...p, isDefault: false })));
                            updatePrinter(selectedPrinter.id, { isDefault: checked });
                          }}
                        />
                        <Label>Default Printer</Label>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={() => testPrint(selectedPrinter.id)}
                        disabled={testPrintLoading}
                        variant="outline"
                        className="flex-1"
                      >
                        <TestTube className="h-4 w-4 mr-2" />
                        {testPrintLoading ? 'Testing...' : 'Test Print'}
                      </Button>
                      <Button
                        onClick={() => deletePrinter(selectedPrinter.id)}
                        variant="destructive"
                        size="icon"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Print Templates</CardTitle>
                <CardDescription>Customize how orders appear on kitchen tickets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {templates.map((template) => (
                  <div key={template.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{template.name}</h3>
                        <p className="text-sm text-gray-500">{template.type} template • {template.width}mm width</p>
                      </div>
                      <Badge>{template.type}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>Customer Info: {template.includeCustomerInfo ? '✓' : '✗'}</div>
                      <div>Order Time: {template.includeOrderTime ? '✓' : '✗'}</div>
                      <div>Special Instructions: {template.includeSpecialInstructions ? '✓' : '✗'}</div>
                      <div>Font Size: {template.fontSize}pt</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integration Tab */}
          <TabsContent value="integration" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>USB Printer Discovery</CardTitle>
                  <CardDescription>Discover and configure USB printers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={discoverUSBPrinters} 
                    className="w-full"
                    disabled={usbDiscoveryLoading}
                  >
                    {usbDiscoveryLoading ? 'Scanning...' : 'Scan for USB Printers'}
                  </Button>
                  {usbPrinters.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Found {usbPrinters.length} USB printers:</p>
                      {usbPrinters.map((printer, index) => (
                        <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                          <div>{printer.manufacturer} {printer.product}</div>
                          <div className="text-gray-500">Device: {printer.devicePath}</div>
                          <Button 
                            size="sm" 
                            className="mt-1"
                            onClick={() => configureUSBPrinter(printer)}
                          >
                            Auto-Configure
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cloud Services</CardTitle>
                  <CardDescription>Connect to cloud printing platforms</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label>Service</Label>
                    <Select value={cloudService} onValueChange={setCloudService}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select cloud service" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="printnode">PrintNode</SelectItem>
                        <SelectItem value="ezeep">ezeep Blue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <Input
                      type="password"
                      value={cloudApiKey}
                      onChange={(e) => setCloudApiKey(e.target.value)}
                      placeholder="Enter API key"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={testCloudConnection}
                      disabled={!cloudService || !cloudApiKey || cloudTestLoading}
                      variant="outline"
                      className="flex-1"
                    >
                      {cloudTestLoading ? 'Testing...' : 'Test Connection'}
                    </Button>
                    <Button 
                      onClick={discoverCloudPrinters}
                      disabled={!cloudService || !cloudApiKey || cloudDiscoveryLoading}
                      className="flex-1"
                    >
                      {cloudDiscoveryLoading ? 'Finding...' : 'Find Printers'}
                    </Button>
                  </div>
                  {cloudPrinters.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Found {cloudPrinters.length} cloud printers:</p>
                      {cloudPrinters.map((printer, index) => (
                        <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                          <div className="flex justify-between items-center">
                            <span>{printer.name}</span>
                            <Badge variant={printer.status === 'online' ? 'default' : 'destructive'}>
                              {printer.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Driver Management</CardTitle>
                  <CardDescription>Install and manage printer drivers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={loadDrivers} 
                    variant="outline" 
                    className="w-full"
                    disabled={driversLoading}
                  >
                    {driversLoading ? 'Loading...' : 'Check Available Drivers'}
                  </Button>
                  {drivers.length > 0 && (
                    <div className="space-y-2">
                      {drivers.map((driver) => (
                        <div key={driver.id} className="p-2 bg-gray-50 rounded text-sm">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{driver.manufacturer} {driver.model}</div>
                              <div className="text-gray-500">Status: {driver.status}</div>
                            </div>
                            {driver.status === 'not_installed' && (
                              <Button 
                                size="sm"
                                onClick={() => installDriver(driver.id)}
                                disabled={installingDriver === driver.id}
                              >
                                {installingDriver === driver.id ? 'Installing...' : 'Install'}
                              </Button>
                            )}
                            {driver.status === 'installed' && (
                              <Badge variant="default">Installed</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>Overall printing system health</CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert>
                    <Wifi className="h-4 w-4" />
                    <AlertDescription>
                      Kitchen printing system is active. Orders from OrderFi AI are automatically sent to enabled printers.
                      {printers.filter(p => p.enabled).length > 0 ? (
                        ` ${printers.filter(p => p.enabled).length} printer(s) enabled.`
                      ) : (
                        ' No printers enabled - configure at least one printer above.'
                      )}
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}