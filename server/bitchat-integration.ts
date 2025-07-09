import { EventEmitter } from 'events';
import WebSocket from 'ws';

// BitChat Protocol Types
export interface BitChatMessage {
  id: string;
  type: 'message' | 'private_message' | 'channel_join' | 'channel_leave' | 'peer_discovery';
  sender: string;
  recipient?: string;
  channel?: string;
  content: string;
  timestamp: number;
  ttl: number;
  encrypted?: boolean;
  signature?: string;
}

export interface BitChatPeer {
  id: string;
  nickname: string;
  publicKey: string;
  lastSeen: number;
  rssi?: number;
  connectionType: 'bluetooth' | 'wifi' | 'websocket';
  channels: string[];
}

export interface BitChatChannel {
  name: string;
  owner: string;
  passwordProtected: boolean;
  messageRetention: boolean;
  memberCount: number;
  lastActivity: number;
}

// BitChat Network Adapter for Restaurant System
export class BitChatNetworkAdapter extends EventEmitter {
  private peers: Map<string, BitChatPeer> = new Map();
  private channels: Map<string, BitChatChannel> = new Map();
  private messageCache: Map<string, BitChatMessage> = new Map();
  private webSocketServer?: WebSocket.Server;
  private isRunning = false;
  
  constructor(private port: number = 8080) {
    super();
    this.initializeDefaultChannels();
  }

  private initializeDefaultChannels() {
    // Create default restaurant channels
    this.channels.set('#kitchen', {
      name: '#kitchen',
      owner: 'system',
      passwordProtected: false,
      messageRetention: true,
      memberCount: 0,
      lastActivity: Date.now()
    });

    this.channels.set('#orders', {
      name: '#orders',
      owner: 'system',
      passwordProtected: false,
      messageRetention: true,
      memberCount: 0,
      lastActivity: Date.now()
    });

    this.channels.set('#staff', {
      name: '#staff',
      owner: 'system',
      passwordProtected: true,
      messageRetention: false,
      memberCount: 0,
      lastActivity: Date.now()
    });

    this.channels.set('#management', {
      name: '#management',
      owner: 'system',
      passwordProtected: true,
      messageRetention: true,
      memberCount: 0,
      lastActivity: Date.now()
    });
  }

  async start(): Promise<void> {
    if (this.isRunning) return;

    try {
      // Initialize WebSocket server for web-based BitChat bridge
      this.webSocketServer = new WebSocket.Server({ port: this.port });
      
      this.webSocketServer.on('connection', (ws) => {
        console.log('New BitChat peer connected via WebSocket');
        this.handleWebSocketConnection(ws);
      });

      this.isRunning = true;
      console.log(`BitChat network adapter started on port ${this.port}`);
      
      // Start peer discovery simulation
      this.startPeerDiscovery();
      
    } catch (error) {
      console.error('Failed to start BitChat network adapter:', error);
      throw error;
    }
  }

