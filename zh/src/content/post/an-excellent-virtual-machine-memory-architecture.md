---
publishDate: 2024-06-01T19:55:05+08:00
title: 一种优秀的虚拟机内存架构 - AQ
excerpt: 虚拟机内存架构直接影响虚拟机的性能和占用。设计一个优秀的架构可以有效提升性能和效率。本文将介绍AQ虚拟机使用的内存架构。
image: https://www.axa6.com/aq.png
category: Blog
tags:
  - AQ
  - Blog
metadata:
  canonical: https://www.axa6.com/一种优秀的虚拟机内存架构
---

# 简介
`虚拟机`内存架构直接影响虚拟机的性能和占用。设计一个优秀的架构可以有效提升性能和效率。</br>
本文将介绍`AQ虚拟机`使用的内存架构。</br>
通过对于`虚拟机`内存架构的优化，有助于`虚拟机`的*运行效率*和*减少占用*。如果可以，应该尽可能地平衡两者，使`虚拟机`达到最佳状态。</br>
> 在某些情况下，应该根据虚拟机的特殊需求进行不同的开发。</br>
> 例如：在`单片机`等*内存受限*情况下，需要尽可能地*减少占用*。</br>
> 而在`并行计算`等*性能敏感*情况，则需要侧重于*性能优化*。</br>

# 内存架构
## 基础内存架构
`AQ`采取了`寄存器`的基础内存架构，但与标准的`寄存器`架构有所不同，对`寄存器`架构进行了部分改进和优化。</br>
> 此处的`寄存器`并非`CPU`中的`寄存器`，而是在`内存`中模拟出的`虚拟寄存器`。
## 选择寄存器的原因
相较与`JAVA`、`Python`等主流语言虚拟机采取堆栈架构不同，`AQ`决定采取`寄存器`架构的原因是性能的优化与`字节码`的容易理解。</br>
虽然`堆栈`架构被普遍认为更容易移植和编写，但在实际的性能中会有一些损耗，对于`内存`的多次访问会减缓其速度，这是不可避免并且难以彻底优化的。因此，为了解决此处的*性能损耗*，`AQ`采用了`寄存器`架构。同时，从`字节码`的角度上说，`寄存器`架构的字节码*更容易理解*，其指令类似于`函数`的`参数`方式，而不是直接面对`堆栈`的众多操作。</br>
## `寄存器`架构的区别
### 标准的寄存器架构
标准的寄存器架构中，`寄存器`包含：</br>
1. `数据类型` - 寄存器将存储的数据的类型（如int、float、double等）
2. `数据` - 寄存器将存储的数据的值
3. （可选）标记 - 寄存器将存储的数据的标记（如变量、函数、类等）
4. （可选）引用 - 寄存器将存储的数据的引用（如对象的地址等）

尽管不同语言的`虚拟机`架构可能有所不同，但大致都是这样的形式，只是略有改变。</br>

而在`AQ`开发过程中曾使用了该架构，但是经过测试，其存在较大的内存占用。</br>
以下是`AQ`曾使用的`register.h`代码：
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
从上述代码可以看出，即使未加入可选内容，但由于`enum`类型的`AqvmMemoryRegister_ValueType`占用`4`字节，`union`类型的`AqvmMemoryRegister_Value`占用`8`字节，`struct`类型本身就会占用`12`字节内存。</br>

又由于`C`编译器的优化，`struct`类型的`AqvmMemoryRegister_Register`中`enum`类型的`type`为与`union`类型的`value`进行`内存对齐`，因此加入`4`字节的`填充内存`。使`struct`类型的`AqvmMemoryRegister_Register`占用`16`字节。

其中如果使用`int`等非`8`字节类型，则会有`4`字节的`填充内存`被浪费，从而造成内存损耗。因此在全部的寄存器中会有`4`-`8`字节的内存浪费。</br>

