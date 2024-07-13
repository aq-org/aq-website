---
publishDate: 2024-07-13T19:12:03+08:00
title: بنية ذاكرة الجهاز الظاهري ممتازة - AQ
excerpt: تؤثر بنية ذاكرة الجهاز الظاهري بشكل مباشر على أداء الجهاز الظاهري وإشغاله.  يمكن أن يؤدي تصميم بنية ممتازة إلى تحسين الأداء والكفاءة بشكل فعال.  ستقدم هذه المقالة بنية الذاكرة التي تستخدمها أجهزة AQ الافتراضية.
image: https://www.axa6.com/aq.png
category: Blog
tags:
  - AQ
  - Blog
metadata:
  canonical: https://www.axa6.com/ar/an-excellent-virtual-machine-memory-architecture
---

# مقدمة
 تؤثر بنية ذاكرة "الجهاز الظاهري" بشكل مباشر على أداء الجهاز الظاهري وإشغاله.  يمكن أن يؤدي تصميم بنية ممتازة إلى تحسين الأداء والكفاءة بشكل فعال.  </br>
 ستقدم هذه المقالة بنية الذاكرة المستخدمة بواسطة "AQ Virtual Machine" والمعايير التفصيلية لذاكرة "AQ Virtual Machine".  </br>
 من خلال تحسين بنية الذاكرة الخاصة بـ "الجهاز الافتراضي"، سيساعد ذلك "الجهاز الافتراضي" على *كفاءة التشغيل* و *تقليل الإشغال*.  إذا كان ذلك ممكنًا، يجب عليك تحقيق التوازن بين الاثنين قدر الإمكان لجعل "الجهاز الافتراضي" يصل إلى حالته المثالية.  </br>

 > في بعض الحالات، يجب إجراء عمليات تطوير مختلفة بناءً على الاحتياجات الخاصة للجهاز الظاهري.  </br>
 > على سبيل المثال: في المواقف *الذاكرة المحدودة* مثل `وحدة التحكم الدقيقة`، من الضروري *تقليل الإشغال* قدر الإمكان.  </br>
 > في المواقف *الحساسة للأداء* مثل "الحوسبة المتوازية"، تحتاج إلى التركيز على *تحسين الأداء*.  </br>

 # أفكار التصميم
 ## بنية الذاكرة
 ### بنية الذاكرة الأساسية
 يعتمد "AQ" بنية الذاكرة الأساسية لـ "التسجيل"، ولكنه يختلف عن بنية "التسجيل" القياسية، وقد قام ببعض التحسينات والتحسينات على بنية "التسجيل".  </br>
 > "التسجيل" هنا ليس "التسجيل" في "وحدة المعالجة المركزية"، ولكنه "السجل الافتراضي" الذي تمت محاكاته في "الذاكرة".  </br>

 ### سبب اختيار التسجيل
 بالمقارنة مع بنية المكدس التي تتبناها الأجهزة الافتراضية للغة السائدة مثل `JAVA` و`Python`، فإن السبب وراء قرار `AQ` باعتماد بنية ``التسجيل`` هو تحسين الأداء وسهولة فهم ``الرمز الثانوي``.  </br>
 على الرغم من أن بنية "المكدس" تعتبر بشكل عام أسهل في النقل والكتابة، إلا أنه سيكون هناك بعض الخسائر في الأداء الفعلي سيؤدي الوصول المتعدد إلى "الذاكرة" إلى إبطائها، وهو أمر لا مفر منه ويصعب تحسينه بالكامل.  لذلك، من أجل حل مشكلة *فقدان الأداء* هنا، يتبنى `AQ` بنية `التسجيل`.  في الوقت نفسه، من منظور "الرمز الثانوي"، فإن الرمز الثانوي لبنية "التسجيل" *أسهل في الفهم*. تشبه تعليماته طريقة "المعلمات" الخاصة بـ "الوظيفة"، بدلاً من مواجهة العديد منها مباشرةً تشغيل المكدس.  </br>

 ### الفرق بين بنية "التسجيل".
 #### بنية التسجيل القياسية
 في بنية السجل القياسية، تتضمن "السجلات" ما يلي:</br>

 1. `نوع البيانات` - نوع البيانات التي سيخزنها السجل (مثل int، وfloat، وDouble، وما إلى ذلك)
 2. "البيانات" - قيمة البيانات التي سيقوم السجل بتخزينها
 3. (اختياري) العلامة - علامة البيانات التي سيخزنها السجل (مثل المتغير، الوظيفة، الفئة، إلخ.)
 4. (اختياري) مرجع - مرجع للبيانات التي سيخزنها السجل (مثل عنوان كائن، وما إلى ذلك)

 على الرغم من أن بنية الذاكرة للأجهزة الافتراضية في اللغات المختلفة قد تكون مختلفة، إلا أنه يتم تخزين هذه المعلومات بشكل عام.  </br>

 تم استخدام هذه البنية أثناء تطوير `AQ`، ولكن بعد الاختبار، استهلكت كمية كبيرة من الذاكرة.  </br>

 فيما يلي رمز `register.h` الذي يستخدمه `AQ`:</br>

```C
// Copyright 2024 AQ authors, All Rights Reserved.
// This program is licensed under the AQ License. You can find the AQ license in
// the root directory.

#ifndef AQ_AQVM_MEMORY_REGISTER_H_
#define AQ_AQVM_MEMORY_REGISTER_H_

#include <stdbool.h>

enum AqvmMemoryRegister_ValueType {
  // TODO(Register): Waiting for the improvement of the register.
  AqvmMemoryRegisterValueType_INT,
  AqvmMemoryRegisterValueType_CONSTINT,
  AqvmMemoryRegisterValueType_FLOAT,
  AqvmMemoryRegisterValueType_CONSTFLOAT,
  AqvmMemoryRegisterValueType_DOUBLE,
  AqvmMemoryRegisterValueType_CONSTDOUBLE,
  AqvmMemoryRegisterValueType_LONG,
  AqvmMemoryRegisterValueType_CONSTLONG,
  AqvmMemoryRegisterValueType_CHARACTER,
  AqvmMemoryRegisterValueType_CONSTCHARACTER,
  AqvmMemoryRegisterValueType_BOOLEAN,
  AqvmMemoryRegisterValueType_CONSTBOOLEAN
};

union AqvmMemoryRegister_Value {
  // TODO(Register): Waiting for the improvement of the register.
  int int_value;
  const int const_int_value;
  float float_value;
  const float const_float_value;
  double double_value;
  const double const_double_value;
  long long_value;
  const long const_long_value;
  char character_value;
  const char const_character_value;
  bool boolean_value;
  const bool const_boolean_value;
};

struct AqvmMemoryRegister_Register {
  enum AqvmMemoryRegister_ValueType type;
  union AqvmMemoryRegister_Value value;
};

#endif
```

