---
publishDate: 2024-07-22T16:50:00+08:00
title: Une excellente architecture mémoire de machine virtuelle - AQ
excerpt: L'architecture de la mémoire de la machine virtuelle affecte directement les performances et l'occupation de la machine virtuelle.  Concevoir une excellente architecture peut améliorer efficacement les performances et l’efficacité.  Cet article présentera l'architecture de mémoire utilisée par les machines virtuelles AQ.
image: https://www.axa6.com/aq.png
category: Blog
tags:
  - AQ
  - Blog
metadata:
  canonical: https://www.axa6.com/fr/an-excellent-virtual-machine-memory-architecture
---

# Introduction
 L'architecture mémoire de la « machine virtuelle » affecte directement les performances et l'occupation de la machine virtuelle.  Concevoir une excellente architecture peut améliorer efficacement les performances et l’efficacité.  </br>
 Cet article présentera l'architecture de mémoire utilisée par « AQ Virtual Machine » et les normes détaillées de la mémoire « AQ Virtual Machine ».  </br>
 En optimisant l'architecture de mémoire de la « machine virtuelle », cela aidera la « machine virtuelle » à *l'efficacité opérationnelle* et à *réduire l'occupation*.  Si possible, vous devez équilibrer les deux autant que possible pour que la « machine virtuelle » atteigne son état optimal.  </br>

 > Dans certains cas, un développement différent doit être effectué en fonction des besoins particuliers de la machine virtuelle.  </br>
 > Par exemple : Dans des situations *à mémoire limitée* telles que « microcontrôleur », il est nécessaire de *réduire l'occupation* autant que possible.  </br>
 > Dans les situations *sensibles aux performances* telles que le « calcul parallèle », vous devez vous concentrer sur l'*optimisation des performances*.  </br>

 # Idées de conception
 ## Architecture mémoire
 ### Architecture mémoire de base
 `AQ` adopte l'architecture de mémoire de base de `register`, mais elle est différente de l'architecture `register` standard. Elle a apporté quelques améliorations et optimisations à l'architecture `register`.  </br>
 > Le `registre` ici n'est pas le `registre` dans `CPU`, mais le `registre virtuel` simulé dans la `mémoire`.  </br>

 ### Raison de la sélection du registre
 Par rapport à l'architecture de pile adoptée par les machines virtuelles de langage grand public telles que « JAVA » et « Python », la raison pour laquelle « AQ » a décidé d'adopter l'architecture « registre » est l'optimisation des performances et la facilité de compréhension du « bytecode ».  </br>
 Bien que l'architecture « pile » soit généralement considérée comme plus facile à porter et à écrire, il y aura certaines pertes de performances réelles. Les accès multiples à la « mémoire » la ralentiront, ce qui est inévitable et difficile à optimiser pleinement.  Par conséquent, afin de résoudre la *perte de performances* ici, `AQ` adopte une architecture `register`.  Dans le même temps, du point de vue du « bytecode », le bytecode de l'architecture « register » est *plus facile à comprendre*. Ses instructions sont similaires à la méthode « paramètres » de la « fonction », plutôt que de faire directement face aux nombreux « ». stack` fonctionne.  </br>

 ### La différence entre l'architecture `register`
 #### Architecture de registre standard
 Dans l'architecture de registre standard, les « registres » incluent :</br>

 1. `Type de données` - le type de données que le registre stockera (telles que int, float, double, etc.)
 2. « data » – la valeur des données que le registre stockera
 3. Balise (facultatif) - balise des données que le registre stockera (telles que variable, fonction, classe, etc.)
 4. (Facultatif) Référence - une référence aux données que le registre stockera (telles que l'adresse d'un objet, etc.)

 Bien que l'architecture de la mémoire des « machines virtuelles » dans différents langages puisse être différente, ces informations sont généralement stockées.  </br>

 Cette architecture a été utilisée lors du développement de « AQ », mais après les tests, elle occupait une grande quantité de mémoire.  </br>

 Voici le code `register.h` utilisé par `AQ` :</br>

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

Comme le montre le code ci-dessus, même si seul le contenu nécessaire est conservé, parce que le `AqvmMemoryRegister_ValueType` du type `enum` occupe `4` octets, le `AqvmMemoryRegister_Value` du type `union` occupe `8` octets. , et le type `struct` Il occupera `12` octets de mémoire.  </br>

 Dans le même temps, en raison de l'optimisation du compilateur `C`, le `type` du type `enum` dans le `AqvmMemoryRegister_Register` du type `struct` est `mémoire alignée` avec la `valeur` du ` type union, donc « 4 » mots sont ajoutés pour « remplir la mémoire » de la section.  Faites en sorte que `AqvmMemoryRegister_Register` de type `struct` occupe `16` octets.  </br>

 Si vous utilisez « int » et d'autres types d'octets non 8, « 4 » octets de « mémoire de remplissage » seront gaspillés, entraînant une perte de mémoire.  Par conséquent, il y aura entre « 4 » et « 8 » octets de mémoire gaspillés dans tous les registres.  </br>

 ### Structure du registre de `AQ`
 Afin de résoudre le problème d'occupation de l'architecture de « registre » traditionnelle, « AQ » combine les fonctionnalités de « table de variables locales » du « cadre de pile » de « JVM » et optimise « l'architecture de mémoire », réduisant considérablement le problème d'occupation.  </br>

 Voici trois alternatives :</br>

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

