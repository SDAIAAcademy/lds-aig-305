// The figures of the parallel examples on the Day 2 slides, computed here so that none is typed from memory.
// None of them is a lab or capstone answer: the labs use 5%/95% and the follow-up 10%/95%.
//
//     node labs/_tools/slide_figures.mjs
import { sampleSize } from './case.mjs';

const pct = x => (100 * x).toFixed(1) + '%';
console.log('sample-size slide');
for (const [tol, conf] of [[0.10, 0.90], [0.05, 0.90], [0.03, 0.95]])
  console.log(`  tolerable ${pct(tol)}, confidence ${pct(conf)}: n = ${sampleSize(tol, conf)}`);

// sample-timing slide: 26 weeks of refund approvals, the control fails only in the last 2 weeks, half the items there.
const weeks = 26, failWeeks = 2, rateInFail = 0.5, n = sampleSize(0.10, 0.90);
const overall = rateInFail * failWeeks / weeks;
const detect = r => 1 - Math.pow(1 - r, n);
console.log('sample-timing slide');
console.log(`  n = ${n}; overall exception rate ${pct(overall)}; P(at least one exception) whole period ${pct(detect(overall))}`);
console.log(`  sample drawn only from the first ${weeks - failWeeks} weeks: ${pct(detect(0))}; only from the last ${failWeeks}: ${pct(detect(rateInFail))}`);

// group-harm slide: 310 renewal letters to old addresses (review/role_cards.html), policies that lapsed without renewal, by group.
const groups = [['65 سنة فأكثر، بلا تطبيق', 40, 18], ['بقية العملاء', 270, 6]];
console.log('group-harm slide');
for (const [g, total, returned] of groups) console.log(`  ${g}: ${returned} of ${total} lapsed = ${pct(returned / total)}`);
console.log(`  total letters ${groups.reduce((a, g) => a + g[1], 0)}`);
const lapsed = groups.reduce((a, g) => a + g[2], 0), letters = groups.reduce((a, g) => a + g[1], 0);
console.log(`  lapsed overall ${lapsed} of ${letters} = ${pct(lapsed / letters)}`);

// expand-the-exception and committee-line slides: 2 exceptions in a sample of 22 refusals.
console.log('expand-the-exception slide');
console.log(`  2 of ${n} = ${pct(2 / n)}`);

// check-control slide: one exception in a sample of 45 transfers.
console.log('check-control slide');
console.log(`  1 of 45 = ${pct(1 / 45)} exceptions, ${pct(44 / 45)} matching`);