كما يتبين من الكود أعلاه، حتى لو تم الاحتفاظ بالمحتوى الضروري فقط، لأن `AqvmMemoryRegister_ValueType` من النوع `enum` يحتل `4` بايت، و`AqvmMemoryRegister_Value` من النوع `union` يحتل `8` بايت والنوع "struct" سيشغل "12" بايت من الذاكرة.  </br>

 في الوقت نفسه، نظرًا لتحسين برنامج التحويل البرمجي "C"، فإن "النوع" من النوع "enum" في "AqvmMemoryRegister_Register" من النوع "struct" هو "محاذاة الذاكرة" مع "قيمة" " union`، لذلك تتم إضافة `4` كلمات إلى قسم ``ملء الذاكرة``.  اجعل `AqvmMemoryRegister_Register` من النوع `struct` يشغل `16` بايت.  </br>

 إذا كنت تستخدم `int` وأنواع بايت أخرى غير 8`، فسيتم إهدار `4` بايت من `ذاكرة التعبئة`، مما يؤدي إلى فقدان الذاكرة.  لذلك سيكون هناك `4` - `8` بايت من الذاكرة مهدرة في كافة السجلات.  </br>

 ### هيكل التسجيل لـ `AQ`
 من أجل حل مشكلة الإشغال في بنية "التسجيل" التقليدية، يجمع "AQ" بين ميزات "جدول المتغيرات المحلية" في "إطار المكدس" الخاص بـ "JVM" ويحسن "بنية الذاكرة"، مما يقلل بشكل كبير من مشكلة الإشغال.  </br>

 فيما يلي ثلاثة بدائل:</br>

```C
// plan 1:
struct AqvmMemoryRegister_Register{
  uint8_t type;
  void* value_ptr;
};
void* value;
AqvmMemoryRegister_Register array[];

// plan 2:
void* value;
// value to the memory address of index 0 is int, the index 0 to the index 1 is
// float, etc.
size_t type[];

// plan 3:
struct AqvmMemoryRegister_Register {
  uint32_t* value;
  size_t size;
};
```

نظرًا لأن المؤشر يشغل `4`-`8` بايت، فإن البيانات نفسها تشغل `1`-`8` بايت، بالإضافة إلى النوع `1` بايت، لذا فإن `الخطة 1` تشغل `6`-`17` بايت، و قد يكون هناك "محاذاة للذاكرة"، لذا فإن "الخطة 1" ستتسبب أيضًا في فقدان الذاكرة بشكل كبير.  </br>
 في الواقع، عندما يكون مطلوبًا الاحتفاظ بمعلومات نوع الذاكرة، فإن أعلى استخدام للذاكرة هو "الخطة 2"، لكن "الخطة 2" لا يمكنها حفظ "تماسك" أنواع مختلفة من البيانات في نفس بنية البيانات (مثل البنية) مما قد يؤدي إلى إبطال بعض عمليات المؤشر.  لذلك، من أجل "سلامة الذاكرة"، لا يتم استخدام "الخطة 2".  </br>
 في بعض الحالات (تتضمن مجموعة تعليمات الجهاز الظاهري أنواعًا)، يمكن أن تلبي "الخطة 3" أيضًا احتياجات تخزين الذاكرة، ومع ذلك، نظرًا لاحتياجات مجموعة التعليمات المخفضة، لا يتم تضمين معلومات النوع في التعليمات، لذلك لا يمكن ذلك تلبية احتياجات تشغيل الآلة الافتراضية.  </br>

 لذلك، نعتمد التصميم التالي لضمان "معدل استخدام" "الذاكرة" وفي نفس الوقت تحسين مشكلة استخدام الذاكرة بشكل كبير.  </br>

 تستخدم ذاكرة `AQ` مؤشرات void*` مباشرة لتخزين البيانات، وتخزن `size_t` حجم الذاكرة المشغولة، وتستخدم نوع تخزين المصفوفة `uint8_t`.  نظرًا لأن `uint8_t` يشغل `8` بتات، ولتقليل الإشغال، يستخدم كل بايت `4` بتات لتخزين النوع.  لذلك، يمكن للمتغير `uint8_t` تخزين نوعين.  يتم استخدام البتات "4" الأولى من كل متغير "uint8_t" لنوع البايت "الزوجي"، ويتم استخدام البتات "4" الأخيرة لنوع البايت "الفردي".  </br>

```C
// The struct stores information about the memory.
// |type| is a pointer to an array that stores the type of each byte in the
// memory. Each byte uses 4 bits to store the type. So a uint8_t variable can
// store 2 types. Each uint8_t variable's first 4 bits are used for the even
// byte's type and the next 4 bits are used for the odd byte's type. The type
// list is in types.h.
// |data| is a pointer of type void* to the memory that stores the data.
// |size| is the size of the memory.
// NOTICE: The struct AqvmMemory_Memory only stores information of the memory.
// The memory is allocated by the bytecode function when storing the bytecode.
// The memory of |memory| and |type| is part of the bytecode memory.
struct AqvmMemory_Memory {
  uint8_t* type;
  void* data;
  size_t size;
};
```

