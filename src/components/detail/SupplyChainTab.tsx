import type { Market } from '@/types';

interface Props { market: Market }

export function SupplyChainTab({ market }: Props) {
  const channels = [
    { ch: 'Ship-from-Store', orders: `${market.fulfillment.sfsOrders.toLocaleString()}/mo`, save: `$${market.fulfillment.sfsSavingsPerOrder.toFixed(2)}/order`, annual: `$${((market.fulfillment.sfsOrders * market.fulfillment.sfsSavingsPerOrder * 12) / 1000).toFixed(1)}K` },
    { ch: 'BOPIS', orders: `${market.fulfillment.bopisOrders.toLocaleString()}/mo`, save: `$${market.fulfillment.bopisSavingsPerOrder.toFixed(2)}/order`, annual: `$${((market.fulfillment.bopisOrders * market.fulfillment.bopisSavingsPerOrder * 12) / 1000).toFixed(1)}K` },
    { ch: 'Returns-to-Store', orders: `${market.fulfillment.returnsOrders.toLocaleString()}/mo`, save: `$${market.fulfillment.returnsSavingsPerOrder.toFixed(2)}/order`, annual: `$${((market.fulfillment.returnsOrders * market.fulfillment.returnsSavingsPerOrder * 12) / 1000).toFixed(1)}K` },
    { ch: 'Inventory Proximity', orders: '—', save: '—', annual: `$${(market.fulfillment.inventoryProximitySavings / 1000).toFixed(1)}K` },
  ];

  return (
    <>
      {/* TCTS Impact */}
      <div className="px-4 py-3.5 border-b border-border-default">
        <div className="text-[9px] uppercase tracking-wider font-bold mb-3" style={{ color: '#10B981' }}>
          Total Cost-to-Serve Impact
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-md px-3 py-2.5 border" style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.15)' }}>
            <div className="text-[8px] text-red-500 uppercase tracking-wider">Current TCTS</div>
            <div className="text-lg font-extrabold text-red-500">${market.currentTCTS.toFixed(2)}</div>
            <div className="text-[9px] text-text-dim">per order</div>
          </div>
          <div className="rounded-md px-3 py-2.5 border" style={{ background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.15)' }}>
            <div className="text-[8px] uppercase tracking-wider" style={{ color: '#10B981' }}>With Store</div>
            <div className="text-lg font-extrabold" style={{ color: '#10B981' }}>${market.projectedTCTS.toFixed(2)}</div>
            <div className="text-[9px] text-text-dim">per order</div>
          </div>
        </div>
        <div className="mt-2.5 rounded-md px-3 py-2.5 border text-center" style={{ background: 'rgba(255,111,0,0.08)', borderColor: 'rgba(255,111,0,0.25)' }}>
          <div className="text-[8px] text-brand-orange-light uppercase tracking-wider">TCTS Delta</div>
          <div className="text-xl font-extrabold text-brand-orange-light">{market.tctsDelta}</div>
          <div className="text-[10px] text-text-muted">
            Annual savings: <strong style={{ color: '#10B981' }}>{market.scSavings}</strong>
          </div>
        </div>
      </div>

      {/* Fulfillment Channel Savings */}
      <div className="px-4 py-3.5 border-b border-border-default">
        <div className="text-[9px] text-text-muted uppercase tracking-wider font-bold mb-2.5">
          Fulfillment Channel Savings
        </div>
        {channels.map((item, i) => (
          <div key={i} className={`flex justify-between items-center py-1.5 ${i < 3 ? 'border-b border-border-default' : ''}`}>
            <div>
              <div className="text-[11px] text-text-primary font-medium">{item.ch}</div>
              <div className="text-[9px] text-text-dim">{item.orders} &bull; {item.save}</div>
            </div>
            <span className="text-xs font-bold" style={{ color: '#10B981' }}>{item.annual}</span>
          </div>
        ))}
      </div>

      {/* Carbon Impact */}
      <div className="px-4 py-3.5">
        <div className="text-[9px] text-text-muted uppercase tracking-wider font-bold mb-2.5">
          Sustainability Impact
        </div>
        <div className="rounded-md p-3 border text-center" style={{ background: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.12)' }}>
          <div className="text-2xl font-extrabold" style={{ color: '#6EE7B7' }}>{market.carbonImpact}</div>
          <div className="text-[10px] text-text-muted">Annual CO₂ reduction</div>
          <div className="text-[9px] text-text-dim mt-1">From reduced last-mile delivery + fewer return shipments</div>
        </div>
      </div>
    </>
  );
}