### `AQ`的寄存器架构
为了解决传统`寄存器`架构的占用问题，`AQ`结合了`JVM`的`栈帧`的`局部变量表`特点，对`内存`进行了优化，使占用问题显著减少。</br>

`AQ`的`内存`直接使用`void*`指针存储数据，`size_t`存储占用内存大小。直接有效地减少了`填充内存`的损耗。</br>

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

由于内存的原因，`plan 1`同样会造成极大的内存损失。
事实上，在要求保留内存信息时，内存利用率最高的是`plan 2`，但不能保存在同一数据结构中不同类型数据的`连贯性`，可能会使部分指针操作失效。因此为了`内存安全`，不使用`plan 2`。</br>
在某些情况下，`plan 3`也可以满足内存存储的需要，但由于精简指令集的需要，没有在指令中包含类型信息，因此无法满足精简指令集的需要。</br>

因此我们采取如下设计，保证对于`内存`的`利用率`，同时使内存占用问题有了很大改善。</br>

```C
// The struct stores information about the memory.
// |type| is a pointer to an array that stores the type of each byte in the
// memory. Each byte uses 4 bits to store the type. So a uint8_t variable can
// store 2 types. Each uint8_t variable's first 4 bits are used for the even
// byte's type and the next 4 bits are used for the odd byte's type. The type
// list is in types.h.
// |data| is a pointer of type void* to the memory that stores the data.
// |size| is the size of the memory.
struct AqvmMemory_Memory {
  uint8_t* type;
  void* data;
  size_t size;
};
```

由于`内存`的原因，对于`type`的存取需要精确的利用。`uint8_t`类型需要`8`位，但是超过了类型的存储需要，因此`4`位既可以满足对于类型的存储需要，同时又可以减少内存占用。但是需要特殊的函数维持`type`的存取。</br>

```C
// Sets the type of the data at |index| bytes in |memory| to |type|. |type|
// should be less than 4 bits.
// Returns 0 if successful. Returns -1 if memory is NULL. Returns -2 if the
// index is out of range. Returns -3 if the type is out of range.
int AqvmMemory_SetType(const struct AqvmMemory_Memory* memory, size_t index,
                       uint8_t type);

// Gets the type of the data at |index| bytes in |memory|.
// Returns the type that is less than 4 bits (0X0F) if successful. Returns 0x10
// if the memory is NULL. Returns 0x20 if the index is out of memory range.
uint8_t AqvmMemory_GetType(struct AqvmMemory_Memory* memory, size_t index);
```

但使用该设计对于数据的`存储`有较高要求，因为数据可能会被打乱，因此需要专门的`函数`配合`内存`进行操作。</br>

```C
// Writes the data that |data_ptr| points to of size |size| to the data of at
// |index| bytes in |memory|.
// Returns 0 if successful. Returns -1 if the memory is NULL. Returns -2 if the
// index is out of memory range. Returns -3 if the data is NULL.
int AqvmMemory_WriteData(struct AqvmMemory_Memory* memory, size_t index,
                         void* data_ptr, size_t size);
```

除了减少`内存`使用外，避免`内存`的二次占用同样重要。因此我们将内存的相关数据与字节码的数据混合存储，利用`字节码`文件中预先分配的`内存`（字节码文件中包含`内存`的数据和类型），实现对于`内存`的高效利用。</br>
但因此需要特殊的函数实现，同时需要注意`内存`的数据和类型信息由字节码的相关函数进行管理。</br>

```C
// Creates the struct AqvmMemory_Memory with |data|, |type|, and |size|.
// The function will allocate a struct AqvmMemory_Memory and copy |data|,
// |type|, and |size| into the struct. Returns a pointer to the struct.
struct AqvmMemory_Memory* AqvmMemory_CreateMemory(void* data, void* type,
                                                  size_t size);

// Free the memory of the |memory_ptr|. No return.
// NOTICE: The function only free the memory of the struct. The memory pointed
// to by pointers to data and type in struct is not freed. This memory is
// managed by bytecode related functions.
void AqvmMemory_FreeMemory(struct AqvmMemory_Memory* memory_ptr);
```

