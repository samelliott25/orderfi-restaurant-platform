/**
 * OrderFi Figma Integration System
 * Comprehensive design system synchronization with Figma API
 */

import { Request, Response } from 'express';

interface FigmaDesignToken {
  name: string;
  type: 'color' | 'typography' | 'spacing' | 'sizing' | 'effect' | 'motion';
  value: string;
  mode?: string;
  description?: string;
}

interface FigmaComponent {
  id: string;
  name: string;
  description: string;
  type: string;
  properties: Record<string, any>;
  variants?: any[];
}

interface FigmaStyle {
  key: string;
  name: string;
  styleType: 'FILL' | 'TEXT' | 'EFFECT' | 'GRID';
  description: string;
  props: Record<string, any>;
}

export class FigmaIntegration {
  private token: string;
  private baseURL = 'https://api.figma.com/v1';

  constructor(token: string) {
    this.token = token;
  }

  private async makeRequest(endpoint: string) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        'X-FIGMA-TOKEN': this.token,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Figma API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get file content and extract design system components
   */
  async getDesignSystemComponents(fileKey: string): Promise<{
    components: FigmaComponent[];
    styles: FigmaStyle[];
    tokens: FigmaDesignToken[];
  }> {
    try {
      // Get file content
      const fileData = await this.makeRequest(`/files/${fileKey}`);
      
      // Get styles
      const stylesData = await this.makeRequest(`/files/${fileKey}/styles`);

      // Extract components from file structure
      const components = this.extractComponents(fileData.document);
      
      // Extract styles
      const styles = this.extractStyles(stylesData.meta?.styles || []);
      
      // Extract design tokens from variables (if available)
      let tokens: FigmaDesignToken[] = [];
      try {
        const variablesData = await this.makeRequest(`/files/${fileKey}/variables/local`);
        tokens = this.extractTokens(variablesData.meta?.variables || []);
      } catch (error) {
        console.log('Variables not available (requires Enterprise plan)');
      }

      return { components, styles, tokens };
    } catch (error) {
      console.error('Error fetching Figma design system:', error);
      throw error;
    }
  }

  /**
   * Extract components from Figma file structure
   */
  private extractComponents(document: any): FigmaComponent[] {
    const components: FigmaComponent[] = [];
    
    const traverse = (node: any) => {
      if (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') {
        components.push({
          id: node.id,
          name: node.name,
          description: node.description || '',
          type: node.type,
          properties: this.extractComponentProperties(node),
          variants: node.type === 'COMPONENT_SET' ? node.children : undefined
        });
      }
      
      if (node.children) {
        node.children.forEach(traverse);
      }
    };

    traverse(document);
    return components;
  }

  /**
   * Extract component properties
   */
  private extractComponentProperties(node: any): Record<string, any> {
    return {
      width: node.absoluteBoundingBox?.width,
      height: node.absoluteBoundingBox?.height,
      fills: node.fills,
      strokes: node.strokes,
      effects: node.effects,
      cornerRadius: node.cornerRadius,
      constraints: node.constraints,
      layoutMode: node.layoutMode,
      paddingLeft: node.paddingLeft,
      paddingRight: node.paddingRight,
      paddingTop: node.paddingTop,
      paddingBottom: node.paddingBottom,
      itemSpacing: node.itemSpacing
    };
  }

  /**
   * Extract styles from Figma
   */
  private extractStyles(styles: any[]): FigmaStyle[] {
    return styles.map(style => ({
      key: style.key,
      name: style.name,
      styleType: style.styleType,
      description: style.description || '',
      props: style.props || {}
    }));
  }

  /**
   * Extract design tokens from variables
   */
  private extractTokens(variables: any[]): FigmaDesignToken[] {
    return variables.map(variable => ({
      name: variable.name,
      type: this.mapVariableType(variable.resolvedType),
      value: this.extractVariableValue(variable),
      mode: variable.mode,
      description: variable.description || ''
    }));
  }

  private mapVariableType(resolvedType: string): FigmaDesignToken['type'] {
    switch (resolvedType) {
      case 'COLOR': return 'color';
      case 'FLOAT': return 'spacing';
      case 'STRING': return 'typography';
      default: return 'sizing';
    }
  }

  private extractVariableValue(variable: any): string {
    // Extract value based on variable type
    if (variable.valuesByMode) {
      const firstMode = Object.keys(variable.valuesByMode)[0];
      return variable.valuesByMode[firstMode];
    }
    return variable.value || '';
  }

