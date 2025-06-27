import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

export interface DriverInfo {
  manufacturer: string;
  model: string;
  driverPath?: string;
  installCommand?: string;
  configFile?: string;
  status: 'installed' | 'not_installed' | 'error';
}

export class PrinterDriverManager {
  private driverDatabase = new Map<string, DriverInfo>([
    // Epson drivers
    ['epson-tm-t88vi', {
      manufacturer: 'Epson',
      model: 'TM-T88VI',
      installCommand: 'sudo apt-get install printer-driver-escpos',
      status: 'not_installed'
    }],
    ['epson-tm-t88v', {
      manufacturer: 'Epson', 
      model: 'TM-T88V',
      installCommand: 'sudo apt-get install printer-driver-escpos',
      status: 'not_installed'
    }],
    
    // Star drivers
    ['star-tsp143', {
      manufacturer: 'Star',
      model: 'TSP143',
      installCommand: 'wget -O- https://starmicronics.com/support/drivers/star-cups-driver.tar.gz | tar xz && sudo ./install.sh',
      status: 'not_installed'
    }],
    
    // Bixolon drivers
    ['bixolon-srp350', {
      manufacturer: 'Bixolon',
      model: 'SRP-350III',
      installCommand: 'sudo apt-get install printer-driver-bixolon',
      status: 'not_installed'
    }]
  ]);

  constructor() {
    this.initializeDriverStatus();
  }

  private async initializeDriverStatus() {
    if (process.platform === 'linux') {
      await this.checkLinuxDrivers();
    } else if (process.platform === 'win32') {
      await this.checkWindowsDrivers();
    } else if (process.platform === 'darwin') {
      await this.checkMacDrivers();
    }
  }

  private async checkLinuxDrivers() {
    try {
      // Check CUPS drivers
      const { stdout } = await execAsync('lpstat -p 2>/dev/null || echo "no printers"');
      
      // Check for ESC/POS driver
      try {
        await execAsync('which escpos 2>/dev/null');
        this.updateDriverStatus('epson-tm-t88vi', 'installed');
        this.updateDriverStatus('epson-tm-t88v', 'installed');
      } catch {
        // ESC/POS driver not found
      }

      // Check installed packages
      const { stdout: packages } = await execAsync('dpkg -l | grep printer-driver || echo "none"');
      if (packages.includes('escpos')) {
        this.updateDriverStatus('epson-tm-t88vi', 'installed');
      }
      if (packages.includes('bixolon')) {
        this.updateDriverStatus('bixolon-srp350', 'installed');
      }
    } catch (error) {
      console.error('Driver check failed:', error);
    }
  }

  private async checkWindowsDrivers() {
    try {
      // Check Windows printer drivers
      const { stdout } = await execAsync('wmic printer get name,drivername');
      
      if (stdout.includes('EPSON') || stdout.includes('TM-T88')) {
        this.updateDriverStatus('epson-tm-t88vi', 'installed');
      }
      if (stdout.includes('Star') || stdout.includes('TSP')) {
        this.updateDriverStatus('star-tsp143', 'installed');
      }
    } catch (error) {
      console.error('Windows driver check failed:', error);
    }
  }

  private async checkMacDrivers() {
    try {
      // Check macOS printer drivers
      const { stdout } = await execAsync('lpstat -p');
      
      // Basic check for known printer types
      if (stdout.includes('EPSON') || stdout.includes('TM')) {
        this.updateDriverStatus('epson-tm-t88vi', 'installed');
      }
    } catch (error) {
      console.error('macOS driver check failed:', error);
    }
  }

  async installDriver(driverId: string): Promise<boolean> {
    const driver = this.driverDatabase.get(driverId);
    if (!driver || !driver.installCommand) {
      console.error(`No installation command for driver: ${driverId}`);
      return false;
    }

    try {
      console.log(`Installing driver: ${driver.manufacturer} ${driver.model}`);
      
      if (process.platform === 'linux') {
        return await this.installLinuxDriver(driver);
      } else if (process.platform === 'win32') {
        return await this.installWindowsDriver(driver);
      } else {
        console.log('Driver installation not supported on this platform');
        return false;
      }
    } catch (error) {
      console.error(`Driver installation failed for ${driverId}:`, error);
      this.updateDriverStatus(driverId, 'error');
      return false;
    }
  }