  private handleWebSocketConnection(ws: WebSocket) {
    const peerId = this.generatePeerId();
    
    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString()) as BitChatMessage;
        this.processMessage(message, peerId);
      } catch (error) {
        console.error('Invalid BitChat message:', error);
      }
    });

    ws.on('close', () => {
      this.removePeer(peerId);
    });

    // Send initial peer discovery
    this.sendPeerDiscovery(ws);
  }

  private processMessage(message: BitChatMessage, fromPeerId: string): void {
    // Validate message structure
    if (!this.validateMessage(message)) {
      console.error('Invalid BitChat message structure');
      return;
    }

    // Check TTL
    if (message.ttl <= 0) {
      console.log('Message TTL expired, dropping');
      return;
    }

    // Check for duplicates
    if (this.messageCache.has(message.id)) {
      console.log('Duplicate message detected, dropping');
      return;
    }

    // Cache message
    this.messageCache.set(message.id, message);

    // Process based on message type
    switch (message.type) {
      case 'message':
        this.handleChannelMessage(message);
        break;
      case 'private_message':
        this.handlePrivateMessage(message);
        break;
      case 'channel_join':
        this.handleChannelJoin(message);
        break;
      case 'channel_leave':
        this.handleChannelLeave(message);
        break;
      case 'peer_discovery':
        this.handlePeerDiscovery(message, fromPeerId);
        break;
    }

    // Relay message to other peers (TTL-based routing)
    this.relayMessage(message, fromPeerId);
  }

  private handleChannelMessage(message: BitChatMessage): void {
    if (!message.channel) return;

    const channel = this.channels.get(message.channel);
    if (!channel) return;

    // Update channel activity
    channel.lastActivity = Date.now();

    // Emit to restaurant system
    this.emit('channel_message', {
      channel: message.channel,
      sender: message.sender,
      content: message.content,
      timestamp: message.timestamp
    });

    // Store for retention if enabled
    if (channel.messageRetention) {
      this.storeMessage(message);
    }
  }

  private handlePrivateMessage(message: BitChatMessage): void {
    // Emit to restaurant system
    this.emit('private_message', {
      sender: message.sender,
      recipient: message.recipient,
      content: message.content,
      timestamp: message.timestamp
    });
  }

  private handleChannelJoin(message: BitChatMessage): void {
    if (!message.channel) return;

    const channel = this.channels.get(message.channel);
    if (channel) {
      channel.memberCount++;
      channel.lastActivity = Date.now();
    }

    this.emit('channel_join', {
      channel: message.channel,
      user: message.sender,
      timestamp: message.timestamp
    });
  }

  private handleChannelLeave(message: BitChatMessage): void {
    if (!message.channel) return;

    const channel = this.channels.get(message.channel);
    if (channel && channel.memberCount > 0) {
      channel.memberCount--;
      channel.lastActivity = Date.now();
    }

    this.emit('channel_leave', {
      channel: message.channel,
      user: message.sender,
      timestamp: message.timestamp
    });
  }

  private handlePeerDiscovery(message: BitChatMessage, fromPeerId: string): void {
    // Update peer information
    const peer: BitChatPeer = {
      id: fromPeerId,
      nickname: message.sender,
      publicKey: message.content, // Public key in discovery message
      lastSeen: Date.now(),
      connectionType: 'websocket',
      channels: []
    };

    this.peers.set(fromPeerId, peer);
    
    this.emit('peer_discovered', peer);
  }

  private relayMessage(message: BitChatMessage, fromPeerId: string): void {
    // Decrement TTL
    const relayMessage = { ...message, ttl: message.ttl - 1 };

    // Don't relay if TTL is 0
    if (relayMessage.ttl <= 0) return;

    // Broadcast to all connected peers except sender
    if (this.webSocketServer) {
      this.webSocketServer.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(relayMessage));
        }
      });
    }
  }

  private validateMessage(message: BitChatMessage): boolean {
    return !!(
      message.id &&
      message.type &&
      message.sender &&
      message.content &&
      message.timestamp &&
      typeof message.ttl === 'number'
    );
  }

  private storeMessage(message: BitChatMessage): void {
    // Store in memory cache (in production, use database)
    this.messageCache.set(message.id, message);
  }

  private sendPeerDiscovery(ws: WebSocket): void {
    const discoveryMessage: BitChatMessage = {
      id: this.generateMessageId(),
      type: 'peer_discovery',
      sender: 'restaurant-system',
      content: 'public-key-placeholder', // In production, use actual public key
      timestamp: Date.now(),
      ttl: 7
    };

    ws.send(JSON.stringify(discoveryMessage));
  }

  private startPeerDiscovery(): void {
    // Simulate peer discovery every 30 seconds
    setInterval(() => {
      if (this.webSocketServer) {
        this.webSocketServer.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            this.sendPeerDiscovery(client);
          }
        });
      }
    }, 30000);
  }

  private generatePeerId(): string {
    return `peer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private removePeer(peerId: string): void {
    this.peers.delete(peerId);
    this.emit('peer_disconnected', peerId);
  }

  // Public API methods
  public sendChannelMessage(channel: string, sender: string, content: string): void {
    const message: BitChatMessage = {
      id: this.generateMessageId(),
      type: 'message',
      sender,
      channel,
      content,
      timestamp: Date.now(),
      ttl: 7
    };

    this.broadcastMessage(message);
  }

  public sendPrivateMessage(sender: string, recipient: string, content: string): void {
    const message: BitChatMessage = {
      id: this.generateMessageId(),
      type: 'private_message',
      sender,
      recipient,
      content,
      timestamp: Date.now(),
      ttl: 7
    };

    this.broadcastMessage(message);
  }

  public joinChannel(user: string, channel: string): void {
    const message: BitChatMessage = {
      id: this.generateMessageId(),
      type: 'channel_join',
      sender: user,
      channel,
      content: `${user} joined ${channel}`,
      timestamp: Date.now(),
      ttl: 7
    };

    this.broadcastMessage(message);
  }

  public leaveChannel(user: string, channel: string): void {
    const message: BitChatMessage = {
      id: this.generateMessageId(),
      type: 'channel_leave',
      sender: user,
      channel,
      content: `${user} left ${channel}`,
      timestamp: Date.now(),
      ttl: 7
    };

    this.broadcastMessage(message);
  }

  private broadcastMessage(message: BitChatMessage): void {
    if (this.webSocketServer) {
      this.webSocketServer.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message));
        }
      });
    }
  }

  public getChannels(): BitChatChannel[] {
    return Array.from(this.channels.values());
  }

  public getPeers(): BitChatPeer[] {
    return Array.from(this.peers.values());
  }

  public getChannelMessages(channel: string): BitChatMessage[] {
    return Array.from(this.messageCache.values()).filter(
      msg => msg.channel === channel
    );
  }

  public stop(): void {
    if (this.webSocketServer) {
      this.webSocketServer.close();
    }
    this.isRunning = false;
    console.log('BitChat network adapter stopped');
  }
}

// Export singleton instance
export const bitChatAdapter = new BitChatNetworkAdapter();