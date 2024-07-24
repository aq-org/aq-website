---
publishDate: 2024-07-22T23:17:00+08:00
title:  Définition du type de machine virtuelle AQ - AQ
excerpt: Étant donné que différents systèmes, matériels et autres conditions externes ont une prise en charge et des définitions différentes pour la mémoire, pour que la machine virtuelle AQ réponde aux exigences de fonctionnement multiplateforme, il est essentiel de concevoir une norme de type unifiée. Cet article définit et standardise les types de machines virtuelles AQ pour garantir que les machines virtuelles AQ sur différents systèmes peuvent fonctionner normalement.
image: https://www.axa6.com/aq.png
category: Blog
tags:
  - AQ
  - Blog
metadata:
  canonical: https://www.axa6.com/zh/type-definition-of-aq-virtual-machine
---

# Introduction
Étant donné que différents `systèmes`, `matériels` et autres conditions externes ont une prise en charge et des définitions différentes pour la `mémoire`, afin que la `machine virtuelle AQ` réponde aux exigences du fonctionnement *multiplateforme*, il est nécessaire de concevoir un norme de `type` unifiée Indispensable. Cet article définit et standardise les types de machines virtuelles AQ pour garantir que les machines virtuelles AQ sur différents systèmes peuvent fonctionner normalement. </br>

# Idées de conception
Tout d'abord, afin de simplifier les `types` et d'obtenir une *efficacité d'exécution* plus élevée, la conception des `types natifs` (les `types` qui sont *directement* pris en charge par la machine virtuelle sans être définis par le code) doit être aussi simple que possible. le moins possible. Par conséquent, pour les *types complexes* associés, tels que `énumération`, `structure`, etc., nous les développons au niveau du `compilateur` pour réduire le nombre de `types` et la `complexité` de la `machine virtuelle`. </br>

> Selon la définition du `type` dans `AqvmMemory_Memory` dans `memory.h`, chaque `uint8_t` stocke `2` types`, donc le nombre de `types` doit être compris entre `0x00`-`0x0F` (16 ) entre. </br>

Deuxièmement, grâce à la recherche sur les `types` d'autres `langages de programmation`, nous avons résumé les `types` courants. Nous avons conçu les `types` suivants afin d'obtenir les *performances* et la *simplicité* de la `machine virtuelle`. `équilibre. </br>

0. null - *type vide*
1. octet - *`1`octet de type entier signé*
2. int - *Type entier signé de `4` octets*
3. long - *`Type entier signé de `8`octets*
4. float - *`4` type à virgule flottante simple précision*
5. double - *`Type à virgule flottante double précision de `8`octets*

Enfin, nous avons conçu des `normes` détaillées pour les `types` afin de garantir que la `machine virtuelle AQ` puisse réaliser un fonctionnement `multiplateforme`. </br>

> Afin de réduire la définition de type de `machine virtuelle`, les `types non signés` seront implémentés au niveau du `compilateur`.

## Définitions de `Type` pour d'autres `langages de programmation`
Afin de rendre les `types` d'`AQ` plus étendus et plus faciles à comprendre pour les développeurs, nous nous référons aux définitions de `type` des `langages de programmation` courants existants. </br>
Les `types de base` définis ci-dessous sont des types de `données` généraux tels que des entiers, des nombres à virgule flottante et des types vides. Il entreprend des travaux de stockage de données de base ou revêt une importance particulière. </br>

###C
La norme `C` actuelle est `ISO/IEC 9899 :2018 Technologies de l'information – Langages de programmation – C`. Étant donné que le droit d'auteur de cette norme appartient à `ISO (Organisation internationale de normalisation)` et à `CEI (Commission électrotechnique internationale)`, afin d'éviter les litiges en matière de droits d'auteur, nous avons résumé les définitions de `type`. Le même ci-dessous. </br>

Site officiel : https://www.iso.org/standard/74528.html</br>

