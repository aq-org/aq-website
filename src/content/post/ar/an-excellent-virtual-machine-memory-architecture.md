---
publishDate: 2024-06-01T19:55:05+08:00
title: An Excellent Virtual Machine Memory Architecture - AQ
excerpt: The memory architecture of a virtual machine directly affects its performance and usage. Designing an excellent architecture can effectively enhance performance and efficiency. This article will introduce the memory architecture used by the AQ virtual machine.
image: https://www.axa6.com/ar/aq.png
category: Blog
tags:
  - AQ
  - Blog
metadata:
  canonical: https://www.axa6.com/an-excellent-virtual-machine-memory-architecture
---

# Introduction
The `virtual machine` memory architecture directly affects the performance and usage of the virtual machine. Designing an excellent architecture can effectively enhance performance and efficiency.  
This article will introduce the memory architecture used by the `AQ virtual machine`.  
Optimizing the `virtual machine` memory architecture helps improve the *operational efficiency* and *reduce usage* of the `virtual machine`. If possible, both should be balanced to achieve the best state for the `virtual machine`.  
> In some cases, different developments should be carried out according to the special needs of the virtual machine.  
> For example, in situations with *memory constraints* such as `microcontrollers`, efforts should be made to *reduce usage* as much as possible.  
> In *performance-sensitive* situations such as `parallel computing`, the focus should be on *performance optimization*.  

# Memory Architecture
## Basic Memory Architecture
`AQ` adopts a `register`-based basic memory architecture, but it differs from the standard `register` architecture with some improvements and optimizations.  
> The `registers` mentioned here are not the `registers` in the `CPU`, but the `virtual registers` simulated in the `memory`.
## Reasons for Choosing Registers
Unlike mainstream language virtual machines like `JAVA` and `Python` that use stack architecture, `AQ` decided to use a `register` architecture for performance optimization and ease of understanding `bytecode`.  
Although the `stack` architecture is generally considered easier to port and write, it incurs some performance losses in practice due to multiple accesses to `memory`, which slows down its speed. This is unavoidable and difficult to completely optimize. Therefore, to solve this *performance loss*, `AQ` adopts a `register` architecture. Meanwhile, from the perspective of `bytecode`, the `register` architecture's bytecode is *easier to understand*, with instructions similar to `function` `parameters` rather than dealing directly with the numerous operations of the `stack`.  
## Differences in `Register` Architecture
### Standard Register Architecture
In a standard register architecture, `registers` include:  
1. `Data Type` - The type of data stored in the register (e.g., int, float, double, etc.)
2. `Data` - The value of the data stored in the register
3. (Optional) Mark - The mark of the data stored in the register (e.g., variable, function, class, etc.)
4. (Optional) Reference - The reference of the data stored in the register (e.g., address of an object, etc.)

Although `virtual machine` architectures in different languages may differ, they generally follow this form with slight changes.  

During the development of `AQ`, this architecture was used, but tests showed significant memory usage.  
Below is the `register.h` code previously used by `AQ`:
```C
// Copyright 2024 AQ author, All Rights Reserved.
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
As can be seen from the code above, even without the optional content, the `enum` type `AqvmMemoryRegister_ValueType` occupies `4` bytes, the `union` type `AqvmMemoryRegister_Value` occupies `8` bytes, and the `struct` type itself occupies `12` bytes of memory.  

Due to `C` compiler optimization, the `struct` type `AqvmMemoryRegister_Register` aligns the `enum` type `type` with the `union` type `value`, adding `4` bytes of padding memory. This makes the `struct` type `AqvmMemoryRegister_Register` occupy `16` bytes.

If `int` and other non-`8`-byte types are used, `4` bytes of padding memory will be wasted, causing memory loss. Therefore, there will be `4`-`8` bytes of memory waste in all registers.

### `AQ`'s Register Architecture
To solve the memory usage problem of traditional `register` architecture, `AQ` combines the characteristics of the `local variable table` in the `stack frame` of `JVM` and optimizes the `memory`, significantly reducing memory usage.  

`AQ`'s `memory` directly uses `void*` pointers to store data and `size_t` to store memory size, effectively reducing padding memory loss.  

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

Due to memory issues, `plan 1` also causes significant memory loss.
In fact, `plan 2` has the highest memory utilization when retaining memory information, but it cannot maintain the continuity of different types of data in the same data structure, which may cause some pointer operations to fail. Therefore, for `memory safety`, `plan 2` is not used.  
In some cases, `plan 3` can also meet memory storage needs, but due to the need for a reduced instruction set, type information is not included in the instructions, so it cannot meet the needs of the reduced instruction set.  

Therefore, we adopt the following design to ensure `memory` `utilization` while significantly improving memory usage.  

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

Due to `memory` reasons, the access to `type` needs to be precisely utilized. The `uint8_t` type requires `8` bits, but this exceeds the storage needs of the type, so `4` bits can meet the storage needs of the type while reducing memory usage. However, special functions are required to maintain `type` access.  

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

However, using this design for data `storage` has high requirements because the data may be disrupted, requiring specialized `functions` to cooperate with `memory` operations.  

```C
// Writes the data that |data_ptr| points to of size |size| to the data of at |index| bytes in |memory|.
// Returns 0 if successful. Returns -1 if the memory is NULL. Returns -2 if the
// index is out of memory range. Returns -3 if the data is NULL.
int AqvmMemory_WriteData(struct AqvmMemory_Memory* memory, size_t index,
                         void* data_ptr, size_t size);
