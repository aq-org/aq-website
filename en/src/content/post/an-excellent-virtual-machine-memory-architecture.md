---
publishDate: 2024-07-13T18:35:03+08:00
title: An excellent virtual machine memory architecture - AQ
excerpt: The memory architecture of a virtual machine directly affects the performance and occupancy of the virtual machine. Designing an excellent architecture can effectively improve performance and efficiency. This article will introduce the memory architecture used by the AQ virtual machine.
image: https://www.axa6.com/aq.png
category: Blog
tags:
  - AQ
  - Blog
metadata:
  canonical: https://www.axa6.com/an-excellent-virtual-machine-memory-architecture
---

# Introduction
The memory architecture of the virtual machine directly affects the performance and occupancy of the virtual machine. Designing an excellent architecture can effectively improve performance and efficiency.</br>
This article will introduce the memory architecture used by the `AQ virtual machine` and the detailed standards of the `AQ virtual machine` memory.</br>
By optimizing the memory architecture of the virtual machine, it helps to improve the *operating efficiency* and *reduce the occupancy* of the virtual machine. If possible, the two should be balanced as much as possible to make the virtual machine reach the best state.</br>

> In some cases, different development should be done based on the special needs of the virtual machine. </br>
> For example: In *memory-constrained* situations such as `single-chip microcomputers`, it is necessary to *reduce the usage* as much as possible. </br>
> In *performance-sensitive* situations such as `parallel computing`, it is necessary to focus on *performance optimization*. </br>

# Design ideas
## Memory Architecture
### Basic memory architecture
`AQ` adopts the basic memory architecture of `register`, but it is different from the standard `register` architecture and has made some improvements and optimizations to the `register` architecture.</br>
> The `registers` here are not the `registers` in the `CPU`, but the `virtual registers` simulated in the `memory`. </br>

### Reasons for choosing registers
Compared with the stack architecture adopted by mainstream language virtual machines such as `JAVA` and `Python`, `AQ` decided to adopt the `register` architecture because of performance optimization and easy understanding of `bytecode`.</br>
Although the `stack` architecture is generally considered easier to port and write, there will be some performance loss in practice. Multiple accesses to `memory` will slow down its speed, which is inevitable and difficult to optimize thoroughly. Therefore, in order to solve the *performance loss* here, `AQ` adopts the `register` architecture. At the same time, from the perspective of `bytecode`, the bytecode of the `register` architecture is *easier to understand*, and its instructions are similar to the `parameter` method of `function`, rather than directly facing the numerous operations of the `stack`.</br>

### Differences in `register` architecture
#### Standard register architecture
In the standard register architecture, `registers` contain:</br>

1. `Data Type` - the type of data the register will store (int, float, double, etc.)
2. `data` - the value of the data that the register will store
3. (Optional) Tag - The tag of the data that the register will store (e.g. variable, function, class, etc.)
4. (Optional) Reference - A reference to the data the register will store (such as the address of an object, etc.)

Although the memory architecture of the `virtual machine` of different languages may be different, this information is roughly stored.</br>

This architecture was used during the development of `AQ`, but after testing, it was found to have a large memory footprint.</br>

The following is the `register.h` code used by `AQ`:</br>

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
As can be seen from the above code, even if only the necessary content is retained, since the `AqvmMemoryRegister_ValueType` of the `enum` type occupies `4` bytes, the `AqvmMemoryRegister_Value` of the `union` type occupies `8` bytes, the `struct` type itself will occupy `12` bytes of memory.</br>

At the same time, due to the optimization of the `C` compiler, the `type` of the `enum` type in the `struct` type `AqvmMemoryRegister_Register` is `memory aligned` with the `value` of the `union` type, so `4` bytes of `padding memory` are added. Make the `struct` type `AqvmMemoryRegister_Register` occupy `16` bytes. </br>

If non-8-byte types such as int are used, 4 bytes of padding memory will be wasted, resulting in memory loss. Therefore, 4-8 bytes of memory will be wasted in all registers.</br>

### Register architecture of `AQ`
In order to solve the occupancy problem of the traditional `register` architecture, `AQ` combines the `local variable table` characteristics of the `stack frame` of the `JVM` and optimizes the `memory architecture`, which significantly reduces the occupancy problem.</br>

Here are three options:</br>

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

Since pointers take up 4 to 8 bytes, the data itself takes up 1 to 8 bytes, plus the type takes up 1 byte, plan 1 takes up 6 to 17 bytes. There may also be memory alignment issues, so plan 1 will also cause a huge memory loss.</br>
In fact, when it is required to retain memory type information, the highest memory utilization is `plan 2`, but `plan 2` cannot preserve the `coherence` of different types of data in the same data structure (such as: structure), which may make some pointer operations invalid. Therefore, for `memory safety`, do not use `plan 2`. </br>
In some cases (the virtual machine instruction set includes types), `plan 3` can also meet the needs of memory storage, but due to the need for a reduced instruction set, type information is not included in the instructions, so it cannot meet the needs of virtual machine operation.</br>

Therefore, we adopt the following design to ensure the utilization of memory and greatly improve the memory usage problem. </br>

