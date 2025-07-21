import { Router } from 'express';
import type { Request, Response } from 'express';

const router = Router();

// Mock waitlist data - in production, this would be stored in database
let waitlistEntries: any[] = [
  {
    id: '1',
    customerName: 'Jessica Chen',
    phoneNumber: '(555) 123-4567',
    partySize: 4,
    joinedAt: new Date(Date.now() - 25 * 60000).toISOString(), // 25 minutes ago
    estimatedWait: 30,
    status: 'waiting',
    notes: 'Birthday celebration',
    position: 1
  },
  {
    id: '2',
    customerName: 'Michael Rodriguez',
    phoneNumber: '(555) 234-5678',
    partySize: 2,
    joinedAt: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
    estimatedWait: 20,
    status: 'notified',
    position: 2
  },
  {
    id: '3',
    customerName: 'Emily Johnson',
    phoneNumber: '(555) 345-6789',
    partySize: 6,
    joinedAt: new Date(Date.now() - 5 * 60000).toISOString(), // 5 minutes ago
    estimatedWait: 45,
    status: 'waiting',
    notes: 'High chair needed',
    position: 3
  }
];

let nextId = 4;

// Get all waitlist entries
router.get('/waitlist', (req: Request, res: Response) => {
  const sortedEntries = [...waitlistEntries]
    .filter(entry => entry.status !== 'seated' && entry.status !== 'cancelled')
    .sort((a, b) => new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime())
    .map((entry, index) => ({ ...entry, position: index + 1 }));
  
  res.json(sortedEntries);
});

// Add to waitlist
router.post('/waitlist', (req: Request, res: Response) => {
  const { customerName, phoneNumber, partySize, notes } = req.body;
  
  if (!customerName || !phoneNumber || !partySize) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Calculate estimated wait time based on party size and current waitlist
  const currentWaiting = waitlistEntries.filter(e => e.status === 'waiting' || e.status === 'notified').length;
  const baseWaitTime = Math.max(15, currentWaiting * 15); // 15 min base, +15 min per party
  const partySizeMultiplier = partySize > 4 ? 1.5 : 1; // Larger parties wait longer
  const estimatedWait = Math.round(baseWaitTime * partySizeMultiplier);

  const newEntry = {
    id: nextId.toString(),
    customerName,
    phoneNumber,
    partySize: parseInt(partySize),
    joinedAt: new Date().toISOString(),
    estimatedWait,
    status: 'waiting',
    notes: notes || '',
    position: waitlistEntries.filter(e => e.status === 'waiting' || e.status === 'notified').length + 1
  };

  waitlistEntries.push(newEntry);
  nextId++;

  res.status(201).json(newEntry);
});

// Update waitlist entry status
router.patch('/waitlist/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const entryIndex = waitlistEntries.findIndex(entry => entry.id === id);
  if (entryIndex === -1) {
    return res.status(404).json({ error: 'Waitlist entry not found' });
  }

  waitlistEntries[entryIndex].status = status;
  
  // If marking as seated, record the time
  if (status === 'seated') {
    waitlistEntries[entryIndex].seatedAt = new Date().toISOString();
  }

  res.json(waitlistEntries[entryIndex]);
});

// Send notification to waitlist entry
router.post('/waitlist/:id/notify', (req: Request, res: Response) => {
  const { id } = req.params;

  const entryIndex = waitlistEntries.findIndex(entry => entry.id === id);
  if (entryIndex === -1) {
    return res.status(404).json({ error: 'Waitlist entry not found' });
  }

  // In production, this would send an actual SMS
  console.log(`Sending SMS to ${waitlistEntries[entryIndex].phoneNumber}: Your table is ready!`);
  
  waitlistEntries[entryIndex].status = 'notified';
  waitlistEntries[entryIndex].notifiedAt = new Date().toISOString();

  res.json({ 
    message: 'Notification sent successfully',
    entry: waitlistEntries[entryIndex]
  });
});

// Remove from waitlist
router.delete('/waitlist/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  const entryIndex = waitlistEntries.findIndex(entry => entry.id === id);
  if (entryIndex === -1) {
    return res.status(404).json({ error: 'Waitlist entry not found' });
  }

  const removedEntry = waitlistEntries.splice(entryIndex, 1)[0];
  res.json({ message: 'Entry removed from waitlist', entry: removedEntry });
});

// Get waitlist statistics
router.get('/waitlist/stats', (req: Request, res: Response) => {
  const activeEntries = waitlistEntries.filter(e => e.status === 'waiting' || e.status === 'notified');
  const totalWaiting = activeEntries.length;
  const averageWaitTime = totalWaiting > 0 
    ? Math.round(activeEntries.reduce((acc, entry) => acc + entry.estimatedWait, 0) / totalWaiting)
    : 0;
  const notifiedCount = waitlistEntries.filter(e => e.status === 'notified').length;

  res.json({
    totalWaiting,
    averageWaitTime,
    notifiedCount,
    longestWaitTime: activeEntries.length > 0 
      ? Math.max(...activeEntries.map(e => {
          const joinedAt = new Date(e.joinedAt);
          const now = new Date();
          return Math.floor((now.getTime() - joinedAt.getTime()) / (1000 * 60));
        }))
      : 0
  });
});

export default router;