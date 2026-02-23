import type { Competitor } from '@/types';

export const COMPETITORS: Competitor[] = [
  {
    name: 'The North Face', stores: 142, color: '#E53935',
    locations: [
      { id: 'tnf-1', brand: 'The North Face', name: 'TNF Denver', address: { city: 'Denver', state: 'CO', lat: 39.7478, lng: -104.9995 }, format: 'Inline', estSqft: 5200 },
      { id: 'tnf-2', brand: 'The North Face', name: 'TNF Chicago', address: { city: 'Chicago', state: 'IL', lat: 41.8950, lng: -87.6230 }, format: 'Flagship', estSqft: 8400 },
      { id: 'tnf-3', brand: 'The North Face', name: 'TNF San Francisco', address: { city: 'San Francisco', state: 'CA', lat: 37.7879, lng: -122.4074 }, format: 'Inline', estSqft: 4800 },
      { id: 'tnf-4', brand: 'The North Face', name: 'TNF Seattle', address: { city: 'Seattle', state: 'WA', lat: 47.6101, lng: -122.3420 }, format: 'Inline', estSqft: 4200 },
      { id: 'tnf-5', brand: 'The North Face', name: 'TNF SLC', address: { city: 'Salt Lake City', state: 'UT', lat: 40.7580, lng: -111.8760 }, format: 'Inline', estSqft: 3800 },
      { id: 'tnf-6', brand: 'The North Face', name: 'TNF NYC', address: { city: 'New York', state: 'NY', lat: 40.7213, lng: -73.9970 }, format: 'Flagship', estSqft: 9200 },
      { id: 'tnf-7', brand: 'The North Face', name: 'TNF Minneapolis', address: { city: 'Minneapolis', state: 'MN', lat: 44.9740, lng: -93.2740 }, format: 'Inline', estSqft: 4600 },
    ],
  },
  {
    name: 'Patagonia', stores: 72, color: '#7B1FA2',
    locations: [
      { id: 'pat-1', brand: 'Patagonia', name: 'Patagonia Denver', address: { city: 'Denver', state: 'CO', lat: 39.7530, lng: -104.9990 }, format: 'Inline', estSqft: 4400 },
      { id: 'pat-2', brand: 'Patagonia', name: 'Patagonia Portland', address: { city: 'Portland', state: 'OR', lat: 45.5220, lng: -122.6820 }, format: 'Inline', estSqft: 3800 },
      { id: 'pat-3', brand: 'Patagonia', name: 'Patagonia Ventura', address: { city: 'Ventura', state: 'CA', lat: 34.2747, lng: -119.2290 }, format: 'Flagship', estSqft: 6200 },
      { id: 'pat-4', brand: 'Patagonia', name: 'Patagonia Boulder', address: { city: 'Boulder', state: 'CO', lat: 40.0150, lng: -105.2705 }, format: 'Inline', estSqft: 3600 },
      { id: 'pat-5', brand: 'Patagonia', name: 'Patagonia SLC', address: { city: 'Salt Lake City', state: 'UT', lat: 40.7620, lng: -111.8930 }, format: 'Inline', estSqft: 3400 },
    ],
  },
  {
    name: "Arc'teryx", stores: 48, color: '#FF8F00',
    locations: [
      { id: 'arc-1', brand: "Arc'teryx", name: "Arc'teryx NYC", address: { city: 'New York', state: 'NY', lat: 40.7210, lng: -73.9960 }, format: 'Flagship', estSqft: 5800 },
      { id: 'arc-2', brand: "Arc'teryx", name: "Arc'teryx Seattle", address: { city: 'Seattle', state: 'WA', lat: 47.6130, lng: -122.3380 }, format: 'Inline', estSqft: 4000 },
      { id: 'arc-3', brand: "Arc'teryx", name: "Arc'teryx Denver", address: { city: 'Denver', state: 'CO', lat: 39.7505, lng: -104.9980 }, format: 'Inline', estSqft: 3800 },
      { id: 'arc-4', brand: "Arc'teryx", name: "Arc'teryx SF", address: { city: 'San Francisco', state: 'CA', lat: 37.7860, lng: -122.4080 }, format: 'Inline', estSqft: 3600 },
    ],
  },
  {
    name: 'REI Co-op', stores: 181, color: '#2E7D32',
    locations: [
      { id: 'rei-1', brand: 'REI', name: 'REI Denver', address: { city: 'Denver', state: 'CO', lat: 39.7560, lng: -104.9790 }, format: 'Flagship', estSqft: 52000 },
      { id: 'rei-2', brand: 'REI', name: 'REI Seattle', address: { city: 'Seattle', state: 'WA', lat: 47.6160, lng: -122.3270 }, format: 'Flagship', estSqft: 80000 },
      { id: 'rei-3', brand: 'REI', name: 'REI Portland', address: { city: 'Portland', state: 'OR', lat: 45.5230, lng: -122.6690 }, format: 'Inline', estSqft: 32000 },
      { id: 'rei-4', brand: 'REI', name: 'REI SLC', address: { city: 'Salt Lake City', state: 'UT', lat: 40.7660, lng: -111.8840 }, format: 'Inline', estSqft: 28000 },
      { id: 'rei-5', brand: 'REI', name: 'REI Minneapolis', address: { city: 'Minneapolis', state: 'MN', lat: 44.9810, lng: -93.2690 }, format: 'Inline', estSqft: 26000 },
      { id: 'rei-6', brand: 'REI', name: 'REI Austin', address: { city: 'Austin', state: 'TX', lat: 30.2890, lng: -97.7420 }, format: 'Inline', estSqft: 24000 },
      { id: 'rei-7', brand: 'REI', name: 'REI Boise', address: { city: 'Boise', state: 'ID', lat: 43.6070, lng: -116.2060 }, format: 'Inline', estSqft: 22000 },
      { id: 'rei-8', brand: 'REI', name: 'REI Raleigh', address: { city: 'Raleigh', state: 'NC', lat: 35.7870, lng: -78.6440 }, format: 'Inline', estSqft: 24000 },
    ],
  },
  {
    name: 'Nike', stores: 384, color: '#424242',
    locations: [
      { id: 'nik-1', brand: 'Nike', name: 'Nike NYC', address: { city: 'New York', state: 'NY', lat: 40.7142, lng: -74.0064 }, format: 'Flagship', estSqft: 68000 },
      { id: 'nik-2', brand: 'Nike', name: 'Nike Chicago', address: { city: 'Chicago', state: 'IL', lat: 41.8955, lng: -87.6245 }, format: 'Flagship', estSqft: 55000 },
      { id: 'nik-3', brand: 'Nike', name: 'Nike Portland', address: { city: 'Portland', state: 'OR', lat: 45.5210, lng: -122.6810 }, format: 'Inline', estSqft: 12000 },
      { id: 'nik-4', brand: 'Nike', name: 'Nike Denver', address: { city: 'Denver', state: 'CO', lat: 39.7440, lng: -104.9970 }, format: 'Inline', estSqft: 9800 },
    ],
  },
  {
    name: 'Under Armour', stores: 167, color: '#B71C1C',
    locations: [
      { id: 'ua-1', brand: 'Under Armour', name: 'UA Baltimore', address: { city: 'Baltimore', state: 'MD', lat: 39.2868, lng: -76.6130 }, format: 'Flagship', estSqft: 30000 },
      { id: 'ua-2', brand: 'Under Armour', name: 'UA Chicago', address: { city: 'Chicago', state: 'IL', lat: 41.8960, lng: -87.6235 }, format: 'Inline', estSqft: 8600 },
      { id: 'ua-3', brand: 'Under Armour', name: 'UA NYC', address: { city: 'New York', state: 'NY', lat: 40.7120, lng: -74.0050 }, format: 'Inline', estSqft: 10000 },
    ],
  },
  {
    name: 'L.L.Bean', stores: 56, color: '#33691E',
    locations: [
      { id: 'llb-1', brand: 'L.L.Bean', name: 'L.L.Bean Freeport', address: { city: 'Freeport', state: 'ME', lat: 43.8573, lng: -70.1032 }, format: 'Flagship', estSqft: 200000 },
      { id: 'llb-2', brand: 'L.L.Bean', name: 'L.L.Bean Burlington', address: { city: 'Burlington', state: 'MA', lat: 42.5048, lng: -71.1956 }, format: 'Inline', estSqft: 18000 },
    ],
  },
  {
    name: 'Eddie Bauer', stores: 89, color: '#4E342E',
    locations: [
      { id: 'eb-1', brand: 'Eddie Bauer', name: 'Eddie Bauer Bellevue', address: { city: 'Bellevue', state: 'WA', lat: 47.6140, lng: -122.2030 }, format: 'Inline', estSqft: 5600 },
      { id: 'eb-2', brand: 'Eddie Bauer', name: 'Eddie Bauer Denver', address: { city: 'Denver', state: 'CO', lat: 39.7420, lng: -104.9960 }, format: 'Inline', estSqft: 5200 },
      { id: 'eb-3', brand: 'Eddie Bauer', name: 'Eddie Bauer SLC', address: { city: 'Salt Lake City', state: 'UT', lat: 40.7590, lng: -111.8880 }, format: 'Inline', estSqft: 4800 },
    ],
  },
  {
    name: 'Helly Hansen', stores: 34, color: '#01579B',
    locations: [
      { id: 'hh-1', brand: 'Helly Hansen', name: 'HH Seattle', address: { city: 'Seattle', state: 'WA', lat: 47.6120, lng: -122.3400 }, format: 'Inline', estSqft: 3200 },
      { id: 'hh-2', brand: 'Helly Hansen', name: 'HH Annapolis', address: { city: 'Annapolis', state: 'MD', lat: 38.9784, lng: -76.4922 }, format: 'Inline', estSqft: 2800 },
    ],
  },
  {
    name: 'Carhartt', stores: 42, color: '#BF360C',
    locations: [
      { id: 'car-1', brand: 'Carhartt', name: 'Carhartt Detroit', address: { city: 'Detroit', state: 'MI', lat: 42.3314, lng: -83.0458 }, format: 'Flagship', estSqft: 6800 },
      { id: 'car-2', brand: 'Carhartt', name: 'Carhartt Nashville', address: { city: 'Nashville', state: 'TN', lat: 36.1590, lng: -86.7780 }, format: 'Inline', estSqft: 4400 },
      { id: 'car-3', brand: 'Carhartt', name: 'Carhartt Denver', address: { city: 'Denver', state: 'CO', lat: 39.7500, lng: -105.0010 }, format: 'Inline', estSqft: 4200 },
    ],
  },
];