بسبب "الذاكرة"، يتطلب الوصول إلى "النوع" استخدامًا دقيقًا.  يتطلب النوع `uint8_t` `8` بتات، ولكنه يتجاوز احتياجات التخزين للنوع، لذلك لا يمكن لـ `4` بتات أن تلبي احتياجات التخزين للنوع فحسب، بل تقلل أيضًا من استخدام الذاكرة.  لكن هناك وظائف خاصة مطلوبة للحفاظ على الوصول إلى "النوع".  </br>

```C
// Sets the type of the data at |index| bytes in |memory| to |type|. |type|
// should be less than 4 bits.
// Returns 0 if successful. Returns -1 if the memory pointer is NULL. Returns -2
// if the type pointer is NULL. Returns -3 if the index is out of range. Returns
// -4 if the type is out of range.
int AqvmMemory_SetType(const struct AqvmMemory_Memory* memory, size_t index,
                       uint8_t type) {
  if (memory == NULL) {
    AqvmRuntimeDebugger_OutputReport("\"ERROR\"",
                                     "\"AqvmMemory_SetType_NullMemoryPointer\"",
                                     "\"The memory pointer is NULL.\"", NULL);
    return -1;
  }
  if (memory->type == NULL) {
    AqvmRuntimeDebugger_OutputReport("\"ERROR\"",
                                     "\"AqvmMemory_SetType_NullTypePointer\"",
                                     "\"The type pointer is NULL.\"", NULL);
    return -2;
  }
  if (index > memory->size) {
    AqvmRuntimeDebugger_OutputReport(
        "\"ERROR\"", "\"AqvmMemory_SetType_OutOfMemoryRange\"",
        "\"The index is out of memory range.\"", NULL);
    return -3;
  }
  if (type > 0x0F) {
    AqvmRuntimeDebugger_OutputReport("\"ERROR\"",
                                     "\"AqvmMemory_SetType_OutOfTypeRange\"",
                                     "\"The type is out of range.\"", NULL);
    return -4;
  }

  // Sets the type of the data at |index| bytes in memory.
  // Since Aqvm stores type data occupying 4 bits and uint8_t occupying 8 bits,
  // each uint8_t type location stores two type data. The storage locations
  // (high 4 bits, low 4 bits) are set according to the parity of |index|. Even
  // numbers are stored in the high bits of (|index| / 2) and odd numbers are
  // stored in the low bits of (|index| / 2).
  if (index % 2 != 0) {
    memory->type[index / 2] = (memory->type[index / 2] & 0xF0) | type;
  } else {
    memory->type[index / 2] = (memory->type[index / 2] & 0x0F) | (type << 4);
  }

  return 0;
}

// Gets the type of the data at |index| bytes in |memory|.
// Returns the type that is less than 4 bits (0X0F) if successful. Returns 0x11
// if the memory pointer is NULL. Returns 0x12 if the type pointer is NULL.
// Returns 0x13 if the index is out of memory range.
uint8_t AqvmMemory_GetType(struct AqvmMemory_Memory* memory, size_t index) {
  if (memory == NULL) {
    AqvmRuntimeDebugger_OutputReport("\"ERROR\"",
                                     "\"AqvmMemory_GetType_NullMemoryPointer\"",
                                     "\"The memory pointer is NULL.\"", NULL);
    return 0x11;
  }
  if (memory->type == NULL) {
    AqvmRuntimeDebugger_OutputReport("\"ERROR\"",
                                     "\"AqvmMemory_GetType_NullTypePointer\"",
                                     "\"The type pointer is NULL.\"", NULL);
    return 0x12;
  }
  if (index > memory->size) {
    AqvmRuntimeDebugger_OutputReport(
        "\"ERROR\"", "\"AqvmMemory_GetType_OutOfMemoryRange\"",
        "\"The index is out of memory range.\"", NULL);
    return 0x13;
  }

  // Gets the type of the data at |index| bytes in memory.
  // Since Aqvm stores type data occupying 4 bits and uint8_t occupying 8 bits,
  // each uint8_t type location stores two type data. The storage locations
  // (high 4 bits, low 4 bits) are set according to the parity of |index|. Even
  // numbers are stored in the high bits of (|index| / 2) and odd numbers are
  // stored in the low bits of (|index| / 2).
  if (index % 2 != 0) {
    return memory->type[index / 2] & 0x0F;
  } else {
    return (memory->type[index / 2] & 0xF0) >> 4;
  }
}
```

ومع ذلك، فإن استخدام هذا التصميم له متطلبات أعلى لتخزين البيانات، لأن طول البيانات غير ثابت، لذلك يلزم وظائف خاصة للعمل مع الذاكرة.  </br>

```C
// Writes the data that |data_ptr| points to of size |size| to the data of at
// |index| bytes in |memory|.
// Returns 0 if successful. Returns -1 if the memory pointer is NULL. Returns -2
// if the type pointer is NULL. Returns -3 if the index is out of range. Returns
// -4 if the data pointer is NULL.
int AqvmMemory_WriteData(struct AqvmMemory_Memory* memory, size_t index,
                         void* data_ptr, size_t size) {
  if (memory == NULL) {
    AqvmRuntimeDebugger_OutputReport(
        "\"ERROR\"", "\"AqvmMemory_WriteData_NullMemoryPointer\"",
        "\"The memory pointer is NULL.\"", NULL);
    return -1;
  }
  if (memory->type == NULL) {
    AqvmRuntimeDebugger_OutputReport("\"ERROR\"",
                                     "\"AqvmMemory_WriteData_NullTypePointer\"",
                                     "\"The type pointer is NULL.\"", NULL);
    return -2;
  }
  if (index > memory->size) {
    AqvmRuntimeDebugger_OutputReport(
        "\"ERROR\"", "\"AqvmMemory_WriteData_OutOfMemoryRange\"",
        "\"The index is out of memory range.\"", NULL);
    return -3;
  }
  if (data_ptr == NULL) {
    AqvmRuntimeDebugger_OutputReport("\"ERROR\"",
                                     "\"AqvmMemory_WriteData_NullDataPointer\"",
                                     "\"The data pointer is NULL.\"", NULL);
    return -4;
  }

  // Since void* does not have a specific size, pointer moves need to be
  // converted before moving.
  memcpy((void*)((uintptr_t)memory->data + index), data_ptr, size);

  return 0;
}
```

