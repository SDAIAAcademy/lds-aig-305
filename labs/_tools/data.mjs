// Synthetic, deterministic data of the case study (fixed seeds, no dates from the clock).
// Times are minutes from the start of each record window (t_min), never times of day.
//
//   incident()   lab 1.2 and 1.3: five days of Mihbara runs, traces, emails, changes, alerts
//   quarter()    lab 2.1: three months of records for three controls, one seeded failure
//   capstone()   the capstone incident (Shafeef and a knowledge-base change) and the follow-up test
import { sampleSize } from './case.mjs';

export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pad = (n, w) => String(n).padStart(w, '0');

export const DAY = 1440;
export const T = {
  change: 2 * DAY + 600,          // CHG-0417 deployed (config v2.8)
  complaint: 3 * DAY + 690,       // the claimant writes to Shafeef
  escalated: 3 * DAY + 692,       // Shafeef opens ESC-2291 to claims staff
  aware: 3 * DAY + 707,           // a claims officer opens ESC-2291: the insurer's clock starts
  declared: 3 * DAY + 761,        // incident INC-0310 declared, severity S2
  humanOnly: 3 * DAY + 796,       // CHG-0419: human-only mode (v2.8.1)
  rollback: 4 * DAY + 420,        // CHG-0420: back to v2.7 settings
  end: 5 * DAY,
};
export const DOC_TYPES = {
  motor: ['صورة الهوية', 'تقدير الإصلاح', 'خطاب الحساب البنكي'],
  health: ['صورة الهوية', 'التقرير الطبي', 'فاتورة العلاج'],
  home: ['صورة الهوية', 'صور الأضرار', 'تقدير الإصلاح', 'خطاب الحساب البنكي'],
};
export const SENSITIVE = new Set(['التقرير الطبي', 'فاتورة العلاج']);