```

In addition to reducing `memory` usage, avoiding secondary memory usage is also important. Therefore, we mix memory-related data with bytecode data, using the pre-allocated `memory` in the bytecode file (the bytecode file contains `memory` data and types), achieving efficient memory utilization.  
However, this requires special function implementations, and attention must be paid to managing memory data and type information by the bytecode-related functions.  

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

Additionally, due to differences in type definitions between some systems and the AQ standard, related functions are designed to ensure the correct operation of the virtual machine. If there are differences, special designs should be made for these systems.  

```C
// Checks the memory conditions in the system.
// Returns 0 if successful. Returns -1 if the length requirement for the int
// type does not conform to the type definition, -2 for long, -3 for float, -4
// for double, -5 for char, and -6 for bool.
int AqvmMemory_CheckMemoryConditions();
```

# Detailed Design:
## Directory Structure
The `memory` part of the code is located at `/aqvm/memory`. It contains multiple code files.  
1. `CMakeLists.txt` - CMake build file in this directory
2. `memory.h` - Memory data s### French

---
publishDate: 2024-06-01T19:55:05+08:00
title: Une Excellente Architecture de Mémoire de Machine Virtuelle - AQ
excerpt: L'architecture de la mémoire d'une machine virtuelle affecte directement ses performances et son utilisation. Concevoir une excellente architecture peut améliorer efficacement les performances et l'efficacité. Cet article présentera l'architecture de mémoire utilisée par la machine virtuelle AQ.
image: https://www.axa6.com/aq.png
category: Blog
tags:
  - AQ
  - Blog
metadata:
  canonical: https://www.axa6.com/une-excellente-architecture-de-mémoire-de-machine-virtuelle
---

# Introduction
L'architecture de la mémoire de la `machine virtuelle` affecte directement les performances et l'utilisation de la machine virtuelle. Concevoir une excellente architecture peut améliorer efficacement les performances et l'efficacité.  
Cet article présentera l'architecture de mémoire utilisée par la `machine virtuelle AQ`.  
L'optimisation de l'architecture de la mémoire de la `machine virtuelle` aide à améliorer l'*efficacité opérationnelle* et à *réduire l'utilisation* de la `machine virtuelle`. Si possible, les deux doivent être équilibrés pour atteindre le meilleur état de la `machine virtuelle`.  
> Dans certains cas, des développements différents doivent être réalisés en fonction des besoins spécifiques de la machine virtuelle.  
> Par exemple, dans des situations de *contraintes de mémoire* telles que les `microcontrôleurs`, il faut s'efforcer de *réduire l'utilisation* autant que possible.  
> Dans des situations *sensibles aux performances* telles que le `calcul parallèle`, l'accent doit être mis sur l'*optimisation des performances*.  

# Architecture de Mémoire
## Architecture de Mémoire de Base
`AQ` adopte une architecture de mémoire de base basée sur les `registres`, mais elle diffère de l'architecture de `registres` standard avec quelques améliorations et optimisations.  
> Les `registres` mentionnés ici ne sont pas les `registres` du `CPU`, mais les `registres virtuels` simulés dans la `mémoire`.
## Raisons du Choix des Registres
Contrairement aux machines virtuelles des langages principaux comme `JAVA` et `Python` qui utilisent une architecture de pile, `AQ` a décidé d'utiliser une architecture de `registre` pour l'optimisation des performances et la facilité de compréhension du `bytecode`.  
Bien que l'architecture de `pile` soit généralement considérée comme plus facile à porter et à écrire, elle entraîne des pertes de performances en pratique en raison des multiples accès à la `mémoire`, ce qui ralentit sa vitesse. Cela est inévitable et difficile à optimiser complètement. Par conséquent, pour résoudre cette *perte de performances*, `AQ` adopte une architecture de `registre`. Par ailleurs, du point de vue du `bytecode`, le bytecode de l'architecture de `registre` est *plus facile à comprendre*, avec des instructions similaires aux `paramètres` des `fonctions` plutôt que de gérer directement les nombreuses opérations de la `pile`tructure and related functions
3. `memory.c` - Implementation of memory-related functions
4. `types.h` - Definition of memory types

## `types.h`
The types also have related code. Below is the code for `types.h`:  
There are `6` basic types with specific definitions:  
1. int - 32 bits (4 bytes)
2. long - 64 bits (8 bytes)
3. float - 32 bits (4 bytes)
4. double - 64 bits (8 bytes)
5. char - 8 bits (1 byte)
6. bool - 8 bits (1 byte)

```C
// Copyright 2024 AQ author, All Rights Reserved.
// This program is licensed under the AQ License. You can find the AQ license in
// the root directory.

