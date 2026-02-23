export interface ColumbiaStore {
  id: string;
  brand: 'Columbia' | 'SOREL' | 'Mountain Hardwear' | 'prAna';
  name: string;
  format: 'Flagship' | 'Factory/Outlet' | 'Inline' | 'Street Retail' | 'Lifestyle Center';
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    lat: number;
    lng: number;
  };
  sqft: number;
  openDate: string;
  performance: {
    annualRevenue: number;
    revenuePerSF: number;
    yoyGrowth: number;
    transactions: number;
    averageTicket: number;
    conversionRate: number;
    footTraffic: number;
  };
  fulfillment: {
    shipFromStoreEnabled: boolean;
    bopisEnabled: boolean;
    monthlyShipFromStoreOrders: number;
    monthlyBopisOrders: number;
    nearestDC: string;
    distanceToDC: number;
  };
}

export interface CompetitorStore {
  id: string;
  brand: string;
  name: string;
  address: {
    city: string;
    state: string;
    lat: number;
    lng: number;
  };
  format: string;
  estSqft: number;
}

export interface RetailPartner {
  id: string;
  retailer: string;
  name: string;
  address: {
    city: string;
    state: string;
    lat: number;
    lng: number;
  };
  type: 'Outdoor Specialty' | 'Sporting Goods' | 'Department Store' | 'General Retail';
  carriesColumbia: boolean;
}

export interface Competitor {
  name: string;
  stores: number;
  color: string;
  locations: CompetitorStore[];
}

export interface DistributionNode {
  id: string;
  type: 'DC' | 'Regional_DC' | '3PL_Partner';
  name: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  capacity: {
    totalSqft: number;
    utilizationPct: number;
    dailyOrderCapacity: number;
    peakCapacity: number;
  };
  coverage: string;
  costs: {
    avgOutboundCostPerOrder: number;
    fulfillmentCostPerOrder: number;
  };
}

export interface MarketRetailScores {
  demo: number;
  income: number;
  lifestyle: number;
  ddg: number;
  comp: number;
  traffic: number;
}

export interface MarketSCScores {
  tcts: number;
  speed: number;
  returns: number;
  dcProx: number;
  invVel: number;
}

export interface MarketStratScores {
  re: number;
  climate: number;
  tourism: number;
  preempt: number;
}

export interface Market {
  rank: number;
  name: string;
  state: string;
  lat: number;
  lng: number;
  trailheadScore: number;
  retail: MarketRetailScores;
  sc: MarketSCScores;
  strat: MarketStratScores;
  pop: string;
  hhi: string;
  growth: string;
  oai: number;
  tctsDelta: string;
  scSavings: string;
  properties: number;
  rent: string;
  carbonImpact: string;
  ecomOrders: number;
  currentTCTS: number;
  projectedTCTS: number;
  fulfillment: {
    sfsOrders: number;
    sfsSavingsPerOrder: number;
    bopisOrders: number;
    bopisSavingsPerOrder: number;
    returnsOrders: number;
    returnsSavingsPerOrder: number;
    inventoryProximitySavings: number;
  };
}

export interface Property {
  id: string;
  name: string;
  market: string;
  address: string;
  sqft: number;
  rent: number;
  siteScore: number;
  coTenancy: string;
  available: string;
  tctsBenefit: string;
  format: 'Inline' | 'Flagship' | 'Factory/Outlet' | 'Lifestyle Center' | 'Street Retail';
  visibility: number;
  parkingSpaces: number;
  frontage: string;
  proForma: ProForma;
}

export interface ProForma {
  buildoutCostPerSF: number;
  totalBuildout: number;
  annualRent: number;
  annualCAM: number;
  fteCount: number;
  annualLaborCost: number;
  annualOtherOpex: number;
  revenueProjection: number[];
  compStoreGrowthRate: number;
  supplyChainSavings: {
    shipFromStore: number;
    bopis: number;
    returnsProcessing: number;
    total: number;
  };
  fourWallContribution: number;
  fourWallWithSC: number;
  paybackPeriod: number;
  paybackWithSC: number;
  fiveYearNPV: number;
  fiveYearIRR: number;
}

export interface DataLayer {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export interface ScoringWeights {
  retail: number;
  supplyChain: number;
  strategic: number;
  retailSub: {
    demo: number;
    income: number;
    lifestyle: number;
    ddg: number;
    comp: number;
    traffic: number;
  };
  scSub: {
    tcts: number;
    speed: number;
    returns: number;
    dcProx: number;
    invVel: number;
  };
  stratSub: {
    re: number;
    climate: number;
    tourism: number;
    preempt: number;
  };
}

export interface PipelineItem {
  id: string;
  market: string;
  state: string;
  trailheadScore: number;
  stage: PipelineStage;
  assignee: string;
  targetDate: string;
  notes: string;
  property?: string;
}

export type PipelineStage =
  | 'identified'
  | 'evaluation'
  | 'site_visit'
  | 'loi'
  | 'negotiation'
  | 'signed'
  | 'buildout'
  | 'opened';

export interface Scenario {
  id: string;
  name: string;
  description: string;
  icon: string;
  params: ScenarioParam[];
}

export interface ScenarioParam {
  id: string;
  label: string;
  type: 'slider' | 'select';
  min?: number;
  max?: number;
  step?: number;
  value: number;
  unit?: string;
  options?: { label: string; value: number }[];
}

export type ViewMode = 'map' | 'dashboard' | 'pipeline' | 'scenarios';
