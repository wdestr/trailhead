import type { PipelineItem, Scenario } from '@/types';

export const PIPELINE_ITEMS: PipelineItem[] = [
  { id: 'pl-001', market: 'Denver-Aurora', state: 'CO', trailheadScore: 94, stage: 'loi', assignee: 'Sarah Chen', targetDate: '2026-04-15', notes: 'LOI submitted for Cherry Creek. Landlord reviewing.', property: 'Cherry Creek North 2B' },
  { id: 'pl-002', market: 'Salt Lake City', state: 'UT', trailheadScore: 91, stage: 'site_visit', assignee: 'Marcus Johnson', targetDate: '2026-03-20', notes: 'Site visit scheduled for City Creek Center.', property: 'City Creek Center L1' },
  { id: 'pl-003', market: 'Seattle-Bellevue', state: 'WA', trailheadScore: 90, stage: 'evaluation', assignee: 'Sarah Chen', targetDate: '2026-05-01', notes: 'Evaluating University Village vs. Bellevue Square.' },
  { id: 'pl-004', market: 'Minneapolis-St. Paul', state: 'MN', trailheadScore: 88, stage: 'negotiation', assignee: 'David Park', targetDate: '2026-03-30', notes: 'Rent negotiation underway. Asking $28/sf, targeting $24/sf.', property: 'North Loop Storefront' },
  { id: 'pl-005', market: 'Boise City', state: 'ID', trailheadScore: 87, stage: 'identified', assignee: 'Unassigned', targetDate: '2026-06-01', notes: 'High OAI and DDG. Need to identify specific properties.' },
  { id: 'pl-006', market: 'Raleigh-Cary', state: 'NC', trailheadScore: 86, stage: 'evaluation', assignee: 'Lisa Yamamoto', targetDate: '2026-04-30', notes: 'North Hills looks promising. Strong co-tenancy signals.' },
  { id: 'pl-007', market: 'Austin-Round Rock', state: 'TX', trailheadScore: 85, stage: 'identified', assignee: 'Marcus Johnson', targetDate: '2026-07-01', notes: 'Domain NORTHSIDE identified. High growth market.' },
  { id: 'pl-008', market: 'Nashville', state: 'TN', trailheadScore: 83, stage: 'site_visit', assignee: 'Lisa Yamamoto', targetDate: '2026-04-10', notes: '12South District visit planned. Tourism uplift strong.' },
  { id: 'pl-009', market: 'Charlotte-Concord', state: 'NC', trailheadScore: 82, stage: 'identified', assignee: 'Unassigned', targetDate: '2026-08-01', notes: 'SouthPark Mall has good demographics.' },
  { id: 'pl-010', market: 'Colorado Springs', state: 'CO', trailheadScore: 81, stage: 'identified', assignee: 'Unassigned', targetDate: '2026-09-01', notes: 'Proximity to Denver DC is a plus.' },
  { id: 'pl-011', market: 'San Diego-Carlsbad', state: 'CA', trailheadScore: 80, stage: 'evaluation', assignee: 'David Park', targetDate: '2026-05-15', notes: 'Existing Carlsbad factory store — evaluating inline.' },
  { id: 'pl-012', market: 'Bend-Redmond', state: 'OR', trailheadScore: 84, stage: 'loi', assignee: 'Sarah Chen', targetDate: '2026-03-25', notes: 'Small market but highest OAI in pipeline. LOI at Old Mill District.' },
];

export const PIPELINE_STAGES = [
  { id: 'identified', label: 'Identified', color: '#94A3B8' },
  { id: 'evaluation', label: 'Under Evaluation', color: '#3B82F6' },
  { id: 'site_visit', label: 'Site Visit', color: '#8B5CF6' },
  { id: 'loi', label: 'LOI Submitted', color: '#F59E0B' },
  { id: 'negotiation', label: 'Negotiation', color: '#FF6F00' },
  { id: 'signed', label: 'Lease Signed', color: '#22C55E' },
  { id: 'buildout', label: 'Buildout', color: '#06B6D4' },
  { id: 'opened', label: 'Store Opened', color: '#10B981' },
] as const;

export const SCENARIOS: Scenario[] = [
  {
    id: 'competitor-entry', name: 'Competitor Entry', icon: 'Swords',
    description: 'Model impact of competitor store openings in target markets',
    params: [
      { id: 'competitor', label: 'Competitor', type: 'select', value: 0, options: [{ label: 'The North Face', value: 0 }, { label: 'Patagonia', value: 1 }, { label: "Arc'teryx", value: 2 }, { label: 'REI Co-op', value: 3 }] },
      { id: 'storeCount', label: 'New Stores', type: 'slider', min: 1, max: 20, step: 1, value: 10 },
      { id: 'region', label: 'Region', type: 'select', value: 0, options: [{ label: 'Mountain West', value: 0 }, { label: 'Southeast', value: 1 }, { label: 'Nationwide', value: 2 }] },
    ],
  },
  {
    id: 'economic-downturn', name: 'Economic Downturn', icon: 'TrendingDown',
    description: 'How do market rankings change with income decline?',
    params: [
      { id: 'incomeDecline', label: 'Income Decline', type: 'slider', min: 5, max: 30, step: 5, value: 15, unit: '%' },
      { id: 'trafficDecline', label: 'Traffic Decline', type: 'slider', min: 5, max: 25, step: 5, value: 10, unit: '%' },
    ],
  },
  {
    id: 'dc-expansion', name: 'DC Expansion', icon: 'Warehouse',
    description: 'Impact of adding a new distribution center',
    params: [
      { id: 'location', label: 'New DC Location', type: 'select', value: 0, options: [{ label: 'Atlanta, GA', value: 0 }, { label: 'Dallas, TX', value: 1 }, { label: 'Denver, CO', value: 2 }, { label: 'Charlotte, NC', value: 3 }] },
      { id: 'capacity', label: 'Daily Order Capacity', type: 'slider', min: 5000, max: 20000, step: 1000, value: 12000 },
    ],
  },
  {
    id: 'channel-shift', name: 'Channel Shift', icon: 'ArrowLeftRight',
    description: 'Model e-commerce growth vs retail contraction',
    params: [
      { id: 'ecomGrowth', label: 'E-commerce Growth', type: 'slider', min: 5, max: 40, step: 5, value: 20, unit: '%' },
      { id: 'retailChange', label: 'Retail Change', type: 'slider', min: -20, max: 10, step: 5, value: -5, unit: '%' },
    ],
  },
  {
    id: 'portfolio-optimization', name: 'Portfolio Optimization', icon: 'Settings2',
    description: 'Close underperformers, redeploy capital to top markets',
    params: [
      { id: 'closures', label: 'Stores to Close', type: 'slider', min: 1, max: 10, step: 1, value: 5 },
      { id: 'reinvestPct', label: 'Capital Reinvested', type: 'slider', min: 50, max: 100, step: 10, value: 80, unit: '%' },
    ],
  },
];
