import type { DistributionNode } from '@/types';

export const DISTRIBUTION_CENTERS: DistributionNode[] = [
  {
    id: 'dc-001',
    type: 'DC',
    name: 'Portland DC (HQ)',
    city: 'Portland',
    state: 'OR',
    lat: 45.5051,
    lng: -122.6750,
    capacity: {
      totalSqft: 450000,
      utilizationPct: 87,
      dailyOrderCapacity: 18000,
      peakCapacity: 28000,
    },
    coverage: 'Pacific NW + Mountain West',
    costs: {
      avgOutboundCostPerOrder: 6.80,
      fulfillmentCostPerOrder: 3.20,
    },
  },
  {
    id: 'dc-002',
    type: 'Regional_DC',
    name: 'Louisville DC',
    city: 'Louisville',
    state: 'KY',
    lat: 38.2527,
    lng: -85.7585,
    capacity: {
      totalSqft: 380000,
      utilizationPct: 82,
      dailyOrderCapacity: 15000,
      peakCapacity: 24000,
    },
    coverage: 'Central US + Southeast + Northeast',
    costs: {
      avgOutboundCostPerOrder: 7.40,
      fulfillmentCostPerOrder: 2.90,
    },
  },
  {
    id: 'dc-003',
    type: '3PL_Partner',
    name: '3PL - Rialto',
    city: 'Rialto',
    state: 'CA',
    lat: 34.1064,
    lng: -117.3703,
    capacity: {
      totalSqft: 220000,
      utilizationPct: 74,
      dailyOrderCapacity: 8000,
      peakCapacity: 14000,
    },
    coverage: 'Southwest + Southern California',
    costs: {
      avgOutboundCostPerOrder: 7.10,
      fulfillmentCostPerOrder: 3.50,
    },
  },
];
