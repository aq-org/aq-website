---
publishDate: 2024-07-24T12:22:00+08:00
title:  Definición de tipo de máquina virtual AQ - AQ
excerpt: Dado que diferentes sistemas, hardware y otras condiciones externas tienen diferentes soportes y definiciones de memoria, para que la máquina virtual AQ cumpla con los requisitos para la operación multiplataforma, es esencial diseñar un estándar de tipo unificado. Este artículo define y estandariza los tipos de máquinas virtuales AQ para garantizar que las máquinas virtuales AQ en diferentes sistemas puedan ejecutarse normalmente.
image: https://www.axa6.com/aq.png
category: Blog
tags:
  - AQ
  - Blog
metadata:
  canonical: https://www.axa6.com/es/type-definition-of-aq-virtual-machine
---

# Introducción
Dado que diferentes `sistemas`, `hardware` y otras condiciones externas tienen diferentes soportes y definiciones para `memoria`, para que la `máquina virtual AQ` cumpla con los requisitos de operación *multiplataforma*, es necesario diseñar un Estándar unificado de `tipo`. Este artículo define y estandariza los tipos de máquinas virtuales AQ para garantizar que las máquinas virtuales AQ en diferentes sistemas puedan ejecutarse normalmente. </br>

# Ideas de diseño
En primer lugar, para lograr la simplificación de los `tipos` y una mayor *eficiencia de ejecución*, el diseño de los `tipos nativos` (los `tipos` que son *directamente* soportados por la máquina virtual sin estar definidos mediante código) debe ser lo más lo menos posible. Por lo tanto, para *tipos complejos* relacionados, como `enumeración`, `estructura`, etc., los desarrollamos en el nivel de `compilador` para reducir el número de `tipos` y la `complejidad` de la `máquina virtual`. </br>

> De acuerdo con la definición de `tipo` en `AqvmMemory_Memory` en `memory.h`, cada `uint8_t` almacena `2` tipos`, por lo que el número de `tipos` debe estar entre `0x00`-`0x0F` (16 ) entre. </br>

En segundo lugar, a través de la investigación sobre `tipos` de otros `lenguajes de programación`, hemos resumido los `tipos` comunes. Hemos diseñado los siguientes `tipos` para lograr el *rendimiento* y la *simplicidad* de la `máquina virtual`. `equilibrio. </br>

0. nulo - *tipo vacío*
1. byte - *`1`byte tipo entero con signo*
2. int - *`4` bytes tipo entero con signo*
3. long - *`8`byte tipo entero con signo*
4. float - *`4` tipo de punto flotante de precisión simple*
5. doble - *`8`bytes tipo coma flotante de doble precisión*

Finalmente, diseñamos `estándares` detallados para `tipos` para garantizar que la `máquina virtual AQ` pueda lograr una operación `multiplataforma`. </br>

> Para reducir la definición de tipo de `máquina virtual`, se implementarán `tipos sin firmar` en el nivel del `compilador`.

## Definiciones de `tipo` para otros `lenguajes de programación`
Para que los `tipos` de `AQ` sean más extensos y más fáciles de entender para los desarrolladores, nos referimos a las definiciones de `tipos` de los `lenguajes de programación` comunes existentes. </br>
Los `tipos básicos` definidos a continuación son tipos de `datos` generales, como números enteros, números de punto flotante y tipos vacíos. Realiza trabajos básicos de almacenamiento de datos o tiene un significado especial. </br>

### C
El estándar `C` actual es `ISO/IEC 9899:2018 Tecnología de la información - Lenguajes de programación - C`. Dado que los derechos de autor de esta norma pertenecen a `ISO (Organización Internacional de Normalización)` e `IEC (Comisión Electrotécnica Internacional)`, para evitar disputas sobre derechos de autor, hemos resumido las definiciones de `tipo`. Lo mismo a continuación. </br>

Sitio web oficial: https://www.iso.org/standard/74528.html</br>