#ifndef AQ_AQVM_MEMORY_TYPES_H_
#define AQ_AQVM_MEMORY_TYPES_H_

#include <stdint.h>
#include <stdbool.h>

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
// Returns 0 if successful. Returns -1 if the length requirement for the int
// type does not conform to the type definition, -2 for long, -3 for float, -4
// for double, -5 for char, and -6 for bool.
int AqvmMemory_CheckMemoryConditions();

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

// Writes the data that |data_ptr| points to of size |size| to the data of at
// |index| bytes in |memory|.
// Returns 0 if successful. Returns -1 if the memory is NULL. Returns -2 if the
// index is out of memory range. Returns -3 if the data is NULL.
int AqvmMemory_WriteData(struct AqvmMemory_Memory* memory, size_t index,
                         void* data_ptr, size_t size);

#endif
```

### AqvmMemory_Memory
This structure stores information about the memory.  
|type| is a pointer to an array that stores the type of each byte in the memory. Each byte uses 4 bits to store the type. So a uint8_t variable can store 2 types. Each uint8_t variable's first 4 bits are used for the even byte's type and the next 4 bits are used for the odd byte's type. The type list is in types.h.  
|data| is a pointer of type void* to the memory that stores the data.  
|size| is the size of the memory.  
NOTICE: The struct AqvmMemory_Memory only stores information of the memory. The memory is allocated by the bytecode function when storing the bytecode. The memory of |memory| and |type| is part of the bytecode memory.  

```C
struct AqvmMemory_Memory {
  uint8_t* type;
  void* data;
  size_t size;
};
```

### AqvmMemory_CheckMemoryConditions
Checks the memory conditions in the system.  
Returns 0 if successful. Returns -1 if the length requirement for the int type does not conform to the type definition, -2 for long, -3 for float, -4 for double, -5 for char, and -6 for bool.  
```C
int AqvmMemory_CheckMemoryConditions();
```

### AqvmMemory_CreateMemory
Creates the struct AqvmMemory_Memory with |data|, |type|, and |size|.  
The function will allocate a struct AqvmMemory_Memory and copy |data|, |type|, and |size| into the struct. Returns a pointer to the struct.  

```C
struct AqvmMemory_Memory* AqvmMemory_CreateMemory(void* data, void* type, size_t size);
```

### AqvmMemory_FreeMemory
Frees the memory of the |memory_ptr|. No return.  
NOTICE: The function only frees the memory of the struct. The memory pointed to by pointers to data and type in struct is not freed. This memory is managed by bytecode related functions.  

```C
void AqvmMemory_FreeMemory(struct AqvmMemory_Memory* memory_ptr);
```
### AqvmMemory_SetType
Sets the type of the data at |index| bytes in |memory| to |type|. |type| should be less than 4 bits.  
Returns 0 if successful. Returns -1 if memory is NULL. Returns -2 if the index is out of range. Returns -3 if the type is out of range.  

```C
int AqvmMemory_SetType(const struct AqvmMemory_Memory* memory, size_t index, uint8_t type);
```

### AqvmMemory_GetType
Gets the type of the data at |index| bytes in |memory|.  
Returns the type that is less than 4 bits (0X0F) if successful. Returns 0x10 if the memory is NULL. Returns 0x20 if the index is out of memory range.  

```C
uint8_t AqvmMemory_GetType(struct AqvmMemory_Memory* memory, size_t index);
```

### AqvmMemory_WriteData
Writes the data that |data_ptr| points to of size |size| to the data of at |index| bytes in |memory|.  
Returns 0 if successful. Returns -1 if the memory is NULL. Returns -2 if the index is out of memory range. Returns -3 if the data is NULL.  

```C
int AqvmMemory_WriteData(struct AqvmMemory_Memory* memory, size_t index, void* data_ptr, size_t size);
```

## `memory.c`
Below are the specific function implementations:

```C
// Copyright 2024 AQ author, All Rights Reserved.
// This program is licensed under the AQ License. You can find the AQ license in
// the root directory.

