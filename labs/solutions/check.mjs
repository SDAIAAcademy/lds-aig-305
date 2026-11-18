// Runs the reference solution of every lab against the course files and prints PASS or the first
// difference. Node 20 or later, no dependencies, no network, writes nothing.
//
//     node labs/solutions/check.mjs            every lab and the capstone
//     node labs/solutions/check.mjs 1.2 2.1    some of them
//
// Everything is recomputed from the participants' files, not taken from the generator:
// 1.1 the insurer's severity rule applied to the reference triage; 1.2 the leak counted from the
// email log and the documents index, the traces checked against both, the evidence manifest's
// fingerprints recomputed, the forwarded copy shown to differ, and every timeline citation found
// in its file; 1.3 every fact in the fact sheet recomputed, every required element present in the
// reference notices, the deadline, segregation of duties; 2.1 sample sizes, random draws and
// exceptions recomputed for the three controls; capstone the rates by language and the follow-up
// test. No lab calls a model: the systems of the case are simulated in the data files.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FILES = path.join(HERE, '..', 'files');
const REF = path.join(HERE, 'reference');
const only = process.argv.slice(2);

const raw = (base, rel) => fs.readFileSync(path.join(base, rel), 'utf8');
const read = (base, rel) => raw(base, rel).replace(/^﻿/, '');
function parseCsv(text) {
  const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; } else if (ch === '"') q = false; else cell += ch; }
    else if (ch === '"') q = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else cell += ch;
  }
  return rows.filter(r => r.some(c => c !== ''));
}
const table = (base, rel) => { const [head, ...rows] = parseCsv(read(base, rel)); return rows.map(r => Object.fromEntries(head.map((h, i) => [h, r[i] ?? '']))); };
const stats = JSON.parse(read(REF, 'stats.json'));
const uniq = a => [...new Set(a)];

let failed = 0;
function lab(id, fn) {
  if (only.length && !only.includes(id)) return;
  try { const out = fn(); console.log(`lab ${id}: ${out}\nPASS ${id}`); }
  catch (e) { failed++; console.log(`FAIL ${id}: ${e.message}`); }
}

// The insurer's rule, written again here from files/severity_matrix.html
function sev(h, r) { if (!h) return ''; const s = h * r; return h === 4 || s >= 12 ? 'S1' : s >= 6 ? 'S2' : s >= 3 ? 'S3' : 'S4'; }

lab('1.1', () => {
  const key = table(REF, 'triage_key.csv');
  const tpl = table(FILES, 'd1_1/triage_template.csv');
  const page = read(FILES, 'd1_1/reports.html');
  assert.equal(key.length, 12); assert.deepEqual(tpl.map(x => x.report_id), key.map(x => x.report_id));
  for (const k of key) {
    assert.ok(page.includes(k.report_id), k.report_id + ' in reports');
    assert.equal(sev(Number(k.harm), Number(k.reach)), k.severity, k.report_id + ' severity');
    if (k.severity === 'S1' || k.severity === 'S2') assert.ok(k.containment, k.report_id + ' needs a containment');
  }
  const bySev = s => key.filter(k => k.severity === s).length;
  const types = uniq(key.map(k => k.type));
  assert.ok(types.length >= 7, 'every kind of type is used');
  return `12 reports; severities S1 ${bySev('S1')}, S2 ${bySev('S2')}, S3 ${bySev('S3')}, S4 ${bySev('S4')}, none ${bySev('')}; ${types.length} types`;
});

const docs = table(FILES, 'd1_2/documents_index.csv');
const owner = Object.fromEntries(docs.map(d => [d.doc_id, d]));
const emails = table(FILES, 'd1_2/email_log.csv');
const leaks = emails.filter(e => e.attachments.split(' ').some(id => owner[id].owner_claim !== e.claim_id));
const foreign = leaks.flatMap(e => e.attachments.split(' ').filter(id => owner[id].owner_claim !== e.claim_id).map(id => ({ id, e })));

