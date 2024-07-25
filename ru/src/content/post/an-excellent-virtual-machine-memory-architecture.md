---
publishDate: 2024-07-22T16:50:00+08:00
title: Отличная архитектура памяти виртуальной машины - AQ
excerpt: Архитектура памяти виртуальной машины напрямую влияет на производительность и заполняемость виртуальной машины.  Разработка превосходной архитектуры может эффективно повысить производительность и эффективность.  В этой статье будет представлена ​​архитектура памяти, используемая виртуальными машинами AQ.
image: https://www.axa6.com/aq.png
category: Blog
tags:
  - AQ
  - Blog
metadata:
  canonical: https://www.axa6.com/ru/an-excellent-virtual-machine-memory-architecture
---

# Введение
 Архитектура памяти «виртуальной машины» напрямую влияет на производительность и заполняемость виртуальной машины.  Разработка превосходной архитектуры может эффективно повысить производительность и эффективность.  </br>
 В этой статье будет представлена ​​архитектура памяти, используемая «виртуальной машиной AQ», и подробные стандарты памяти «виртуальной машины AQ».  </br>
 Оптимизируя архитектуру памяти «виртуальной машины», это поможет «виртуальной машине» *эффективно работать* и *уменьшить занятость*.  Если возможно, вам следует максимально сбалансировать их, чтобы «виртуальная машина» достигла оптимального состояния.  </br>

 > В некоторых случаях необходимо выполнить другую разработку, исходя из особых потребностей виртуальной машины.  </br>
 > Например: в ситуациях *ограниченной памяти*, таких как «микроконтроллер», необходимо *уменьшить занятость* настолько, насколько это возможно.  </br>
 > В ситуациях, *зависящих от производительности*, таких как «параллельные вычисления», вам необходимо сосредоточиться на *оптимизации производительности*.  </br>

 # Идеи дизайна
 ## Архитектура памяти
 ### Базовая архитектура памяти
 «AQ» использует базовую архитектуру памяти «регистр», но она отличается от стандартной архитектуры «регистр». В архитектуру «регистр» внесены некоторые улучшения и оптимизации.  </br>
 > «Регистр» здесь — это не «регистр» в «ЦП», а «виртуальный регистр», смоделированный в «памяти».  </br>

 ### Причина выбора регистра
 По сравнению со стековой архитектурой, принятой в виртуальных машинах на основных языках, таких как `JAVA` и `Python`, причина, по которой `AQ` решила принять `регистровую` архитектуру, заключается в оптимизации производительности и простоте понимания `байт-кода`.  </br>
 Хотя «стековая» архитектура обычно считается более простой для портирования и записи, фактическая производительность будет несколько снижена. Множественный доступ к «памяти» замедлит ее, что неизбежно и трудно полностью оптимизировать.  Поэтому, чтобы решить проблему *потери производительности*, AQ использует «регистровую» архитектуру.  В то же время, с точки зрения «байт-кода», байт-код архитектуры «регистра» *легче понять*, его инструкции аналогичны методу «параметров» функции, а не непосредственно обращены к многочисленным командам. стек` работает.  </br>

 ### Разница между регистровой архитектурой
 #### Стандартная архитектура регистров
 В стандартной архитектуре регистров «регистры» включают в себя:</br>

 1. `Тип данных` — тип данных, которые будет хранить регистр (например, int, float, double и т. д.).
 2. `data` – значение данных, которые будет хранить регистр.
 3. (Необязательно) тег — тег данных, которые будет хранить регистр (например, переменная, функция, класс и т. д.).
 4. (Необязательно) Ссылка — ссылка на данные, которые будет хранить регистр (например, адрес объекта и т. д.).

 Хотя архитектура памяти «виртуальных машин» на разных языках может отличаться, эта информация обычно сохраняется.  </br>

 Эта архитектура использовалась при разработке `AQ`, но после тестирования заняла большой объём памяти.  </br>

 Ниже приведен код `register.h`, используемый `AQ`:</br>

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

Как видно из приведенного выше кода, даже если сохраняется только необходимое содержимое, поскольку `AqvmMemoryRegister_ValueType` типа `enum` занимает `4` байта, `AqvmMemoryRegister_Value` типа `union` занимает `8` байтов. и тип `struct`. Он будет занимать `12` байт памяти.  </br>

 В то же время, благодаря оптимизации компилятора `C`, `type` типа `enum` в `AqvmMemoryRegister_Register` типа `struct` `выровнен по памяти` со `значением` ` тип объединения, поэтому добавляется `4` слова. Раздел `заполняет память`.  Сделайте так, чтобы `AqvmMemoryRegister_Register` типа `struct` занимал `16` байт.  </br>

 Если вы используете int и другие типы байтов, отличные от 8, 4 байта заполнения памяти будут потрачены впустую, что приведет к потере памяти.  Поэтому во всех регистрах будет потрачено `4`-`8` байт памяти.  </br>

 ### Регистровая структура `AQ`
 Чтобы решить проблему занятости традиционной «регистровой» архитектуры, «AQ» сочетает в себе функции «таблицы локальных переменных» «фрейма стека» «JVM» и оптимизирует «архитектуру памяти», значительно уменьшая проблему занятости.  </br>

 Вот три альтернативы:</br>

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

