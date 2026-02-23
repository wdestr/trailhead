import type { DataLayer } from '@/types';

export const DATA_LAYERS: DataLayer[] = [
  { id: 'demo', label: 'Demographics', icon: 'Users', color: '#3B82F6' },
  { id: 'income', label: 'Household Income', icon: 'DollarSign', color: '#22C55E' },
  { id: 'lifestyle', label: 'Outdoor Lifestyle', icon: 'Mountain', color: '#A855F7' },
  { id: 'ddg', label: 'Digital Demand Gap', icon: 'Package', color: '#06B6D4' },
  { id: 'competitors', label: 'Competitor Density', icon: 'Swords', color: '#EF4444' },
  { id: 'traffic', label: 'Foot Traffic', icon: 'Footprints', color: '#FF6F00' },
  { id: 'realestate', label: 'Real Estate', icon: 'Building2', color: '#EAB308' },
  { id: 'supply', label: 'Supply Chain Network', icon: 'Truck', color: '#10B981' },
  { id: 'tcts', label: 'Cost-to-Serve', icon: 'CircleDollarSign', color: '#F472B6' },
  { id: 'climate', label: 'Climate/Season', icon: 'CloudSun', color: '#94A3B8' },
  { id: 'retailers', label: 'Retail Partners', icon: 'ShoppingBag', color: '#2E7D32' },
];
