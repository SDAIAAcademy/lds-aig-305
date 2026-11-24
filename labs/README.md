# الاستجابة لحوادث الذكاء الاصطناعي ومراقبة الامتثال: المختبرات

أربعة مختبرات لمقرر أكاديمية سدايا **LDS-AIG-305**، مدة كل منها 75 دقيقة، ومعها ملفات المشروع الختامي. المختبرات صفحات إرشادية بالعربية: الهدف، والملفات، وخطوات بدقائقها، وأسئلة تحقق، وتمرين إضافي ✱، وملاحظات للمدرب. لا يكتب المشارك كودًا ولا يستدعي نموذجًا.

كل المختبرات في جهة واحدة: **مِجَنّ للتأمين التعاوني**، شركة افتراضية. كل الأسماء والأرقام والعناوين والسجلات اصطناعية، ومصنفة «عام».

## ما يحتاجه المشارك

- متصفح، وبرنامج جداول (Excel أو Google Sheets أو LibreOffice Calc)، ومحرر نصوص.
- مساعد ذكاء اصطناعي عام بخطة مجانية حيث يسمح المختبر به مرشدًا. لا يُنزَّل أي نموذج على الجهاز.
- لحساب البصمات في المختبر 1.2: `certutil -hashfile <ملف> SHA256` في Windows، أو `shasum -a 256 <ملف>` في macOS وLinux.

## نقطة البداية والحل

كل مختبر يبدأ من ملفات جاهزة في `files/` ولا يعتمد على ناتج مختبر آخر.

| المختبر | الصفحة | يبدأ من | الحل المرجعي |
|---|---|---|---|
| 1.1 | `D1_1_triage.html` | `files/d1_1/reports.html`، `files/d1_1/triage_template.csv`، `files/severity_matrix.html` | `solutions/reference/triage_key.csv` |
| 1.2 | `D1_2_reconstruct.html` | `files/d1_2/` (آثار التنفيذ وسجلات البريد والتغيير والنشر والتنبيهات، وقالبا التسلسل الزمني وسجل الأدلة) | `solutions/reference/timeline_reference.csv`، `solutions/reference/evidence_register_reference.csv` |
| 1.3 | `D1_3_notices.html` | `files/d1_3/` (الوقائع وقواعد الإشعار والقوالب الثلاثة) | `solutions/reference/notification_decision_reference.csv`، `solutions/reference/notices_reference.md` |
| 2.1 | `D2_1_control_tests.html` | `files/d2_1/` (مجتمعات الضوابط الثلاثة والأرقام العشوائية وجدول العينة) | `solutions/reference/monitoring_plan_reference.md`، `solutions/reference/test_results_reference.csv` |
| المشروع الختامي | `../slides/capstone.html` | `files/capstone/`، `files/playbook_template.md`، `files/review/` | `solutions/reference/capstone_key.md` |

قبل اليوم الأول: `files/prereading.html` و`files/case_brief.html`. ومساء اليوم الأول: `files/playbook_template.md`.

## التحقق من الحلول

```
node labs/solutions/check.mjs          كل المختبرات
node labs/solutions/check.mjs 1.2      مختبر واحد (1.1 أو 1.2 أو 1.3 أو 2.1 أو capstone)
```

يحتاج Node.js 20 أو أحدث، بلا اعتماديات ولا اتصال. يعيد حساب كل رقم من ملفات المشاركين (لا من المولّد) ويقارنه بالحلول المرجعية وبالأرقام في `solutions/reference/stats.json`.

## إعادة توليد الملفات

```
node labs/_tools/build_files.mjs
```

يكتب `files/` و`solutions/reference/` من `_tools/case.mjs` (الحالة والبلاغات والضوابط) و`_tools/data.mjs` (السجلات، ببذور ثابتة). الناتج هو نفسه في كل تشغيل، فلا يظهر في git فرق بعد إعادة التوليد إلا إذا غُيّر المولّد. بعد أي تغيير: شغّل `check.mjs`، وراجع الأرقام في الشرائح وصفحات المختبرات.
