---
publishDate: 2024-07-22T23:17:00+08:00
title:  AQ虚拟机的类型定义 - AQ
excerpt: 由于不同的系统、硬件等外部条件对于内存有不同的支持和定义，因此为了使AQ虚拟机满足跨平台运行的要求，设计统一的类型标准是必不可少的。本文对于AQ虚拟机的类型进行了定义和规范，以确保在不同系统上的AQ虚拟机均能正常运行。
image: https://www.axa6.com/aq.png
category: Blog
tags:
  - AQ
  - Blog
metadata:
  canonical: https://www.axa6.com/zh/type-definition-of-aq-virtual-machine
---

# 简介
由于不同的`系统`、`硬件`等外部条件对于`内存`有不同的支持和定义，因此为了使`AQ虚拟机`满足*跨平台*运行的要求，设计统一的`类型`标准是必不可少的。本文对于`AQ虚拟机`的`类型`进行了定义和规范，以确保在不同系统上的`AQ虚拟机`均能正常运行。</br>

# 设计思路
首先，为实现`类型`的精简和更高的*运行效率*，对于`原生类型`（不通过代码定义，虚拟机*直接*支持的`类型`）的设计应尽可能少。因此对于相关的*复杂类型*，如`枚举`、`结构体`等，我们在`编译器`层面开发，减少`虚拟机`的`类型`数量和`复杂度`。</br>

> 根据`memory.h`中对于`AqvmMemory_Memory`中`type`的定义，每一个`uint8_t`存储`2`个`类型`，因此`类型`的数量应在`0x00`-`0x0F`（16个）之间。</br>

其次，通过对于其它`编程语言`的`类型`的研究，总结了常见的`类型`，我们设计了以下几种`类型`，以便于在`虚拟机`的*性能*与*简洁*达到平衡。</br>

0. null - *空类型*
1. byte - *`1`字节有符号整数类型*
2. int - *`4`字节有符号整数类型*
3. long - *`8`字节有符号整数类型*
4. float - *`4`字节单精度浮点类型*
5. double - *`8`字节双精度浮点类型*

最后，我们为`类型`设计了详细的`标准`，以确保`AQ虚拟机`能够实现`跨平台`运行。</br>

> 为了减少`虚拟机`的类型定义，`无符号类型`将在`编译器`层面被实现。

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
`JVM（Java虚拟机）`的`规范`是`The Java® Virtual Machine Specification`，最新版本是`Java SE 22 Edition`，发布日期为`2024-02-09`。相较与其它语言的`编译器`层面的`类型定义`，`JVM`的情况更符合`虚拟机`的设计。同时`JVM`的`类型`分为`基元类型`和`引用类型`，由于`虚拟机`开发需要，选择了`基元类型`进行讨论。</br>
除此之外，`Java`还有一份`规范`是`The Java Language Specification, Java SE 22 Edition`，`HTML`链接：https://docs.oracle.com/javase/specs/jls/se22/html/index.html `PDF`链接：https://docs.oracle.com/javase/specs/jls/se22/jls22.pdf 。由于`虚拟机`开发的特殊需要，因此在本文选择研究`JVM`的`类型定义`而非`Java`语言的`类型定义`</br>

源链接（HTML）：https://docs.oracle.com/javase/specs/jvms/se22/html/jvms-2.html#jvms-2.3</br>
源链接（PDF）：https://docs.oracle.com/javase/specs/jvms/se22/jvms22.pdf</br>

1. `byte` - *整数类型* 其值是`8`位*有符号二进制补码整数*，其默认值为`零`。从`-128`至`127`（*-2<sup>7</sup>*至*2<sup>7</sup> - 1*），包括在内。
2. `short` - *整数类型* 其值为`16`位*有符号二进制补码整数*，其默认值为`零`。从`-32768`至`32767`（*-2<sup>15</sup>*至*2<sup>15</sup> - 1*），包括在内。
3. `int` - *整数类型* 其值为`32`位*有符号二进制补码整数*，其默认值为`零`。从`-2147483648`至`2147483647`（*-2<sup>31</sup>*至*2<sup>31</sup> - 1*），包括在内。
4. `long` - *整数类型* 其值为`64`位*有符号二进制补码整数*，其默认值为`零`。从 `-9223372036854775808`至`9223372036854775807`（*-2<sup>63</sup>*至*2<sup>63</sup> - 1*），包括在内。
5. `char` - *整数类型* 其值为`16`位*无符号整数*，表示基本多语言平面中的`Unicode`码位，编码为`UTF-16`，其默认值为`null`码位 (`\u0000`)。从`0`到`65535`。
6. `float` - *浮点类型* 其值完全符合`32`位*IEEE 754 binary32*格式，默认值为`正零`。
7. `double` - *浮点类型* 其值与`64`位*IEEE 754 binary64*格式的值完全一致，默认值为`正零`。