`AQ`'s `memory` directly uses `void*` pointer to store data, `size_t` to store the occupied memory size, and `uint8_t` array to store the type. Since `uint8_t` occupies `8` bits, in order to reduce the occupation, each byte uses `4` bits to store the type. Therefore, a `uint8_t` variable can store `2` types. The first `4` bits of each `uint8_t` variable are used for the type of the `even` bytes, and the last `4` bits are used for the type of the `odd` bytes. </br>

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
  // Each uint8_t type location stores two type data. The storage locations
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
  // Each uint8_t type location stores two type data. The storage locations
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

However, this design has high requirements for data storage, because the length of the data is not fixed, so a special function is needed to operate with memory. </br>

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

In addition to reducing the use of `memory`, it is equally important to avoid the secondary occupation of `memory`. Therefore, we reuse the `memory` of `bytecode`, store the memory data and types in the memory part of `bytecode`, and use the `memory` pre-allocated in the `bytecode` file (the bytecode file contains the `memory` data and types) to achieve efficient use of `memory`.</br>
Because if the two parts are stored separately, there will be two parts of duplicate memory data and types, one in the `memory` part, and the other, the `bytecode` part will not be used, so we adopted a reuse method to reduce the memory waste caused by memory data and types. </br>
However, this requires special function implementation, and it should be noted that the allocation and release of memory data and types are managed by the relevant functions of the bytecode.</br>

```C
// Creates the struct AqvmMemory_Memory with |data|, |type|, and |size|.
// The function will allocate a struct AqvmMemory_Memory and copy |data|,
// |type|, and |size| into the struct. Returns a pointer to the struct if
// successful. Returns NULL if creation fails.
struct AqvmMemory_Memory* AqvmMemory_CreateMemory(void* data, void* type,
  ...
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
// NOTICE: The function only frees the memory of the struct. The memory pointed
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

# Detailed standards:
## Directory Structure
The code of the `memory` part is located in `/aqvm/memory`. It contains multiple code files.</br>
1. `CMakeLists.txt` - CMake build file in this directory
2. `memory.h` - memory data structures and related functions
3. `memory.c` - implementation of memory related functions
4. `types.h` - Memory type definitions

## memory.h
### AqvmMemory_Memory
This structure stores information about memory.</br>
|type| is a pointer to an array that stores the type of each byte in memory. Each byte uses 4 bits to store the type. Therefore, a uint8_t variable can store 2 types. The first 4 bits of each uint8_t variable are used for the type of even bytes, and the last 4 bits are used for the type of odd bytes. The types are listed in types.h. </br>
|data| is a pointer of type void* pointing to the memory where the data is stored.</br>
|size| is the size of the memory.</br>
Note: The structure AqvmMemory_Memory only stores information about memory. Memory is allocated by the bytecode function when storing bytecode. The memory of |memory| and |type| is part of the bytecode memory.</br>

```C
struct AqvmMemory_Memory {
  uint8_t* type;
  void* data;
  size_t size;
};
```

### AqvmMemory_CheckMemoryConditions
Check memory conditions on the system.</br>
Returns the number of warnings.</br>

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
Create a structure AqvmMemory_Memory containing |data|, |type| and |size|.</br>
This function will allocate an AqvmMemory_Memory structure and copy |data|, |type| and |size| into the structure. Returns a pointer to the structure. Returns NULL if creation fails.</br>

```C
struct AqvmMemory_Memory* AqvmMemory_CreateMemory(void* data, void* type,
  ...
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
Releases the memory of |memory_ptr|. No return value.</br>
Note: This function only releases the memory of the structure. The memory pointed to by the pointers to the data and types in the structure will not be released. These memories are managed by bytecode related functions.</br>

```C
void AqvmMemory_FreeMemory(struct AqvmMemory_Memory* memory_ptr) {
  free(memory_ptr);
}
```

### AqvmMemory_SetType
Sets the data type at byte |index| in |memory| to |type|. |type| should be less than 4 bits.</br>
Returns 0 on success. Returns -1 if the memory pointer is NULL. Returns -2 if the index pointer is NULL. Returns -3 if the index is out of range. Returns -4 if the type is out of range.</br>

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
  // Each uint8_t type location stores two type data. The storage locations
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
Get the data type of the byte at |index| in |memory|.</br>
Returns a type less than 4 bits (0x0F) on success. If the memory pointer is NULL, returns 0x11. If the index pointer is NULL, returns 0x12. If the index is out of memory range, returns 0x13.</br>

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
  // Each uint8_t type location stores two type data. The storage locations
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
Write the data of size |size| pointed to by |data_ptr| to the data at |index| bytes in |memory|.</br>
Returns 0 on success. If the memory pointer is NULL, returns -1. If the index pointer is NULL, returns -2. If the index is out of memory, returns -3. If the data pointer is NULL, returns -4.</br>

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
// NOTICE: The function only frees the memory of the struct. The memory pointed
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
  ...
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
  // Each uint8_t type location stores two type data. The storage locations
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
  // Each uint8_t type location stores two type data. The storage locations
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

The cooperation of these codes together constitutes the complete memory architecture of Aqvm, which effectively alleviates memory pressure and improves the operating efficiency of Aqvm.

> We are working harder to develop the `AQ virtual machine`. If you want to learn more or participate in the development, please follow our official website: https://www.axa6.com and Github: https://github.com/aq-org/AQ. </br>

> This article is released under AQ License: https://github.com/aq-org/AQ/blob/main/LICENSE. If necessary, please adapt or reprint it according to AQ License.