除此之外，由于部分系统对于类型的定义与AQ标准有所差异，因此设计了相关函数确保虚拟机的正确运行。如果存在差异，应当为这些系统进行特殊的设计。</br>

```C
// Checks the memory conditions in the system.
// Returns 0 if successful. Returns -1 if the length requirement for the int
// type does not conform to the type definition, -2 for long, -3 for float, -4
// for double, -5 for char, and -6 for bool.
int AqvmMemory_CheckMemoryConditions();
```

# 详细代码：</br>
## 目录结构
`memory`部分的代码位于`/aqvm/memory`。内含多个代码文件。</br>
1. `CMakeLists.txt` - 该目录下的CMake构建文件
2. `memory.h` - 内存的数据结构和相关函数
3. `memory.c` - 内存的相关函数的实现
4. `types.h` - 内存类型的定义

## `types.h`
对于类型同样有相关代码。以下是`types.h`的代码：</br>
因此拥有具体定义的基本类型有`6`种：</br>
0. NULL - 0 bits (0 bytes) 用于表示空值或未知类型
1. int - 32 bits (4 bytes) 遵守 `C` 标准
2. long - 64 bits (8 bytes) 遵守 `C` 标准
3. float - 32 bits (4 bytes) 遵守 `IEEE 754` 标准
4. double - 64 bits (8 bytes) 遵守 `IEEE 754` 标准
5. char - 8 bits (1 byte) 遵守 `C` 标准
6. bool - 8 bits (1 byte) 遵守 `C` 标准
7. byte - 8 bits (1 byte) 用于特定长度需要的内存存储，可以根据需要进行不同的组合。固定大小为`1`字节

```C
// Copyright 2024 AQ author, All Rights Reserved.
// This program is licensed under the AQ License. You can find the AQ license in
// the root directory.

#ifndef AQ_AQVM_MEMORY_TYPES_H_
#define AQ_AQVM_MEMORY_TYPES_H_

#include <stdbool.h>
#include <stdint.h>

// 0x00 is NULL type.

// 0x01
typedef int32_t aqint;
// 0x02
typedef int64_t aqlong;
// 0x03
typedef float aqfloat;
// 0x04
typedef double aqdouble;
// 0x05
typedef uint8_t aqchar;
// 0x06
typedef bool aqbool;
// 0x07
typedef uint8_t aqbyte;

// Portions exceeding 0x07 and falling within the range 0x0F are currently
// designated as reserved types. Portions extending beyond 0x0F cannot be
// utilised without exceeding the 4-bit size limit.

#endif
```

## `memory.h`

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

### AqvmMemory_Memory
该结构体存储有关内存的信息。</br>
|type| 是一个指向数组的指针，该数组存储内存中每个字节的类型。每个字节使用4位来存储类型。因此，一个 uint8_t 变量可以存储2个类型。每个 uint8_t 变量的前4位用于偶数字节的类型，后4位用于奇数字节的类型。类型列表在 types.h 中。</br>
|data| 是一个指向存储数据的内存的 void* 类型的指针。</br>
|size| 是内存的大小。</br>
注意：结构体 AqvmMemory_Memory 仅存储内存的信息。内存由存储字节码时的字节码函数分配。|memory| 和 |type| 的内存是字节码内存的一部分。</br>

```C
struct AqvmMemory_Memory {
  uint8_t* type;
  void* data;
  size_t size;
};
```

### AqvmMemory_CheckMemoryConditions
检查系统中的内存条件。</br>
返回警告数量。</br>
```C
int AqvmMemory_CheckMemoryConditions();
```