Поскольку указатель занимает `4`-`8` байт, сами данные занимают `1`-`8` байт плюс байт типа `1`, поэтому `plan 1` занимает `6`-`17` байт, и может быть «выравнивание памяти», поэтому «план 1» также приведет к огромной потере памяти.  </br>
 Фактически, когда требуется сохранить информацию о типе памяти, наибольшее использование памяти соответствует «плану 2», но «план 2» не может сохранить «связность» разных типов данных в одной и той же структуре данных (например, в структуре). , что может привести к аннулированию некоторых операций с указателями.  Поэтому для «безопасности памяти» «план 2» не используется.  </br>
 В некоторых случаях (набор инструкций виртуальной машины включает типы) «план 3» также может удовлетворить потребности в памяти. Однако из-за потребностей сокращенного набора команд информация о типе не включается в инструкции, поэтому она не может быть включена. удовлетворить потребности работы виртуальных машин.  </br>

 Поэтому мы принимаем следующую конструкцию, чтобы обеспечить «коэффициент использования» «памяти» и в то же время значительно улучшить проблему использования памяти.  </br>

 Память AQ напрямую использует указатели void* для хранения данных, size_t сохраняет занимаемый размер памяти и использует тип хранения массива uint8_t.  Поскольку `uint8_t` занимает `8` бит, для уменьшения занятости каждый байт использует `4` бита для хранения типа.  Следовательно, переменная uint8_t может хранить типы «2».  Первые `4` бита каждой переменной `uint8_t` используются для четного типа байта, а последние `4` бита используются для `нечетного` типа байта.  </br>

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

Из-за «памяти» доступ к «типу» требует точного использования.  Тип uint8_t требует 8 бит, но он превышает потребности этого типа в памяти, поэтому 4 бита могут не только удовлетворить потребности типа в памяти, но и уменьшить использование памяти.  Но для поддержания доступа к `type` требуются специальные функции.  </br>

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

Однако использование этой конструкции предъявляет более высокие требования к хранению данных, поскольку длина данных не фиксирована, поэтому для работы с памятью требуются специальные функции.  </br>

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

Помимо сокращения использования памяти, не менее важно избегать вторичного использования памяти.  Поэтому мы повторно используем «память» «байт-кода», сохраняем данные и типы памяти в части памяти «байт-кода» и используем «память», предварительно выделенную в файле «байт-кода» (файл байт-кода содержит данные и типы «памяти») для достижения эффективного использования «памяти».  </br>
 Потому что, если вы храните две части отдельно, вам нужно иметь две части повторяющихся данных и типов памяти. Одна часть находится в части «памяти», а другая часть, часть «байт-кода», не будет использоваться, поэтому мы принимаем. повторное использование Этот метод уменьшает потери памяти, вызванные данными и типами памяти.  </br>
 Однако требуется реализация специальной функции, и следует отметить, что выделением и освобождением данных и типов памяти в памяти управляют соответствующие функции байт-кода.  </br>

```C
// Creates and initializes the struct AqvmMemory_Memory with |data|, |type|, and
// |size|. The function will allocate a struct AqvmMemory_Memory and copy
// |data|, |type|, and |size| into the struct. Returns a pointer to the struct
// if successful. Returns NULL if creation fails.
struct AqvmMemory_Memory* AqvmMemory_InitializeMemory(void* data, void* type,
                                                      size_t size) {
  AqvmRuntimeDebugger_OutputReport("\"INFO\"",
                                   "\"AqvmMemory_InitializeMemory_Start\"",
                                   "\"Memory initialization started.\"", NULL);

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
  AqvmRuntimeDebugger_OutputReport("\"INFO\"",
                                   "\"AqvmMemory_FreeMemory_Start\"",
                                   "\"Memory deallocation started.\"", NULL);

  free(memory_ptr);
}
```