بالإضافة إلى تقليل استخدام الذاكرة، من المهم بنفس القدر تجنب الاحتلال الثانوي للذاكرة.  لذلك، نقوم بإعادة استخدام "ذاكرة" "الرمز الثانوي"، وتخزين بيانات الذاكرة وأنواعها في جزء الذاكرة من "الرمز الثانوي"، واستخدام "الذاكرة" المخصصة مسبقًا في ملف "الرمز الثانوي" (يحتوي ملف الرمز الثانوي على البيانات و أنواع "الذاكرة") لتحقيق الاستخدام الفعال لـ "الذاكرة".  </br>
 لأنه إذا قمت بتخزين جزأين بشكل منفصل، فستحتاج إلى جزأين من بيانات وأنواع الذاكرة المتكررة، جزء واحد موجود في جزء "الذاكرة"، والجزء الآخر، جزء "الرمز الثانوي"، لن يتم استخدامه، لذلك نعتمد. إعادة الاستخدام تعمل هذه الطريقة على تقليل هدر الذاكرة الناتج عن بيانات الذاكرة وأنواعها.  </br>
 ومع ذلك، يلزم تنفيذ وظيفة خاصة، وتجدر الإشارة إلى أن تخصيص وإصدار بيانات الذاكرة وأنواع الذاكرة تتم إدارتها من خلال وظائف الكود الثانوي ذات الصلة.  </br>

```C
// Creates the struct AqvmMemory_Memory with |data|, |type|, and |size|.
// The function will allocate a struct AqvmMemory_Memory and copy |data|,
// |type|, and |size| into the struct. Returns a pointer to the struct if
// successful. Returns NULL if creation fails.
struct AqvmMemory_Memory* AqvmMemory_CreateMemory(void* data, void* type,
                                                  size_t size) {
  struct AqvmMemory_Memory* memory_ptr =
      (struct AqvmMemory_Memory*)malloc(sizeof(struct AqvmMemory_Memory));
  if (memory_ptr == NULL) {
    AqvmRuntimeDebugger_OutputReport(
        "\"ERROR\"", "\"AqvmMemory_CreateMemory_MemoryAllocationFailure\"",
        "\"Failed to allocate memory.\"", NULL);
    return NULL;
  }

  memory_ptr->data = data;
  memory_ptr->type = type;
  memory_ptr->size = size;

  return memory_ptr;
}

// Free the memory of the |memory_ptr|. No return.
// NOTICE: The function only free the memory of the struct. The memory pointed
// to by pointers to data and type in struct is not freed. This memory is
// managed by bytecode related functions.
void AqvmMemory_FreeMemory(struct AqvmMemory_Memory* memory_ptr) {
  free(memory_ptr);
}
```

بالإضافة إلى ذلك، نظرًا لأن تعريف الأنواع في بعض الأنظمة يختلف عن معيار AQ، فقد تم تصميم الوظائف ذات الصلة لضمان امتثال الجهاز الظاهري للمعيار.  إذا اختلفت الأنظمة عن المعيار، فيجب عمل تصميمات خاصة لهذه الأنظمة.  </br>

```C
// Checks the memory conditions in the system.
// Returns the number of warnings.
int AqvmMemory_CheckMemoryConditions() {
  int warning_count = 0;
  if (sizeof(aqint) != 4) {
    AqvmRuntimeDebugger_OutputReport(
        "\"WARNING\"", "\"AqvmMemory_CheckMemoryConditions_IntLengthWarning\"",
        "\"The length requirement for the int type does not conform to the "
        "type "
        "definition.\"",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqlong) != 8) {
    AqvmRuntimeDebugger_OutputReport(
        "\"WARNING\"", "\"AqvmMemory_CheckMemoryConditions_LongLengthWarning\"",
        "\"The length requirement for the long type does not conform to the "
        "type "
        "definition.\"",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqfloat) != 4) {
    AqvmRuntimeDebugger_OutputReport(
        "\"WARNING\"",
        "\"AqvmMemory_CheckMemoryConditions_FloatLengthWarning\"",
        "\"The length requirement for the float type does not conform to the "
        "type definition.\"",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqdouble) != 4) {
    AqvmRuntimeDebugger_OutputReport(
        "\"WARNING\"",
        "\"AqvmMemory_CheckMemoryConditions_DoubleLengthWarning\"",
        "\"The length requirement for the double type does not conform to the "
        "type definition.\"",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqchar) != 1) {
    AqvmRuntimeDebugger_OutputReport(
        "\"WARNING\"", "\"AqvmMemory_CheckMemoryConditions_CharLengthWarning\"",
        "\"The length requirement for the char type does not conform to the "
        "type "
        "definition.\"",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqbool) != 1) {
    AqvmRuntimeDebugger_OutputReport(
        "\"WARNING\"", "\"AqvmMemory_CheckMemoryConditions_BoolLengthWarning\"",
        "The length requirement for the bool type does not conform to the type "
        "definition.",
        NULL);
    ++warning_count;
  }

  if (warning_count == 0) {
    AqvmRuntimeDebugger_OutputReport("\"INFO\"",
                                     "\"AqvmMemory_CheckMemoryConditions_CheckNormal\"",
                                     "\"No memory conditions warning.\"", NULL);
  }

  return warning_count;
}
```

