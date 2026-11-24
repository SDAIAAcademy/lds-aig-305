---
course: "الاستجابة لحوادث الذكاء الاصطناعي ومراقبة الامتثال"
code: "LDS-AIG-305"
version: "2027.1.0"
language: "ar"
view: "trainee"
source: "https://sdaiaacademy.github.io/lds-aig-305/index.html"
---

# الاستجابة لحوادث الذكاء الاصطناعي ومراقبة الامتثال

AI Incident Response and Compliance Monitoring

مسار التنفيذيين والقادة · يومان تدريبيان + يوم للمشروع الختامي · 12 ساعة · المستوى 300

تفرز بلاغات حوادث الذكاء الاصطناعي، وتعيد بناء الحادثة من آثار التنفيذ، وتكتب الإشعارات بما يُعرف وما لا يُعرف، وتقود مراجعة بلا لوم، وتختبر الضوابط بالمعاينة

يعمل المشاركون على مساعد مطالبات ووكيل مستندات لدى شركة تأمين افتراضية، فيفرزون بلاغات الحوادث، ويعيدون بناء حادثة تسرب بيانات تسبب فيها وكيل انطلاقًا من آثار التنفيذ، ويقررون من يجب إبلاغه، ويقودون مراجعة بلا لوم، ويختبرون الضوابط بالمعاينة. يُتناول تصميم تسجيل آثار التنفيذ في المقرر LDS-AIG-302، والتدريب القيادي على الحوادث في المقرر LDS-EXE-209، وحوادث الاعتمادية في المقرر DEV-OPS-401.

**لمن هذا المقرر:** المختصون. العاملون في الحوكمة والمخاطر والامتثال والتدقيق والخصوصية والأمن، والعاملون التقنيون المنتقلون إلى أدوار ضمان الذكاء الاصطناعي في الجهات العامة والخاصة.

**الصيغة:** ورشة عمل: يوم ونصف مع مختبرات واختبار متابعة لأحد الضوابط

## دراسة الحالة

**مِجَنّ للتأمين التعاوني.** شركة تأمين افتراضية للمركبات والصحة والمنازل، لها مساعد مطالبات للعملاء «شَفيف» ووكيل مستندات «مِحبَرة» يرسل حزم التسوية إلى العملاء وإلى مورد تسوية الخسائر «تُخوم». يعمل المشاركون مع يزيد الخضير رئيس وحدة الاستجابة لحوادث الذكاء الاصطناعي والامتثال على اثني عشر بلاغًا، وعلى خمسة أيام من آثار تنفيذ «مِحبَرة» وسجلات التغيير بعد حادثة أرفق فيها مستندات عملاء آخرين، وعلى ثلاثة أشهر من سجلات الضوابط؛ البيانات كلها اصطناعية ببذرة ثابتة، و«شَفيف» و«مِحبَرة» محاكاة في ملفات البيانات لا نماذج.

## مخطط المقرر

### اليوم 1: من البلاغ إلى الإشعار

الشرائح: https://sdaiaacademy.github.io/lds-aig-305/slides/day1.md