1. `_Bool` - Un objet déclaré comme type `_Bool` est suffisamment grand pour stocker les valeurs `0` et `1`.
2. `(non signé) char` - type de caractère. Un objet déclaré comme type char est suffisamment grand pour stocker n'importe quel membre du jeu de caractères d'exécution de base. Si un membre du jeu de caractères d'exécution de base est stocké dans un objet `char`, sa valeur est garantie comme étant non négative. Si d'autres caractères sont stockés dans un objet caractère, la valeur résultante est `définie par l'implémentation`, mais doit se situer dans la plage de valeurs qui peuvent être représentées dans ce type.
3. `signed char` - Type de caractère signé.
4. `short int` - type entier signé étendu.
5. `unsigned short int` - Type entier non signé étendu.
6. `int` - Type entier signé standard étendu.
7. `unsigned int` – Type entier non signé standard.
8. `long int` - Type entier signé étendu.
9. `unsigned long int` – Type entier non signé étendu.
10. `long long int` – Type entier signé étendu.
11. `unsigned long long int` - Type entier non signé étendu.
12. `float` - Type à virgule flottante. Un ensemble de valeurs de type `float` est un sous-ensemble d'un ensemble de valeurs de type `double`.
13. `double` - Type à virgule flottante. Un ensemble de valeurs de type `double` est un sous-ensemble d'un ensemble de valeurs de type `long double`.
14. `long double` - Type à virgule flottante.
15. `void` - Le type `void` contient un ensemble de valeurs nulles ; c'est un type d'objet incomplet et ne peut pas être implémenté.

De plus, `C` a également d'autres types non `basiques`, tels que les types `énumération` (types `enum`), les types pointeur, etc. Cela ne sera pas abordé dans la conception de la `machine virtuelle`. </br>

### `C++` et autres variantes `C`
La norme `C++` actuelle est `ISO/IEC 14882 :2020 Langages de programmation — C++`. Puisque `C++` et les autres variantes de `C` sont fondamentalement les mêmes types que `C`, ils ne sont plus répertoriés. </br>

###Python
La dernière version officielle de `Python` est `3.12.4`. Les types intégrés dans la documentation Python 3.12.4 documentent les types standard intégrés à l'interpréteur Python. </br>
Les principaux types intégrés sont `Number`, `Sequence`, `Map`, `Class`, `Instance` et `Exception`. Pour des raisons d'espace, les contenus autres que les `types de base` ne seront pas abordés ici. </br>

Lien source : https://docs.python.org/zh-cn/3/library/stdtypes.html</br>