  private async installLinuxDriver(driver: DriverInfo): Promise<boolean> {
    return new Promise((resolve) => {
      const child = spawn('bash', ['-c', driver.installCommand!], {
        stdio: 'pipe'
      });

      let output = '';
      child.stdout.on('data', (data) => {
        output += data.toString();
      });

      child.stderr.on('data', (data) => {
        output += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          console.log(`Driver installed successfully: ${driver.model}`);
          this.updateDriverStatus(this.getDriverId(driver), 'installed');
          resolve(true);
        } else {
          console.error(`Driver installation failed with code ${code}: ${output}`);
          this.updateDriverStatus(this.getDriverId(driver), 'error');
          resolve(false);
        }
      });
    });
  }

  private async installWindowsDriver(driver: DriverInfo): Promise<boolean> {
    // Windows driver installation would require specific installer executables
    console.log(`Windows driver installation for ${driver.model} requires manual installation`);
    return false;
  }

  async configureCUPSPrinter(printerName: string, deviceUri: string, driver: string): Promise<boolean> {
    if (process.platform !== 'linux') {
      console.log('CUPS configuration only supported on Linux');
      return false;
    }

    try {
      // Add printer to CUPS
      const addCommand = `lpadmin -p "${printerName}" -E -v "${deviceUri}" -m "${driver}"`;
      await execAsync(addCommand);

      // Enable printer
      const enableCommand = `cupsenable "${printerName}"`;
      await execAsync(enableCommand);

      // Accept jobs
      const acceptCommand = `cupsaccept "${printerName}"`;
      await execAsync(acceptCommand);

      console.log(`CUPS printer configured: ${printerName}`);
      return true;
    } catch (error) {
      console.error('CUPS configuration failed:', error);
      return false;
    }
  }

  async testPrinterSetup(printerName: string): Promise<boolean> {
    try {
      if (process.platform === 'linux') {
        // Test print via CUPS
        const testCommand = `echo "Test print from OrderFi Kitchen System" | lp -d "${printerName}"`;
        await execAsync(testCommand);
        return true;
      } else {
        console.log('Test printing not implemented for this platform');
        return false;
      }
    } catch (error) {
      console.error('Test print failed:', error);
      return false;
    }
  }

  getAvailableDrivers(): Map<string, DriverInfo> {
    return new Map(this.driverDatabase);
  }

  getDriverStatus(driverId: string): DriverInfo | undefined {
    return this.driverDatabase.get(driverId);
  }

  private updateDriverStatus(driverId: string, status: 'installed' | 'not_installed' | 'error') {
    const driver = this.driverDatabase.get(driverId);
    if (driver) {
      driver.status = status;
      this.driverDatabase.set(driverId, driver);
    }
  }

  private getDriverId(driver: DriverInfo): string {
    return `${driver.manufacturer.toLowerCase()}-${driver.model.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
  }

  // Generate printer PPD file for CUPS
  async generatePPDFile(manufacturer: string, model: string): Promise<string> {
    const ppdContent = `*PPD-Adobe: "4.3"
*FormatVersion: "4.3"
*FileVersion: "1.0"
*LanguageVersion: English
*LanguageEncoding: ISOLatin1
*PCFileName: "${model.replace(/[^A-Za-z0-9]/g, '')}.ppd"
*Manufacturer: "${manufacturer}"
*Product: "(${model})"
*ModelName: "${manufacturer} ${model}"
*ShortNickName: "${manufacturer} ${model}"
*NickName: "${manufacturer} ${model} Kitchen Printer"
*PSVersion: "(3010.000) 550"
*LanguageLevel: "3"
*ColorDevice: False
*DefaultColorSpace: Gray
*FileSystem: False
*Throughput: "8"
*LandscapeOrientation: Plus90
*TTRasterizer: Type42
*DefaultResolution: 203dpi
*Resolution 203dpi: "<< HWResolution [203 203] >> setpagedevice"

*OpenUI *PageSize/Media Size: PickOne
*DefaultPageSize: X80MMY200MM
*PageSize X80MMY200MM/80mm x Variable: "<< PageSize [226.77 566.93] ImagingBBox null >> setpagedevice"
*CloseUI: *PageSize

*OpenUI *PageRegion/Media Size: PickOne  
*DefaultPageRegion: X80MMY200MM
*PageRegion X80MMY200MM/80mm x Variable: "<< PageSize [226.77 566.93] ImagingBBox null >> setpagedevice"
*CloseUI: *PageRegion

*DefaultImageableArea: X80MMY200MM
*ImageableArea X80MMY200MM/80mm x Variable: "0.00 0.00 226.77 566.93"

*DefaultPaperDimension: X80MMY200MM
*PaperDimension X80MMY200MM/80mm x Variable: "226.77 566.93"

*% End of PPD file for ${manufacturer} ${model}`;

    const ppdPath = path.join('/tmp', `${manufacturer}-${model}.ppd`);
    await fs.writeFile(ppdPath, ppdContent);
    return ppdPath;
  }

  // Auto-detect and configure printer
  async autoConfigurePrinter(vendorId: string, productId: string, devicePath: string): Promise<boolean> {
    // Map vendor/product IDs to drivers
    const printerMap = new Map([
      ['04b8:0202', { manufacturer: 'Epson', model: 'TM-T88V', driver: 'epson-tm-t88v' }],
      ['04b8:0207', { manufacturer: 'Epson', model: 'TM-T88VI', driver: 'epson-tm-t88vi' }],
      ['0519:0001', { manufacturer: 'Star', model: 'TSP143', driver: 'star-tsp143' }],
      ['1504:0006', { manufacturer: 'Bixolon', model: 'SRP-350III', driver: 'bixolon-srp350' }]
    ]);

    const printerInfo = printerMap.get(`${vendorId}:${productId}`);
    if (!printerInfo) {
      console.log(`Unknown printer: ${vendorId}:${productId}`);
      return false;
    }

    try {
      // Install driver if needed
      const driverStatus = this.getDriverStatus(printerInfo.driver);
      if (driverStatus?.status !== 'installed') {
        const installed = await this.installDriver(printerInfo.driver);
        if (!installed) {
          return false;
        }
      }

      // Generate PPD file
      const ppdPath = await this.generatePPDFile(printerInfo.manufacturer, printerInfo.model);

      // Configure CUPS printer
      const printerName = `orderfi-${printerInfo.manufacturer.toLowerCase()}-${printerInfo.model.toLowerCase()}`;
      const deviceUri = `usb://${devicePath}`;
      
      const configured = await this.configureCUPSPrinter(printerName, deviceUri, ppdPath);
      return configured;
    } catch (error) {
      console.error('Auto-configuration failed:', error);
      return false;
    }
  }
}

export const printerDriverManager = new PrinterDriverManager();