# 详细标准
## 类型定义
复杂的类型会有`编译器`处理以保证`虚拟机`的简洁和效率，对于简单的类型，则会被`虚拟机`直接支持。</br>
以下是`AQ虚拟机`定义的`6`种基本类型有：</br>

> 未直接支持的类型包括`无符号整数`，`内存地址（指针）`，`字符串`等。这些类型将在`编译器`层面得到实现。对于`虚拟机`来说，这些类型被间接实现。

0. `null` - `0x00` - ***空类型***</br>
空类型仅代表未知类型或无需使用的类型（例如：无返回）。没有长度。</br>

1. `byte` - `0x01` - ***`1`字节（`8`位）有符号整数类型***</br>
采用*二进制补码*存储。一般用于存储`bool`或`char`。从`-128`至`127`（*-2<sup>7</sup>*至*2<sup>7</sup> - 1*），包括在内。</br>

2. `int` - `0x02` - ***`4`字节（`32`位）有符号整数类型***</br>
采用*二进制补码*存储。从`-2147483648`至`2147483647`（*-2<sup>31</sup>*至*2<sup>31</sup> - 1*），包括在内。</br>

3. `long` - `0x03` - ***`8`字节（`64`位）有符号整数类型***</br>
采用*二进制补码*存储。`内存地址（指针）`也用此存储。其值为`64`位*有符号二进制补码整数*，其默认值为`零`。从 `-9223372036854775808`至`9223372036854775807`（*-2<sup>63</sup>*至*2<sup>63</sup> - 1*），包括在内。</br>

4. `float` - `0x04` - ***`4`字节（`32`位）单精度浮点类型***</br>
采用`ISO/IEC 60559 Information technology — Microprocessor Systems — Floating-Point arithmetic`标准。</br>

5. `double` - `0x05` - ***`8`字节（`64`位）双精度浮点类型***</br>
采用`ISO/IEC 60559 Information technology — Microprocessor Systems — Floating-Point arithmetic`标准。</br>

### 补码
#### 定义
`补码`是*计算机中有符号数的表示方法*。</br>

#### 方法
`正数`和`0`的`补码`就是*该数字本身再补上最高比特0*。`负数`的`补码`则是*将其绝对值按位取反再加1*。</br>

### 浮点数标准
#### 定义
`浮点数标准`采用`ISO/IEC 60559 Information technology — Microprocessor Systems — Floating-Point arithmetic`标准。该标准又称`IEEE二进制浮点数算术标准（IEEE 754）`</br>

官方网址：https://www.iso.org/standard/80985.html</br>

#### 方法
`浮点数`的`实际值`，等于`符号位`乘以`指数偏移值`再乘以`分数值`。详细定义见`ISO/IEC 60559 Information technology — Microprocessor Systems — Floating-Point arithmetic`标准。</br>

##### `32`位`浮点数`
| 比特长度 | 名称 | 比特编号 |
| ------ | ------ | ------ |
| 1 | 符号位 | 31 |
| 8 | 数字 | 30至23偏正值（实际的指数大小+127） |
| 23 | 有效数字 | 22至0位编号（从右边开始为0） |

##### `64`位`浮点数`
| 比特长度 | 名称 | 比特编号 |
| ------ | ------ | ------ |
| 1 | 符号位 | 63 |
| 11 | 数字 | 62至52偏正值（实际的指数大小+1023） |
| 52 | 有效数字 | 51至0位编号（从右边开始为0） |


## `types.h`完整代码：
对于`类型`同样有相关代码。以下是`types.h`的代码：</br>

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

> 我们正在更加努力地开发`AQ虚拟机`。如果您想了解更多信息或参与开发工作，请关注我们的官网：https://www.axa6.com 和 Github：https://github.com/aq-org/AQ。</br>

> 本文章基于AQ License：https://github.com/aq-org/AQ/blob/main/LICENSE 发布，如有需要，请根据AQ License进行改编或转载。