# المعايير التفصيلية:
 ## بنية الدليل
 رمز جزء "الذاكرة" موجود في "/aqvm/memory".  يحتوي على ملفات تعليمات برمجية متعددة.  </br>
 1. `CMakeLists.txt` - ملف بناء CMake في هذا الدليل
 2. `memory.h` - هياكل بيانات الذاكرة والوظائف ذات الصلة
 3. `memory.c` - تنفيذ الوظائف المتعلقة بالذاكرة
 4. `types.h` - تعريف أنواع الذاكرة

 ## الذاكرة.ح
 ### AqvmMemory_Memory
 يقوم هذا الهيكل بتخزين معلومات حول الذاكرة.  </br>
 |النوع| هو مؤشر لمصفوفة تقوم بتخزين نوع كل بايت في الذاكرة.  يستخدم كل بايت 4 بتات لتخزين النوع.  لذلك، يمكن لمتغير uint8_t تخزين نوعين.  يتم استخدام أول 4 بتات من كل متغير uint8_t لنوع البايتات الزوجية، ويتم استخدام آخر 4 بتات لنوع البايتات الفردية.  قائمة الأنواع موجودة في Types.h.  </br>
 |البيانات| هي مؤشر من النوع void* إلى الذاكرة التي يتم تخزين البيانات فيها.  </br>
 |الحجم|. هو حجم الذاكرة.  </br>
 ملاحظة: تقوم البنية AqvmMemory_Memory بتخزين معلومات الذاكرة فقط.  يتم تخصيص الذاكرة بواسطة وظيفة الرمز الثانوي عند تخزين الرمز الثانوي.  تعتبر ذاكرة |الذاكرة| و|النوع| جزءًا من ذاكرة الكود الثانوي.  </br>

```C
struct AqvmMemory_Memory {
  uint8_t* type;
  void* data;
  size_t size;
};
```

### AqvmMemory_CheckMemoryConditions
التحقق من ظروف الذاكرة في النظام.  </br>
 إرجاع عدد التحذيرات.  </br>

```C
int AqvmMemory_CheckMemoryConditions() {
  int warning_count = 0;
  if (sizeof(aqint) != 4) {
    AqvmRuntimeDebugger_OutputReport(
        "\"WARNING\"", "\"AqvmMemory_CheckMemoryConditions_IntLengthWarning\"",
        "\"The length requirement for the int type does not conform to the "
        "type "
        "definition.\"",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqlong) != 8) {
    AqvmRuntimeDebugger_OutputReport(
        "\"WARNING\"", "\"AqvmMemory_CheckMemoryConditions_LongLengthWarning\"",
        "\"The length requirement for the long type does not conform to the "
        "type "
        "definition.\"",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqfloat) != 4) {
    AqvmRuntimeDebugger_OutputReport(
        "\"WARNING\"",
        "\"AqvmMemory_CheckMemoryConditions_FloatLengthWarning\"",
        "\"The length requirement for the float type does not conform to the "
        "type definition.\"",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqdouble) != 4) {
    AqvmRuntimeDebugger_OutputReport(
        "\"WARNING\"",
        "\"AqvmMemory_CheckMemoryConditions_DoubleLengthWarning\"",
        "\"The length requirement for the double type does not conform to the "
        "type definition.\"",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqchar) != 1) {
    AqvmRuntimeDebugger_OutputReport(
        "\"WARNING\"", "\"AqvmMemory_CheckMemoryConditions_CharLengthWarning\"",
        "\"The length requirement for the char type does not conform to the "
        "type "
        "definition.\"",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqbool) != 1) {
    AqvmRuntimeDebugger_OutputReport(
        "\"WARNING\"", "\"AqvmMemory_CheckMemoryConditions_BoolLengthWarning\"",
        "The length requirement for the bool type does not conform to the type "
        "definition.",
        NULL);
    ++warning_count;
  }

  if (warning_count == 0) {
    AqvmRuntimeDebugger_OutputReport("\"INFO\"",
                                     "\"AqvmMemory_CheckMemoryConditions_CheckNormal\"",
                                     "\"No memory conditions warning.\"", NULL);
  }

  return warning_count;
}
```

### AqvmMemory_CreateMemory
إنشاء بنية AqvmMemory_Memory تحتوي على |بيانات|، |نوع|، و |حجم|.  </br>
 تقوم هذه الوظيفة بتخصيص بنية AqvmMemory_Memory ونسخ |البيانات|، |النوع|، و|الحجم| في البنية.  إرجاع مؤشر إلى هذا الهيكل.  إرجاع NULL إذا فشل الإنشاء.  </br>

```C
struct AqvmMemory_Memory* AqvmMemory_CreateMemory(void* data, void* type,
                                                  size_t size) {
  struct AqvmMemory_Memory* memory_ptr =
      (struct AqvmMemory_Memory*)malloc(sizeof(struct AqvmMemory_Memory));
  if (memory_ptr == NULL) {
    AqvmRuntimeDebugger_OutputReport(
        "\"ERROR\"", "\"AqvmMemory_CreateMemory_MemoryAllocationFailure\"",
        "\"Failed to allocate memory.\"", NULL);
    return NULL;
  }

  memory_ptr->data = data;
  memory_ptr->type = type;
  memory_ptr->size = size;

  return memory_ptr;
}
```

### AqvmMemory_FreeMemory
حرر ذاكرة |memory_ptr|.  لا توجد قيمة إرجاع.  </br>
 ملاحظة: تقوم هذه الوظيفة بتحرير ذاكرة الهيكل فقط.  لن يتم تحرير الذاكرة التي تشير إليها المؤشرات إلى البيانات والأنواع الموجودة في البنية.  تتم إدارة هذه الذكريات من خلال الوظائف المرتبطة بالرمز الثانوي.  </br>

```C
void AqvmMemory_FreeMemory(struct AqvmMemory_Memory* memory_ptr) {
  free(memory_ptr);
}
```

### AqvmMemory_SetType
قم بتعيين نوع البيانات عند |الفهرس| بايت في |الذاكرة| إلى |نوع|.  |النوع| يجب أن يكون أقل من 4 أرقام.  </br>
 يعود 0 على النجاح.  إذا كان مؤشر الذاكرة NULL، فسيتم إرجاع -1.  إذا كان مؤشر الفهرس فارغًا، فسيتم إرجاع -2.  إذا كان الفهرس خارج النطاق، فسيتم إرجاع -3.  إذا كان النوع خارج النطاق، فسيتم إرجاع -4.  </br>