lab('1.2', () => {
  const spans = table(FILES, 'd1_2/mihbara_spans.csv');
  const jsonl = read(FILES, 'd1_2/mihbara_traces.jsonl').trim().split('\n').map(l => JSON.parse(l));
  assert.equal(jsonl.length, spans.length, 'jsonl and csv hold the same spans');
  const mis = spans.filter(s => s.name === 'tool.attach_document' && s.doc_owner_claim !== s.claim_id);
  const I = stats.incident;
  const sentTraces = new Set(emails.map(e => e.trace_id));
  const leakTraces = uniq(mis.filter(s => sentTraces.has(s.trace_id)).map(s => s.trace_id));
  assert.equal(leakTraces.length, leaks.length, 'leaking traces = leaking emails');
  const holds = Object.fromEntries(spans.filter(s => s.name === 'mihbara.hold_for_staff').map(s => [s.trace_id, s.hold_reason]));
  const held = uniq(mis.filter(s => holds[s.trace_id] === 'recipient_check').map(s => s.trace_id));
  const heldHuman = uniq(mis.filter(s => holds[s.trace_id] === 'human_only_mode').map(s => s.trace_id));
  assert.equal(held.length, I.near_misses, 'near misses');
  assert.equal(held.length + heldHuman.length + leakTraces.length, uniq(mis.map(s => s.trace_id)).length, 'every mismatch is sent or held');
  assert.equal(leaks.length, I.leak_emails); assert.equal(leaks[0].email_id, I.first_leak.email); assert.equal(leaks.at(-1).email_id, I.last_leak.email);
  // fingerprints
  const manifest = table(FILES, 'd1_2/evidence_manifest.csv');
  for (const m of manifest) assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(FILES, 'd1_2', m.file))).digest('hex'), m.sha256, m.file + ' fingerprint');
  const copyHash = crypto.createHash('sha256').update(fs.readFileSync(path.join(FILES, 'd1_2/forwarded_copy_traces.jsonl'))).digest('hex');
  assert.ok(!manifest.some(m => m.sha256 === copyHash), 'the forwarded copy matches no manifest entry');
  const copy = read(FILES, 'd1_2/forwarded_copy_traces.jsonl').trim().split('\n').map(l => JSON.parse(l));
  const copyMis = copy.filter(s => s.name === 'tool.attach_document' && s.attributes['doc.owner_claim'] !== s.attributes['claim.id']);
  assert.ok(copyMis.length < mis.length, 'the copy hides mismatched attachments');
  // the timeline's citations
  const ch = Object.fromEntries(table(FILES, 'd1_2/change_log.csv').map(x => [x.change_id, x]));
  assert.equal(ch['CHG-0417'].requested_by, ch['CHG-0417'].approved_by, 'CHG-0417 self-approved');
  assert.ok(!/مرفق/.test(ch['CHG-0417'].tests), 'CHG-0417 has no attachment test');
  for (const [id, c] of Object.entries(ch)) if (id !== 'CHG-0417') assert.notEqual(c.requested_by, c.approved_by, id);
  const dep = Object.fromEntries(table(FILES, 'd1_2/deploy_log.csv').map(x => [x.deploy_id, x]));
  assert.equal(dep['DEP-0779'].recipient_check, 'off'); assert.equal(dep['DEP-0779'].search_scope, 'batch'); assert.equal(dep['DEP-0784'].human_only, 'on');
  const firstLeakT = Number(leaks[0].t_min), lastLeakT = Number(leaks.at(-1).t_min);
  assert.ok(firstLeakT >= Number(dep['DEP-0779'].t_min) && lastLeakT < Number(dep['DEP-0784'].t_min), 'leaks lie between v2.8 and human-only');
  const al = Object.fromEntries(table(FILES, 'd1_2/alerts.csv').map(x => [x.alert_id, x]));
  const chan = Object.fromEntries(table(FILES, 'd1_2/alert_channels.csv').map(x => [x.channel, x]));
  assert.equal(al['ALR-5508'].acknowledged_by, ''); assert.equal(chan[al['ALR-5508'].routed_to].status, 'متوقفة');
  const esc = table(FILES, 'd1_2/escalations.csv').find(x => x.escalation_id === 'ESC-2291');
  assert.ok(lastLeakT > Number(esc.t_min_opened_by_staff), 'a leak after awareness');
  const tl = table(REF, 'timeline_reference.csv');
  const factors = tl.filter(x => x.factor === 'نعم');
  for (const f of tl) assert.ok(f.evidence_entry, 'step ' + f.step + ' cites an entry');
  return `${leaks.length} leaking emails of ${emails.length} (t_min ${firstLeakT} to ${lastLeakT}); ${held.length} near misses held by the check (v2.7); ${heldHuman.length} packs with another claimant's document held in human-only mode; fingerprints of ${manifest.length} files match; forwarded copy hides ${mis.length - copyMis.length} mismatched attachments; ${factors.length} factors each cited`;
});