- **الجلسة 1: الحوادث والفرز**
  - تحدد نوع البلاغ بقاعدة الأسبقية، ومنها الأنواع الخاصة بالذكاء الاصطناعي
  - تقدّر الضرر والنطاق بالوقائع المعروفة وتشتق الشدة من المصفوفة
  - تختار الاحتواء بين وضع الموظف فقط والتراجع والإيقاف، وما يُحفظ قبله
  - [المختبر 1.1: فرز اثني عشر بلاغًا عن حوادث (75 د)](https://sdaiaacademy.github.io/lds-aig-305/labs/D1_1_triage.html)
- **الجلسة 2: الأدلة وإعادة بناء الحادثة**
  - تحفظ الأدلة ببصمة كل ملف وسجل حيازة، وترفض نسخة لا تطابق البيان
  - تصفّي آثار التنفيذ بالوقت والمعرّف لتجد بداية الحادثة ونهايتها
  - تكتب تسلسلًا زمنيًا يستشهد بقيد لكل عامل، وتسمّي الضابط الذي أخفق
  - [المختبر 1.2: إعادة بناء تسرب «مِحبَرة» من آثار التنفيذ (75 د)](https://sdaiaacademy.github.io/lds-aig-305/labs/D1_2_reconstruct.html)
- **الجلسة 3: الإشعار بالتسرب**
  - تقرر من يجب إشعاره، وبأي مهلة، ومن يعدّ الإشعار ومن يعتمده
  - تكتب إشعار الجهة المختصة بعناصره الخمسة وما لا يُعرف بعد
  - تكتب إشعار أصحاب البيانات وإخطار المورد دون ادعاء لا تسنده واقعة
  - [المختبر 1.3: صياغة ثلاثة إشعارات (75 د)](https://sdaiaacademy.github.io/lds-aig-305/labs/D1_3_notices.html)

### اليوم 2: من المراجعة إلى المراقبة

الشرائح: https://sdaiaacademy.github.io/lds-aig-305/slides/day2.md

- **الجلسة 1: التعلم من الحادثة ومراقبة الضوابط**
  - تقود مراجعة بلا لوم تبحث عن أسباب في النظام وعن فئة تضررت أكثر
  - تصمم اختبار ضابط بالسمة والعينة والعتبة والتصعيد
  - تكتب للجنة نتيجة كل ضابط والقرار المطلوب منها
  - [المختبر 2.1: اختبار ثلاثة ضوابط بالمعاينة (75 د)](https://sdaiaacademy.github.io/lds-aig-305/labs/D2_1_control_tests.html)

### المشروع الختامي: التمرين المراقَب واختبار المتابعة

الشرائح: https://sdaiaacademy.github.io/lds-aig-305/slides/capstone.md

## المشروع الختامي

دليل استجابة وخطة مراقبة يُطبَّقان على حادثة جديدة في جلسة موقوتة تحت الملاحظة؛ وتنفذ مهمة المتابعة اختبارًا لأحد الضوابط

**ما تسلّمه:** عمل فردي يُسلَّم رابطًا لمجلد مشترك في Google Drive، فيه: بطاقة الفرز الأول، وقرار الإشعار قبل الواقعة المتغيرة وبعدها، وسجل المراجعة الذي قدته، ودليل الاستجابة (الإصدار 2)، وخطة المراقبة من المختبر 2.1، ونتيجة اختبار المتابعة وسطر التقرير إلى اللجنة، وسجل جلسات المساعد إن استُخدم. الذكاء الاصطناعي ممنوع في الفرز الأول، ومرشد في قراءة السجلات، وكامل في الدليل الذي تدافع عنه في مكالمة المتابعة (خمس دقائق).

**سلم التقدير:**

- الفرز الأول دون ذكاء اصطناعي والاحتواء: النوع والشدة والمكوّن صحيحة بالدليل، والاحتواء يناسب الشدة ويحفظ الأدلة: 15%
- الدليل مطبقًا: الأدلة محفوظة، والوقائع من السجلات بقيودها، وقرار الإشعار يذكر ما لا يُعرف: 20%
- إعادة قرار الإشعار بعد الواقعة التي غيّرها المقيِّم: القرار الصحيح لبطاقتك، وسببه من القاعدة، وفصل المهام: 20%
- المراجعة بلا لوم التي قدتها: أسباب في النظام لا أشخاص، وفحص هل تضررت فئة أكثر، وإجراءات لكل منها مسؤول واحد وموعد: 25%
- اختبار المتابعة والدفاع: العينة بالقاعدة، والنتيجة والنطاق، والتصعيد، والإجابة عن خطوة من الدليل: 20%

## نواتج التعلم

- **LO1** يصنف بلاغات الحوادث بحسب النوع والضرر والشدة والمكوّن الذي أخفق، استنادًا إلى اثني عشر بلاغًا ومصفوفة للشدة، وضمن مهلة زمنية محددة (Applied) الدليل: سجل فرز يطابق المرجع في عشرة بلاغات
- **LO2** يحلل آثار التنفيذ وسجلات التغيير لإعادة بناء الحادثة وتحديد الضوابط التي أخفقت، استنادًا إلى سجلات وكيل سرّب بيانات العملاء (Applied) الدليل: تسلسل زمني يستشهد بقيد من السجل لكل عامل
- **LO3** يصوغ الإشعارات التي تستوجبها حادثة التسرب إلى الجهة المختصة بحماية البيانات والمتأثرين وأحد الموردين، استنادًا إلى الوقائع وقواعد الإبلاغ والقوالب (Applied) الدليل: إشعارات تتضمن كل العناصر المطلوبة ولا تحتوي على أي ادعاء غير مدعوم
- **LO4** يقود مراجعة بلا لوم لما بعد الحادثة، ويقرر الإجراءات التصحيحية، مع فريق يؤدي أفراده أدوارًا محددة (Performance) الدليل: سجل مراجعة فيه إجراءات لها مسؤولون وتواريخ
- **LO5** يصمم خطة لمراقبة الامتثال تتضمن اختبارات الضوابط والعتبات والتصعيد، على سجلات اصطناعية تغطي ثلاثة أشهر (Performance) الدليل: نتائج اختبارات تكشف إخفاق الضابط المزروع

## الأدوات

- **عارض آثار التنفيذ:** آثار OpenTelemetry في دفتر (notebook), Langfuse, Arize Phoenix
- **السجلات العامة للحوادث:** AI Incident Database, OECD AI Incidents and Hazards Monitor (AIM)
- **تتبع الحالات:** أداة مفتوحة المصدر لتتبع المشكلات, أي أداة لإدارة التذاكر

## المتطلبات السابقة

- LDS-AIG-201 أسس حوكمة الذكاء الاصطناعي: المبادئ والأدوار وضوابط دورة الحياة
- يقرأ جدول سجلات أو آثار تنفيذ ويصفّيه بحسب الوقت والمعرِّف

## المصادر

### المرجعيات الوطنية

- [اللائحة التنفيذية لنظام حماية البيانات الشخصية، النص العربي (المادة الرابعة والعشرون، والمادة السابعة عشرة)](https://sdaia.gov.sa/ar/SDAIA/about/Documents/ImplementingRegulationPersonalDataProtectionLawAr.pdf)
- [Implementing Regulation of the Personal Data Protection Law, English translation (Article 24)](https://sdaia.gov.sa/en/SDAIA/about/Documents/ImplementingRegulationPersonalDataProtectionLaw.pdf)
- [Personal Data Protection Law, English translation (Article 20)](https://sdaia.gov.sa/en/SDAIA/about/Documents/PersonalDataProtectionLaw.pdf)
- [سدايا: الدليل الإجرائي لمعالجة حوادث تسرب البيانات الشخصية، الإصدار 1.0 (أكتوبر 2024)](https://sdaia.gov.sa/ar/SDAIA/about/Documents/PersonalDataBreachIncidents.pdf)
- [SDAIA: Personal Data Breach Incidents Procedural Guide, issue 1.0 (October 2024)](https://sdaia.gov.sa/en/SDAIA/about/Documents/PersonalDataBreachIncidents.pdf)
- [الهيئة الوطنية للأمن السيبراني: الضوابط الأساسية للأمن السيبراني (ECC-2:2024)، الضابط 2-13](https://cdn.nca.gov.sa/api/files/public/upload/29a9e86a-595f-4af9-8db5-88715a458a14_ECC-2-2024---NCA.pdf)
- [NCA: Essential Cybersecurity Controls (ECC-2:2024), control 2-13, English edition](https://cdn.nca.gov.sa/api/files/public/upload/86e09090-44e4-481f-bc28-355673607654_ECC--2024-EN.pdf)
- [الهيئة الوطنية للأمن السيبراني: مسودة إرشادات الأمن السيبراني للذكاء الاصطناعي (AICG-1:2026)، للاستطلاع العام](https://cdn.nca.gov.sa/api/files/public/upload/eb6f2457-8b99-403b-b8b9-35352c6feca8_AI_Cybersecurity_Guidelines-_AR--.pdf)
- [NCA: Draft of AI Cybersecurity Guidelines (AICG-1:2026), English edition](https://cdn.nca.gov.sa/api/files/public/upload/cbf45381-f94f-40c7-9b8c-553fb01b6a3b_AI_Cybersecurity_Controls_EN.pdf)
- [NCA: NCA Launches Public Consultation on "AI Cybersecurity Guidelines"](https://nca.gov.sa/en/news/ai-cybersecurity-guidelines/)
- [سدايا: الإطار الوطني لإدارة مخاطر الذكاء الاصطناعي، النص العربي (مستويات الأثر)](https://sdaia.gov.sa/ar/MediaCenter/KnowledgeCenter/ResearchLibrary/ExecutiveSummaryAr.pdf)
- [سدايا: إرشادات الذكاء الاصطناعي التوليدي للجهات الحكومية، النص العربي](https://sdaia.gov.sa/ar/SDAIA/about/Files/GenAIGuidelinesForGovernmentARCompressed.pdf)

### الاستجابة للحوادث والمراجعة

- [NIST SP 800-61 Rev. 3, Incident Response Recommendations and Considerations for Cybersecurity Risk Management (April 2025)](https://csrc.nist.gov/pubs/sp/800/61/r3/final)
- [NIST SP 800-86, Guide to Integrating Forensic Techniques into Incident Response](https://csrc.nist.gov/pubs/sp/800/86/final)
- [Google, Site Reliability Engineering, chapter 15: Postmortem Culture: Learning from Failure](https://sre.google/sre-book/postmortem-culture/)

### سجلات الحوادث وآثار التنفيذ

- [AI Incident Database](https://incidentdatabase.ai/)
- [OECD.AI: AIM, AI Incidents and Hazards Monitor](https://oecd.ai/en/incidents)
- [OpenTelemetry: Semantic conventions for generative AI systems](https://opentelemetry.io/docs/specs/semconv/gen-ai/)
- [Langfuse documentation: Observability overview](https://langfuse.com/docs/observability/overview)
- [Arize Phoenix documentation](https://arize.com/docs/phoenix)

---

أكاديمية سدايا · مسار التنفيذيين والقادة · الاستجابة لحوادث الذكاء الاصطناعي ومراقبة الامتثال

إصدار المقرر 2027.1.0 · المحرّك 1.0.0 · بُني في ⁦2026-11-24⁩ · الإيداع 52f63c0
