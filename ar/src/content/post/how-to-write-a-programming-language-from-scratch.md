---
publishDate: 2024-07-12T21:07:11+08:00
title: كيف تكتب لغة برمجة من الصفر - AQ
excerpt: كيفية كتابة لغة برمجة من الصفر AQ هي لغة برمجة مفسرة سريعة وصغيرة وبسيطة وآمنة.
image: https://www.axa6.com/aq.png
category: Blog
tags:
  - AQ
  - Blog
metadata:
  canonical: https://www.axa6.com/ar/how-to-write-a-programming-language-from-scratch
---

# مقدمة
كيف تصمم لغة برمجة من الصفر؟ ما هي الأجزاء التي يجب أن تتضمنها لغة البرمجة الجديدة؟</br>
ستتناول هذه المقالة بالتفصيل عملية تطوير لغة برمجة من خلال تصميم AQ، بدءًا من الصفر وحتى التصميم وتطوير المترجم والبنية التحتية ذات الصلة، وفي النهاية إكمال بناء لغة برمجة.</br>

# مقدمة إلى عبد القدير

**AQ** هي لغة برمجة "مفسرة" وهي برامج "سريعة" و"صغيرة" و"بسيطة" و"آمنة". كود المصدر لـ "AQ" متاح على "GitHub"، مفتوح المصدر، ويتبع "ترخيص AQ".

عنوان GitHub: https://github.com/aq-org/AQ، حيث يمكنك الحصول على الكود المصدري لـ `AQ`.

## سمات

- **سريع** (تجميع `الكود المصدر` و`سرعة التشغيل`)
- **صغير** (حجم `شفرة المصدر`)
- **بسيط** (سهل التعلم)
- **آمن** ('إدارة الذاكرة' و'التحقق من التعليمات البرمجية' بشكل آمن)
- **الأنظمة الأساسية المشتركة** (يدعم أنظمة التشغيل Windows وLinux وMacOS وما إلى ذلك)
- بناء جملة يشبه لغة C++ (سريع الفهم)
- تفسير (اختياري `تجميع`)
- مجاني (يتبع "ترخيص AQ")
- مفتوح المصدر (استنادًا إلى "ترخيص AQ")

#تصميم
## الخطة الأصلية
بدأ تطوير AQ مبدئيًا في أكتوبر 2023 وخضع لعملية إعادة الهيكلة في 1 فبراير 2024، مع مراجعات متعددة تشكل إطار العمل الحالي.</br>

كانت الخطة الأصلية هي تنفيذ المترجم في لغة C++ ثم تطوير الجهاز الظاهري، ومع ذلك، نظرًا لأن المترجم يحتاج إلى الترجمة إلى الرمز الثانوي للجهاز الظاهري وبسبب وقت تطوير المترجم المطول، فقد تم التخلي عن الإصدار الأصلي ولكن يمكن العثور عليها في الالتزامات.</br>

## خطة جديدة
تتمثل الخطة الجديدة في تطوير "جهاز AQ الظاهري" أولاً ثم تنفيذ المترجم من خلال وسائل أخرى، نظرًا لأنه تم تطويره في لغة C، فإن "جهاز AQ الظاهري" يقلل من حمل الأداء ويكتسب دعمًا أوسع حاليًا مقسمة إلى "مترجم"، و"ذاكرة"، و"وقت تشغيل"، و"مكتبة نظام التشغيل".</br>

1. "المترجم الفوري" هو محرك تنفيذ "جهاز AQ الظاهري". ويجري حاليًا تطوير وظائف تنفيذ تعليمات Bytecode.</br>
2. "الذاكرة" هي مخزن "جهاز AQ الظاهري". ولأسباب تتعلق بالكفاءة، يعتمد "جهاز AQ الظاهري" على بنية تسجيل ستتم إضافتها في المستقبل.</br>
3. "وقت التشغيل" هو البيئة التابعة لـ "جهاز AQ الظاهري"، بما في ذلك معالجة الأخطاء والمخرجات القياسية والمكونات الضرورية الأخرى، مما يوفر بيئة تشغيل أساسية لـ AQ.</br>
4. تعد "مكتبة نظام التشغيل" مكونًا ضروريًا لتفاعل "جهاز AQ الظاهري" مع نظام التشغيل.</br>

تشتمل هذه الأجزاء الأربعة من التصميم بشكل أساسي على معظم مكونات الجهاز الظاهري للغة المفسرة، ومع استمرار توسع وظائف لغة البرمجة في المستقبل، يمكن تنفيذ الترقيات عن طريق إضافة مكونات.</br>


## الأسباب والمزايا
تم تصميم لغة AQ كلغة مترجمة للتوافق مع الأنظمة الأساسية المتعددة. في المستقبل، يمكن أن يؤدي المزيد من أعمال تطوير المترجم لأنظمة تشغيل مختلفة إلى جعل التطوير أكثر كفاءة، استنادًا إلى بنية التسجيل، كما أنه يقلل من فقدان الأداء.</br>

> نحن نعمل جاهدين على تطوير `AQ Virtual Machine` إذا كنت ترغب في معرفة المزيد أو المشاركة في أعمال التطوير، يرجى متابعة موقعنا الرسمي: https://www.axa6.com وGitHub: https://github. .com/aq-org/AQ.</br>

> تم نشر هذه المقالة بموجب ترخيص AQ: https://github.com/aq-org/AQ/blob/main/LICENSE، إذا لزم الأمر، يرجى تعديلها أو إعادة طباعتها وفقًا لترخيص AQ.