Кроме того, поскольку определение типов в некоторых системах отличается от стандарта AQ, соответствующие функции предназначены для обеспечения соответствия виртуальной машины стандарту.  Если системы отличаются от стандартных, для этих систем следует изготовить специальные конструкции.  </br>

```C
// Checks the memory conditions in the system.
// Returns the number of warnings.
int AqvmMemory_CheckMemoryConditions() {
  int warning_count = 0;
  if (sizeof(aqbyte) != 1) {
    AqvmRuntimeDebugger_OutputReport(
        "\"WARNING\"", "\"AqvmMemory_CheckMemoryConditions_ByteLengthWarning\"",
        "\"The length requirement for the byte type does not conform to the "
        "type "
        "definition.\"",
        NULL);
    ++warning_count;
  }
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
  if (sizeof(aqdouble) != 8) {
    AqvmRuntimeDebugger_OutputReport(
        "\"WARNING\"",
        "\"AqvmMemory_CheckMemoryConditions_DoubleLengthWarning\"",
        "\"The length requirement for the double type does not conform to the "
        "type definition.\"",
        NULL);
    ++warning_count;
  }

  if (warning_count == 0) {
    AqvmRuntimeDebugger_OutputReport(
        "\"INFO\"", "\"AqvmMemory_CheckMemoryConditions_CheckNormal\"",
        "\"No memory conditions warning.\"", NULL);
  }

  return warning_count;
}
```

# Подробные стандарты:
## Структура каталогов
Код части памяти находится в каталоге /aqvm/memory.  Содержит несколько файлов кода.  </br>
 1. `CMakeLists.txt` — файл сборки CMake в этом каталоге.
 2. `memory.h` — структуры данных памяти и связанные с ними функции.
 3. `memory.c` — реализация функций, связанных с памятью.
 4. `types.h` — определение типов памяти

## memory.h
### AqvmMemory_Memory
Эта структура хранит информацию о памяти.  </br>
 |type| — это указатель на массив, в котором хранится тип каждого байта в памяти.  Каждый байт использует 4 бита для хранения типа.  Следовательно, переменная uint8_t может хранить 2 типа.  Первые 4 бита каждой переменной uint8_t используются для типа четных байтов, а последние 4 бита — для типа нечетных байтов.  Список типов находится в Types.h.  </br>
 |data| — это указатель типа void* на память, в которой хранятся данные.  </br>
 |размер| — размер памяти.  </br>
 Примечание. Структура AqvmMemory_Memory хранит только информацию о памяти.  Память выделяется функцией байт-кода при сохранении байт-кода.  Память для |памяти| и |типа| является частью памяти байт-кода.  </br>

```C
struct AqvmMemory_Memory {
  uint8_t* type;
  void* data;
  size_t size;
};
```

### AqvmMemory_CheckMemoryConditions
Проверьте состояние памяти в системе.  </br>
 Возвращает количество предупреждений.  </br>

```C
int AqvmMemory_CheckMemoryConditions() {
  int warning_count = 0;
  if (sizeof(aqbyte) != 1) {
    AqvmRuntimeDebugger_OutputReport(
        "\"WARNING\"", "\"AqvmMemory_CheckMemoryConditions_ByteLengthWarning\"",
        "\"The length requirement for the byte type does not conform to the "
        "type "
        "definition.\"",
        NULL);
    ++warning_count;
  }
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
  if (sizeof(aqdouble) != 8) {
    AqvmRuntimeDebugger_OutputReport(
        "\"WARNING\"",
        "\"AqvmMemory_CheckMemoryConditions_DoubleLengthWarning\"",
        "\"The length requirement for the double type does not conform to the "
        "type definition.\"",
        NULL);
    ++warning_count;
  }

  if (warning_count == 0) {
    AqvmRuntimeDebugger_OutputReport(
        "\"INFO\"", "\"AqvmMemory_CheckMemoryConditions_CheckNormal\"",
        "\"No memory conditions warning.\"", NULL);
  }

  return warning_count;
}
```

### AqvmMemory_CreateMemory
Создает структуру AqvmMemory_Memory, содержащую |данные|, |тип| и |размер|.  </br>
 Эта функция выделяет структуру AqvmMemory_Memory и копирует в нее |data|, |type| и |size|.  Возвращает указатель на эту структуру.  Возвращает NULL, если создание не удалось.  </br>