```C
int AqvmMemory_SetType(const struct AqvmMemory_Memory* memory, size_t index,
                       uint8_t type) {
  if (memory == NULL) {
    AqvmRuntimeDebugger_OutputReport("\"ERROR\"",
                                     "\"AqvmMemory_SetType_NullMemoryPointer\"",
                                     "\"The memory pointer is NULL.\"", NULL);
    return -1;
  }
  if (memory->type == NULL) {
    AqvmRuntimeDebugger_OutputReport("\"ERROR\"",
                                     "\"AqvmMemory_SetType_NullTypePointer\"",
                                     "\"The type pointer is NULL.\"", NULL);
    return -2;
  }
  if (index > memory->size) {
    AqvmRuntimeDebugger_OutputReport(
        "\"ERROR\"", "\"AqvmMemory_SetType_OutOfMemoryRange\"",
        "\"The index is out of memory range.\"", NULL);
    return -3;
  }
  if (type > 0x0F) {
    AqvmRuntimeDebugger_OutputReport("\"ERROR\"",
                                     "\"AqvmMemory_SetType_OutOfTypeRange\"",
                                     "\"The type is out of range.\"", NULL);
    return -4;
  }

  // Sets the type of the data at |index| bytes in memory.
  // Since Aqvm stores type data occupying 4 bits and uint8_t occupying 8 bits,
  // each uint8_t type location stores two type data. The storage locations
  // (high 4 bits, low 4 bits) are set according to the parity of |index|. Even
  // numbers are stored in the high bits of (|index| / 2) and odd numbers are
  // stored in the low bits of (|index| / 2).
  if (index % 2 != 0) {
    memory->type[index / 2] = (memory->type[index / 2] & 0xF0) | type;
  } else {
    memory->type[index / 2] = (memory->type[index / 2] & 0x0F) | (type << 4);
  }

  return 0;
}
```

### AqvmMemory_GetType
الحصول على نوع البيانات في |الفهرس|.  </br>
 إرجاع نوع أقل من 4 بت (0X0F) عند النجاح.  إذا كان مؤشر الذاكرة NULL، فسيتم إرجاع 0x11.  إذا كان مؤشر الفهرس NULL، فسيتم إرجاع 0x12.  إذا كان الفهرس نفاد الذاكرة، يتم إرجاع 0x13.  </br>

```C
uint8_t AqvmMemory_GetType(struct AqvmMemory_Memory* memory, size_t index) {
  if (memory == NULL) {
    AqvmRuntimeDebugger_OutputReport("\"ERROR\"",
                                     "\"AqvmMemory_GetType_NullMemoryPointer\"",
                                     "\"The memory pointer is NULL.\"", NULL);
    return 0x11;
  }
  if (memory->type == NULL) {
    AqvmRuntimeDebugger_OutputReport("\"ERROR\"",
                                     "\"AqvmMemory_GetType_NullTypePointer\"",
                                     "\"The type pointer is NULL.\"", NULL);
    return 0x12;
  }
  if (index > memory->size) {
    AqvmRuntimeDebugger_OutputReport(
        "\"ERROR\"", "\"AqvmMemory_GetType_OutOfMemoryRange\"",
        "\"The index is out of memory range.\"", NULL);
    return 0x13;
  }

  // Gets the type of the data at |index| bytes in memory.
  // Since Aqvm stores type data occupying 4 bits and uint8_t occupying 8 bits,
  // each uint8_t type location stores two type data. The storage locations
  // (high 4 bits, low 4 bits) are set according to the parity of |index|. Even
  // numbers are stored in the high bits of (|index| / 2) and odd numbers are
  // stored in the low bits of (|index| / 2).
  if (index % 2 != 0) {
    return memory->type[index / 2] & 0x0F;
  } else {
    return (memory->type[index / 2] & 0xF0) >> 4;
  }
}
```

### AqvmMemory_WriteData
يكتب البيانات بالحجم |الحجم| المشار إليها بواسطة |data_ptr| إلى البيانات الموجودة في |الفهرس|.  </br>
 يعود 0 على النجاح.  إذا كان مؤشر الذاكرة NULL، فسيتم إرجاع -1.  إذا كان مؤشر الفهرس فارغًا، فسيتم إرجاع -2.  إذا كان الفهرس نفاد الذاكرة، يتم إرجاع -3.  إذا كان مؤشر البيانات NULL، فسيتم إرجاع -4.  </br>

```C
int AqvmMemory_WriteData(struct AqvmMemory_Memory* memory, size_t index,
                         void* data_ptr, size_t size) {
  if (memory == NULL) {
    AqvmRuntimeDebugger_OutputReport(
        "\"ERROR\"", "\"AqvmMemory_WriteData_NullMemoryPointer\"",
        "\"The memory pointer is NULL.\"", NULL);
    return -1;
  }
  if (memory->type == NULL) {
    AqvmRuntimeDebugger_OutputReport("\"ERROR\"",
                                     "\"AqvmMemory_WriteData_NullTypePointer\"",
                                     "\"The type pointer is NULL.\"", NULL);
    return -2;
  }
  if (index > memory->size) {
    AqvmRuntimeDebugger_OutputReport(
        "\"ERROR\"", "\"AqvmMemory_WriteData_OutOfMemoryRange\"",
        "\"The index is out of memory range.\"", NULL);
    return -3;
  }
  if (data_ptr == NULL) {
    AqvmRuntimeDebugger_OutputReport("\"ERROR\"",
                                     "\"AqvmMemory_WriteData_NullDataPointer\"",
                                     "\"The data pointer is NULL.\"", NULL);
    return -4;
  }

  // Since void* does not have a specific size, pointer moves need to be
  // converted before moving.
  memcpy((void*)((uintptr_t)memory->data + index), data_ptr, size);

  return 0;
}
```

### `memory.h`الكود الكامل:

