---
publishDate: 2024-07-23T23:47:00+08:00
title: Type Definition of AQ Virtual Machine - AQ
excerpt: Since different systems, hardware and other external conditions have different support and definitions for memory, it is necessary to design a unified type standard in order to make AQ virtual machine meet the requirements of cross-platform operation. This article defines and standardizes the type of AQ virtual machine to ensure that AQ virtual machines on different systems can run normally.
image: https://www.axa6.com/aq.png
category: Blog
tags:
- AQ
- Blog
metadata:
canonical: https://www.axa6.com/type-definition-of-aq-virtual-machine
---

# Introduction
Since different `systems`, `hardware` and other external conditions have different support and definitions for `memory`, it is necessary to design a unified `type` standard in order to make `AQ virtual machine` meet the requirements of *cross-platform* operation. This article defines and specifies the `type` of the `AQ virtual machine` to ensure that the `AQ virtual machine` on different systems can run normally. </br>

# Design ideas
First, in order to achieve the simplification of `type` and higher *operation efficiency*, the design of `native types` (`types` that are *directly* supported by the virtual machine without code definition) should be as few as possible. Therefore, for related *complex types*, such as `enumerations` and `structures`, we develop them at the `compiler` level to reduce the number and `complexity` of `types` of the `virtual machine`. </br>