export function incident() {
  const r = rng(305);
  const runs = [], docs = [], spans = [], emails = [];
  let claimNo = 41200, docNo = 880000, traceNo = 0, emailNo = 60000, subjectNo = 7000;
  const pick = a => a[Math.floor(r() * a.length)];
  for (let d = 0; d < 5; d++) {
    const batch = `B-${d + 1}`;
    let t = d * DAY + 420 + Math.floor(r() * 8);
    const dayRuns = [];
    while (t < d * DAY + 1260) {
      const x = r();
      const line = x < 0.5 ? 'motor' : x < 0.75 ? 'health' : 'home';
      const claim = `C-${++claimNo}`;
      const subject = `P-${++subjectNo}`;
      const own = DOC_TYPES[line].map(type => {
        const doc = { doc_id: `D-${++docNo}`, owner_claim: claim, subject, line, doc_type: type, sensitive: SENSITIVE.has(type) ? 'نعم' : 'لا' };
        docs.push(doc); return doc;
      });
      const recipient = line === 'home' && r() < 0.5 ? 'adjuster' : 'claimant';
      dayRuns.push({ claim, subject, line, own, recipient, t, batch, u: r(), v: r(), w: r() });
      t += 6 + Math.floor(r() * 8);
    }
    runs.push(...dayRuns);
    // attachments are decided once the batch is known, so foreign documents come from the same day
    for (const run of dayRuns) {
      const cfg = run.t < T.change ? 'v2.7' : run.t < T.humanOnly ? 'v2.8' : run.t < T.rollback ? 'v2.8.1' : 'v2.7';
      run.config = cfg;
      const scope = cfg === 'v2.8' || cfg === 'v2.8.1' ? 'batch' : 'claim';
      const check = cfg === 'v2.7';
      const humanOnly = cfg === 'v2.8.1';
      const attach = run.own.slice(0, run.recipient === 'adjuster' ? run.own.length : run.own.length - 1).map(x => x);
      let foreign = [];
      const others = dayRuns.filter(o => o !== run);
      if (scope === 'batch') {
        const k = run.u < 0.06 ? 2 : run.u < 0.36 ? 1 : 0;
        for (let i = 0; i < k; i++) {
          const o = others[Math.floor((i ? run.w : run.v) * others.length)];
          const doc = o.own[Math.floor(run.w * o.own.length)];
          if (!foreign.includes(doc) && doc) foreign.push(doc);
        }
      } else if (run.u < 0.012) {
        const o = others[Math.floor(run.v * others.length)];
        foreign.push(o.own[0]);           // near miss under v2.7: the recipient check stops it
      }
      run.attach = attach; run.foreign = foreign;
      const trace = `T-${pad(++traceNo, 5)}`;
      run.trace = trace;
      let s = 0;
      const span = (name, parent, dt, attrs, status = 'OK') => {
        const id = `${trace}.${++s}`;
        spans.push({ trace_id: trace, span_id: id, parent_span_id: parent, name, t_min: run.t + dt, attributes: attrs, status });
        return id;
      };
      const root = span('mihbara.run', '', 0, { 'claim.id': run.claim, 'claim.line': run.line, 'batch.id': run.batch, 'mihbara.config': cfg, 'recipient.role': run.recipient });
      span('gen_ai.chat', root, 0, { 'gen_ai.operation.name': 'chat', 'gen_ai.request.model': 'docs-model-3', 'gen_ai.usage.input_tokens': 900 + Math.floor(run.v * 600), 'gen_ai.usage.output_tokens': 140 + Math.floor(run.w * 90) });
      span('tool.search_documents', root, 0, { 'search.scope': scope, 'claim.id': run.claim, 'search.results': scope === 'batch' ? others.length * 3 + run.own.length : run.own.length + foreign.length });
      const all = [...attach, ...foreign];
      for (const doc of all) span('tool.attach_document', root, 1, { 'claim.id': run.claim, 'doc.id': doc.doc_id, 'doc.owner_claim': doc.owner_claim, 'doc.type': doc.doc_type });
      let blocked = false;
      if (check) {
        blocked = foreign.length > 0;
        span('guard.recipient_check', root, 1, { 'claim.id': run.claim, 'guard.result': blocked ? 'block' : 'pass' }, blocked ? 'ERROR' : 'OK');
      }
      if (blocked) {
        span('mihbara.hold_for_staff', root, 1, { 'claim.id': run.claim, 'hold.reason': 'recipient_check' });
        run.status = 'held_by_check';
      } else if (humanOnly) {
        span('mihbara.hold_for_staff', root, 1, { 'claim.id': run.claim, 'hold.reason': 'human_only_mode' });
        run.status = 'held_human_only';
      } else {
        const email = `E-${++emailNo}`;
        run.email = email;
        span('tool.send_email', root, 2, { 'claim.id': run.claim, 'email.id': email, 'recipient.role': run.recipient });
        emails.push({ email_id: email, t_min: run.t + 2, trace_id: trace, claim_id: run.claim, recipient_role: run.recipient,
          recipient: run.recipient === 'adjuster' ? 'claims@tukhoom.example' : `عميل المطالبة ${run.claim}`,
          attachments: all.map(x => x.doc_id).join(' '), status: 'delivered' });
        run.status = 'sent';
      }
    }
  }
  return { runs, docs, spans, emails };
}

export function incidentStats(inc) {
  const leaks = inc.runs.filter(x => x.status === 'sent' && x.foreign.length);
  const foreignDocs = leaks.flatMap(x => x.foreign);
  const uniq = a => [...new Set(a)];
  const subjects = uniq(foreignDocs.map(d => d.subject));
  const sens = foreignDocs.filter(d => d.sensitive === 'نعم');
  const byType = {};
  for (const d of foreignDocs) byType[d.doc_type] = (byType[d.doc_type] || 0) + 1;
  const ids = foreignDocs.filter(d => d.doc_type === 'صورة الهوية');
  return {
    runs: inc.runs.length,
    emails: inc.emails.length,
    near_misses_before_change: inc.runs.filter(x => x.status === 'held_by_check' && x.t < T.change).length,
    near_misses: inc.runs.filter(x => x.status === 'held_by_check').length,
    first_leak: { t_min: leaks[0].t + 2, email: leaks[0].email, trace: leaks[0].trace },
    last_leak: { t_min: leaks.at(-1).t + 2, email: leaks.at(-1).email, trace: leaks.at(-1).trace },
    leak_emails: leaks.length,
    leak_to_claimants: leaks.filter(x => x.recipient === 'claimant').length,
    leak_to_adjuster: leaks.filter(x => x.recipient === 'adjuster').length,
    foreign_docs: uniq(foreignDocs.map(d => d.doc_id)).length,
    foreign_attachments: foreignDocs.length,
    subjects: subjects.length,
    sensitive_docs: uniq(sens.map(d => d.doc_id)).length,
    sensitive_subjects: uniq(sens.map(d => d.subject)).length,
    by_type: byType,
    adjuster_docs: uniq(leaks.filter(x => x.recipient === 'adjuster').flatMap(x => x.foreign).map(d => d.doc_id)).length,
    held_human_only: inc.runs.filter(x => x.status === 'held_human_only').length,
    runs_v28: inc.runs.filter(x => x.config === 'v2.8').length,
    hours_change_to_aware: Math.round((T.aware - T.change) / 6) / 10,
    hours_aware_to_contain: Math.round((T.humanOnly - T.aware) / 6) / 10,
    deadline_t_min: T.aware + 72 * 60,
    id_copies: ids.length,
  };
}