### AqvmMemory_CreateMemory
创建包含 |data|、|type| 和 |size| 的结构体 AqvmMemory_Memory。</br>
该函数将分配一个 AqvmMemory_Memory 结构体，并将 |data|、|type| 和 |size| 复制到结构体中。返回指向该结构体的指针。如果创建失败则返回NULL。</br>

```C
struct AqvmMemory_Memory* AqvmMemory_CreateMemory(void* data, void* type, size_t size);
```

### AqvmMemory_FreeMemory
释放 |memory_ptr| 的内存。无返回值。</br>
注意：该函数仅释放结构体的内存。结构体中指向数据和类型的指针所指向的内存不会被释放。这些内存由字节码相关函数管理。</br>

```C
void AqvmMemory_FreeMemory(struct AqvmMemory_Memory* memory_ptr);
```

### AqvmMemory_SetType
设置 |memory| 中 |index| 字节处的数据类型为 |type|。|type| 应小于 4 位。</br>
成功时返回 0。如果内存指针为 NULL，返回 -1。如果索引指针为 NULL，返回 -2。如果索引超出范围，返回 -3。如果类型超出范围，返回 -4。</br>

```C
int AqvmMemory_SetType(const struct AqvmMemory_Memory* memory, size_t index, uint8_t type);
```

### AqvmMemory_GetType
获取 |memory| 中 |index| 字节处的数据类型。</br>
成功时返回小于 4 位 (0X0F) 的类型。如果内存指针为 NULL，返回 0x11。如果索引指针为 NULL，返回 0x12。如果索引超出内存范围，返回 0x13。</br>

```C
uint8_t AqvmMemory_GetType(struct AqvmMemory_Memory* memory, size_t index);
```

### AqvmMemory_WriteData
将 |data_ptr| 指向的大小为 |size| 的数据写入 |memory| 中 |index| 字节处的数据。</br>
成功时返回 0。如果内存指针为 NULL，返回 -1。如果索引指针为 NULL，返回 -2。如果索引超出内存范围，返回 -3。如果数据指针为 NULL，返回 -4。</br>

```C
int AqvmMemory_WriteData(struct AqvmMemory_Memory* memory, size_t index, void* data_ptr, size_t size);
```

## `memory.c`
以下是具体的`函数`实现：</br>

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
        1, "AqvmMemoryCheckMemoryConditions_IntLengthWarning",
        "The length requirement for the int type does not conform to the type "
        "definition.",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqlong) != 8) {
    AqvmRuntimeDebugger_OutputReport(
        1, "AqvmMemoryCheckMemoryConditions_LongLengthWarning",
        "The length requirement for the long type does not conform to the type "
        "definition.",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqfloat) != 4) {
    AqvmRuntimeDebugger_OutputReport(
        1, "AqvmMemoryCheckMemoryConditions_FloatLengthWarning",
        "The length requirement for the float type does not conform to the "
        "type definition.",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqdouble) != 4) {
    AqvmRuntimeDebugger_OutputReport(
        1, "AqvmMemoryCheckMemoryConditions_DoubleLengthWarning",
        "The length requirement for the double type does not conform to the "
        "type definition.",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqchar) != 1) {
    AqvmRuntimeDebugger_OutputReport(
        1, "AqvmMemoryCheckMemoryConditions_CharLengthWarning",
        "The length requirement for the char type does not conform to the type "
        "definition.",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqbool) != 1) {
    AqvmRuntimeDebugger_OutputReport(
        1, "AqvmMemoryCheckMemoryConditions_BoolLengthWarning",
        "The length requirement for the bool type does not conform to the type "
        "definition.",
        NULL);
    ++warning_count;
  }

  return warning_count;
}

