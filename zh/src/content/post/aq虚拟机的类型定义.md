---
publishDate: 2024-07-14T22:20:00+08:00
title:  AQ虚拟机的类型定义 - AQ
excerpt: 由于不同的系统、硬件等外部条件对于内存有不同的支持和定义，因此为了使AQ虚拟机满足跨平台运行的要求，设计统一的类型标准是必不可少的。本文对于AQ虚拟机的类型进行了定义和规范，以确保在不同系统上的AQ虚拟机均能正常运行。
image: https://www.axa6.com/aq.png
category: Blog
tags:
  - AQ
  - Blog
metadata:
  canonical: https://www.axa6.com/一种优秀的虚拟机内存架构
---

# 简介
由于不同的`系统`、`硬件`等外部条件对于`内存`有不同的支持和定义，因此为了使`AQ虚拟机`满足`跨平台`运行的要求，设计统一的`类型`标准是必不可少的。本文对于`AQ虚拟机`的`类型`进行了定义和规范，以确保在不同系统上的`AQ虚拟机`均能正常运行。</br>

# 设计思路
首先，为实现`类型`的精简和更高的`运行效率`，对于`原生类型`（不通过代码定义，虚拟机`直接`支持的`类型`）的设计应尽可能少。</br>

> 根据`memory.h`中对于`AqvmMemory_Memory`中`type`的定义，每一个`uint8_t`存储`2`个`类型`，因此`类型`的数量应在`0x00`-`0x0F`（16个）之间。

## 其它`编程语言`的`类型`定义
为了使`AQ`的`类型`更加广泛且易于被开发人员掌握，我们参考了现有的常见的`编程语言`的`类型`定义。</br>
### C
现行的`C`标准是`ISO/IEC 9899:2018 Information technology — Programming languages — C`。由于该标准版权归属`ISO/IEC 2018`，因此为避免版权纠纷，我们就其中的`类型`定义进行了归纳总结。</br>

1. `_Bool` - 声明为`_Bool`类型的对象足够大以存储值`0`和`1`。
2. `(unsigned) char` - 字符类型。声明为类型`char`的对象足够大，可以存储基本执行字符集的任何成员。如果基本执行字符集的成员存储在`char`对象中，则其值保证为非负值。如果任何其他字符存储在一个字符对象中，则结果值为`implementation-defned`，但应在该类型中可以表示的值范围内。
3. `signed char` - 有符号字符类型。
4. `short int` - 扩展有符号整数类型。
5. `unsigned short int` - 扩展无符号整数类型。
6. `int` - 扩展标准有符号整数类型。
7. `unsigned int` - 标准无符号整数类型。
8. `long int` - 扩展有符号整数类型。
9. `unsigned long int` - 扩展无符号整数类型。
10. `long long int` - 扩展有符号整数类型。
11. `unsigned long long int` - 扩展无符号整数类型。
12. `float` - 浮点类型。`float` 类型的值集是`double`类型的一组值的子集。
13. `double` - 浮点类型。`double` 类型的值集是`long double`类型的一组值的子集。
14. `long double` - 浮点类型。
15. `void` - `void`类型包含一组空值；它是一个不完整的对象类型，无法实现。

除此之外，`C`还有其它非基础类型，如枚举类型(`enum`类型)，指针类型等。在`虚拟机`的设计中不作讨论。</br>


# 详细设计
## types.h
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

### `types.h`完整代码：
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

未完待续……</br>