#include "aqvm/memory/memory.h"

#include <stddef.h>
#include <stdlib.h>
#include <string.h>

#include "aqvm/memory/types.h"

int AqvmMemory_CheckMemoryConditions() {
  if (sizeof(aqint) != 4) {
    // TODO(WARNING): The length requirement for the int type does not conform
    // to the type definition.
    return -1;
  }
  if (sizeof(aqlong) != 8) {
    // TODO(WARNING): The length requirement for the long type does not conform
    // to the type definition.
    return -2;
  }
  if (sizeof(aqfloat) != 4) {
    // TODO(WARNING): The length requirement for the float type does not conform
    // to the type definition.
    return -3;
  }
  if (sizeof(aqdouble) != 4) {
    // TODO(WARNING): The length requirement for the double type does not
    // conform to the type definition.
    return -4;
  }
  if (sizeof(aqchar) != 1) {
    // TODO(WARNING): The length requirement for the char type does not conform
    // to the type definition.
    return -5;
  }
  if (sizeof(aqbool) != 1) {
    // TODO(WARNING): The length requirement for the bool type does not conform
    // to the type definition.
    return -6;
  }

  return 0;
}

void* AqvmMemory_AllocateMemory(size_t size) {
  void* ptr = malloc(size);
  if (ptr == NULL) {
    // TODO(WARNING): Handle the warning of memory allocation.
  }
  return ptr;
}

void AqvmMemory_FreeMemory(void* ptr) { free(ptr); }

int AqvmMemory_SetType(const struct AqvmMemory_Memory* memory, size_t index,
                       uint8_t type) {
  if (memory == NULL || memory->type == NULL) {
    // TODO(ERROR): The memory is NULL.
    return -1;
  }

  if (index > memory->size) {
    // TODO(ERROR): The index is out of memory range.
    return -2;
  }

  if (type > 0x0F) {
    // TODO(ERROR): The type is out of range.
    return -3;
  }

  if (index % 2 != 0) {
    memory->type[index / 2] = (memory->type[index / 2] & 0xF0) | type;
  } else {
    memory->type[index / 2] = (memory->type[index / 2] & 0x0F) | (type << 4);
  }

  return 0;
}

uint8_t AqvmMemory_GetType(struct AqvmMemory_Memory* memory, size_t index) {
  if (memory == NULL || memory->type == NULL) {
    // TODO(ERROR): The memory is NULL.
    return 0x10;
  }

  if (index > memory->size) {
    // TODO(ERROR): The index is out of memory range.
    return 0x20;
  }

  if (index % 2 != 0) {
    return memory->type[index / 2] & 0x0F;
  } else {
    return (memory->type[index / 2] & 0xF0) >> 4;
  }
}

int AqvmMemory_WriteData(struct AqvmMemory_Memory* memory, size_t index,
                         void* data_ptr, size_t size) {
  if (memory == NULL || memory->data == NULL) {
    // TODO(ERROR): The memory is NULL.
    return -1;
  }
  if (index + size > memory->size) {
    // TODO(ERROR): The index is out of memory range.
    return -2;
  }
  if (data_ptr == NULL) {
    // TODO(ERROR): The data is NULL.
    return -3;
  }

  memcpy(memory->data + index, data_ptr, size);
  return 0;
}
```

With the cooperation of these codes, a complete memory architecture of Aqvm is formed, effectively alleviating memory pressure while improving the operating efficiency of Aqvm.

> We are working hard on developing the `AQ virtual machine`. We would appreciate it if you could give us a star on Github. If you want to learn more or participate in the development work, please follow our official website: https://www.axa6.com and GitHub: https://github.com/aq-org/AQ.  

> This article is published under the AQ License: https://github.com/aq-org/AQ/blob/main/LICENSE. If needed, please adapt or reprint according to the AQ License.