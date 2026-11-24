---
course: "الاستجابة لحوادث الذكاء الاصطناعي ومراقبة الامتثال"
code: "LDS-AIG-305"
version: "2027.1.0"
lab: "1.2"
language: "ar"
view: "trainee"
source: "https://sdaiaacademy.github.io/lds-aig-305/labs/D1_2_reconstruct.html"
---

# المختبر 1.2 · إعادة بناء تسرب «مِحبَرة» من آثار التنفيذ

تحفظ أدلة الحادثة INC-0310، ثم تعيد بناءها من آثار تنفيذ «مِحبَرة» وسجل البريد وسجلات التغيير والنشر والتنبيهات، وتكتب تسلسلًا زمنيًا بقيد لكل عامل والضوابط التي أخفقت.

اليوم 1 · الجلسة 2: الأدلة وإعادة بناء الحادثة

### ستخرج من هذا المختبر بـ

سجل أدلة للحادثة INC-0310 فيه بصمة كل ملف وقرارك في نسخة مشكوك فيها، وتسلسل زمني لتسرب «مِحبَرة» يستشهد بقيد من السجل لكل عامل، والضوابط التي أخفقت. التسلسل دليل الناتج الثاني.

## ما تحتاجه

[**incident_ticket.html**البلاغ كما وصل، والمحادثة التي بدأت بها الحادثة.](https://sdaiaacademy.github.io/lds-aig-305/labs/files/d1_2/incident_ticket.html) [**evidence_manifest.csv**بيان الأدلة: الملفات التسعة ومصدرها ومن صدّرها وبصمتها.](https://sdaiaacademy.github.io/lds-aig-305/labs/files/d1_2/evidence_manifest.csv) [**mihbara_spans.csv**آثار تنفيذ «مِحبَرة» في جدول: وحدة لكل سطر، خمسة أيام.](https://sdaiaacademy.github.io/lds-aig-305/labs/files/d1_2/mihbara_spans.csv) [**mihbara_traces.jsonl**الآثار نفسها بصيغة JSON Lines، كما يصدّرها عارض آثار التنفيذ.](https://sdaiaacademy.github.io/lds-aig-305/labs/files/d1_2/mihbara_traces.jsonl) [**email_log.csv**الرسائل التي أرسلها الوكيل ومرفقاتها.](https://sdaiaacademy.github.io/lds-aig-305/labs/files/d1_2/email_log.csv) [**documents_index.csv**كل مستند: مطالبته وصاحبه ونوعه وهل هو حساس.](https://sdaiaacademy.github.io/lds-aig-305/labs/files/d1_2/documents_index.csv) [**change_log.csv**سجل التغييرات.](https://sdaiaacademy.github.io/lds-aig-305/labs/files/d1_2/change_log.csv) [**deploy_log.csv**سجل النشر وإعدادات كل إصدار.](https://sdaiaacademy.github.io/lds-aig-305/labs/files/d1_2/deploy_log.csv) [**alerts.csv**التنبيهات وأين وُجّهت ومن قرأها.](https://sdaiaacademy.github.io/lds-aig-305/labs/files/d1_2/alerts.csv) [**alert_channels.csv**قنوات التنبيه وحالتها.](https://sdaiaacademy.github.io/lds-aig-305/labs/files/d1_2/alert_channels.csv) [**escalations.csv**التصعيدات من «شَفيف» إلى الموظفين.](https://sdaiaacademy.github.io/lds-aig-305/labs/files/d1_2/escalations.csv) [**forwarded_copy_traces.jsonl**نسخة من الآثار أرسلها زميل بالبريد «لتوفير الوقت».](https://sdaiaacademy.github.io/lds-aig-305/labs/files/d1_2/forwarded_copy_traces.jsonl) [**evidence_register_template.csv**قالب سجل الأدلة.](https://sdaiaacademy.github.io/lds-aig-305/labs/files/d1_2/evidence_register_template.csv) [**timeline_template.csv**قالب التسلسل الزمني.](https://sdaiaacademy.github.io/lds-aig-305/labs/files/d1_2/timeline_template.csv)

> **استخدام الذكاء الاصطناعي:** مرشد في قراءة الآثار، كما يحدد الكتالوج: اسأله ما معنى وحدة أو حقل، أو كيف تصفّي جدولًا، ولا تطلب منه التسلسل. الأوقات كلها بالدقائق من بداية نافذة السجلات (`t_min`)، والساعة 60 دقيقة.

> **عارض الآثار.** الجدول `mihbara_spans.csv` يكفي في أي برنامج جداول: صفِّ بعمود `name` وبعمود `t_min` وبمعرّف المطالبة. ومن يفضّل عارض آثار يمكنه تحميل ملف JSON Lines في دفتر Python؛ لم نشغّل المختبر في Langfuse أو Arize Phoenix.

## الخطوات

### 1 · اقرأ بلاغ الحادثة INC-0310 وبيان الأدلة 10 د

اكتب في سطر واحد ما تريد أن تعرفه: متى بدأ الأمر، وما الذي تغير، وكم رسالة، ومتى توقف. ثم انظر في البيان: من أين جاء كل ملف، ومن صدّره.

### 2 · احفظ الأدلة: تحقق من بصمة ملفين، وسجّلهما، وقرر في النسخة التي وصلت بالبريد 15 د

احسب بصمة SHA-256 لملف `mihbara_traces.jsonl` ولملف `forwarded_copy_traces.jsonl`، وقارنهما بالبيان. في Windows: `certutil -hashfile mihbara_traces.jsonl SHA256`؛ وفي macOS وLinux: `shasum -a 256 mihbara_traces.jsonl`. سجّل في سجل الأدلة: الملف، ومصدره، ومن صدّره، ومن تسلّمه، وهل طابقت البصمة، وأين حُفظ.

### 3 · صفِّ آثار التنفيذ بالوقت ومعرّف المطالبة، وجد أول رسالة وآخر رسالة فيها مستند من مطالبة أخرى 20 د

في `mihbara_spans.csv` صفِّ الوحدات `tool.attach_document`، وقارن `doc_owner_claim` بـ`claim_id`. الأثر الذي فيه مرفق غريب: هل انتهى بـ`tool.send_email` أم بـ`mihbara.hold_for_staff`؟ ثم تحقق من رسالة واحدة في `email_log.csv` و`documents_index.csv`.

أمر لـ مساعد مرشد:

```text
لا تحلل الملف عني. اشرح لي ما تعنيه هذه الوحدة في أثر تنفيذ وكيل، وأي حقولها يدل على أن المرفق من مطالبة أخرى: سطر من mihbara_spans.csv
```

### 4 · اربط سجلات التغيير والنشر والتنبيهات بالتسلسل، وحدد الضوابط التي أخفقت 20 د

ما الذي تغير قبل أول مرفق غريب، ومن طلبه ومن وافق عليه، وكيف اختُبر؟ ما الإعدادات التي نُشرت؟ هل أطلق أي نظام تنبيهًا، وإلى أين ذهب؟ لكل عامل: الضابط الذي كان يجب أن يمنعه أو يكشفه.

### 5 · اكتب التسلسل الزمني بقيد من السجل لكل عامل 10 د

سطر لكل خطوة في القالب: `t_min`، وما حدث، والملف، والقيد (معرّف التغيير أو النشر أو التنبيه أو الأثر)، وهل هو عامل، والضابط الذي أخفق. لا عامل دون قيد. ولا اسم شخص في عمود الضابط.

### ✱ إضافي

حمّل `mihbara_traces.jsonl` في دفتر Python، وارسم عدد المرفقات من مطالبات أخرى في كل ساعة من النافذة.

## أسئلة تحقق

1. لماذا لا تُستخدم النسخة التي وصلت بالبريد، ولو بدت كاملة؟
2. كم دقيقة مرت بين أول مرفق غريب وأول تنبيه، ولماذا لم يتحرك أحد بعد التنبيه؟
3. هل أُرسلت رسالة فيها مستند من مطالبة أخرى بعد أن علمت الشركة؟ ما القيد الذي يثبت جوابك؟