> According to the definition of `type` in `AqvmMemory_Memory` in `memory.h`, each `uint8_t` stores `2` types`, so the number of `types` should be between `0x00`-`0x0F` (16). </br>

Secondly, through the study of `types` in other `programming languages`, we summarized the common `types` and designed the following `types` to achieve a balance between *performance* and *simplicity* in `virtual machines`. </br>

0. null - *empty type*
1. byte - *`1` byte signed integer type*
2. int - *`4` byte signed integer type*
3. long - *`8` byte signed integer type*
4. float - *`4` byte single-precision floating-point type*
5. double - *`8` byte double-precision floating-point type*

Finally, we designed a detailed `standard` for `types` to ensure that `AQ virtual machines` can run `cross-platform`. </br>

> In order to reduce the type definitions of `virtual machines`, `unsigned types` will be implemented at the `compiler` level.

## `Type` definitions of other `programming languages`
In order to make `AQ`'s `type` more extensive and easy for developers to master, we refer to the existing `type` definitions of common `programming languages`. </br>
Here, the `basic types` in the following text are defined as general `data` types such as integers, floating-point numbers, and null types. They undertake basic data storage work or have special significance. </br>

### C
The current `C` standard is `ISO/IEC 9899:2018 Information technology — Programming languages ​​— C`. Since the copyright of this standard belongs to `ISO (International Organization for Standardization)` and `IEC (International Electrotechnical Commission)`, in order to avoid copyright disputes, we have summarized the `type` definitions in it. The same below. </br>

Official website: https://www.iso.org/standard/74528.html</br>

1. `_Bool` - Objects declared as `_Bool` type are large enough to store values ​​​​of `0` and `1`.
2. `(unsigned) char` - character type. An object declared as type `char` is large enough to store any member of the basic execution character set. If a member of the basic execution character set is stored in a `char` object, its value is guaranteed to be non-negative. If any other character is stored in a character object, the resulting value is `implementation-defned`, but shall be in the range of values ​​representable in the type.
3. `signed char` - signed character type.
4. `short int` - extended signed integer type.
5. `unsigned short int` - extended unsigned integer type.
6. `int` - extended standard signed integer type.
7. `unsigned int` - standard unsigned integer type.
8. `long int` - extended signed integer type.
9. `unsigned long int` - extended unsigned integer type.
10. `long long int` - extended signed integer type.
11. `unsigned long long int` - extended unsigned integer type.
12. `float` - floating-point type. The value set of the `float` type is a subset of the set of values ​​of the `double` type.
13. `double` - floating-point type. The value set of the `double` type is a subset of the set of values ​​of the `long double` type.
14. `long double` - floating-point type.
15. `void` - The `void` type contains a set of empty values; it is an incomplete object type and cannot be implemented.

In addition, `C` has other non-`basic types`, such as `enumeration` types (`enum` types), pointer types, etc. They are not discussed in the design of the `virtual machine`. </br>

### `C++` and other `C` variants
The current `C++` standard is `ISO/IEC 14882:2020 Programming languages ​​— C++`. Since the types of `C++` and other `C` variants are basically the same as those of `C`, they are no longer listed. </br>

### Python
The latest official version of `Python` is `3.12.4`. The `Built-in Types` in the `Python 3.12.4 Documentation` documents the standard types built into the `Python` interpreter. </br>
The main built-in types are `numbers`, `sequences`, `maps`, `classes`, `instances`, and `exceptions`. Due to space constraints, the contents other than `basic types` are not discussed here. </br>

Source link: https://docs.python.org/zh-cn/3/library/stdtypes.html</br>

1. `int` - *Integer* `Integer` has unlimited precision. Unmodified integer literals (including hexadecimal, octal, and binary numbers) produce integers.
2. `float` - *Floating-point numbers* `Floating-point numbers` are usually implemented in `C` using `double`. Numeric literals containing a decimal point or an exponential sign produce a floating point number.
3. `complex` - *Complex numbers* Complex numbers have a real part and an imaginary part, each of which is a floating point number. Adding `j` or `J` to a numeric literal produces an imaginary number (a complex number with a zero real part), which can be added to an integer or a floating point number to produce a complex number with both a real part and an imaginary part.
4. `bool` - *Boolean* `Boolean` is also a `subtype` of `integer`. A Boolean object representing a truth value. The `bool` type has only two constant instances: `True` and `False`.
5. `list` - *List* `Lists` are mutable sequences, often used to store `collections` of items of the same kind (where the exact degree of similarity will vary depending on the application).
6. `tuple` - *Tuple* A tuple is an immutable sequence, often used to store multi-tuples of heterogeneous data (e.g., tuples produced by the `enumerate()` built-in function). Tuples are also used in situations where an immutable sequence of homogeneous data is needed (e.g., to allow storage into instances of `set` or `dict`).
7. `range` - The `range` type represents an immutable sequence of numbers, often used to iterate a specified number of times in a `for` loop.
8. `str` - *Text sequence type* Text data is handled in Python using the `str` object, also known as a `string`. A `string` is an `immutable sequence` of `Unicode` code points.
9. `bytes` - The `bytes` object is an `immutable sequence` of single bytes. Since many major binary protocols are based on the `ASCII` text encoding, the `bytes` object provides some `methods` that are only available when dealing with `ASCII` compatible data, and are closely related to the `string` object in many features.
10. `bytearray` - The `bytearray` object is the mutable counterpart of the `bytes` object.
11. `memoryview` - *Memory view* The `memoryview` object allows `Python` code to access the internal data of an object as long as the object supports the `buffer protocol` without copying.
12. `set` - *Set type* The `set` object is an `unordered multi-item set` of unique `hashable` objects. Common uses include membership testing, removing duplicates from a sequence, and set-like calculations in mathematics, such as `intersection`, `union`, `difference`, and `symmetric difference`. The `set` type is mutable and its contents can be changed using methods such as `add()` and `remove()`. As a `mutable type`, it has no `hash value` and cannot be used as a `dictionary` key` or an `set` element`.
13. `frozenset` - *Set Types* The `frozenset` type is `immutable` and `hashable`, its contents cannot be changed after creation, so it can be used as `keys` of `dictionaries` or `elements` of other `sets`.
14. `dict` - *Mapping Types* `mapping` objects map `hashable` values ​​to arbitrary objects. `Mappings` are `mutable objects`. Currently there is only one standard mapping type, `dict`.
15. `GenericAlias` - `GenericAlias` objects are usually created by `extracting` a `class`. They are most commonly used for `container classes`, such as `list` or `dict`. For example, the `list[int]` `GenericAlias` object is created by extracting the `list` class with an `int` parameter. The main purpose of `GenericAlias` objects is for `type annotations`.
16. `union` - `Union objects` contain the values ​​after performing `| (bitwise or)` operations on multiple `type objects`. These types are mainly used for `type annotations`. Compared with `typing.Union`, `union type` expressions can achieve more concise type hint syntax.

### Java
The `specification` of `JVM (Java Virtual Machine)` is `The Java® Virtual Machine Specification`, the latest version is `Java SE 22 Edition`, and the release date is `2024-02-09`. Compared with the `type definition` at the `compiler` level of other languages, the situation of `JVM` is more in line with the design of `virtual machine`. At the same time, the `types` of `JVM` are divided into `primitive types` and `reference types`. Due to the needs of `virtual machine` development, `primitive types` are selected for discussion. </br>
In addition, `Java` also has a `specification`, `The Java Language Specification, Java SE 22 Edition`, `HTML` link: https://docs.oracle.com/javase/specs/jls/se22/html/index.html `PDF` link: https://docs.oracle.com/javase/specs/jls/se22/jls22.pdf . Due to the special needs of `virtual machine` development, in this article, we choose to study the `type definition` of `JVM` rather than the `type definition` of `Java` language</br>

Source link (HTML): https://docs.oracle.com/javase/specs/jvms/se22/html/jvms-2.html#jvms-2.3</br>
Source link (PDF): https://docs.oracle.com/javase/specs/jvms/se22/jvms22.pdf</br>

1. `byte` - *integer type* whose value is an `8`-bit *signed two's complement integer*, and its default value is `zero`. From `-128` to `127` (*-2<sup>7</sup>* to *2<sup>7</sup> - 1*), inclusive.
2. `short` - *integer type* Its value is a `16`-bit *signed two's complement integer*, whose default value is `zero`. From `-32768` to `32767` (*-2<sup>15</sup>* to *2<sup>15</sup> - 1*), inclusive.
3. `int` - *integer type* Its value is a `32`-bit *signed two's complement integer*, whose default value is `zero`. From `-2147483648` to `2147483647` (*-2<sup>31</sup>* to *2<sup>31</sup> - 1*), inclusive.
4. `long` - *integer type* Its value is a `64`-bit *signed two's complement integer*, whose default value is `zero`. From `-9223372036854775808` to `9223372036854775807` (*-2<sup>63</sup>* to *2<sup>63</sup> - 1*), inclusive.
5. `char` - *integer type* whose values ​​are `16`-bit *unsigned integers* representing `Unicode` code points in the Basic Multilingual Plane, encoded as `UTF-16`, whose default value is the `null` code point (`\u0000`). From `0` to `65535`.
6. `float` - *floating-point type* whose values ​​are exactly in the `32`-bit *IEEE 754 binary32* format, with a default value of `positive zero`.
7. `double` - *Floating point type* Its value is exactly the same as the value of `64`bit *IEEE 754 binary64* format, and the default value is `positive zero`.

# Detailed standard
## Type definition
Complex types will be processed by the `compiler` to ensure the simplicity and efficiency of the `virtual machine`, and for simple types, they will be directly supported by the `virtual machine`. </br>
The following are the `6` basic types defined by the `AQ virtual machine`:</br>

> Types that are not directly supported include `unsigned integers`, `memory addresses (pointers)`, `strings`, etc. These types will be implemented at the `compiler` level. For the `virtual machine`, these types are indirectly implemented.

0. `null` - `0x00` - ***empty type***</br>
The empty type only represents an unknown type or a type that is not needed (for example: no return). No length. </br>

1. `byte` - `0x01` - ***`1` byte (`8` bit) signed integer type***</br>
Stored in *two's complement*. Generally used to store `bool` or `char`. From `-128` to `127` (*-2<sup>7</sup>* to *2<sup>7</sup> - 1*), inclusive. </br>

2. `int` - `0x02` - ***`4` byte (`32` bit) signed integer type***</br>
Stored in *two's complement*. From `-2147483648` to `2147483647` (*-2<sup>31</sup>* to *2<sup>31</sup> - 1*), inclusive. </br>

3. `long` - `0x03` - ***`8` byte (`64` bit) signed integer type***</br>
Using *two's complement* storage. `Memory address (pointer)` is also stored in this way. Its value is a `64` bit *signed two's complement integer*, and its default value is `zero`. From `-9223372036854775808` to `9223372036854775807` (*-2<sup>63</sup>* to *2<sup>63</sup> - 1*), inclusive. </br>

4. `float` - `0x04` - ***`4` byte (`32` bit) single-precision floating-point type***</br>
Using `ISO/IEC 60559 Information technology — Microprocessor Systems — Floating-Point arithmetic` standard. </br>

5. `double` - `0x05` - ***`8` byte (`64` bit) double precision floating point type***</br>
Using `ISO/IEC 60559 Information technology — Microprocessor Systems — Floating-Point arithmetic` standard. </br>

### Complement code
#### Definition
`Complement code` is *a method of representing signed numbers in computers*. </br>

#### Method
The `complement code` of a `positive number` and `0` is *the number itself plus the highest bit 0*. The `complement code` of a `negative number` is *the absolute value is bitwise inverted and then 1 is added*. </br>

### Floating point standard
#### Definition
`Floating point standard` adopts `ISO/IEC 60559 Information technology — Microprocessor Systems — Floating-Point arithmetic` standard. This standard is also known as the `IEEE Standard for Binary Floating-Point Arithmetic (IEEE 754)`</br>

Official website: https://www.iso.org/standard/80985.html</br>

#### Method
The `actual value` of a `floating-point number` is equal to the `sign bit` multiplied by the `exponent offset value` multiplied by the `fractional value`. For detailed definition, see the `ISO/IEC 60559 Information technology — Microprocessor Systems — Floating-Point arithmetic` standard. </br>

##### `32` bit `floating point`
| Bit length | Name | Bit number |
| ------ | ------ | ------ |
| 1 | Sign | 31 |
| 8 | Number | 30 to 23 positive value (actual exponent size + 127) |
| 23 | Significant digit | 22 to 0 bit number (starting from the right with 0) |

##### `64` bit `floating point`
| Bit length | Name | Bit number |
| ------ | ------ | ------ |
| 1 | Sign | 63 |
| 11 | Number | 62 to 52 positive value (actual exponent size + 1023) |
| 52 | Significant digit | 51 to 0 bit number (starting from the right with 0) |

## `types.h` complete code:
For `types` there is also relevant code. The following is the code for `types.h`:</br>

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

> We are working harder to develop the `AQ virtual machine`. If you want to learn more or participate in the development work, please follow our official website: https://www.axa6.com and Github: https://github.com/aq-org/AQ. </br>

> This article is based on the AQ License: https://github.com/aq-org/AQ/blob/main/LICENSE. If necessary, please adapt or reprint according to the AQ License.