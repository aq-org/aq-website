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
此处定义下文中的`基础类型`为整数、浮点数、空类型等一般的`数据`类型。其承担基本的数据存储工作或具有特殊的意义。</br>

### C
现行的`C`标准是`ISO/IEC 9899:2018 Information technology — Programming languages — C`。由于该标准版权归属`ISO（国际标准化组织）`和`IEC（国际电工委员会）`，因此为避免版权纠纷，我们就其中的`类型`定义进行了归纳总结。下同。</br>

官方网址：https://www.iso.org/standard/74528.html</br>

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

除此之外，`C`还有其它非`基础类型`，如`枚举`类型(`enum`类型)，指针类型等。在`虚拟机`的设计中不作讨论。</br>

### `C++` 及其它`C`变种
现行的`C++`标准是`ISO/IEC 14882:2020 Programming languages — C++`。由于`C++`及其它`C`变种与`C`的类型基本一致，因此不再列出。</br>

### Python
最新的`Python`正式版本是`3.12.4`。在`Python 3.12.4 Documentation`中的`内置类型`记载了`Python`解释器中内置的标准类型。</br>
其中的主要内置类型有`数字`、`序列`、`映射`、`类`、`实例`和`异常`。由于篇幅原因，在此对于除`基础类型`外的内容不作讨论。</br>

源链接：https://docs.python.org/zh-cn/3/library/stdtypes.html</br>

1. `int` - *整数* `整数`具有无限的精度。未经修饰的整数字面（包括十六进制、八进制和二进制数）产生整数。
2. `float` - *浮点数* `浮点数`通常在`C`中使用`double`实现。包含`小数点`或`指数符号`的数值字面产生`浮点数`。
3. `complex` - *复数* 复数有`实数部分`和`虚数部分`，每一部分都是`浮点数`。在数值字面后面加上`j`或 `J`，可以得到一个`虚数`（实数部分为零的`复数`），将其与`整数`或`浮点数`相加，可以得到一个包含`实数部分`和`虚数部分`的`复数`。
4. `bool` - *布尔型* `布尔型`也是`整数`的一种`子类型`。代表真值的布尔对象。`bool`类型只有两个常量实例:`True`和`False`。
5. `list` - *列表* `列表`是`可变序列`，通常用于存放同类项目的`集合`（其中精确的相似程度将根据应用而变化）。
6. `tuple` - *元组* `元组`是`不可变序列`，通常用于储存异构数据的`多项集`（例如由`enumerate()`内置函数所产生的`二元组`）。`元组`也被用于需要同构数据的`不可变序列`的情况（例如允许存储到`set`或`dict`的实例）。
7. `range` - `range`类型表示`不可变`的`数字序列`，通常用于在`for`循环中循环指定的次数。
8. `str` - *文本序列类型* 在`Python`中处理文本数据是使用`str`对象，也称为`字符串`。`字符串`是由`Unicode`码位构成的`不可变序列`。
9. `bytes` - `bytes`对象是由单个字节构成的`不可变序列`。由于许多主要二进制协议都基于`ASCII`文本编码，因此`bytes`对象提供了一些仅在处理`ASCII`兼容数据时可用，并且在许多特性上与`字符串`对象紧密相关的`方法`。
10. `bytearray` - `bytearray`对象是`bytes`对象的可变对应物。
11. `memoryview` - *内存视图* `memoryview`对象允许`Python`代码访问一个对象的内部数据，只要该对象支持`缓冲区协议`而无需进行拷贝。
12. `set` - *集合类型* `set`对象是由具有唯一性的`hashable`对象所组成的`无序多项集`。 常见的用途包括成员检测、从序列中去除重复项以及数学中的集合类计算，例如`交集`、`并集`、`差集`与`对称差集`等等。`set`类型是可变的，其内容可以使用`add()`和`remove()`这样的方法来改变。由于是`可变类型`，它没有`哈希值`，且不能被用作`字典`的`键`或其他`集合`的`元素`。
13. `frozenset` - *集合类型* `frozenset`类型是`不可变`并且为`hashable`，其内容在被创建后不能再改变，因此它可以被用作`字典`的`键`或其他`集合`的`元素`。
14. `dict` - *映射类型* `mapping`对象会将`hashable`值映射到任意对象。`映射`属于`可变对象`。目前仅有一种标准映射类型`字典`。
15. `GenericAlias` - `GenericAlias`对象通常是通过`抽取`一个`类`来创建的。它们最常被用于 `容器类`，如`list`或`dict`。举例来说，`list[int]`这个`GenericAlias`对象是通过附带`int`参数抽取`list`类来创建的。`GenericAlias`对象的主要目的是用于`类型标注`。
16. `union` - `联合对象`包含了在多个`类型对象`上执行`| (按位或)`运算后的值。 这些类型主要用于`类型标注`。与`typing.Union`相比，`联合类型`表达式可以实现更简洁的类型提示语法。

### Java
`JVM（Java虚拟机）`的`规范`是`The Java® Virtual Machine Specification`，最新版本是`Java SE 22 Edition`，发布日期为`2024-02-09`。相较与其它语言的`编译器`层面的`类型定义`，`JVM`的情况更符合`虚拟机`的设计。</br>
除此之外，`Java`还有一份`规范`是`The Java Language Specification, Java SE 22 Edition`，`HTML`链接：https://docs.oracle.com/javase/specs/jls/se22/html/index.html
 `PDF`链接：https://docs.oracle.com/javase/specs/jls/se22/jls22.pdf 。由于`虚拟机`开发的特殊需要，因此在本文选择研究`JVM`的`类型定义`而非`Java`语言的`类型定义`</br>

源链接（HTML）：https://docs.oracle.com/javase/specs/jvms/se22/html/jvms-2.html#jvms-2.3</br>
源链接（PDF）：https://docs.oracle.com/javase/specs/jvms/se22/jvms22.pdf</br>

1. `byte`
2. `short`
3. `int`
4. `long`
5. `char`
6. `float`
7. `double`

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
