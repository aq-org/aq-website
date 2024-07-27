---
publishDate: 2024-07-22T16:50:00+08:00
title: Una excelente arquitectura de memoria para máquinas virtuales - AQ
excerpt: La arquitectura de memoria de la máquina virtual afecta directamente el rendimiento y la ocupación de la máquina virtual.  Diseñar una arquitectura excelente puede mejorar eficazmente el rendimiento y la eficiencia.  Este artículo presentará la arquitectura de memoria utilizada por las máquinas virtuales AQ.
image: https://www.axa6.com/aq.png
category: Blog
tags:
  - AQ
  - Blog
metadata:
  canonical: https://www.axa6.com/es/an-excellent-virtual-machine-memory-architecture
---

# Introducción
 La arquitectura de memoria de la "máquina virtual" afecta directamente el rendimiento y la ocupación de la máquina virtual.  Diseñar una arquitectura excelente puede mejorar eficazmente el rendimiento y la eficiencia.  </br>
 Este artículo presentará la arquitectura de memoria utilizada por "AQ Virtual Machine" y los estándares detallados de la memoria de "AQ Virtual Machine".  </br>
 Al optimizar la arquitectura de memoria de la "máquina virtual", ayudará a la "máquina virtual" a *eficiencia operativa* y *reducirá la ocupación*.  Si es posible, debes equilibrar los dos tanto como sea posible para que la "máquina virtual" alcance su estado óptimo.  </br>

 > En algunos casos, se debe realizar un desarrollo diferente según las necesidades especiales de la máquina virtual.  </br>
 > Por ejemplo: En situaciones de *memoria limitada* como `microcontrolador`, es necesario *reducir la ocupación* tanto como sea posible.  </br>
 > En situaciones *sensibles al rendimiento* como la "computación paralela", es necesario centrarse en la *optimización del rendimiento*.  </br>

 # Ideas de diseño
 ## Arquitectura de memoria
 ### Arquitectura de memoria básica
 "AQ" adopta la arquitectura de memoria básica de "registro", pero es diferente de la arquitectura de "registro" estándar. Ha realizado algunas mejoras y optimizaciones en la arquitectura de "registro".  </br>
 > El `registro` aquí no es el `registro` en `CPU`, sino el `registro virtual` simulado en la `memoria`.  </br>

 ### Razón para seleccionar el registro
 En comparación con la arquitectura de pila adoptada por las máquinas virtuales de lenguajes convencionales como "JAVA" y "Python", la razón por la que "AQ" decidió adoptar la arquitectura de "registro" es la optimización del rendimiento y la facilidad de comprensión del "código de bytes".  </br>
 Aunque generalmente se considera que la arquitectura "stack" es más fácil de portar y escribir, habrá algunas pérdidas en el rendimiento real. Los accesos múltiples a la "memoria" la ralentizarán, lo cual es inevitable y difícil de optimizar por completo.  Por lo tanto, para resolver la *pérdida de rendimiento* aquí, "AQ" adopta una arquitectura de "registro".  Al mismo tiempo, desde la perspectiva del "código de bytes", el código de bytes de la arquitectura "registro" es *más fácil de entender*. Sus instrucciones son similares al método de "parámetros" de la "función", en lugar de enfrentarse directamente a los numerosos ". operación de pila.  </br>

 ### La diferencia entre la arquitectura de "registro"
 #### Arquitectura de registro estándar
 En la arquitectura de registro estándar, los "registros" incluyen:</br>

 1. `Tipo de datos`: el tipo de datos que almacenará el registro (como int, float, double, etc.)
 2. `datos`: el valor de los datos que almacenará el registro
 3. Etiqueta (opcional): etiqueta de los datos que almacenará el registro (como variable, función, clase, etc.)
 4. Referencia (opcional): una referencia a los datos que almacenará el registro (como la dirección de un objeto, etc.)

 Aunque la arquitectura de memoria de las "máquinas virtuales" en diferentes idiomas puede ser diferente, esta información generalmente se almacena.  </br>

 Esta arquitectura se utilizó durante el desarrollo de "AQ", pero después de las pruebas, consumió una gran cantidad de memoria.  </br>

 El siguiente es el código `register.h` utilizado por `AQ`:</br>

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