Puisque le pointeur occupe `4`-`8` octets, les données elles-mêmes occupent `1`-`8` octets, plus le type `1` octet, donc `plan 1` occupe `6`-`17` octets, et il peut y avoir un « alignement de la mémoire », donc le « plan 1 » entraînera également d'énormes pertes de mémoire.  </br>
 En fait, lorsqu'il est nécessaire de conserver des informations sur le type de mémoire, l'utilisation de mémoire la plus élevée est le « plan 2 », mais le « plan 2 » ne peut pas sauvegarder la « cohérence » des différents types de données dans la même structure de données (comme une structure) , ce qui peut invalider certaines opérations du pointeur.  Par conséquent, pour la « sécurité de la mémoire », le « plan 2 » n'est pas utilisé.  </br>
 Dans certains cas (le jeu d'instructions de la machine virtuelle inclut des types), le « plan 3 » peut également répondre aux besoins de stockage en mémoire. Cependant, en raison des besoins du jeu d'instructions réduit, les informations de type ne sont pas incluses dans les instructions, elles ne peuvent donc pas être incluses. répondre aux besoins de fonctionnement des machines virtuelles.  </br>

 Par conséquent, nous adoptons la conception suivante pour garantir le « taux d'utilisation » de la « mémoire » et en même temps améliorer considérablement le problème d'utilisation de la mémoire.  </br>

 La « mémoire » d'AQ utilise directement les pointeurs « void* » pour stocker les données, « size_t » stocke la taille de la mémoire occupée et utilise le type de stockage de tableau « uint8_t ».  Puisque `uint8_t` occupe `8` bits, pour réduire l'occupation, chaque octet utilise `4` bits pour stocker le type.  Par conséquent, une variable `uint8_t` peut stocker `2` types.  Les « 4 » premiers bits de chaque variable « uint8_t » sont utilisés pour le type d'octet « pair », et les « 4 » derniers bits sont utilisés pour le type d'octet « impair ».  </br>

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

En raison de la « mémoire », l'accès au « type » nécessite une utilisation précise.  Le type `uint8_t` nécessite `8` bits, mais il dépasse les besoins de stockage du type, donc `4` bits peuvent non seulement répondre aux besoins de stockage du type, mais également réduire l'utilisation de la mémoire.  Mais des fonctions spéciales sont nécessaires pour conserver l'accès au « type ».  </br>

```C
// Sets the type of the data at |index| bytes in |memory| to |type|. |type|
// should be less than 4 bits.
// Returns 0 if successful. Returns -1 if the memory pointer is NULL. Returns -2
// if the type pointer is NULL. Returns -3 if the index is out of range. Returns
// -4 if the type is out of range.
int AqvmMemory_SetType(const struct AqvmMemory_Memory* memory, size_t index,
                       uint8_t type) {
  if (memory == NULL) {
    AqvmBaseLogging_OutputLog("\"ERROR\"",
                              "\"AqvmMemory_SetType_NullMemoryPointer\"",
                              "\"The memory pointer is NULL.\"", NULL);
    return -1;
  }
  if (memory->type == NULL) {
    AqvmBaseLogging_OutputLog("\"ERROR\"",
                              "\"AqvmMemory_SetType_NullTypePointer\"",
                              "\"The type pointer is NULL.\"", NULL);
    return -2;
  }
  if (index > memory->size) {
    AqvmBaseLogging_OutputLog("\"ERROR\"",
                              "\"AqvmMemory_SetType_OutOfMemoryRange\"",
                              "\"The index is out of memory range.\"", NULL);
    return -3;
  }
  if (type > 0x0F) {
    AqvmBaseLogging_OutputLog("\"ERROR\"",
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
    AqvmBaseLogging_OutputLog("\"ERROR\"",
                              "\"AqvmMemory_GetType_NullMemoryPointer\"",
                              "\"The memory pointer is NULL.\"", NULL);
    return 0x11;
  }
  if (memory->type == NULL) {
    AqvmBaseLogging_OutputLog("\"ERROR\"",
                              "\"AqvmMemory_GetType_NullTypePointer\"",
                              "\"The type pointer is NULL.\"", NULL);
    return 0x12;
  }
  if (index > memory->size) {
    AqvmBaseLogging_OutputLog("\"ERROR\"",
                              "\"AqvmMemory_GetType_OutOfMemoryRange\"",
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

Cependant, l'utilisation de cette conception nécessite des exigences plus élevées en matière de stockage de données, car la longueur des données n'est pas fixe, des fonctions spéciales sont donc nécessaires pour fonctionner avec la mémoire.  </br>

```C
// Writes the data that |data_ptr| points to of size |size| to the data of at
// |index| bytes in |memory|.
// Returns 0 if successful. Returns -1 if the memory pointer is NULL. Returns -2
// if the type pointer is NULL. Returns -3 if the index is out of range. Returns
// -4 if the data pointer is NULL.
int AqvmMemory_WriteData(struct AqvmMemory_Memory* memory, size_t index,
                         void* data_ptr, size_t size) {
  if (memory == NULL) {
    AqvmBaseLogging_OutputLog("\"ERROR\"",
                              "\"AqvmMemory_WriteData_NullMemoryPointer\"",
                              "\"The memory pointer is NULL.\"", NULL);
    return -1;
  }
  if (memory->type == NULL) {
    AqvmBaseLogging_OutputLog("\"ERROR\"",
                              "\"AqvmMemory_WriteData_NullTypePointer\"",
                              "\"The type pointer is NULL.\"", NULL);
    return -2;
  }
  if (index > memory->size) {
    AqvmBaseLogging_OutputLog("\"ERROR\"",
                              "\"AqvmMemory_WriteData_OutOfMemoryRange\"",
                              "\"The index is out of memory range.\"", NULL);
    return -3;
  }
  if (data_ptr == NULL) {
    AqvmBaseLogging_OutputLog("\"ERROR\"",
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

En plus de réduire l’utilisation de la mémoire, il est tout aussi important d’éviter une occupation secondaire de la mémoire.  Par conséquent, nous réutilisons la « mémoire » du « bytecode », stockons les données et les types de mémoire dans la partie mémoire du « bytecode » et utilisons la « mémoire » pré-allouée dans le fichier « bytecode » (le fichier bytecode contient les données et types de « mémoire ») pour obtenir une utilisation efficace de la « mémoire ».  </br>
 Parce que si vous stockez deux parties séparément, vous devez avoir deux parties de données et de types de mémoire répétés. Une partie est dans la partie « mémoire », et l'autre partie, la partie « bytecode », ne sera pas utilisée, nous adoptons donc. réutilisation Cette méthode réduit le gaspillage de mémoire causé par les données et les types de mémoire.  </br>
 Cependant, l'implémentation de fonctions spéciales est requise, et il convient de noter que l'allocation et la libération des données de mémoire et les types de mémoire sont gérés par des fonctions associées du bytecode.  </br>

```C
// Creates and initializes the struct AqvmMemory_Memory with |data|, |type|, and
// |size|. The function will allocate a struct AqvmMemory_Memory and copy
// |data|, |type|, and |size| into the struct. Returns a pointer to the struct
// if successful. Returns NULL if creation fails.
struct AqvmMemory_Memory* AqvmMemory_InitializeMemory(void* data, void* type,
                                                      size_t size) {
  AqvmBaseLogging_OutputLog("\"INFO\"", "\"AqvmMemory_InitializeMemory_Start\"",
                            "\"Memory initialization started.\"", NULL);

  struct AqvmMemory_Memory* memory_ptr =
      (struct AqvmMemory_Memory*)malloc(sizeof(struct AqvmMemory_Memory));
  if (memory_ptr == NULL) {
    AqvmBaseLogging_OutputLog(
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
  AqvmBaseLogging_OutputLog("\"INFO\"", "\"AqvmMemory_FreeMemory_Start\"",
                            "\"Memory deallocation started.\"", NULL);

  free(memory_ptr);
}
```

De plus, étant donné que la définition des types dans certains systèmes est différente de la norme AQ, les fonctions pertinentes sont conçues pour garantir que la machine virtuelle est conforme à la norme.  Si les systèmes diffèrent de la norme, des conceptions spéciales doivent être réalisées pour ces systèmes.  </br>

```C
// Checks the memory conditions in the system.
// Returns the number of warnings.
int AqvmMemory_CheckMemoryConditions() {
  int warning_count = 0;
  if (sizeof(aqbyte) != 1) {
    AqvmBaseLogging_OutputLog(
        "\"WARNING\"", "\"AqvmMemory_CheckMemoryConditions_ByteLengthWarning\"",
        "\"The length requirement for the byte type does not conform to the "
        "type "
        "definition.\"",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqint) != 4) {
    AqvmBaseLogging_OutputLog(
        "\"WARNING\"", "\"AqvmMemory_CheckMemoryConditions_IntLengthWarning\"",
        "\"The length requirement for the int type does not conform to the "
        "type "
        "definition.\"",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqlong) != 8) {
    AqvmBaseLogging_OutputLog(
        "\"WARNING\"", "\"AqvmMemory_CheckMemoryConditions_LongLengthWarning\"",
        "\"The length requirement for the long type does not conform to the "
        "type "
        "definition.\"",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqfloat) != 4) {
    AqvmBaseLogging_OutputLog(
        "\"WARNING\"",
        "\"AqvmMemory_CheckMemoryConditions_FloatLengthWarning\"",
        "\"The length requirement for the float type does not conform to the "
        "type definition.\"",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqdouble) != 8) {
    AqvmBaseLogging_OutputLog(
        "\"WARNING\"",
        "\"AqvmMemory_CheckMemoryConditions_DoubleLengthWarning\"",
        "\"The length requirement for the double type does not conform to the "
        "type definition.\"",
        NULL);
    ++warning_count;
  }

  if (warning_count == 0) {
    AqvmBaseLogging_OutputLog(
        "\"INFO\"", "\"AqvmMemory_CheckMemoryConditions_CheckNormal\"",
        "\"No memory conditions warning.\"", NULL);
  }

  return warning_count;
}
```

# Normes détaillées :
 ## Structure du répertoire
 Le code de la partie « mémoire » se trouve dans « /aqvm/memory ».  Contient plusieurs fichiers de code.  </br>
 1. `CMakeLists.txt` - Fichier de build CMake dans ce répertoire
 2. `memory.h` - structures de données de mémoire et fonctions associées
 3. `memory.c` - Implémentation de fonctions liées à la mémoire
 4. `types.h` - définition des types de mémoire

## memory.h
### AqvmMemory_Memory
Cette structure stocke des informations sur la mémoire.  </br>
|type| est un pointeur vers un tableau qui stocke le type de chaque octet en mémoire.  Chaque octet utilise 4 bits pour stocker le type.  Par conséquent, une variable uint8_t peut stocker 2 types.  Les 4 premiers bits de chaque variable uint8_t sont utilisés pour le type d'octets pairs et les 4 derniers bits sont utilisés pour le type d'octets impairs.  La liste des types est dans types.h.  </br>
|data| est un pointeur de type void* vers la mémoire où les données sont stockées.  </br>
|size| est la taille de la mémoire.  </br>
Remarque : La structure AqvmMemory_Memory stocke uniquement les informations de mémoire.  La mémoire est allouée par la fonction bytecode lors du stockage du bytecode.  La mémoire pour |memory| et |type| fait partie de la mémoire du bytecode.  </br>

```C
struct AqvmMemory_Memory {
  uint8_t* type;
  void* data;
  size_t size;
};
```

### AqvmMemory_CheckMemoryConditions
Vérifiez les conditions de mémoire dans le système.  </br>
 Renvoie le nombre d'avertissements.  </br>

```C
int AqvmMemory_CheckMemoryConditions() {
  int warning_count = 0;
  if (sizeof(aqbyte) != 1) {
    AqvmBaseLogging_OutputLog(
        "\"WARNING\"", "\"AqvmMemory_CheckMemoryConditions_ByteLengthWarning\"",
        "\"The length requirement for the byte type does not conform to the "
        "type "
        "definition.\"",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqint) != 4) {
    AqvmBaseLogging_OutputLog(
        "\"WARNING\"", "\"AqvmMemory_CheckMemoryConditions_IntLengthWarning\"",
        "\"The length requirement for the int type does not conform to the "
        "type "
        "definition.\"",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqlong) != 8) {
    AqvmBaseLogging_OutputLog(
        "\"WARNING\"", "\"AqvmMemory_CheckMemoryConditions_LongLengthWarning\"",
        "\"The length requirement for the long type does not conform to the "
        "type "
        "definition.\"",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqfloat) != 4) {
    AqvmBaseLogging_OutputLog(
        "\"WARNING\"",
        "\"AqvmMemory_CheckMemoryConditions_FloatLengthWarning\"",
        "\"The length requirement for the float type does not conform to the "
        "type definition.\"",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqdouble) != 8) {
    AqvmBaseLogging_OutputLog(
        "\"WARNING\"",
        "\"AqvmMemory_CheckMemoryConditions_DoubleLengthWarning\"",
        "\"The length requirement for the double type does not conform to the "
        "type definition.\"",
        NULL);
    ++warning_count;
  }

  if (warning_count == 0) {
    AqvmBaseLogging_OutputLog(
        "\"INFO\"", "\"AqvmMemory_CheckMemoryConditions_CheckNormal\"",
        "\"No memory conditions warning.\"", NULL);
  }

  return warning_count;
}
```

### AqvmMemory_InitializeMemory
Crée une structure AqvmMemory_Memory contenant |data|, |type| et |size|.  </br>
 Cette fonction alloue une structure AqvmMemory_Memory et copie |data|, |type| et |size| dans la structure.  Renvoie un pointeur vers cette structure.  Renvoie NULL si la création échoue.  </br>

```C
struct AqvmMemory_Memory* AqvmMemory_InitializeMemory(void* data, void* type,
                                                      size_t size) {
  AqvmBaseLogging_OutputLog("\"INFO\"", "\"AqvmMemory_InitializeMemory_Start\"",
                            "\"Memory initialization started.\"", NULL);

  struct AqvmMemory_Memory* memory_ptr =
      (struct AqvmMemory_Memory*)malloc(sizeof(struct AqvmMemory_Memory));
  if (memory_ptr == NULL) {
    AqvmBaseLogging_OutputLog(
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
Libérez la mémoire de |memory_ptr|.  Aucune valeur de retour.  </br>
 Remarque : Cette fonction libère uniquement la mémoire de la structure.  La mémoire pointée par les pointeurs vers les données et les types dans la structure ne sera pas libérée.  Ces mémoires sont gérées par des fonctions liées au bytecode.  </br>

```C
void AqvmMemory_FreeMemory(struct AqvmMemory_Memory* memory_ptr) {
  AqvmBaseLogging_OutputLog("\"INFO\"", "\"AqvmMemory_FreeMemory_Start\"",
                            "\"Memory deallocation started.\"", NULL);

  free(memory_ptr);
}
```

### AqvmMemory_SetType
Définissez le type de données sur |index| octets dans |memory| sur |type|.  |type| doit être inférieur à 4 chiffres.  </br>
 Renvoie 0 en cas de succès.  Si le pointeur mémoire est NULL, -1 est renvoyé.  Si le pointeur d'index est NULL, -2 est renvoyé.  Si l'index est hors plage, -3 est renvoyé.  Si le type est hors plage, -4 est renvoyé.  </br>

```C
int AqvmMemory_SetType(const struct AqvmMemory_Memory* memory, size_t index,
                       uint8_t type) {
  if (memory == NULL) {
    AqvmBaseLogging_OutputLog("\"ERROR\"",
                              "\"AqvmMemory_SetType_NullMemoryPointer\"",
                              "\"The memory pointer is NULL.\"", NULL);
    return -1;
  }
  if (memory->type == NULL) {
    AqvmBaseLogging_OutputLog("\"ERROR\"",
                              "\"AqvmMemory_SetType_NullTypePointer\"",
                              "\"The type pointer is NULL.\"", NULL);
    return -2;
  }
  if (index > memory->size) {
    AqvmBaseLogging_OutputLog("\"ERROR\"",
                              "\"AqvmMemory_SetType_OutOfMemoryRange\"",
                              "\"The index is out of memory range.\"", NULL);
    return -3;
  }
  if (type > 0x0F) {
    AqvmBaseLogging_OutputLog("\"ERROR\"",
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
Obtient le type de données à |index| octets dans |memory|.  </br>
 Renvoie un type inférieur à 4 bits (0X0F) en cas de succès.  Si le pointeur mémoire est NULL, 0x11 est renvoyé.  Si le pointeur d'index est NULL, 0x12 est renvoyé.  Si l'index manque de mémoire, 0x13 est renvoyé.  </br>

```C
uint8_t AqvmMemory_GetType(struct AqvmMemory_Memory* memory, size_t index) {
  if (memory == NULL) {
    AqvmBaseLogging_OutputLog("\"ERROR\"",
                              "\"AqvmMemory_GetType_NullMemoryPointer\"",
                              "\"The memory pointer is NULL.\"", NULL);
    return 0x11;
  }
  if (memory->type == NULL) {
    AqvmBaseLogging_OutputLog("\"ERROR\"",
                              "\"AqvmMemory_GetType_NullTypePointer\"",
                              "\"The type pointer is NULL.\"", NULL);
    return 0x12;
  }
  if (index > memory->size) {
    AqvmBaseLogging_OutputLog("\"ERROR\"",
                              "\"AqvmMemory_GetType_OutOfMemoryRange\"",
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
Écrit les données de taille |size| pointées par |data_ptr| dans les données |index| octets dans |memory|.  </br>
 Renvoie 0 en cas de succès.  Si le pointeur mémoire est NULL, -1 est renvoyé.  Si le pointeur d'index est NULL, -2 est renvoyé.  Si l'index manque de mémoire, -3 est renvoyé.  Si le pointeur de données est NULL, -4 est renvoyé.  </br>

```C
int AqvmMemory_WriteData(struct AqvmMemory_Memory* memory, size_t index,
                         void* data_ptr, size_t size) {
  if (memory == NULL) {
    AqvmBaseLogging_OutputLog("\"ERROR\"",
                              "\"AqvmMemory_WriteData_NullMemoryPointer\"",
                              "\"The memory pointer is NULL.\"", NULL);
    return -1;
  }
  if (memory->type == NULL) {
    AqvmBaseLogging_OutputLog("\"ERROR\"",
                              "\"AqvmMemory_WriteData_NullTypePointer\"",
                              "\"The type pointer is NULL.\"", NULL);
    return -2;
  }
  if (index > memory->size) {
    AqvmBaseLogging_OutputLog("\"ERROR\"",
                              "\"AqvmMemory_WriteData_OutOfMemoryRange\"",
                              "\"The index is out of memory range.\"", NULL);
    return -3;
  }
  if (data_ptr == NULL) {
    AqvmBaseLogging_OutputLog("\"ERROR\"",
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

### `memory.h` Code complet :

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
### `memory.c` Code complet :

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
#include "aqvm/base/logging/logging.h"

int AqvmMemory_CheckMemoryConditions() {
  int warning_count = 0;
  if (sizeof(aqbyte) != 1) {
    AqvmBaseLogging_OutputLog(
        "\"WARNING\"", "\"AqvmMemory_CheckMemoryConditions_ByteLengthWarning\"",
        "\"The length requirement for the byte type does not conform to the "
        "type "
        "definition.\"",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqint) != 4) {
    AqvmBaseLogging_OutputLog(
        "\"WARNING\"", "\"AqvmMemory_CheckMemoryConditions_IntLengthWarning\"",
        "\"The length requirement for the int type does not conform to the "
        "type "
        "definition.\"",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqlong) != 8) {
    AqvmBaseLogging_OutputLog(
        "\"WARNING\"", "\"AqvmMemory_CheckMemoryConditions_LongLengthWarning\"",
        "\"The length requirement for the long type does not conform to the "
        "type "
        "definition.\"",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqfloat) != 4) {
    AqvmBaseLogging_OutputLog(
        "\"WARNING\"",
        "\"AqvmMemory_CheckMemoryConditions_FloatLengthWarning\"",
        "\"The length requirement for the float type does not conform to the "
        "type definition.\"",
        NULL);
    ++warning_count;
  }
  if (sizeof(aqdouble) != 8) {
    AqvmBaseLogging_OutputLog(
        "\"WARNING\"",
        "\"AqvmMemory_CheckMemoryConditions_DoubleLengthWarning\"",
        "\"The length requirement for the double type does not conform to the "
        "type definition.\"",
        NULL);
    ++warning_count;
  }

  if (warning_count == 0) {
    AqvmBaseLogging_OutputLog(
        "\"INFO\"", "\"AqvmMemory_CheckMemoryConditions_CheckNormal\"",
        "\"No memory conditions warning.\"", NULL);
  }

  return warning_count;
}

struct AqvmMemory_Memory* AqvmMemory_InitializeMemory(void* data, void* type,
                                                      size_t size) {
  AqvmBaseLogging_OutputLog("\"INFO\"", "\"AqvmMemory_InitializeMemory_Start\"",
                            "\"Memory initialization started.\"", NULL);

  struct AqvmMemory_Memory* memory_ptr =
      (struct AqvmMemory_Memory*)malloc(sizeof(struct AqvmMemory_Memory));
  if (memory_ptr == NULL) {
    AqvmBaseLogging_OutputLog(
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
  AqvmBaseLogging_OutputLog("\"INFO\"", "\"AqvmMemory_FreeMemory_Start\"",
                            "\"Memory deallocation started.\"", NULL);

  free(memory_ptr);
}

int AqvmMemory_SetType(const struct AqvmMemory_Memory* memory, size_t index,
                       uint8_t type) {
  if (memory == NULL) {
    AqvmBaseLogging_OutputLog("\"ERROR\"",
                              "\"AqvmMemory_SetType_NullMemoryPointer\"",
                              "\"The memory pointer is NULL.\"", NULL);
    return -1;
  }
  if (memory->type == NULL) {
    AqvmBaseLogging_OutputLog("\"ERROR\"",
                              "\"AqvmMemory_SetType_NullTypePointer\"",
                              "\"The type pointer is NULL.\"", NULL);
    return -2;
  }
  if (index > memory->size) {
    AqvmBaseLogging_OutputLog("\"ERROR\"",
                              "\"AqvmMemory_SetType_OutOfMemoryRange\"",
                              "\"The index is out of memory range.\"", NULL);
    return -3;
  }
  if (type > 0x0F) {
    AqvmBaseLogging_OutputLog("\"ERROR\"",
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
    AqvmBaseLogging_OutputLog("\"ERROR\"",
                              "\"AqvmMemory_GetType_NullMemoryPointer\"",
                              "\"The memory pointer is NULL.\"", NULL);
    return 0x11;
  }
  if (memory->type == NULL) {
    AqvmBaseLogging_OutputLog("\"ERROR\"",
                              "\"AqvmMemory_GetType_NullTypePointer\"",
                              "\"The type pointer is NULL.\"", NULL);
    return 0x12;
  }
  if (index > memory->size) {
    AqvmBaseLogging_OutputLog("\"ERROR\"",
                              "\"AqvmMemory_GetType_OutOfMemoryRange\"",
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
    AqvmBaseLogging_OutputLog("\"ERROR\"",
                              "\"AqvmMemory_WriteData_NullMemoryPointer\"",
                              "\"The memory pointer is NULL.\"", NULL);
    return -1;
  }
  if (memory->type == NULL) {
    AqvmBaseLogging_OutputLog("\"ERROR\"",
                              "\"AqvmMemory_WriteData_NullTypePointer\"",
                              "\"The type pointer is NULL.\"", NULL);
    return -2;
  }
  if (index > memory->size) {
    AqvmBaseLogging_OutputLog("\"ERROR\"",
                              "\"AqvmMemory_WriteData_OutOfMemoryRange\"",
                              "\"The index is out of memory range.\"", NULL);
    return -3;
  }
  if (data_ptr == NULL) {
    AqvmBaseLogging_OutputLog("\"ERROR\"",
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

Grâce à la coopération de ces codes, une architecture de mémoire Aqvm complète est formée, ce qui soulage efficacement la pression de la mémoire et améliore l'efficacité opérationnelle d'Aqvm.

 > Nous travaillons plus dur pour développer « AQ Virtual Machine ».  Si vous souhaitez en savoir plus ou participer aux travaux de développement, veuillez suivre notre site officiel : https://www.axa6.com et Github : https://github.com/aq-org/AQ.  </br>

 > Cet article est publié sur la base de la licence AQ : https://github.com/aq-org/AQ/blob/main/LICENSE Si nécessaire, veuillez l'adapter ou le réimprimer selon la licence AQ.