1. `_Bool`: un objeto declarado como tipo `_Bool` es lo suficientemente grande como para almacenar los valores `0` y `1`.
2. `(sin firmar) char` - tipo de carácter. Un objeto declarado como tipo char es lo suficientemente grande como para almacenar cualquier miembro del conjunto de caracteres de ejecución básico. Si un miembro del conjunto de caracteres de ejecución base se almacena en un objeto `char`, se garantiza que su valor no será negativo. Si se almacenan otros caracteres en un objeto de carácter, el valor resultante es `definido por implementación`, pero debe estar dentro del rango de valores que se pueden representar en ese tipo.
3. `signed char`: tipo de carácter firmado.
4. `short int`: tipo entero extendido con signo.
5. `unsigned short int`: tipo entero extendido sin signo.
6. `int`: tipo entero con signo estándar extendido.
7. `unsigned int`: tipo entero estándar sin signo.
8. `long int`: tipo entero con signo extendido.
9. `unsigned long int`: tipo entero extendido sin signo.
10. `long long int`: tipo entero extendido con signo.
11. `unsigned long long int`: tipo entero extendido sin signo.
12. `float` - Tipo de punto flotante. Un conjunto de valores de tipo `float` es un subconjunto de un conjunto de valores de tipo `double`.
13. `doble` - Tipo de coma flotante. Un conjunto de valores de tipo `doble` es un subconjunto de un conjunto de valores de tipo `doble largo`.
14. `long double` - Tipo de coma flotante.
15. `void`: el tipo `void` contiene un conjunto de valores nulos; es un tipo de objeto incompleto y no se puede implementar.

Además, `C` también tiene otros tipos no `básicos`, como tipos de `enumeración` (tipos `enum`), tipos de puntero, etc. No se discutirá en el diseño de la `máquina virtual`. </br>

### `C++` y otras variantes de `C`
El estándar actual `C++` es `ISO/IEC 14882:2020 Lenguajes de programación — C++`. Dado que `C++` y otras variantes de `C` son básicamente los mismos tipos que `C`, ya no aparecen en la lista. </br>

###Pitón
La última versión oficial de `Python` es `3.12.4`. Los tipos integrados en la documentación de Python 3.12.4 documentan los tipos estándar integrados en el intérprete de Python. </br>
Los principales tipos integrados son `Número`, `Secuencia`, `Mapa`, `Clase`, `Instancia` y `Excepción`. Por razones de espacio, aquí no se analizará ningún contenido que no sea `tipos básicos`. </br>

Enlace fuente: https://docs.python.org/zh-cn/3/library/stdtypes.html</br>

