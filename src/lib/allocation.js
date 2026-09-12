// Connected-pool savings allocation engine.
// Splits a single pool of money across goals + wishlist items by
// priority x urgency, with priorities that can auto-upgrade on a date.

export const PRIORITY_WEIGHT = { High: 3, Medium: 2, Low: 1 };
export const PRIORITIES = ['Low', 'Medium', 'High'];

export function addMonths(date, n) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + n);
  return d;
}

export function monthsBetween(from, to) {
  const f = new Date(from), t = new Date(to);
  if (isNaN(f.getTime()) || isNaN(t.getTime())) return null;
  return (t.getFullYear() - f.getFullYear()) * 12 + (t.getMonth() - f.getMonth());
}

export function daysBetween(from, to) {
  const f = new Date(from), t = new Date(to);
  if (isNaN(f.getTime()) || isNaN(t.getTime())) return null;
  return Math.round((t.getTime() - f.getTime()) / 86400000);
}

export function effectivePriority(item, asOf) {
  if (item.upgradeDate && item.upgradePriority) {
    if (new Date(asOf) >= new Date(item.upgradeDate)) return item.upgradePriority;
  }
  return item.basePriority || 'Medium';
}

export function urgencyWeight(item, asOf) {
  if (!item.deadline) return 1;
  const m = monthsBetween(asOf, item.deadline);
  if (m === null) return 1;
  if (m <= 0) return 4;
  if (m <= 6) return 3;
  if (m <= 18) return 2;
  return 1;
}

export function computeWeight(item, asOf) {
  return PRIORITY_WEIGHT[effectivePriority(item, asOf)] * urgencyWeight(item, asOf);
}

// Waterfall allocation: split `pool` across items proportional to weight,
// capping each at its remaining need and redistributing leftover to the rest.
export function allocatePool(pool, items, asOf) {
  let remaining = Math.max(0, pool);
  let working = items.map((it) => ({
    ...it,
    need: Math.max(0, Number(it.target) || 0),
    allocated: 0,
    weight: computeWeight(it, asOf),
  }));
  let guard = 0;
  while (remaining > 0.5 && working.some((w) => w.need > 0) && guard < 300) {
    guard++;
    const active = working.filter((w) => w.need > 0);
    const totalWeight = active.reduce((s, w) => s + w.weight, 0);
    if (totalWeight <= 0) break;
    let anyCapped = false;
    for (const w of active) {
      const share = remaining * (w.weight / totalWeight);
      if (share >= w.need - 0.01) {
        w.allocated += w.need;
        remaining -= w.need;
        w.need = 0;
        anyCapped = true;
      }
    }
    if (!anyCapped) {
      for (const w of active) {
        const share = remaining * (w.weight / totalWeight);
        w.allocated += share;
        w.need -= share;
      }
      remaining = 0;
    }
  }
  return working;
}

// Simulates month-by-month growth of the pool (totalSaved + monthlyCapacity*m)
// and records the first month each item's need hits zero.
export function simulateCompletions(totalSaved, monthlyCapacity, items, startDate, maxMonths = 300) {
  const completions = {};
  for (let m = 0; m <= maxMonths; m++) {
    const asOf = addMonths(startDate, m);
    const pool = totalSaved + monthlyCapacity * m;
    const result = allocatePool(pool, items, asOf);
    for (const r of result) {
      if (completions[r.id] === undefined && r.need <= 0.5) {
        completions[r.id] = asOf;
      }
    }
    if (Object.keys(completions).length === items.length) break;
  }
  return completions;
}

export function fmtINR(n) {
  if (n === '' || n === null || n === undefined || isNaN(n)) return '\u20B90';
  return '\u20B9' + Math.round(n).toLocaleString('en-IN');
}

export function fmtDate(d) {
  if (!d) return '\u2014';
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return '\u2014';
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function fmtShortDate(d) {
  if (!d) return '\u2014';
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return '\u2014';
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}