lab('1.3', () => {
  const I = stats.incident;
  const toAdj = leaks.filter(e => e.recipient_role === 'adjuster');
  const fdocs = uniq(foreign.map(f => f.id));
  const subjects = uniq(fdocs.map(id => owner[id].subject));
  const sens = fdocs.filter(id => owner[id].sensitive === 'نعم');
  const facts = read(FILES, 'd1_3/facts.html');
  const want = [
    `أرسل «مِحبَرة» ${leaks.length} رسالة`, `${leaks.length - toAdj.length} رسالة إلى عملاء`, `${toAdj.length} رسالة إلى بريد`,
    `${fdocs.length} مستندًا لـ${subjects.length} صاحب بيانات`, `${sens.length} من المستندات صحية`,
    `تخص ${uniq(sens.map(id => owner[id].subject)).length} أصحاب`, `${uniq(toAdj.flatMap(e => e.attachments.split(' ').filter(id => owner[id].owner_claim !== e.claim_id))).length} مستندًا وصل إلى «تُخوم»`,
  ];
  for (const w of want) assert.ok(facts.includes(w), 'fact sheet: ' + w);
  const esc = table(FILES, 'd1_2/escalations.csv').find(x => x.escalation_id === 'ESC-2291');
  const deadline = Number(esc.t_min_opened_by_staff) + 72 * 60;
  const dec = table(REF, 'notification_decision_reference.csv');
  assert.ok(dec[0].deadline.includes(String(deadline)), 'authority deadline');
  for (const d of dec) if (d.prepared_by) assert.ok(!d.approved_by.includes(d.prepared_by), 'segregation: ' + d.recipient);
  const notices = read(REF, 'notices_reference.md');
  const els = ['**(أ)**', '**(ب)**', '**(ج)**', '**(د)**', '**(هـ)**', 'ما لا يُعرف بعد', 'أعدّته', 'اعتمدته'];
  for (const e of els) assert.ok(notices.includes(e), 'authority notice element ' + e);
  const sub = notices.split('## 2.')[1].split('## 3.')[0];
  for (const n of ['1.', '2.', '3.', '4.']) assert.ok(sub.includes('\n' + n), 'subject notice paragraph ' + n);
  const sup = notices.split('## 3.')[1].split('## الأخطاء')[0];
  for (const w of ['امتنعوا', 'احذفوها', 'يومي عمل', 'سجل الاستلام', 'جهة التواصل']) assert.ok(sup.includes(w), 'supplier notice: ' + w);
  const body = notices.split('## الأخطاء')[0];
  for (const bad of ['لا خطر', 'لم يتأثر', 'تميم', 'خطأ بشري']) assert.ok(!body.includes(bad), 'unsupported or blaming phrase: ' + bad);
  assert.equal(subjects.length, I.subjects);
  return `facts recomputed (${leaks.length} emails, ${fdocs.length} documents, ${subjects.length} data subjects, ${sens.length} health documents); deadline t_min ${deadline}; every element present; preparer differs from approver`;
});

