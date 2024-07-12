---
publishDate: 2024-07-12T18:41:14+08:00
title: An Excellent Virtual Machine Memory Architecture - AQ
excerpt: Virtual machine memory architecture directly affects the performance and occupancy of the virtual machine. Designing an excellent architecture can effectively improve performance and efficiency. In this article, we will introduce the memory architecture used by the AQ virtual machine.
image: https://www.axa6.com/aq.png
category: Blog
tags:
  - AQ
  - Blog
metadata:
  canonical: https://www.axa6.com/an-excellent-virtual-machine-memory-architecture
---

# Introduction
The memory architecture of the `virtual machine` directly affects the performance and occupancy of the virtual machine. Designing an excellent architecture can effectively improve performance and efficiency. </br>
This article will introduce the memory architecture used by the `AQ virtual machine` and the detailed standards of the `AQ virtual machine` memory. </br>
By optimizing the memory architecture of the `virtual machine`, it is helpful to *operate efficiently* and *reduce the occupancy* of the `virtual machine`. If possible, the two should be balanced as much as possible to make the `virtual machine` reach the best state. </br>
> In some cases, different development should be carried out according to the special needs of the virtual machine. </br>
> For example: in *memory-constrained* situations such as `single-chip microcomputers`, it is necessary to *reduce the occupancy* as much as possible. </br>
> In *performance-sensitive* situations such as `parallel computing`, it is necessary to focus on *performance optimization*. </br>

# Design ideas
## Memory architecture
### Basic memory architecture
`AQ` adopts the basic memory architecture of `registers`, but it is different from the standard `register` architecture, and some improvements and optimizations have been made to the `register` architecture. </br>
> The `registers` here are not the `registers` in the `CPU`, but the `virtual registers` simulated in the `memory`. </br>

### Reasons for choosing registers
Compared with the stack architecture adopted by mainstream language virtual machines such as `JAVA` and `Python`, `AQ` decided to adopt the `register` architecture because of performance optimization and easy understanding of `bytecode`. </br>
Although the `stack` architecture is generally considered to be easier to port and write, there will be some losses in actual performance. Multiple accesses to `memory` will slow down its speed, which is inevitable and difficult to optimize thoroughly. Therefore, in order to solve the *performance loss* here, `AQ` adopts the `register` architecture. At the same time, from the perspective of `bytecode`, the bytecode of the `register` architecture is *easier to understand*, and its instructions are similar to the `parameter` method of `function`, rather than directly facing the many operations of `stack`. </br>

### Differences between `register` architectures
#### Standard register architecture
In the standard register architecture, `register` contains:</br>
1. `Data type` - the type of data that the register will store (such as int, float, double, etc.)
2. `Data` - the value of the data that the register will store
3. (Optional) Tag - the tag of the data that the register will store (such as variables, functions, classes, etc.)
4. (Optional) Reference - the reference of the data that the register will store (such as the address of the object, etc.)

Although the `virtual machine` architecture of different languages ​​may be different, it is generally in this form with only slight changes. </br>

This architecture was used during the development of `AQ`, but after testing, it has a large memory footprint. </br>
The following is the `register.h` code that `AQ` used:</br>
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
As can be seen from the above code, even if no optional content is added, because the `AqvmMemoryRegister_ValueType` of the `enum` type occupies `4` bytes, the `AqvmMemoryRegister_Value` of the `union` type occupies `8` bytes, and the `struct` type It will occupy `12` bytes of memory. </br>

Due to the optimization of the `C` compiler, the `type` of the `enum` type in the `AqvmMemoryRegister_Register` of the `struct` type is memory aligned with the `value` of the `union` type, so `4` bytes are added `fill memory`. Make `AqvmMemoryRegister_Register` of type `struct` occupy `16` bytes. </br>

If you use `int` and other non-8` byte types, `4` bytes of `fill memory` will be wasted, resulting in memory loss. Therefore there will be `4`-`8` bytes of memory wasted in all registers. </br>

### Register structure of `AQ`
In order to solve the occupancy problem of the traditional `register' architecture, `AQ` combines the `local variable table` features of the `stack frame` of `JVM` and optimizes the `memory`, significantly reducing the occupancy problem. </br>

`AQ`'s `memory` directly uses `void*` pointers to store data, and `size_t` stores the memory size occupied. Directly and effectively reduce the loss of `filling memory`. </br>

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

Due to memory reasons, `plan 1` will also cause great memory loss. </br>
In fact, when it is required to retain memory information, `plan 2` has the highest memory utilization, but it cannot preserve the `coherence` of different types of data in the same data structure, which may make some pointer operations invalid. Therefore, for `memory safety`, `plan 2` is not used. </br>
In some cases, `plan 3` can also meet the needs of memory storage, but due to the need of reduced instruction sets, type information is not included in the instructions, so it cannot meet the needs of reduced instruction sets. </br>