```C
struct AqvmMemory_Memory* AqvmMemory_InitializeMemory(void* data, void* type,
                                                      size_t size) {
  AqvmRuntimeDebugger_OutputReport("\"INFO\"",
                                   "\"AqvmMemory_InitializeMemory_Start\"",
                                   "\"Memory initialization started.\"", NULL);

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
Освободите память |memory_ptr|.  Нет возвращаемого значения.  </br>
 Примечание. Эта функция освобождает только память структуры.  Память, на которую указывают указатели на данные и типы в структуре, не будет освобождена.  Этими воспоминаниями управляют функции, связанные с байт-кодом.  </br>

```C
void AqvmMemory_FreeMemory(struct AqvmMemory_Memory* memory_ptr) {
  AqvmRuntimeDebugger_OutputReport("\"INFO\"",
                                   "\"AqvmMemory_FreeMemory_Start\"",
                                   "\"Memory deallocation started.\"", NULL);

  free(memory_ptr);
}
```

### AqvmMemory_SetType
Установите тип данных в |index| байтах в |памяти| как |type|.  |тип| должен содержать менее 4 цифр.  </br>
 Возвращает 0 в случае успеха.  Если указатель памяти равен NULL, возвращается -1.  Если указатель индекса равен NULL, возвращается -2.  Если индекс выходит за пределы диапазона, возвращается -3.  Если тип выходит за пределы диапазона, возвращается -4.  </br>

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
Получает тип данных в |index| байтах в |памяти|.  </br>
 В случае успеха возвращает тип размером менее 4 бит (0X0F).  Если указатель памяти равен NULL, возвращается 0x11.  Если указатель индекса равен NULL, возвращается 0x12.  Если индексу не хватает памяти, возвращается 0x13.  </br>

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
Записывает данные размера |size|, на которые указывает |data_ptr|, в данные в |index| байтах в |памяти|.  </br>
 Возвращает 0 в случае успеха.  Если указатель памяти равен NULL, возвращается -1.  Если указатель индекса равен NULL, возвращается -2.  Если индексу не хватает памяти, возвращается -3.  Если указатель данных равен NULL, возвращается -4.  </br>

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

### `memory.h` Полный код:

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

// Creates and initializes the struct AqvmMemory_Memory with |data|, |type|, and
// |size|. The function will allocate a struct AqvmMemory_Memory and copy
// |data|, |type|, and |size| into the struct. Returns a pointer to the struct
// if successful. Returns NULL if creation fails.
struct AqvmMemory_Memory* AqvmMemory_InitializeMemory(void* data, void* type,
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
### `memory.c` Полный код:

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
  if (sizeof(aqbyte) != 1) {
    AqvmRuntimeDebugger_OutputReport(
        "\"WARNING\"", "\"AqvmMemory_CheckMemoryConditions_ByteLengthWarning\"",
        "\"The length requirement for the byte type does not conform to the "
        "type "
        "definition.\"",
        NULL);
    ++warning_count;
  }
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
  if (sizeof(aqdouble) != 8) {
    AqvmRuntimeDebugger_OutputReport(
        "\"WARNING\"",
        "\"AqvmMemory_CheckMemoryConditions_DoubleLengthWarning\"",
        "\"The length requirement for the double type does not conform to the "
        "type definition.\"",
        NULL);
    ++warning_count;
  }

  if (warning_count == 0) {
    AqvmRuntimeDebugger_OutputReport(
        "\"INFO\"", "\"AqvmMemory_CheckMemoryConditions_CheckNormal\"",
        "\"No memory conditions warning.\"", NULL);
  }

  return warning_count;
}

struct AqvmMemory_Memory* AqvmMemory_InitializeMemory(void* data, void* type,
                                                      size_t size) {
  AqvmRuntimeDebugger_OutputReport("\"INFO\"",
                                   "\"AqvmMemory_InitializeMemory_Start\"",
                                   "\"Memory initialization started.\"", NULL);

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
  AqvmRuntimeDebugger_OutputReport("\"INFO\"",
                                   "\"AqvmMemory_FreeMemory_Start\"",
                                   "\"Memory deallocation started.\"", NULL);

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

Благодаря сотрудничеству этих кодов формируется полная архитектура памяти Aqvm, которая эффективно снижает нагрузку на память и повышает эффективность работы Aqvm.

 > Мы усердно работаем над разработкой «виртуальной машины AQ».  Если вы хотите узнать дополнительную информацию или принять участие в разработке, посетите наш официальный сайт: https://www.axa6.com и Github: https://github.com/aq-org/AQ.  </br>

 > Эта статья опубликована на основе лицензии AQ: https://github.com/aq-org/AQ/blob/main/LICENSE. При необходимости адаптируйте или перепечатайте ее в соответствии с лицензией AQ.