// Lab 2.1: three months (90 days) after the fix.
export function quarter() {
  const r = rng(2026);
  const changes = [], outbound = [], sessions = [];
  const systems = ['مِحبَرة', 'شَفيف', 'نموذج ترشيح الاحتيال', 'نموذج التسعير', 'بوابة العملاء'];
  const people = ['U-104', 'U-117', 'U-123', 'U-131', 'U-142', 'U-156', 'U-163', 'U-178'];
  for (let i = 0; i < 64; i++) {
    const day = 1 + Math.floor(i * 90 / 64);
    const req = people[Math.floor(r() * people.length)];
    let apr = people[Math.floor(r() * people.length)];
    if (apr === req) apr = people[(people.indexOf(req) + 3) % people.length];
    changes.push({ row_no: i + 1, change_id: `CHG-${pad(500 + i, 4)}`, month: Math.ceil(day / 30), day,
      system: systems[Math.floor(r() * systems.length)], requested_by: req, approved_by: apr,
      test_evidence: `TST-${pad(3000 + i, 4)}`, status: 'منفّذ' });
  }
  for (let i = 0; i < 3600; i++) {
    const day = 1 + Math.floor(i / 40);
    const claim = `C-${50000 + i}`;
    const held = r() < 0.004;
    const owners = held ? `${claim} C-${50000 + ((i + 17) % 3600)}` : `${claim}`;
    outbound.push({ row_no: i + 1, email_id: `E-${pad(70000 + i, 5)}`, month: Math.ceil(day / 30), day, claim_id: claim,
      attachment_owner_claims: owners, recipient_check: held ? 'block' : 'pass', status: held ? 'محجوزة لموظف' : 'مرسلة' });
  }
  for (let i = 0; i < 6000; i++) {
    const day = 1 + Math.floor(i / (6000 / 90));
    const x = r();
    const channel = x < 0.26 ? 'voice' : x < 0.68 ? 'app' : 'web';
    const language = r() < 0.82 ? 'ar' : 'en';
    const template = channel === 'voice' ? (day >= 61 ? 'IVR-v3' : 'IVR-v2') : 'CHAT-v5';
    const shown = template === 'IVR-v3' ? 'لا' : 'نعم';
    sessions.push({ row_no: i + 1, session_id: `S-${pad(200000 + i, 6)}`, month: Math.ceil(day / 30), day, channel, language,
      greeting_template: template, ai_disclosure_first_reply: shown });
  }
  const n = sampleSize(0.05, 0.95);
  const draws = {};
  const rr = rng(59);
  for (const [c, N] of [['C1', 64], ['C2', 3600], ['C3', 6000]]) {
    const size = Math.min(n, N);
    const set = new Set();
    while (set.size < size) set.add(1 + Math.floor(rr() * N));
    draws[c] = [...set];
  }
  return { changes, outbound, sessions, draws, n };
}

export function quarterStats(q) {
  const exC1 = row => row.requested_by === row.approved_by || !row.test_evidence;
  const exC2 = row => row.status === 'مرسلة' && row.attachment_owner_claims.split(' ').some(c => c !== row.claim_id);
  const exC3 = row => row.ai_disclosure_first_reply !== 'نعم';
  const pop = { C1: q.changes, C2: q.outbound, C3: q.sessions };
  const ex = { C1: exC1, C2: exC2, C3: exC3 };
  const out = { n: q.n, controls: {} };
  for (const c of ['C1', 'C2', 'C3']) {
    const rows = pop[c];
    const sample = q.draws[c].map(i => rows[i - 1]);
    const sx = sample.filter(ex[c]);
    out.controls[c] = { population: rows.length, sample: sample.length, sample_exceptions: sx.length, sample_exception_rows: sx.map(x => x.row_no),
      population_exceptions: rows.filter(ex[c]).length };
  }
  const s = q.sessions;
  const rate = rows => Math.round(1000 * rows.filter(exC3).length / rows.length) / 10;
  out.c3 = {
    overall_pct: rate(s),
    by_month_pct: [1, 2, 3].map(m => rate(s.filter(x => x.month === m))),
    voice_month3: s.filter(x => x.month === 3 && x.channel === 'voice').length,
    voice_month3_pct: rate(s.filter(x => x.month === 3 && x.channel === 'voice')),
    other_channels_month3_pct: rate(s.filter(x => x.month === 3 && x.channel !== 'voice')),
    first_day_failing: Math.min(...s.filter(exC3).map(x => x.day)),
    held_by_check_c2: q.outbound.filter(x => x.status !== 'مرسلة').length,
    detect_prob_all_months: Math.round(1000 * (1 - Math.pow(1 - s.filter(exC3).length / s.length, q.n))) / 10,
  };
  return out;
}