```C
// Copyright 2024 AQ author, All Rights Reserved.
// This program is licensed under the AQ License. You can find the AQ license in
// the root directory.

#ifndef AQ_AQVM_MEMORY_MEMORY_H_
#define AQ_AQVM_MEMORY_MEMORY_H_

#include <stddef.h>
#include <stdint.h>

#include "aqvm/memory/types.h"

// The struct stores information about the memory.
// |type| is a pointer to an array that stores the type of each byte in the
// memory. Each byte uses 4 bits to store the type. So a uint8_t variable can
// store 2 types. Each uint8_t variable's first 4 bits are used for the even
// byte's type and the next 4 bits are used for the odd byte's type. The type
// list is in types.h.
// |data| is a pointer of type void* to the memory that stores the data.
// |size| is the size of the memory.
// NOTICE: The struct AqvmMemory_Memory only stores information of the memory.
// The memory is allocated by the bytecode function when storing the bytecode.
// The memory of |memory| and |type| is part of the bytecode memory.
struct AqvmMemory_Memory {
  uint8_t* type;
  void* data;
  size_t size;
};

// Checks the memory conditions in the system.
// Returns the number of warnings.
int AqvmMemory_CheckMemoryConditions();

// Creates the struct AqvmMemory_Memory with |data|, |type|, and |size|.
// The function will allocate a struct AqvmMemory_Memory and copy |data|,
// |type|, and |size| into the struct. Returns a pointer to the struct if
// successful. Returns NULL if creation fails.
struct AqvmMemory_Memory* AqvmMemory_CreateMemory(void* data, void* type,
                                                  size_t size);

// Free the memory of the |memory_ptr|. No return.
// NOTICE: The function only free the memory of the struct. The memory pointed
// to by pointers to data and type in struct is not freed. This memory is
// managed by bytecode related functions.
void AqvmMemory_FreeMemory(struct AqvmMemory_Memory* memory_ptr);

// Sets the type of the data at |index| bytes in |memory| to |type|. |type|
// should be less than 4 bits.
// Returns 0 if successful. Returns -1 if the memory pointer is NULL. Returns -2
// if the type pointer is NULL. Returns -3 if the index is out of range. Returns
// -4 if the type is out of range.
int AqvmMemory_SetType(const struct AqvmMemory_Memory* memory, size_t index,
                       uint8_t type);

// Gets the type of the data at |index| bytes in |memory|.
// Returns the type that is less than 4 bits (0X0F) if successful. Returns 0x11
// if the memory pointer is NULL. Returns 0x12 if the type pointer is NULL.
// Returns 0x13 if the index is out of memory range.
uint8_t AqvmMemory_GetType(struct AqvmMemory_Memory* memory, size_t index);

// Writes the data that |data_ptr| points to of size |size| to the data of at
// |index| bytes in |memory|.
// Returns 0 if successful. Returns -1 if the memory pointer is NULL. Returns -2
// if the type pointer is NULL. Returns -3 if the index is out of range. Returns
// -4 if the data pointer is NULL.
int AqvmMemory_WriteData(struct AqvmMemory_Memory* memory, size_t index,
                         void* data_ptr, size_t size);

#endif
```

## memory.c
### `memory.c`الكود الكامل:

