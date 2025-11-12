// Interaction tracking service
// Stores all customer interactions in localStorage

export interface Interaction {
  id: string;
  customerId: number;
  customerName: string;
  type: 'view' | 'chat' | 'edit' | 'note';
  timestamp: string;
  details?: string;
  duration?: number; // in seconds
}

export interface CustomerStats {
  customerId: number;
  totalInteractions: number;
  lastViewed?: string;
  lastChatted?: string;
  viewCount: number;
  chatCount: number;
  totalChatDuration?: number;
  firstInteraction?: string;
}

const STORAGE_KEY = 'customer_interactions';
const STATS_KEY = 'customer_stats';

// Get all interactions
export const getInteractions = (): Interaction[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading interactions:', error);
    return [];
  }
};

// Get interactions for a specific customer
export const getCustomerInteractions = (customerId: number): Interaction[] => {
  const allInteractions = getInteractions();
  return allInteractions
    .filter(i => i.customerId === customerId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Get recent interactions (last N)
export const getRecentInteractions = (limit: number = 10): Interaction[] => {
  const allInteractions = getInteractions();
  return allInteractions
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
};

// Add a new interaction
export const addInteraction = (
  customerId: number,
  customerName: string,
  type: Interaction['type'],
  details?: string,
  duration?: number
): void => {
  const interactions = getInteractions();
  
  const newInteraction: Interaction = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    customerId,
    customerName,
    type,
    timestamp: new Date().toISOString(),
    details,
    duration
  };

  interactions.push(newInteraction);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(interactions));

  // Update stats
  updateCustomerStats(customerId, type, duration);
};

// Get customer stats
export const getCustomerStats = (customerId: number): CustomerStats | null => {
  try {
    const stored = localStorage.getItem(STATS_KEY);
    const allStats: { [key: number]: CustomerStats } = stored ? JSON.parse(stored) : {};
    return allStats[customerId] || null;
  } catch (error) {
    console.error('Error reading stats:', error);
    return null;
  }
};

// Get all customer stats
export const getAllCustomerStats = (): { [key: number]: CustomerStats } => {
  try {
    const stored = localStorage.getItem(STATS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error reading all stats:', error);
    return {};
  }
};

// Update customer stats
const updateCustomerStats = (
  customerId: number,
  type: Interaction['type'],
  duration?: number
): void => {
  const allStats = getAllCustomerStats();
  const existing = allStats[customerId] || {
    customerId,
    totalInteractions: 0,
    viewCount: 0,
    chatCount: 0,
    totalChatDuration: 0
  };

  existing.totalInteractions++;
  
  const now = new Date().toISOString();
  
  if (!existing.firstInteraction) {
    existing.firstInteraction = now;
  }

  if (type === 'view') {
    existing.viewCount++;
    existing.lastViewed = now;
  } else if (type === 'chat') {
    existing.chatCount++;
    existing.lastChatted = now;
    if (duration) {
      existing.totalChatDuration = (existing.totalChatDuration || 0) + duration;
    }
  }

  allStats[customerId] = existing;
  localStorage.setItem(STATS_KEY, JSON.stringify(allStats));
};

// Format time ago
export const formatTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return past.toLocaleDateString();
};

// Clear all interactions (for testing)
export const clearAllInteractions = (): void => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STATS_KEY);
};

// Get interaction icon
export const getInteractionIcon = (type: Interaction['type']): string => {
  switch (type) {
    case 'view': return '👁️';
    case 'chat': return '💬';
    case 'edit': return '✏️';
    case 'note': return '📝';
    default: return '📌';
  }
};

// Get interaction color
export const getInteractionColor = (type: Interaction['type']): string => {
  switch (type) {
    case 'view': return 'text-blue-600 dark:text-blue-400';
    case 'chat': return 'text-green-600 dark:text-green-400';
    case 'edit': return 'text-orange-600 dark:text-orange-400';
    case 'note': return 'text-purple-600 dark:text-purple-400';
    default: return 'text-gray-600 dark:text-gray-400';
  }
};