Therefore, we adopt the following design to ensure the `utilization` of `memory`, and at the same time greatly improve the memory usage problem. </br>

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

Due to `memory` reasons, access to `type` needs to be used precisely. `uint8_t` type requires `8` bits, but this exceeds the storage requirement of the type, so `4` bits can both meet the storage requirement of the type and reduce memory usage. However, special functions are required to maintain access to `type`.</br>

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

However, this design has high requirements for data storage, because the data may be disrupted, so a special function is needed to operate with memory. </br>

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

In addition to reducing the use of `memory`, it is equally important to avoid the secondary occupation of `memory`. Therefore, we store the relevant data of memory mixed with the data of bytecode, and use the pre-allocated `memory` in the `bytecode` file (the bytecode file contains the data and type of `memory`) to achieve efficient use of `memory`. </br>
However, this requires special function implementation, and it should be noted that the data and type information of `memory` are managed by the relevant functions of bytecode. </br>

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

In addition, since some systems have different definitions of types from the AQ standard, related functions are designed to ensure that the virtual machine complies with the standard. If the system is different from the standard, special designs should be made for these systems.</br>

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

# Detailed Standard:
## Directory Structure
The code of the `memory` part is located in `/aqvm/memory`. It contains multiple code files. </br>
1. `CMakeLists.txt` - CMake build files in this directory
2. `memory.h` - memory data structure and related functions
3. `memory.c` - Implementation of memory related functions
4. `types.h` - Definition of memory types

## memory.h
### AqvmMemory_Memory
This structure stores information about memory. </br>
|type| is a pointer to an array that stores the type of each byte in the memory. Each byte uses 4 bits to store the type. Therefore, a uint8_t variable can store 2 types. The first 4 bits of each uint8_t variable are used for the type of even bytes, and the last 4 bits are used for the type of odd bytes. The type list is in types.h. </br>
|data| is a pointer to the void* type of the memory where the data is stored. </br>
|size| is the size of the memory. </br>
Note: The structure AqvmMemory_Memory only stores information about the memory. The memory is allocated by the bytecode function when storing the bytecode. The memory of |memory| and |type| is part of the bytecode memory. </br>

```C
struct AqvmMemory_Memory {
  uint8_t* type;
  void* data;
  size_t size;
};
```

### AqvmMemory_CheckMemoryConditions
Checks memory conditions in the system. </br>
Returns the number of warnings. </br>
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
Creates a structure AqvmMemory_Memory containing |data|, |type| and |size|. </br>
This function will allocate an AqvmMemory_Memory structure and copy |data|, |type| and |size| into the structure. Returns a pointer to the structure. Returns NULL if creation fails. </br>

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
Release the memory of |memory_ptr|. No return value. </br>
Note: This function only releases the memory of the structure. The memory pointed to by the pointer to the data and type in the structure will not be released. These memories are managed by bytecode related functions. </br>

```C
void AqvmMemory_FreeMemory(struct AqvmMemory_Memory* memory_ptr) {
  free(memory_ptr);
}
```

### AqvmMemory_SetType
Sets the data type at byte |index| in |memory| to |type|. |type| should be less than 4 bits. </br>
Returns 0 on success. Returns -1 if the memory pointer is NULL. Returns -2 if the index pointer is NULL. Returns -3 if the index is out of range. Returns -4 if the type is out of range. </br>

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
Get the data type at byte |index| in |memory|. </br>
Returns the type less than 4 bits (0X0F) on success. If the memory pointer is NULL, returns 0x11. If the index pointer is NULL, returns 0x12. If the index is out of memory range, returns 0x13. </br>

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
Writes the data of size |size| pointed to by |data_ptr| to the data at |index| bytes in |memory|. </br>
Returns 0 on success. If the memory pointer is NULL, returns -1. If the index pointer is NULL, returns -2. If the index is out of memory, returns -3. If the data pointer is NULL, returns -4. </br>

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

### `memory.h` complete code:
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
### `memory.c` complete code:

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

Through the cooperation of these codes, the complete memory architecture of Aqvm is formed, which effectively alleviates the memory pressure and improves the operating efficiency of Aqvm.

> We are working harder to develop the `AQ virtual machine`. If you want to learn more or participate in the development work, please pay attention to our official website: https://www.axa6.com and Github: https://github.com/aq-org/AQ. </br>

> This article is based on the AQ License: https://github.com/aq-org/AQ/blob/main/LICENSE. If necessary, please adapt or reprint it according to the AQ License.