```C
// Copyright 2024 AQ author, All Rights Reserved.
// This program is licensed under the AQ License. You can find the AQ license in
// the root directory.

#include "aqvm/memory/memory.h"

#include <stddef.h>
#include <stdint.h>
#include <stdlib.h>
#include <string.h>

#include "aqvm/memory/types.h"
#include "aqvm/runtime/debugger/debugger.h"

int AqvmMemory_CheckMemoryConditions() {
  int warning_count = 0;
  if (sizeof(aqint) != 4) {
    AqvmRuntimeDebugger_OutputReport(
        "\"WARNING\"", "\"AqvmMemory_CheckMemoryConditions_IntLengthWarning\"",
        "\"The length requirement for the int type does not conform to the "
        "type "
        "definition.\"",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqlong) != 8) {
    AqvmRuntimeDebugger_OutputReport(
        "\"WARNING\"", "\"AqvmMemory_CheckMemoryConditions_LongLengthWarning\"",
        "\"The length requirement for the long type does not conform to the "
        "type "
        "definition.\"",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqfloat) != 4) {
    AqvmRuntimeDebugger_OutputReport(
        "\"WARNING\"",
        "\"AqvmMemory_CheckMemoryConditions_FloatLengthWarning\"",
        "\"The length requirement for the float type does not conform to the "
        "type definition.\"",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqdouble) != 4) {
    AqvmRuntimeDebugger_OutputReport(
        "\"WARNING\"",
        "\"AqvmMemory_CheckMemoryConditions_DoubleLengthWarning\"",
        "\"The length requirement for the double type does not conform to the "
        "type definition.\"",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqchar) != 1) {
    AqvmRuntimeDebugger_OutputReport(
        "\"WARNING\"", "\"AqvmMemory_CheckMemoryConditions_CharLengthWarning\"",
        "\"The length requirement for the char type does not conform to the "
        "type "
        "definition.\"",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqbool) != 1) {
    AqvmRuntimeDebugger_OutputReport(
        "\"WARNING\"", "\"AqvmMemory_CheckMemoryConditions_BoolLengthWarning\"",
        "The length requirement for the bool type does not conform to the type "
        "definition.",
        NULL);
    ++warning_count;
  }

  if (warning_count == 0) {
    AqvmRuntimeDebugger_OutputReport("\"INFO\"",
                                     "\"AqvmMemory_CheckMemoryConditions_CheckNormal\"",
                                     "\"No memory conditions warning.\"", NULL);
  }

  return warning_count;
}

struct AqvmMemory_Memory* AqvmMemory_CreateMemory(void* data, void* type,
                                                  size_t size) {
  struct AqvmMemory_Memory* memory_ptr =
      (struct AqvmMemory_Memory*)malloc(sizeof(struct AqvmMemory_Memory));
  if (memory_ptr == NULL) {
    AqvmRuntimeDebugger_OutputReport(
        "\"ERROR\"", "\"AqvmMemory_CreateMemory_MemoryAllocationFailure\"",
        "\"Failed to allocate memory.\"", NULL);
    return NULL;
  }

  memory_ptr->data = data;
  memory_ptr->type = type;
  memory_ptr->size = size;

  return memory_ptr;
}

void AqvmMemory_FreeMemory(struct AqvmMemory_Memory* memory_ptr) {
  free(memory_ptr);
}

int AqvmMemory_SetType(const struct AqvmMemory_Memory* memory, size_t index,
                       uint8_t type) {
  if (memory == NULL) {
    AqvmRuntimeDebugger_OutputReport("\"ERROR\"",
                                     "\"AqvmMemory_SetType_NullMemoryPointer\"",
                                     "\"The memory pointer is NULL.\"", NULL);
    return -1;
  }
  if (memory->type == NULL) {
    AqvmRuntimeDebugger_OutputReport("\"ERROR\"",
                                     "\"AqvmMemory_SetType_NullTypePointer\"",
                                     "\"The type pointer is NULL.\"", NULL);
    return -2;
  }
  if (index > memory->size) {
    AqvmRuntimeDebugger_OutputReport(
        "\"ERROR\"", "\"AqvmMemory_SetType_OutOfMemoryRange\"",
        "\"The index is out of memory range.\"", NULL);
    return -3;
  }
  if (type > 0x0F) {
    AqvmRuntimeDebugger_OutputReport("\"ERROR\"",
                                     "\"AqvmMemory_SetType_OutOfTypeRange\"",
                                     "\"The type is out of range.\"", NULL);
    return -4;
  }

  // Sets the type of the data at |index| bytes in memory.
  // Since Aqvm stores type data occupying 4 bits and uint8_t occupying 8 bits,
  // each uint8_t type location stores two type data. The storage locations
  // (high 4 bits, low 4 bits) are set according to the parity of |index|. Even
  // numbers are stored in the high bits of (|index| / 2) and odd numbers are
  // stored in the low bits of (|index| / 2).
  if (index % 2 != 0) {
    memory->type[index / 2] = (memory->type[index / 2] & 0xF0) | type;
  } else {
    memory->type[index / 2] = (memory->type[index / 2] & 0x0F) | (type << 4);
  }

  return 0;
}

uint8_t AqvmMemory_GetType(struct AqvmMemory_Memory* memory, size_t index) {
  if (memory == NULL) {
    AqvmRuntimeDebugger_OutputReport("\"ERROR\"",
                                     "\"AqvmMemory_GetType_NullMemoryPointer\"",
                                     "\"The memory pointer is NULL.\"", NULL);
    return 0x11;
  }
  if (memory->type == NULL) {
    AqvmRuntimeDebugger_OutputReport("\"ERROR\"",
                                     "\"AqvmMemory_GetType_NullTypePointer\"",
                                     "\"The type pointer is NULL.\"", NULL);
    return 0x12;
  }
  if (index > memory->size) {
    AqvmRuntimeDebugger_OutputReport(
        "\"ERROR\"", "\"AqvmMemory_GetType_OutOfMemoryRange\"",
        "\"The index is out of memory range.\"", NULL);
    return 0x13;
  }

  // Gets the type of the data at |index| bytes in memory.
  // Since Aqvm stores type data occupying 4 bits and uint8_t occupying 8 bits,
  // each uint8_t type location stores two type data. The storage locations
  // (high 4 bits, low 4 bits) are set according to the parity of |index|. Even
  // numbers are stored in the high bits of (|index| / 2) and odd numbers are
  // stored in the low bits of (|index| / 2).
  if (index % 2 != 0) {
    return memory->type[index / 2] & 0x0F;
  } else {
    return (memory->type[index / 2] & 0xF0) >> 4;
  }
}

int AqvmMemory_WriteData(struct AqvmMemory_Memory* memory, size_t index,
                         void* data_ptr, size_t size) {
  if (memory == NULL) {
    AqvmRuntimeDebugger_OutputReport(
        "\"ERROR\"", "\"AqvmMemory_WriteData_NullMemoryPointer\"",
        "\"The memory pointer is NULL.\"", NULL);
    return -1;
  }
  if (memory->type == NULL) {
    AqvmRuntimeDebugger_OutputReport("\"ERROR\"",
                                     "\"AqvmMemory_WriteData_NullTypePointer\"",
                                     "\"The type pointer is NULL.\"", NULL);
    return -2;
  }
  if (index > memory->size) {
    AqvmRuntimeDebugger_OutputReport(
        "\"ERROR\"", "\"AqvmMemory_WriteData_OutOfMemoryRange\"",
        "\"The index is out of memory range.\"", NULL);
    return -3;
  }
  if (data_ptr == NULL) {
    AqvmRuntimeDebugger_OutputReport("\"ERROR\"",
                                     "\"AqvmMemory_WriteData_NullDataPointer\"",
                                     "\"The data pointer is NULL.\"", NULL);
    return -4;
  }

  // Since void* does not have a specific size, pointer moves need to be
  // converted before moving.
  memcpy((void*)((uintptr_t)memory->data + index), data_ptr, size);

  return 0;
}
```

من خلال التعاون مع هذه الرموز، يتم تشكيل بنية ذاكرة Aqvm كاملة، مما يخفف بشكل فعال ضغط الذاكرة ويحسن كفاءة تشغيل Aqvm.

 > نحن نعمل بجد لتطوير "AQ Virtual Machine".  إذا كنت تريد معرفة المزيد من المعلومات أو المشاركة في أعمال التطوير، يرجى متابعة موقعنا الرسمي: https://www.axa6.com وGithub: https://github.com/aq-org/AQ.  </br>

 > تم نشر هذه المقالة بناءً على ترخيص AQ: https://github.com/aq-org/AQ/blob/main/LICENSE، إذا لزم الأمر، يرجى تعديلها أو إعادة طباعتها وفقًا لترخيص AQ.