// Capstone: Shafeef answers on home water damage after knowledge-base change KB-0912 (day 2),
// and the follow-up control test on one month of knowledge-base changes.
export function capstone() {
  const r = rng(912);
  const sessions = [];
  for (let i = 0; i < 640; i++) {
    const t = Math.floor(i * (4 * DAY) / 640) + Math.floor(r() * 6);
    const lang = r() < 0.78 ? 'ar' : 'en';
    const channel = r() < 0.3 ? 'voice' : 'app';
    const after = t >= DAY + 540;
    const version = lang === 'ar' ? (after ? 'KB-0912' : 'KB-0871') : 'KB-0871-en';
    const wrong = version === 'KB-0912' && r() < 0.92;
    const y = r();
    const outcome = wrong ? (y < 0.07 ? 'سحب المطالبة' : y < 0.37 ? 'طلب موظفًا' : 'أنهى المحادثة') : (y < 0.2 ? 'طلب موظفًا' : 'أنهى المحادثة');
    sessions.push({ session_id: `S-${pad(400000 + i, 6)}`, t_min: t, channel, language: lang, kb_version: version,
      answer_says_gradual_leak_excluded: wrong ? 'نعم' : 'لا', outcome });
  }
  const kb = [];
  const rk = rng(48);
  const editors = ['K-21', 'K-22', 'K-23', 'K-24', 'K-25'];
  for (let i = 0; i < 48; i++) {
    const a = editors[Math.floor(rk() * editors.length)];
    const b = editors[(editors.indexOf(a) + 1 + Math.floor(rk() * 4)) % editors.length];
    const enOnly = [6, 15, 22, 31, 40].includes(i);
    kb.push({ row_no: i + 1, kb_change: `KB-${pad(1000 + i, 4)}`, day: 1 + Math.floor(i * 30 / 48), article_language: rk() < 0.7 ? 'ar' : 'ar+en',
      author: a, reviewer: b, regression_run: 'نعم', regression_languages: enOnly ? 'en' : 'ar+en' });
  }
  const n = sampleSize(0.10, 0.95);
  const rr = rng(29);
  const set = new Set();
  while (set.size < n) set.add(1 + Math.floor(rr() * kb.length));
  return { sessions, kb, draw: [...set], n };
}

export function capstoneStats(c) {
  const pct = (a, b) => Math.round(1000 * a / b) / 10;
  const by = lang => {
    const rows = c.sessions.filter(x => x.language === lang && x.t_min >= DAY + 540);
    const w = rows.filter(x => x.answer_says_gradual_leak_excluded === 'نعم');
    return { sessions: rows.length, wrong: w.length, pct: pct(w.length, rows.length), withdrew: w.filter(x => x.outcome === 'سحب المطالبة').length };
  };
  const ex = row => row.regression_languages !== 'ar+en' || row.author === row.reviewer || row.regression_run !== 'نعم';
  const sample = c.draw.map(i => c.kb[i - 1]);
  return {
    ar: by('ar'), en: by('en'),
    wrong_total: c.sessions.filter(x => x.answer_says_gradual_leak_excluded === 'نعم').length,
    withdrew_total: c.sessions.filter(x => x.outcome === 'سحب المطالبة' && x.answer_says_gradual_leak_excluded === 'نعم').length,
    followup: { n: c.n, population: c.kb.length, population_exceptions: c.kb.filter(ex).length, sample_exceptions: sample.filter(ex).length, sample_exception_rows: sample.filter(ex).map(x => x.row_no) },
  };
}