function sampleSize(p, c) { let n = 1; while (Math.pow(1 - p, n) > 1 - c) n++; return n; }
lab('2.1', () => {
  const tbl = table(FILES, 'd2_1/sample_size_table.csv');
  for (const r of tbl) assert.equal(Number(r.sample_size_zero_expected), sampleSize(parseFloat(r.tolerable_rate) / 100, parseFloat(r.confidence) / 100), 'table row ' + r.tolerable_rate + ' ' + r.confidence);
  const n = sampleSize(0.05, 0.95);
  const draws = table(FILES, 'd2_1/random_numbers.csv');
  const pops = { C1: table(FILES, 'd2_1/changes_q.csv'), C2: table(FILES, 'd2_1/outbound_q.csv'), C3: table(FILES, 'd2_1/shafeef_q.csv') };
  const ex = {
    C1: r => r.requested_by === r.approved_by || !r.test_evidence,
    C2: r => r.status === 'مرسلة' && r.attachment_owner_claims.split(' ').some(c => c !== r.claim_id),
    C3: r => r.ai_disclosure_first_reply !== 'نعم',
  };
  const ref = Object.fromEntries(table(REF, 'test_results_reference.csv').map(x => [x.control, x]));
  const out = [];
  for (const c of ['C1', 'C2', 'C3']) {
    const rows = draws.filter(d => d.control === c).map(d => Number(d.row_no));
    assert.equal(rows.length, n, c + ' sample size'); assert.equal(uniq(rows).length, n, c + ' unique draws');
    const sample = rows.map(i => pops[c][i - 1]);
    assert.ok(sample.every((s, i) => Number(s.row_no) === rows[i]), c + ' row numbers');
    const sx = sample.filter(ex[c]);
    assert.equal(String(sx.length), ref[c].exceptions, c + ' exceptions');
    assert.equal(ref[c].result, sx.length ? 'غير فعّال' : 'فعّال', c + ' result');
    out.push(`${c} ${sx.length}/${n}`);
  }
  const s = pops.C3;
  const fails = s.filter(ex.C3);
  assert.ok(fails.every(x => x.channel === 'voice' && x.greeting_template === 'IVR-v3' && x.month === '3'), 'the seeded failure is voice, IVR-v3, month 3');
  const m12 = s.filter(x => x.month !== '3');
  assert.equal(m12.filter(ex.C3).length, 0, 'months 1 and 2 are clean');
  const voice3 = s.filter(x => x.month === '3' && x.channel === 'voice');
  assert.equal(fails.length, voice3.length);
  assert.ok(ref.C3.expanded_scope.includes(String(voice3.length)), 'expanded scope figure');
  const held = pops.C2.filter(r => r.status !== 'مرسلة').length;
  return `${out.join(', ')}; C3 fails in ${fails.length} voice sessions from day ${Math.min(...fails.map(x => Number(x.day)))}; ${held} emails held by the check are not exceptions`;
});

lab('capstone', () => {
  const ses = table(FILES, 'capstone/shafeef_kb_sessions.csv');
  const kb = table(FILES, 'capstone/kb_change_log.csv').find(x => x.kb_change === 'KB-0912');
  const after = ses.filter(x => Number(x.t_min) >= Number(kb.t_min));
  const rate = lang => { const r = after.filter(x => x.language === lang); const w = r.filter(x => x.answer_says_gradual_leak_excluded === 'نعم'); return [w.length, r.length]; };
  const [aw, an] = rate('ar'), [ew, en] = rate('en');
  const C = stats.capstone;
  assert.deepEqual([aw, an, ew, en], [C.ar.wrong, C.ar.sessions, C.en.wrong, C.en.sessions]);
  assert.equal(kb.regression_languages, 'en', 'the seeded system cause');
  assert.ok(ses.filter(x => Number(x.t_min) < Number(kb.t_min)).every(x => x.answer_says_gradual_leak_excluded === 'لا'), 'no wrong answer before KB-0912');
  const pop = table(FILES, 'capstone/followup_kb_changes.csv');
  const draw = table(FILES, 'capstone/followup_random_numbers.csv').map(d => Number(d.row_no));
  assert.equal(draw.length, sampleSize(0.10, 0.95)); assert.equal(uniq(draw).length, draw.length);
  const ex = r => r.regression_languages !== 'ar+en' || r.author === r.reviewer || r.regression_run !== 'نعم';
  const sx = draw.map(i => pop[i - 1]).filter(ex);
  assert.equal(sx.length, C.followup.sample_exceptions); assert.ok(sx.length > 0, 'the follow-up test catches the failure');
  const key = read(REF, 'capstone_key.md');
  assert.ok(key.includes(`${aw} من ${an}`) && key.includes(`${ew} من ${en}`), 'key figures');
  return `Arabic ${aw}/${an} wrong answers after KB-0912, English ${ew}/${en}; follow-up ${sx.length}/${draw.length} exceptions in the sample, ${pop.filter(ex).length} in ${pop.length}`;
});

if (failed) { console.log(`${failed} failed`); process.exit(1); }
console.log('all passed');