1. `int` - *integer* `int` a une précision infinie. Les littéraux entiers non modifiés (y compris les nombres hexadécimaux, octaux et binaires) produisent des entiers.
2. `float` - *Numéro à virgule flottante* La `virgule flottante` est généralement implémentée en `C` en utilisant `double`. Les littéraux numériques contenant un point décimal ou un signe exposant produisent un nombre à virgule flottante.
3. `complexe` - *Nombre complexe* Un nombre complexe a une `partie réelle` et une `partie imaginaire`, chaque partie est un `nombre à virgule flottante`. En ajoutant `j` ou `J` après un littéral numérique, vous pouvez obtenir un `nombre imaginaire` (un `nombre complexe` avec une partie réelle de zéro). Ajoutez-le à un `nombre entier` ou à un `nombre à virgule flottante`. obtenir un `nombre imaginaire` Un `nombre complexe` avec une partie réelle et une partie imaginaire.
4. `bool` - *Boolean* `Boolean` est également un `sous-type` de `integer`. Un objet booléen représentant une vraie valeur. Le type `bool` n'a que deux instances constantes : `True` et `False`.
5. `list` - *List* `List` est une `séquence mutable`, généralement utilisée pour stocker des `ensembles` d'éléments similaires (où le degré précis de similarité variera en fonction de l'application).
6. `tuple` - *Tuple* `Tuple` est une `séquence immuable`, généralement utilisée pour stocker des `ensembles multi-éléments` de données hétérogènes (telles que `binaire` généré par la fonction intégrée `enumerate()` groupe`). Les `Tuples` sont également utilisés dans les situations où une `séquence immuable` de données homogènes est requise (par exemple, permettre le stockage d'instances de `set` ou `dict`).
7. `range` - Le type `range` représente une `séquence de nombres` `immuable`, généralement utilisée pour boucler un nombre spécifié de fois dans une boucle `for`.
8. `str` - *Type de séquence de texte* Pour traiter les données texte dans `Python`, vous utilisez l'objet `str`, également appelé `string`. Une `chaîne` est une `séquence immuable` de points de code `Unicode`.
9. `bytes` - Un objet `bytes` est une `séquence immuable` d'octets simples. Étant donné que de nombreux protocoles binaires majeurs sont basés sur le codage de texte ASCII, l'objet bytes fournit certaines méthodes qui ne sont disponibles que lorsque vous travaillez avec des données compatibles ASCII et qui sont étroitement liées aux objets chaîne dans de nombreuses fonctionnalités.
10. `byteearray` - Un objet `byteearray` est la contrepartie mutable d'un objet `bytes`.
11. `memoryview` - *Memoryview* L'objet `memoryview` permet au code `Python` d'accéder aux données internes d'un objet, tant que l'objet prend en charge le `buffer protocol` sans faire de copie.
12. `set` - *set type* L'objet `set` est un `ensemble multi-éléments non ordonné` composé d'objets `hashables` uniques. Les utilisations courantes incluent la détection d'appartenance, la suppression des doublons des séquences et la définition de calculs mathématiques, tels que l'intersection, l'union, la différence et la différence symétrique, etc. Le type `set` est mutable et son contenu peut être modifié à l'aide de méthodes telles que `add()` et `remove()`. Comme il s’agit d’un type mutable, il n’a pas de valeur de hachage et ne peut pas être utilisé comme clé dans un dictionnaire ou comme élément dans une collection.
13. `frozenset` - *Type de collection* Le type `frozenset` est `immuable` et `hashable`. Son contenu ne peut pas être modifié après sa création, il peut donc être utilisé comme `clé` d'un `dictionnaire` ou. autre Un `élément` d'un `ensemble`.
14. `dict` - *Type de mappage* L'objet `mapping` mappera la valeur `hashable` à n'importe quel objet. `Map` est un `objet mutable`. Actuellement, il n’existe qu’un seul type de mappage standard « dictionnaire ».
15. `GenericAlias` - Les objets `GenericAlias` sont généralement créés en `extrayant` une `classe`. Ils sont le plus souvent utilisés avec des `classes de conteneurs` telles que `list` ou `dict`. Par exemple, l'objet `GenericAlias` `list[int]` est créé en extrayant la classe `list` avec le paramètre `int`. L'objectif principal des objets `GenericAlias` est l'`annotation de type`.
16. `union` - Un `objet union` contient la valeur d'effectuer l'opération `| (OU au niveau du bit)` sur plusieurs `objets de type`. Ces types sont principalement utilisés pour les « annotations de type ». Par rapport à typing.Union, les expressions `union type` permettent une syntaxe d'indication de type plus concise.

###Java
La `spécification` de `JVM (Java Virtual Machine)` est `La spécification de la machine virtuelle Java®`, la dernière version est `Java SE 22 Edition` et la date de sortie est le `2024-02-09`. Par rapport à la `définition de type` au niveau du `compilateur` d'autres langages, la situation de `JVM` est plus conforme à la conception d'une `machine virtuelle`. Dans le même temps, les types de JVM sont divisés en types primitifs et types de référence. En raison des besoins de développement des machines virtuelles, nous avons choisi les types primitifs pour la discussion. </br>
De plus, `Java` a également une `spécification` qui est `The Java Language Spécification, Java SE 22 Edition`, lien `HTML` : https://docs.oracle.com/javase/specs/jls/se22/ html /index.html Lien `PDF` : https://docs.oracle.com/javase/specs/jls/se22/jls22.pdf. En raison des besoins particuliers du développement de `machines virtuelles`, cet article choisit d'étudier la `définition de type` de `JVM` au lieu de la `définition de type` du langage `Java`.

Lien source (HTML) : https://docs.oracle.com/javase/specs/jvms/se22/html/jvms-2.html#jvms-2.3</br>
Lien source (PDF) : https://docs.oracle.com/javase/specs/jvms/se22/jvms22.pdf</br>

1. `byte` - *type entier* dont la valeur est un entier *complément à deux signé de `8` bits*, et sa valeur par défaut est `zéro`. De `-128` à `127` (*-2<sup>7</sup>* à *2<sup>7</sup> - 1*), inclus.
2. `short` - *type entier* dont la valeur est un bit `16` *entier complémentaire à deux signé*, et sa valeur par défaut est `zéro`. De `-32768` à `32767` (*-2<sup>15</sup>* à *2<sup>15</sup> - 1*), inclus.
3. `int` - *type entier* dont la valeur est un bit `32` *entier complémentaire à deux signé* et sa valeur par défaut est `zéro`. De `-2147483648` à `2147483647` (*-2<sup>31</sup>* à *2<sup>31</sup> - 1*), inclus.
4. `long` - *type entier* dont la valeur est un bit `64` *entier complémentaire à deux signé* et dont la valeur par défaut est `zéro`. De `-9223372036854775808` à `9223372036854775807` (*-2<sup>63</sup>* à *2<sup>63</sup> - 1*), inclus.
5. `char` - *Type entier* Sa valeur est un *entier non signé* de `16` bits, représentant le point de code `Unicode` dans le plan multilingue de base, codé en `UTF-16`, et sa valeur par défaut est ` null `Point de code(`\u0000`). De `0` à `65535`.
6. `float` - *Type à virgule flottante* Sa valeur est entièrement conforme au format `32` bits *IEEE 754 binaire32*, et la valeur par défaut est `zéro positif`.
7. `double` - *Type à virgule flottante* Sa valeur est exactement la même que la valeur au format `64` bits *IEEE 754 binaire64*, et la valeur par défaut est `zéro positif`.

# Normes détaillées
## Définition du type
Les types complexes seront traités par le compilateur pour garantir la simplicité et l'efficacité de la machine virtuelle. Les types simples seront directement pris en charge par la machine virtuelle. </br>
Voici les `6` types de base définis par la `machine virtuelle AQ` :</br>

> Les types non directement pris en charge incluent `entier non signé`, `adresse mémoire (pointeur)`, `chaîne`, etc. Ces types seront implémentés au niveau du `compilateur`. Pour les `machines virtuelles`, ces types sont implémentés indirectement.

0. `null` - `0x00` - ***type vide***</br>
Les types vides représentent uniquement des types inconnus ou des types qui n'ont pas besoin d'être utilisés (par exemple : pas de retour). Aucune longueur. </br>

1. `byte` - `0x01` - ***`1` octet (`8` bit) type entier signé***</br>
Stocké dans *le complément à deux*. Généralement utilisé pour stocker `bool` ou `char`. De `-128` à `127` (*-2<sup>7</sup>* à *2<sup>7</sup> - 1*), inclus. </br>

2. `int` - `0x02` - ***`4` octets (`32` bits) de type entier signé***</br>
Stocké dans *le complément à deux*. De `-2147483648` à `2147483647` (*-2<sup>31</sup>* à *2<sup>31</sup> - 1*), inclus. </br>

3. `long` - `0x03` - ***`8` octets (`64` bits) type entier signé***</br>
Stocké dans *le complément à deux*. « L'adresse mémoire (pointeur) » est également stockée à l'aide de ceci. Sa valeur est un bit `64` *entier complémentaire à deux signé* et sa valeur par défaut est `zéro`. De `-9223372036854775808` à `9223372036854775807` (*-2<sup>63</sup>* à *2<sup>63</sup> - 1*), inclus. </br>

4. `float` - `0x04` - ***`4` octets (`32` bits) type à virgule flottante simple précision***</br>
Adopte la norme « ISO/IEC 60559 Technologies de l'information – Systèmes à microprocesseurs – Arithmétique à virgule flottante ». </br>

5. `double` - `0x05` - ***`8` octets (`64` bits) type à virgule flottante double précision***</br>
Adopte la norme « ISO/IEC 60559 Technologies de l'information – Systèmes à microprocesseurs – Arithmétique à virgule flottante ». </br>

### Code complémentaire
#### Définition
Le « complément » est *la représentation des nombres signés dans les ordinateurs*. </br>

#### méthode
Le `code complémentaire` des `nombres positifs` et `0` est *le nombre lui-même plus le bit le plus élevé 0*. Le `complément` d'un `nombre négatif` consiste à *inverser sa valeur absolue au niveau du bit et à ajouter 1*. </br>

### Norme à virgule flottante
#### Définition
La `Norme sur les nombres à virgule flottante` adopte la norme `ISO/IEC 60559 Technologies de l'information — Systèmes à microprocesseurs — Arithmétique à virgule flottante`. Cette norme est également appelée « Norme arithmétique binaire à virgule flottante IEEE (IEEE 754) »</br>

Site officiel : https://www.iso.org/standard/80985.html</br>

#### méthode
La `valeur réelle` d'un `nombre à virgule flottante` est égale au `bit de signe` multiplié par la `valeur de décalage de l'exposant` multipliée par la `valeur fractionnaire`. Pour des définitions détaillées, voir la norme `ISO/IEC 60559 Technologies de l'information — Systèmes à microprocesseurs — Arithmétique à virgule flottante`. </br>

##### `32` bits `numéro à virgule flottante`
| Longueur de bit | Nom | Numéro de bit |
| ------ | ------ |
| 1 | Bit de signe |
| 8 | Nombre | 30 à 23 valeur positive (taille réelle de l'exposant + 127) |
| 23 | Chiffres valides | Numéro de 22 à 0 chiffres (en commençant par 0 en partant de la droite) |

##### `64` bits `numéro à virgule flottante`
| Longueur de bit | Nom | Numéro de bit |
| ------ | ------ |
| 1 | Bit de signe |
| 11 | Nombre | 62 à 52 valeur positive (taille réelle de l'exposant + 1023) |
| 52 | Chiffres valides | Nombres de 51 à 0 (en commençant par 0 en partant de la droite) |


## Code complet de `types.h` :
Il existe également des codes associés pour le « type ». Voici le code de `types.h` :</br>

```C
// Copyright 2024 AQ author, All Rights Reserved.
// This program is licensed under the AQ License. You can find the AQ license in
// the root directory.

#ifndef AQ_AQVM_MEMORY_TYPES_H_
#define AQ_AQVM_MEMORY_TYPES_H_

#include <stdint.h>

// null - 0x00 - null type
// The null type simply represents an unknown type or a type that is not needed
// (e.g., returns nothing). Has no length.
typedef void aqnull;

// byte - 0x01 - 1 byte (8-bit) signed integer type
// Using two's complement storage. Generally used to store bool or char. From
// -128 to 127 (-2^7 to 2^7 - 1), inclusive.
typedef int8_t aqbyte;

// int - 0x02 - 4-byte (32-bit) signed integer type
// Stored in two's complement notation. From -2147483648 to 2147483647 (-2^31 to
// 2^31 - 1), inclusive.
typedef int aqint;

// long - 0x03 - 8-byte (64-bit) signed integer type
// Stored in two's complement notation. From -9223372036854775808 to
// 9223372036854775807 (-2^63 to 2^63 - 1), inclusive.
typedef int64_t aqlong;

// float - 0x04 - 4-byte (32-bit) single-precision floating point type
// Using ISO/IEC 60559 Information technology — Microprocessor Systems —
// Floating-Point arithmetic standard.
typedef float aqfloat;

// double - 0x05 - 8-byte (64-bit) double-precision floating point type
// Using ISO/IEC 60559 Information technology — Microprocessor Systems —
// Floating-Point arithmetic standard.
typedef double aqdouble;

// The part beyond 0x05 and within 0x0F is currently designated as a reserved
// type. The part beyond 0x0F cannot be used because it exceeds the 4-bit size
// limit.

#endif
```

> Nous travaillons plus dur pour développer `AQ Virtual Machine`. Si vous souhaitez en savoir plus ou participer aux travaux de développement, veuillez suivre notre site officiel : https://www.axa6.com et Github : https://github.com/aq-org/AQ. </br>

> Cet article est publié sur la base de la licence AQ : https://github.com/aq-org/AQ/blob/main/LICENSE Si nécessaire, veuillez l'adapter ou le réimprimer selon la licence AQ.