import { getDatabase, saveDatabase, logActivity } from './db.ts';
import type { PriceHistoryRecord } from '../src/types/index.ts';

export function startSchedulerDaemon(intervalMs = 10000) {
  console.log('[MINDMESH Daemon] Server scheduler initialized. Checking pending jobs every', intervalMs, 'ms');

  const checkScheduled = async () => {
    try {
      const db = await getDatabase();
      const now = new Date();
      let hasChanges = false;

      // 1. Process pending scheduled updates
      for (const job of db.scheduled_updates) {
        if (job.status === 'pending' && new Date(job.scheduled_time) <= now) {
          console.log(`[MINDMESH Daemon] Executing scheduled job: ${job.id} for ${job.entity_type} ${job.entity_id}`);
          try {
            if (job.entity_type === 'price') {
              const product = db.products.find(p => p.id === job.entity_id);
              if (product) {
                const oldPrice = product.price_inr;
                const newPrice = Number(job.payload.new_price);
                const reason = String(job.payload.reason || 'Scheduled automatic price change');
                product.price_inr = newPrice;
                product.updated_at = now.toISOString();
                product.last_editor = `Scheduled: ${job.created_by}`;

                const phRecord: PriceHistoryRecord = {
                  id: `ph_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
                  product_id: product.id,
                  product_name: product.name,
                  old_price: oldPrice,
                  new_price: newPrice,
                  reason,
                  effective_date: now.toISOString(),
                  updated_by: job.created_by,
                  created_at: now.toISOString(),
                };
                db.price_history.unshift(phRecord);

                await logActivity(
                  'Automated Scheduler',
                  'scheduler@mindmesh.in',
                  'price_change',
                  'product',
                  product.id,
                  `Scheduled price update applied for "${product.name}": ₹${oldPrice} → ₹${newPrice}`,
                  { price_inr: oldPrice },
                  { price_inr: newPrice, reason }
                );
              }
            } else if (job.entity_type === 'product') {
              const product = db.products.find(p => p.id === job.entity_id);
              if (product) {
                const oldVal = { ...product };
                Object.assign(product, job.payload, { updated_at: now.toISOString(), last_editor: job.created_by });
                await logActivity(
                  'Automated Scheduler',
                  'scheduler@mindmesh.in',
                  'update',
                  'product',
                  product.id,
                  `Scheduled product update executed for "${product.name}"`,
                  oldVal,
                  product
                );
              }
            } else if (job.entity_type === 'offer') {
              const offer = db.offers.find(o => o.id === job.entity_id);
              if (offer) {
                Object.assign(offer, job.payload);
                await logActivity(
                  'Automated Scheduler',
                  'scheduler@mindmesh.in',
                  'publish',
                  'offer',
                  offer.id,
                  `Scheduled offer activation applied: "${offer.title}"`
                );
              }
            } else if (job.entity_type === 'site_content') {
              Object.assign(db.site_content, job.payload, { updated_at: now.toISOString(), last_editor: job.created_by });
              await logActivity(
                'Automated Scheduler',
                'scheduler@mindmesh.in',
                'publish',
                'site_content',
                '1',
                'Scheduled site content changes published'
              );
            }

            job.status = 'executed';
            job.executed_at = now.toISOString();
            hasChanges = true;
          } catch (err) {
            console.error('[MINDMESH Daemon] Error executing job', job.id, err);
            job.status = 'failed';
            hasChanges = true;
          }
        }
      }

      // 2. Check and auto-archive expired offers
      for (const offer of db.offers) {
        if (offer.is_published && !offer.is_archived && new Date(offer.expiry_date) < now) {
          offer.is_archived = true;
          hasChanges = true;
          await logActivity(
            'Automated Scheduler',
            'scheduler@mindmesh.in',
            'update',
            'offer',
            offer.id,
            `Offer "${offer.title}" expired and automatically archived`
          );
        }
      }

      if (hasChanges) {
        await saveDatabase();
      }
    } catch (err) {
      console.error('[MINDMESH Daemon] Scheduler tick error:', err);
    }
  };

  const timer = setInterval(checkScheduled, intervalMs);
  // initial tick after 1s
  setTimeout(checkScheduled, 1000);

  return () => clearInterval(timer);
}