Como se puede ver en el código anterior, incluso si solo se conserva el contenido necesario, debido a que el `AqvmMemoryRegister_ValueType` del tipo `enum` ocupa `4` bytes, el `AqvmMemoryRegister_Value` del tipo `union` ocupa `8` bytes , y el tipo `struct` ocupará `12` bytes de memoria.  </br>

 Al mismo tiempo, debido a la optimización del compilador "C", el "tipo" del tipo "enum" en el "AqvmMemoryRegister_Register" del tipo "estructura" está "alineado en memoria" con el "valor" del " tipo union`, por lo que se agregan palabras `4` a la `memoria de relleno` de la sección.  Haga que `AqvmMemoryRegister_Register` de tipo `struct` ocupe `16` bytes.  </br>

 Si utiliza `int` y otros tipos de bytes que no sean 8`, se desperdiciarán `4` bytes de `memoria de relleno`, lo que provocará una pérdida de memoria.  Por lo tanto, se desperdiciarán entre "4" y "8" bytes de memoria en todos los registros.  </br>

 ### Estructura de registro de `AQ`
 Para resolver el problema de ocupación de la arquitectura tradicional de "registro", "AQ" combina las características de "tabla de variables locales" del "marco de pila" de "JVM" y optimiza la "arquitectura de memoria", reduciendo significativamente el problema de ocupación.  </br>

 Aquí hay tres alternativas:</br>

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

Dado que el puntero ocupa `4`-`8` bytes, los datos en sí ocupan `1`-`8` bytes, más el tipo `1` byte, por lo que el `plan 1` ocupa `6`-`17` bytes, y puede haber una "alineación de la memoria", por lo que el "plan 1" también provocará una gran pérdida de memoria.  </br>
 De hecho, cuando se requiere retener información del tipo de memoria, la utilización de memoria más alta es el "plan 2", pero el "plan 2" no puede guardar la "coherencia" de diferentes tipos de datos en la misma estructura de datos (como una estructura) , lo que puede invalidar algunas operaciones de puntero.  Por lo tanto, para la "seguridad de la memoria", no se utiliza el "plan 2".  </br>
 En algunos casos (el conjunto de instrucciones de la máquina virtual incluye tipos), el "plan 3" también puede satisfacer las necesidades de almacenamiento de memoria. Sin embargo, debido a las necesidades del conjunto de instrucciones reducido, la información de tipo no se incluye en las instrucciones, por lo que no puede. satisfacer las necesidades de operación de la máquina virtual.  </br>

 Por lo tanto, adoptamos el siguiente diseño para garantizar la "tasa de utilización" de la "memoria" y al mismo tiempo mejorar en gran medida el problema de uso de la memoria.  </br>

 La `memoria` de `AQ` usa directamente punteros `void*` para almacenar datos, `size_t` almacena el tamaño de la memoria ocupada y usa el tipo de almacenamiento de matriz `uint8_t`.  Dado que `uint8_t` ocupa `8` bits, para reducir la ocupación, cada byte usa `4` bits para almacenar el tipo.  Por lo tanto, una variable `uint8_t` puede almacenar tipos `2`.  Los primeros "4" bits de cada variable "uint8_t" se utilizan para el tipo de byte "par" y los últimos "4" bits se utilizan para el tipo de byte "impar".  </br>

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

Debido a la "memoria", el acceso al "tipo" requiere una utilización precisa.  El tipo `uint8_t` requiere `8` bits, pero excede las necesidades de almacenamiento del tipo, por lo que `4` bits no solo pueden satisfacer las necesidades de almacenamiento del tipo, sino también reducir el uso de memoria.  Pero se requieren funciones especiales para mantener el acceso al "tipo".  </br>

```C
// Sets the type of the data at |index| bytes in |memory| to |type|. |type|
// should be less than 4 bits.
// Returns 0 if successful. Returns -1 if the memory pointer is NULL. Returns -2
// if the type pointer is NULL. Returns -3 if the index is out of range. Returns
// -4 if the type is out of range.
int AqvmMemory_SetType(const struct AqvmMemory_Memory* memory, size_t index,
                       uint8_t type) {
  if (memory == NULL) {
    AqvmBase_OutputLog("\"ERROR\"", "\"AqvmMemory_SetType_NullMemoryPointer\"",
                       "\"The memory pointer is NULL.\"", NULL);
    return -1;
  }
  if (memory->type == NULL) {
    AqvmBase_OutputLog("\"ERROR\"", "\"AqvmMemory_SetType_NullTypePointer\"",
                       "\"The type pointer is NULL.\"", NULL);
    return -2;
  }
  if (index > memory->size) {
    AqvmBase_OutputLog("\"ERROR\"", "\"AqvmMemory_SetType_OutOfMemoryRange\"",
                       "\"The index is out of memory range.\"", NULL);
    return -3;
  }
  if (type > 0x0F) {
    AqvmBase_OutputLog("\"ERROR\"", "\"AqvmMemory_SetType_OutOfTypeRange\"",
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
    AqvmBase_OutputLog("\"ERROR\"", "\"AqvmMemory_GetType_NullMemoryPointer\"",
                       "\"The memory pointer is NULL.\"", NULL);
    return 0x11;
  }
  if (memory->type == NULL) {
    AqvmBase_OutputLog("\"ERROR\"", "\"AqvmMemory_GetType_NullTypePointer\"",
                       "\"The type pointer is NULL.\"", NULL);
    return 0x12;
  }
  if (index > memory->size) {
    AqvmBase_OutputLog("\"ERROR\"", "\"AqvmMemory_GetType_OutOfMemoryRange\"",
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

Sin embargo, el uso de este diseño tiene requisitos más altos para el almacenamiento de datos, porque la longitud de los datos no es fija, por lo que se requieren funciones especiales para operar con la memoria.  </br>

```C
// Writes the data that |data_ptr| points to of size |size| to the data of at
// |index| bytes in |memory|.
// Returns 0 if successful. Returns -1 if the memory pointer is NULL. Returns -2
// if the type pointer is NULL. Returns -3 if the index is out of range. Returns
// -4 if the data pointer is NULL.
int AqvmMemory_WriteData(struct AqvmMemory_Memory* memory, size_t index,
                         void* data_ptr, size_t size) {
  if (memory == NULL) {
    AqvmBase_OutputLog("\"ERROR\"",
                       "\"AqvmMemory_WriteData_NullMemoryPointer\"",
                       "\"The memory pointer is NULL.\"", NULL);
    return -1;
  }
  if (memory->type == NULL) {
    AqvmBase_OutputLog("\"ERROR\"", "\"AqvmMemory_WriteData_NullTypePointer\"",
                       "\"The type pointer is NULL.\"", NULL);
    return -2;
  }
  if (index > memory->size) {
    AqvmBase_OutputLog("\"ERROR\"", "\"AqvmMemory_WriteData_OutOfMemoryRange\"",
                       "\"The index is out of memory range.\"", NULL);
    return -3;
  }
  if (data_ptr == NULL) {
    AqvmBase_OutputLog("\"ERROR\"", "\"AqvmMemory_WriteData_NullDataPointer\"",
                       "\"The data pointer is NULL.\"", NULL);
    return -4;
  }

  // Since void* does not have a specific size, pointer moves need to be
  // converted before moving.
  memcpy((void*)((uintptr_t)memory->data + index), data_ptr, size);

  return 0;
}
```

Además de reducir el uso de la memoria, es igualmente importante evitar la ocupación secundaria de la memoria.  Por lo tanto, reutilizamos la `memoria` de `bytecode`, almacenamos los datos y tipos de memoria en la parte de memoria de `bytecode` y usamos la `memoria` preasignada en el archivo `bytecode` (el archivo de código de bytes contiene los datos y tipos de "memoria") para lograr una utilización eficiente de la "memoria".  </br>
 Porque si almacena dos partes por separado, necesita tener dos partes de datos y tipos de memoria repetidos. Una parte está en la parte de "memoria" y la otra parte, la parte de "código de bytes", no se utilizará, por lo que adoptamos. reutilización Este método reduce el desperdicio de memoria causado por los datos y tipos de memoria.  </br>
 Sin embargo, se requiere la implementación de una función especial y cabe señalar que la asignación y liberación de datos de memoria y los tipos de memoria se gestionan mediante funciones relacionadas de código de bytes.  </br>

```C
// Creates and initializes the struct AqvmMemory_Memory with |data|, |type|, and
// |size|. The function will allocate a struct AqvmMemory_Memory and copy
// |data|, |type|, and |size| into the struct. Returns a pointer to the struct
// if successful. Returns NULL if creation fails.
struct AqvmMemory_Memory* AqvmMemory_InitializeMemory(void* data, void* type,
                                                      size_t size) {
  AqvmBase_OutputLog("\"INFO\"", "\"AqvmMemory_InitializeMemory_Start\"",
                     "\"Memory initialization started.\"", NULL);

  struct AqvmMemory_Memory* memory_ptr =
      (struct AqvmMemory_Memory*)malloc(sizeof(struct AqvmMemory_Memory));
  if (memory_ptr == NULL) {
    AqvmBase_OutputLog(
        "\"ERROR\"", "\"AqvmMemory_InitializeMemory_MemoryAllocationFailure\"",
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
  AqvmBase_OutputLog("\"INFO\"", "\"AqvmMemory_FreeMemory_Start\"",
                     "\"Memory deallocation started.\"", NULL);

  free(memory_ptr);
}
```

Además, debido a que la definición de tipos en algunos sistemas es diferente del estándar AQ, se diseñan funciones relevantes para garantizar que la máquina virtual cumpla con el estándar.  Si los sistemas difieren del estándar, se deben realizar diseños especiales para estos sistemas.  </br>

```C
// Checks the memory conditions in the system.
// Returns the number of warnings.
int AqvmMemory_CheckMemoryConditions() {
  int warning_count = 0;
  if (sizeof(aqbyte) != 1) {
    AqvmBase_OutputLog(
        "\"WARNING\"", "\"AqvmMemory_CheckMemoryConditions_ByteLengthWarning\"",
        "\"The length requirement for the byte type does not conform to the "
        "type "
        "definition.\"",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqint) != 4) {
    AqvmBase_OutputLog(
        "\"WARNING\"", "\"AqvmMemory_CheckMemoryConditions_IntLengthWarning\"",
        "\"The length requirement for the int type does not conform to the "
        "type "
        "definition.\"",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqlong) != 8) {
    AqvmBase_OutputLog(
        "\"WARNING\"", "\"AqvmMemory_CheckMemoryConditions_LongLengthWarning\"",
        "\"The length requirement for the long type does not conform to the "
        "type "
        "definition.\"",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqfloat) != 4) {
    AqvmBase_OutputLog(
        "\"WARNING\"",
        "\"AqvmMemory_CheckMemoryConditions_FloatLengthWarning\"",
        "\"The length requirement for the float type does not conform to the "
        "type definition.\"",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqdouble) != 8) {
    AqvmBase_OutputLog(
        "\"WARNING\"",
        "\"AqvmMemory_CheckMemoryConditions_DoubleLengthWarning\"",
        "\"The length requirement for the double type does not conform to the "
        "type definition.\"",
        NULL);
    ++warning_count;
  }

  if (warning_count == 0) {
    AqvmBase_OutputLog("\"INFO\"",
                       "\"AqvmMemory_CheckMemoryConditions_CheckNormal\"",
                       "\"No memory conditions warning.\"", NULL);
  }

  return warning_count;
}
```

# Estándares detallados:
 ## Estructura de directorios
 El código para la parte `memoria` se encuentra en `/aqvm/memory`.  Contiene varios archivos de código.  </br>
 1. `CMakeLists.txt`: archivo de compilación de CMake en este directorio
 2. `memory.h`: estructuras de datos de memoria y funciones relacionadas
 3. `memory.c`: implementación de funciones relacionadas con la memoria
 4. `types.h` - definición de tipos de memoria

 ## memory.h
 ### AqvmMemory_Memory
 Esta estructura almacena información sobre la memoria.  </br>
 |tipo| es un puntero a una matriz que almacena el tipo de cada byte en la memoria.  Cada byte utiliza 4 bits para almacenar el tipo.  Por tanto, una variable uint8_t puede almacenar 2 tipos.  Los primeros 4 bits de cada variable uint8_t se utilizan para el tipo de bytes pares y los últimos 4 bits se utilizan para el tipo de bytes impares.  La lista de tipos está en tipos.h.  </br>
 |datos| es un puntero de tipo void* a la memoria donde se almacenan los datos.  </br>
 |tamaño| es el tamaño de la memoria.  </br>
 Nota: La estructura AqvmMemory_Memory solo almacena información de la memoria.  La memoria es asignada por la función de código de bytes al almacenar el código de bytes.  La memoria para |memoria| y |tipo| es parte de la memoria de código de bytes.  </br>

```C
struct AqvmMemory_Memory {
  uint8_t* type;
  void* data;
  size_t size;
};
```

### AqvmMemory_CheckMemoryConditions
Verifique las condiciones de la memoria en el sistema.  </br>
 Devuelve el número de advertencias.  </br>

```C
int AqvmMemory_CheckMemoryConditions() {
  int warning_count = 0;
  if (sizeof(aqbyte) != 1) {
    AqvmBase_OutputLog(
        "\"WARNING\"", "\"AqvmMemory_CheckMemoryConditions_ByteLengthWarning\"",
        "\"The length requirement for the byte type does not conform to the "
        "type "
        "definition.\"",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqint) != 4) {
    AqvmBase_OutputLog(
        "\"WARNING\"", "\"AqvmMemory_CheckMemoryConditions_IntLengthWarning\"",
        "\"The length requirement for the int type does not conform to the "
        "type "
        "definition.\"",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqlong) != 8) {
    AqvmBase_OutputLog(
        "\"WARNING\"", "\"AqvmMemory_CheckMemoryConditions_LongLengthWarning\"",
        "\"The length requirement for the long type does not conform to the "
        "type "
        "definition.\"",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqfloat) != 4) {
    AqvmBase_OutputLog(
        "\"WARNING\"",
        "\"AqvmMemory_CheckMemoryConditions_FloatLengthWarning\"",
        "\"The length requirement for the float type does not conform to the "
        "type definition.\"",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqdouble) != 8) {
    AqvmBase_OutputLog(
        "\"WARNING\"",
        "\"AqvmMemory_CheckMemoryConditions_DoubleLengthWarning\"",
        "\"The length requirement for the double type does not conform to the "
        "type definition.\"",
        NULL);
    ++warning_count;
  }

  if (warning_count == 0) {
    AqvmBase_OutputLog("\"INFO\"",
                       "\"AqvmMemory_CheckMemoryConditions_CheckNormal\"",
                       "\"No memory conditions warning.\"", NULL);
  }

  return warning_count;
}
```

### AqvmMemory_InitializeMemory
Crea una estructura AqvmMemory_Memory que contiene |datos|, |tipo| y |tamaño|.  </br>
 Esta función asigna una estructura AqvmMemory_Memory y copia |datos|, |tipo| y |tamaño| en la estructura.  Devuelve un puntero a esta estructura.  Devuelve NULL si falla la creación.  </br>

```C
struct AqvmMemory_Memory* AqvmMemory_InitializeMemory(void* data, void* type,
                                                      size_t size) {
  AqvmBase_OutputLog("\"INFO\"", "\"AqvmMemory_InitializeMemory_Start\"",
                     "\"Memory initialization started.\"", NULL);

  struct AqvmMemory_Memory* memory_ptr =
      (struct AqvmMemory_Memory*)malloc(sizeof(struct AqvmMemory_Memory));
  if (memory_ptr == NULL) {
    AqvmBase_OutputLog(
        "\"ERROR\"", "\"AqvmMemory_InitializeMemory_MemoryAllocationFailure\"",
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
Libere la memoria de |memory_ptr|.  Sin valor de retorno.  </br>
 Nota: Esta función solo libera la memoria de la estructura.  La memoria a la que apuntan los punteros a datos y tipos en la estructura no se liberará.  Estas memorias se gestionan mediante funciones relacionadas con el código de bytes.  </br>

```C
void AqvmMemory_FreeMemory(struct AqvmMemory_Memory* memory_ptr) {
  AqvmBase_OutputLog("\"INFO\"", "\"AqvmMemory_FreeMemory_Start\"",
                     "\"Memory deallocation started.\"", NULL);

  free(memory_ptr);
}
```

### AqvmMemory_SetType
Establezca el tipo de datos en |índice| bytes en |memoria| en |tipo|.  |tipo| debe tener menos de 4 dígitos.  </br>
 Devuelve 0 en caso de éxito.  Si el puntero de memoria es NULL, se devuelve -1.  Si el puntero de índice es NULL, se devuelve -2.  Si el índice está fuera de rango, se devuelve -3.  Si el tipo está fuera de rango, se devuelve -4.  </br>

```C
int AqvmMemory_SetType(const struct AqvmMemory_Memory* memory, size_t index,
                       uint8_t type) {
  if (memory == NULL) {
    AqvmBase_OutputLog("\"ERROR\"", "\"AqvmMemory_SetType_NullMemoryPointer\"",
                       "\"The memory pointer is NULL.\"", NULL);
    return -1;
  }
  if (memory->type == NULL) {
    AqvmBase_OutputLog("\"ERROR\"", "\"AqvmMemory_SetType_NullTypePointer\"",
                       "\"The type pointer is NULL.\"", NULL);
    return -2;
  }
  if (index > memory->size) {
    AqvmBase_OutputLog("\"ERROR\"", "\"AqvmMemory_SetType_OutOfMemoryRange\"",
                       "\"The index is out of memory range.\"", NULL);
    return -3;
  }
  if (type > 0x0F) {
    AqvmBase_OutputLog("\"ERROR\"", "\"AqvmMemory_SetType_OutOfTypeRange\"",
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
Obtiene el tipo de datos en |índice| bytes en |memoria|.  </br>
 Devuelve un tipo de menos de 4 bits (0X0F) en caso de éxito.  Si el puntero de memoria es NULL, se devuelve 0x11.  Si el puntero de índice es NULL, se devuelve 0x12.  Si el índice no tiene memoria, se devuelve 0x13.  </br>

```C
uint8_t AqvmMemory_GetType(struct AqvmMemory_Memory* memory, size_t index) {
  if (memory == NULL) {
    AqvmBase_OutputLog("\"ERROR\"", "\"AqvmMemory_GetType_NullMemoryPointer\"",
                       "\"The memory pointer is NULL.\"", NULL);
    return 0x11;
  }
  if (memory->type == NULL) {
    AqvmBase_OutputLog("\"ERROR\"", "\"AqvmMemory_GetType_NullTypePointer\"",
                       "\"The type pointer is NULL.\"", NULL);
    return 0x12;
  }
  if (index > memory->size) {
    AqvmBase_OutputLog("\"ERROR\"", "\"AqvmMemory_GetType_OutOfMemoryRange\"",
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
Escribe los datos de tamaño |tamaño| señalados por |data_ptr| en los datos en |índice|  </br>
 Devuelve 0 en caso de éxito.  Si el puntero de memoria es NULL, se devuelve -1.  Si el puntero de índice es NULL, se devuelve -2.  Si el índice no tiene memoria, se devuelve -3.  Si el puntero de datos es NULL, se devuelve -4.  </br>

```C
int AqvmMemory_WriteData(struct AqvmMemory_Memory* memory, size_t index,
                         void* data_ptr, size_t size) {
  if (memory == NULL) {
    AqvmBase_OutputLog("\"ERROR\"",
                       "\"AqvmMemory_WriteData_NullMemoryPointer\"",
                       "\"The memory pointer is NULL.\"", NULL);
    return -1;
  }
  if (memory->type == NULL) {
    AqvmBase_OutputLog("\"ERROR\"", "\"AqvmMemory_WriteData_NullTypePointer\"",
                       "\"The type pointer is NULL.\"", NULL);
    return -2;
  }
  if (index > memory->size) {
    AqvmBase_OutputLog("\"ERROR\"", "\"AqvmMemory_WriteData_OutOfMemoryRange\"",
                       "\"The index is out of memory range.\"", NULL);
    return -3;
  }
  if (data_ptr == NULL) {
    AqvmBase_OutputLog("\"ERROR\"", "\"AqvmMemory_WriteData_NullDataPointer\"",
                       "\"The data pointer is NULL.\"", NULL);
    return -4;
  }

  // Since void* does not have a specific size, pointer moves need to be
  // converted before moving.
  memcpy((void*)((uintptr_t)memory->data + index), data_ptr, size);

  return 0;
}
```

### `memory.h` Código completo:

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
### `memory.c` Código completo:

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
#include "aqvm/base/logging.h"

int AqvmMemory_CheckMemoryConditions() {
  int warning_count = 0;
  if (sizeof(aqbyte) != 1) {
    AqvmBase_OutputLog(
        "\"WARNING\"", "\"AqvmMemory_CheckMemoryConditions_ByteLengthWarning\"",
        "\"The length requirement for the byte type does not conform to the "
        "type "
        "definition.\"",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqint) != 4) {
    AqvmBase_OutputLog(
        "\"WARNING\"", "\"AqvmMemory_CheckMemoryConditions_IntLengthWarning\"",
        "\"The length requirement for the int type does not conform to the "
        "type "
        "definition.\"",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqlong) != 8) {
    AqvmBase_OutputLog(
        "\"WARNING\"", "\"AqvmMemory_CheckMemoryConditions_LongLengthWarning\"",
        "\"The length requirement for the long type does not conform to the "
        "type "
        "definition.\"",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqfloat) != 4) {
    AqvmBase_OutputLog(
        "\"WARNING\"",
        "\"AqvmMemory_CheckMemoryConditions_FloatLengthWarning\"",
        "\"The length requirement for the float type does not conform to the "
        "type definition.\"",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqdouble) != 8) {
    AqvmBase_OutputLog(
        "\"WARNING\"",
        "\"AqvmMemory_CheckMemoryConditions_DoubleLengthWarning\"",
        "\"The length requirement for the double type does not conform to the "
        "type definition.\"",
        NULL);
    ++warning_count;
  }

  if (warning_count == 0) {
    AqvmBase_OutputLog("\"INFO\"",
                       "\"AqvmMemory_CheckMemoryConditions_CheckNormal\"",
                       "\"No memory conditions warning.\"", NULL);
  }

  return warning_count;
}

struct AqvmMemory_Memory* AqvmMemory_InitializeMemory(void* data, void* type,
                                                      size_t size) {
  AqvmBase_OutputLog("\"INFO\"", "\"AqvmMemory_InitializeMemory_Start\"",
                     "\"Memory initialization started.\"", NULL);

  struct AqvmMemory_Memory* memory_ptr =
      (struct AqvmMemory_Memory*)malloc(sizeof(struct AqvmMemory_Memory));
  if (memory_ptr == NULL) {
    AqvmBase_OutputLog(
        "\"ERROR\"", "\"AqvmMemory_InitializeMemory_MemoryAllocationFailure\"",
        "\"Failed to allocate memory.\"", NULL);
    return NULL;
  }

  memory_ptr->data = data;
  memory_ptr->type = type;
  memory_ptr->size = size;

  return memory_ptr;
}

void AqvmMemory_FreeMemory(struct AqvmMemory_Memory* memory_ptr) {
  AqvmBase_OutputLog("\"INFO\"", "\"AqvmMemory_FreeMemory_Start\"",
                     "\"Memory deallocation started.\"", NULL);

  free(memory_ptr);
}

int AqvmMemory_SetType(const struct AqvmMemory_Memory* memory, size_t index,
                       uint8_t type) {
  if (memory == NULL) {
    AqvmBase_OutputLog("\"ERROR\"", "\"AqvmMemory_SetType_NullMemoryPointer\"",
                       "\"The memory pointer is NULL.\"", NULL);
    return -1;
  }
  if (memory->type == NULL) {
    AqvmBase_OutputLog("\"ERROR\"", "\"AqvmMemory_SetType_NullTypePointer\"",
                       "\"The type pointer is NULL.\"", NULL);
    return -2;
  }
  if (index > memory->size) {
    AqvmBase_OutputLog("\"ERROR\"", "\"AqvmMemory_SetType_OutOfMemoryRange\"",
                       "\"The index is out of memory range.\"", NULL);
    return -3;
  }
  if (type > 0x0F) {
    AqvmBase_OutputLog("\"ERROR\"", "\"AqvmMemory_SetType_OutOfTypeRange\"",
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
    AqvmBase_OutputLog("\"ERROR\"", "\"AqvmMemory_GetType_NullMemoryPointer\"",
                       "\"The memory pointer is NULL.\"", NULL);
    return 0x11;
  }
  if (memory->type == NULL) {
    AqvmBase_OutputLog("\"ERROR\"", "\"AqvmMemory_GetType_NullTypePointer\"",
                       "\"The type pointer is NULL.\"", NULL);
    return 0x12;
  }
  if (index > memory->size) {
    AqvmBase_OutputLog("\"ERROR\"", "\"AqvmMemory_GetType_OutOfMemoryRange\"",
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
    AqvmBase_OutputLog("\"ERROR\"",
                       "\"AqvmMemory_WriteData_NullMemoryPointer\"",
                       "\"The memory pointer is NULL.\"", NULL);
    return -1;
  }
  if (memory->type == NULL) {
    AqvmBase_OutputLog("\"ERROR\"", "\"AqvmMemory_WriteData_NullTypePointer\"",
                       "\"The type pointer is NULL.\"", NULL);
    return -2;
  }
  if (index > memory->size) {
    AqvmBase_OutputLog("\"ERROR\"", "\"AqvmMemory_WriteData_OutOfMemoryRange\"",
                       "\"The index is out of memory range.\"", NULL);
    return -3;
  }
  if (data_ptr == NULL) {
    AqvmBase_OutputLog("\"ERROR\"", "\"AqvmMemory_WriteData_NullDataPointer\"",
                       "\"The data pointer is NULL.\"", NULL);
    return -4;
  }

  // Since void* does not have a specific size, pointer moves need to be
  // converted before moving.
  memcpy((void*)((uintptr_t)memory->data + index), data_ptr, size);

  return 0;
}
```

Mediante la cooperación de estos códigos, se forma una arquitectura de memoria Aqvm completa, que alivia efectivamente la presión de la memoria y mejora la eficiencia operativa de Aqvm.

 > Estamos trabajando más duro para desarrollar la "Máquina Virtual AQ".  Si desea obtener más información o participar en el trabajo de desarrollo, siga nuestro sitio web oficial: https://www.axa6.com y Github: https://github.com/aq-org/AQ.  </br>

 > Este artículo se publica según la licencia AQ: https://github.com/aq-org/AQ/blob/main/LICENSE Si es necesario, adáptelo o reimprima según la licencia AQ.