1. `int` - *integer* `int` tiene una precisión infinita. Los literales enteros no modificados (incluidos los números hexadecimales, octales y binarios) producen números enteros.
2. `float` - *Número de punto flotante* El `punto flotante` generalmente se implementa en `C` usando `doble`. Los literales numéricos que contienen un punto decimal o un signo de exponente producen un número de punto flotante.
3. `complejo` - *Número complejo* Un número complejo tiene una `parte real` y una `parte imaginaria`, cada parte es un `número de punto flotante`. Al agregar `j` o `J` después de un literal numérico, puede obtener un `número imaginario` (un `número complejo` con una parte real de cero. Agréguelo a un `entero` o `número de coma flotante`). obtenga un `número imaginario`. Un `número complejo` con parte real y parte imaginaria.
4. `bool` - *Boolean* `Boolean` también es un `subtipo` de `integer`. Un objeto booleano que representa un valor verdadero. El tipo `bool` tiene solo dos instancias constantes: `Verdadero` y `Falso`.
5. `list` - *List* `List` es una `secuencia mutable`, generalmente utilizada para almacenar `conjuntos` de elementos similares (donde el grado preciso de similitud variará dependiendo de la aplicación).
6. `tuple` - *Tuple* `Tuple` es una `secuencia inmutable`, generalmente utilizada para almacenar `conjuntos de elementos múltiples` de datos heterogéneos (como los `binarios` generados por la función incorporada `enumerate()` grupo`). Las `tuplas` también se utilizan en situaciones en las que se requiere una `secuencia inmutable` de datos homogéneos (por ejemplo, permitir el almacenamiento en instancias de `set` o `dict`).
7. `rango`: el tipo `rango` representa una `secuencia numérica` `inmutable`, generalmente utilizada para realizar un bucle un número específico de veces en un bucle `for`.
8. `str` - *Tipo de secuencia de texto* Para procesar datos de texto en `Python`, se utiliza el objeto `str`, también llamado `string`. Una `cadena` es una `secuencia inmutable` de puntos de código `Unicode`.
9. `bytes`: un objeto `bytes` es una `secuencia inmutable` de bytes individuales. Dado que muchos de los principales protocolos binarios se basan en la codificación de texto ASCII, el objeto bytes proporciona algunos métodos que sólo están disponibles cuando se trabaja con datos compatibles con ASCII y están estrechamente relacionados con los objetos de cadena en muchas características.
10. `byteearray`: un objeto `byteearray` es la contraparte mutable de un objeto `bytes`.
11. `memoryview` - *Vista de memoria* El objeto `memoryview` permite que el código `Python` acceda a los datos internos de un objeto, siempre que el objeto admita el `protocolo de búfer` sin realizar una copia.
12. `set` - *tipo de conjunto* El objeto `set` es un `conjunto desordenado de elementos múltiples` compuesto por objetos únicos `hashable`. Los usos comunes incluyen detección de membresía, eliminación de duplicados de secuencias y cálculos de conjuntos en matemáticas, como intersección, unión, diferencia y diferencia simétrica, etc. El tipo `set` es mutable y su contenido se puede cambiar usando métodos como `add()` y `remove()`. Debido a que es un tipo mutable, no tiene un valor hash y no se puede usar como clave en un diccionario o elemento en una colección.
13. `frozenset` - *Tipo de colección* El tipo `frozenset` es `inmutable` y `hashable`. Su contenido no se puede cambiar después de su creación, por lo que se puede usar como una `clave` de un `diccionario` o. otro Un `elemento` de un `conjunto`.
14. `dict` - *Tipo de asignación* El objeto `mapping` asignará el valor `hashable` a cualquier objeto. `Map` es un `objeto mutable`. Actualmente sólo existe un tipo de mapeo estándar, `diccionario`.
15. `GenericAlias` - Los objetos `GenericAlias` generalmente se crean `extrayendo` una `clase`. Se utilizan más comúnmente con `clases contenedoras` como `lista` o `dict`. Por ejemplo, el objeto `GenericAlias` `list[int]` se crea extrayendo la clase `list` con el parámetro `int`. El objetivo principal de los objetos `GenericAlias` es la `anotación de tipo`.
16. `union`: un `objeto de unión` contiene el valor de realizar la operación `| (bit a bit OR)` en múltiples `tipos de objetos`. Estos tipos se utilizan principalmente para `anotaciones de tipo`. En comparación con escribir.Union, las expresiones `union type` permiten una sintaxis de sugerencia de tipo más concisa.

###Java
La `especificación` de `JVM (Java Virtual Machine)` es `La especificación de la máquina virtual Java®`, la última versión es `Java SE 22 Edition` y la fecha de lanzamiento es `2024-02-09`. En comparación con la `definición de tipo` en el nivel de `compilador` de otros lenguajes, la situación de `JVM` está más en línea con el diseño de la `máquina virtual`. Al mismo tiempo, los tipos de JVM se dividen en tipos primitivos y tipos de referencia. Debido a las necesidades de desarrollo de las máquinas virtuales, elegimos los tipos primitivos para la discusión. </br>
Además, `Java` también tiene una `especificación` que es `La especificación del lenguaje Java, edición Java SE 22`, enlace `HTML`: https://docs.oracle.com/javase/specs/jls/se22/html /index.html enlace `PDF`: https://docs.oracle.com/javase/specs/jls/se22/jls22.pdf. Debido a las necesidades especiales del desarrollo de `máquinas virtuales`, este artículo elige estudiar la `definición de tipo` de `JVM` en lugar de la `definición de tipo` del lenguaje `Java`.</br>

Enlace fuente (HTML): https://docs.oracle.com/javase/specs/jvms/se22/html/jvms-2.html#jvms-2.3</br>
Enlace fuente (PDF): https://docs.oracle.com/javase/specs/jvms/se22/jvms22.pdf</br>

1. `byte` - *tipo entero* cuyo valor es un `8`-bit *entero en complemento a dos con signo*, y su valor predeterminado es `cero`. De `-128` a `127` (*-2<sup>7</sup>* a *2<sup>7</sup> - 1*), inclusive.
2. `short` - *tipo entero* cuyo valor es un `16` bit *entero en complemento a dos con signo*, y su valor predeterminado es `cero`. De `-32768` a `32767` (*-2<sup>15</sup>* a *2<sup>15</sup> - 1*), inclusive.
3. `int` - *tipo entero* cuyo valor es un bit de `32` *entero en complemento a dos con signo* y su valor predeterminado es `cero`. De `-2147483648` a `2147483647` (*-2<sup>31</sup>* a *2<sup>31</sup> - 1*), inclusive.
4. `long` - *tipo entero* cuyo valor es un bit de `64` *entero en complemento a dos con signo* y cuyo valor predeterminado es `cero`. De `-9223372036854775808` a `9223372036854775807` (*-2<sup>63</sup>* a *2<sup>63</sup> - 1*), inclusive.
5. `char` - *Tipo entero* Su valor es un *entero sin signo* de `16` bits, que representa el punto de código `Unicode` en el plano multilingüe básico, codificado como `UTF-16`, y su valor predeterminado es ` null `Punto de código(`\u0000`). De `0` a `65535`.
6. `float` - *Tipo de punto flotante* Su valor se ajusta completamente al formato de `32` bits *IEEE 754 binario32*, y el valor predeterminado es `cero positivo`.
7. `double` - *Tipo de coma flotante* Su valor es exactamente el mismo que el valor en formato `64` bit *IEEE 754 binario64*, y el valor predeterminado es `cero positivo`.

# Estándares detallados
## Definición de tipo
El compilador procesará los tipos complejos para garantizar la simplicidad y eficiencia de la máquina virtual. Los tipos simples serán compatibles directamente con la máquina virtual. </br>
Los siguientes son los `6` tipos básicos definidos por la `máquina virtual AQ`:</br>

> Los tipos que no se admiten directamente incluyen `entero sin signo`, `dirección de memoria (puntero)`, `cadena`, etc. Estos tipos se implementarán en el nivel de `compilador`. Para las `máquinas virtuales`, estos tipos se implementan indirectamente.

0. `nulo` - `0x00` - ***tipo vacío***</br>
Los tipos vacíos solo representan tipos desconocidos o tipos que no necesitan usarse (por ejemplo: sin retorno). Sin longitud. </br>

1. `byte` - `0x01` - ***`1` byte (`8` bit) tipo entero con signo***</br>
Almacenado en *complemento a dos*. Generalmente se usa para almacenar `bool` o `char`. De `-128` a `127` (*-2<sup>7</sup>* a *2<sup>7</sup> - 1*), inclusive. </br>

2. `int` - `0x02` - ***`4` bytes (`32` bits) tipo entero con signo***</br>
Almacenado en *complemento a dos*. De `-2147483648` a `2147483647` (*-2<sup>31</sup>* a *2<sup>31</sup> - 1*), inclusive. </br>

3. `long` - `0x03` - ***`8` bytes (`64` bits) tipo entero con signo***</br>
Almacenado en *complemento a dos*. La `dirección de memoria (puntero)` también se almacena usando esto. Su valor es un bit de `64` *entero en complemento a dos con signo* y su valor predeterminado es `cero`. De `-9223372036854775808` a `9223372036854775807` (*-2<sup>63</sup>* a *2<sup>63</sup> - 1*), inclusive. </br>

4. `float` - `0x04` - ***`4` bytes (`32` bits) tipo de punto flotante de precisión simple***</br>
Adopta el estándar `ISO/IEC 60559 Tecnología de la información - Sistemas de microprocesadores - Aritmética de punto flotante`. </br>

5. `double` - `0x05` - ***`8` bytes (`64` bit) tipo de coma flotante de doble precisión***</br>
Adopta el estándar `ISO/IEC 60559 Tecnología de la información - Sistemas de microprocesadores - Aritmética de punto flotante`. </br>

### Código complemento
#### Definición
'Complemento' es *la representación de números con signo en las computadoras*. </br>

#### método
El `código complementario` de los `números positivos` y el `0` es *el número en sí más el bit más alto 0*. El `complemento` de un `número negativo` es *invertir su valor absoluto bit a bit y sumar 1*. </br>

### Estándar de coma flotante
#### Definición
El `Estándar de números de coma flotante` adopta el estándar `ISO/IEC 60559 Tecnología de la información - Sistemas de microprocesadores - Aritmética de coma flotante`. Este estándar también se denomina `Estándar aritmético de coma flotante binaria IEEE (IEEE 754)`</br>

Sitio web oficial: https://www.iso.org/standard/80985.html</br>

#### método
El `valor real` de un `número de coma flotante` es igual al `bit de signo` multiplicado por el `valor de compensación del exponente` multiplicado por el `valor fraccionario`. Para obtener definiciones detalladas, consulte el estándar `ISO/IEC 60559 Tecnología de la información - Sistemas de microprocesadores - Aritmética de punto flotante`. </br>

##### `32` bit `número de punto flotante`
| Longitud de bits | Nombre | Número de bits |
| ------ | ------ |
| 1 | Bit de signo |
| 8 | Número | 30 a 23 valor positivo (tamaño de exponente real + 127) |
| 23 | Dígitos válidos | Número de 22 a 0 dígitos (comenzando con 0 desde la derecha) |

##### `64` bit `número de punto flotante`
| Longitud de bits | Nombre | Número de bits |
| ------ | ------ |
| 1 | Bit de signo |
| 11 | Número | 62 a 52 valor positivo (tamaño de exponente real + 1023) |
| 52 | Dígitos válidos | Números del 51 al 0 (empezando por 0 desde la derecha) |


## `types.h` código completo:
También hay códigos relacionados para `tipo`. El siguiente es el código de `types.h`:</br>
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

> Estamos trabajando más duro para desarrollar la `Máquina Virtual AQ`. Si desea obtener más información o participar en el trabajo de desarrollo, siga nuestro sitio web oficial: https://www.axa6.com y Github: https://github.com/aq-org/AQ. </br>

> Este artículo está publicado según la licencia AQ: https://github.com/aq-org/AQ/blob/main/LICENSE Si es necesario, adáptelo o reimprima según la licencia AQ.