  /**
   * Convert Figma design tokens to OrderFi CSS
   */
  generateOrderFiCSS(tokens: FigmaDesignToken[]): string {
    let css = '/* OrderFi Design Tokens - Auto-generated from Figma */\n:root {\n';

    tokens.forEach(token => {
      const cssVar = `--orderfi-${token.name.toLowerCase().replace(/\s+/g, '-')}`;
      css += `  ${cssVar}: ${token.value};\n`;
    });

    css += '}\n\n';

    // Add dark mode variants if available
    const darkTokens = tokens.filter(t => t.mode === 'dark');
    if (darkTokens.length > 0) {
      css += '.dark {\n';
      darkTokens.forEach(token => {
        const cssVar = `--orderfi-${token.name.toLowerCase().replace(/\s+/g, '-')}`;
        css += `  ${cssVar}: ${token.value};\n`;
      });
      css += '}\n';
    }

    return css;
  }

  /**
   * Generate TypeScript interfaces from Figma components
   */
  generateTypeScriptInterfaces(components: FigmaComponent[]): string {
    let interfaces = '// OrderFi Component Interfaces - Auto-generated from Figma\n\n';

    components.forEach(component => {
      const interfaceName = `${component.name.replace(/\s+/g, '')}Props`;
      interfaces += `export interface ${interfaceName} {\n`;
      
      // Add component properties
      Object.entries(component.properties).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          const type = typeof value === 'number' ? 'number' : 'string';
          interfaces += `  ${key}?: ${type};\n`;
        }
      });

      // Add variants if available
      if (component.variants) {
        interfaces += `  variant?: ${component.variants.map(v => `'${v.name}'`).join(' | ')};\n`;
      }

      interfaces += '}\n\n';
    });

    return interfaces;
  }

  /**
   * Export component images as SVG
   */
  async exportComponentImages(fileKey: string, componentIds: string[]): Promise<Record<string, string>> {
    const nodeIds = componentIds.join(',');
    const response = await this.makeRequest(`/images/${fileKey}?ids=${nodeIds}&format=svg`);
    return response.images || {};
  }
}

// API Routes
export const figmaRoutes = {
  // Sync design system from Figma
  syncDesignSystem: async (req: Request, res: Response) => {
    try {
      const { fileKey, token } = req.body;
      
      if (!fileKey || !token) {
        return res.status(400).json({ error: 'Missing fileKey or token' });
      }

      const figma = new FigmaIntegration(token);
      const designSystem = await figma.getDesignSystemComponents(fileKey);
      
      // Generate CSS and TypeScript files
      const css = figma.generateOrderFiCSS(designSystem.tokens);
      const interfaces = figma.generateTypeScriptInterfaces(designSystem.components);

      res.json({
        success: true,
        designSystem,
        generatedCSS: css,
        generatedInterfaces: interfaces,
        summary: {
          components: designSystem.components.length,
          styles: designSystem.styles.length,
          tokens: designSystem.tokens.length
        }
      });
    } catch (error) {
      console.error('Figma sync error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Get file info
  getFileInfo: async (req: Request, res: Response) => {
    try {
      const { fileKey } = req.params;
      const token = req.headers['x-figma-token'] as string;
      
      if (!token) {
        return res.status(401).json({ error: 'Missing Figma token' });
      }

      const figma = new FigmaIntegration(token);
      const fileData = await figma.makeRequest(`/files/${fileKey}`);
      
      res.json({
        name: fileData.name,
        lastModified: fileData.lastModified,
        version: fileData.version,
        thumbnailUrl: fileData.thumbnailUrl,
        components: fileData.components || {}
      });
    } catch (error) {
      console.error('Get file info error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Export components as images
  exportImages: async (req: Request, res: Response) => {
    try {
      const { fileKey } = req.params;
      const { componentIds } = req.body;
      const token = req.headers['x-figma-token'] as string;
      
      if (!token) {
        return res.status(401).json({ error: 'Missing Figma token' });
      }

      const figma = new FigmaIntegration(token);
      const images = await figma.exportComponentImages(fileKey, componentIds);
      
      res.json({ images });
    } catch (error) {
      console.error('Export images error:', error);
      res.status(500).json({ error: error.message });
    }
  }
};