struct AqvmMemory_Memory* AqvmMemory_CreateMemory(void* data, void* type,
                                                  size_t size) {
  struct AqvmMemory_Memory* memory_ptr =
      (struct AqvmMemory_Memory*)malloc(sizeof(struct AqvmMemory_Memory));
  if (memory_ptr == NULL) {
    AqvmRuntimeDebugger_OutputReport(
        2, "AqvmMemoryCreateMemory_MemoryAllocationFailure",
        "Failed to allocate memory.", NULL);
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
    AqvmRuntimeDebugger_OutputReport(1, "AqvmMemorySetType_NullMemoryPointer",
                                     "The memory pointer is NULL.", NULL);
    return -1;
  }

  if (memory->type == NULL) {
    AqvmRuntimeDebugger_OutputReport(1, "AqvmMemorySetType_NullTypePointer",
                                     "The type pointer is NULL.", NULL);
    return -2;
  }

  if (index > memory->size) {
    AqvmRuntimeDebugger_OutputReport(1, "AqvmMemorySetType_OutOfMemoryRange",
                                     "The index is out of memory range.", NULL);
    return -3;
  }

  if (type > 0x0F) {
    AqvmRuntimeDebugger_OutputReport(1, "AqvmMemorySetType_OutOfTypeRange",
                                     "The type is out of range.", NULL);
    return -4;
  }

  if (index % 2 != 0) {
    memory->type[index / 2] = (memory->type[index / 2] & 0xF0) | type;
  } else {
    memory->type[index / 2] = (memory->type[index / 2] & 0x0F) | (type << 4);
  }

  return 0;
}

uint8_t AqvmMemory_GetType(struct AqvmMemory_Memory* memory, size_t index) {
  if (memory == NULL) {
    AqvmRuntimeDebugger_OutputReport(1, "AqvmMemoryGetType_NullMemoryPointer",
                                     "The memory pointer is NULL.", NULL);
    return 0x11;
  }

  if (memory->type == NULL) {
    AqvmRuntimeDebugger_OutputReport(1, "AqvmMemoryGetType_NullTypePointer",
                                     "The type pointer is NULL.", NULL);
    return 0x12;
  }

  if (index > memory->size) {
    AqvmRuntimeDebugger_OutputReport(1, "AqvmMemoryGetType_OutOfMemoryRange",
                                     "The index is out of memory range.", NULL);
    return 0x13;
  }

  if (index % 2 != 0) {
    return memory->type[index / 2] & 0x0F;
  } else {
    return (memory->type[index / 2] & 0xF0) >> 4;
  }
}

int AqvmMemory_WriteData(struct AqvmMemory_Memory* memory, size_t index,
                         void* data_ptr, size_t size) {
  if (memory == NULL) {
    AqvmRuntimeDebugger_OutputReport(1, "AqvmMemoryWriteData_NullMemoryPointer",
                                     "The memory pointer is NULL.", NULL);
    return -1;
  }

  if (memory->type == NULL) {
    AqvmRuntimeDebugger_OutputReport(1, "AqvmMemoryWriteData_NullTypePointer",
                                     "The type pointer is NULL.", NULL);
    return -2;
  }

  if (index > memory->size) {
    AqvmRuntimeDebugger_OutputReport(1, "AqvmMemoryWriteData_OutOfMemoryRange",
                                     "The index is out of memory range.", NULL);
    return -3;
  }

  if (data_ptr == NULL) {
    AqvmRuntimeDebugger_OutputReport(1, "AqvmMemoryWriteData_NullDataPointer",
                                     "The data pointer is NULL.", NULL);
    return -4;
  }

  memcpy((void*)((uintptr_t)memory->data + index), data_ptr, size);
  return 0;
}
```

通过这些代码的配合，共同构成了完整的Aqvm的内存架构，有效缓解内存压力的同时，提高了Aqvm的运行效率。

> 我们正在更加努力地开发`AQ虚拟机`。如果您想了解更多信息或参与开发工作，请关注我们的官网：https://www.axa6.com 和 Github：https://github.com/aq-org/AQ。</br>

> 本文章基于AQ License：https://github.com/aq-org/AQ/blob/main/LICENSE 发布，如有需要，请根据AQ License进行改编或转载。