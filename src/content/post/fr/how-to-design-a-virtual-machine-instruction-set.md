---
publishDate: 2024-05-29T21:20:43+08:00
title: How to design a virtual machine instruction set? - AQ
excerpt: How to design a virtual machine instruction set? This article is a design proposal for the AQ virtual machine instruction set.
image: https://www.axa6.com/fr/aq.png
category: Blog
tags:
  - AQ
  - Blog
metadata:
  canonical: https://www.axa6.com/how-to-write-a-programming-language-from-scratch
---

# Introduction
How to design a virtual machine instruction set?</br>
What instructions should be included in the instruction set?</br>
This article is a design proposal for the AQ virtual machine instruction set.</br>

# Instructions
AQ虚拟机的指令集定义在AQ根目录的"/aqvm/interpreter/bytecode/opcode"。</br>

您可以在Github查看本目录：https://github.com/aq-org/AQ/tree/main/aqvm/interpreter/bytecode/opcode</br>

内含两个文件：</br>
1. `opcode.h` - AQ虚拟机指令集的`枚举类型`和`指令执行函数`等声明</br>
源代码：https://github.com/aq-org/AQ/blob/main/aqvm/interpreter/bytecode/opcode/opcode.h
2. `opcode.c` - AQ虚拟机指令集的`指令执行函数`的定义</br>
源代码：https://github.com/aq-org/AQ/blob/main/aqvm/interpreter/bytecode/opcode/opcode.c
3. `CMakeLists.txt` - 编译指令集的`CMake`脚本</br>
源代码：https://github.com/aq-org/AQ/blob/main/aqvm/interpreter/bytecode/opcode/CMakeLists.txt
4. 暂无...</br>

由于C语言代码命名可能出现重复，因此AQ虚拟机的代码均以`Aqvm`开头，后加入文件路径等`命名空间`，用`_`区分前面的命名空间和后面的具体名称，例如：`AqvmInterpreterBytecodeOpcode_Type`</br>

```C
enum AqvmInterpreterBytecodeOpcode_Type {
  AqvmInterpreterBytecodeOpcodeType_NOP = 0x00,
  AqvmInterpreterBytecodeOpcodeType_LOAD,
  AqvmInterpreterBytecodeOpcodeType_STORE,
  AqvmInterpreterBytecodeOpcodeType_NEW,
  AqvmInterpreterBytecodeOpcodeType_FREE,
  AqvmInterpreterBytecodeOpcodeType_SIZE,
  AqvmInterpreterBytecodeOpcodeType_ADD,
  AqvmInterpreterBytecodeOpcodeType_SUB,
  AqvmInterpreterBytecodeOpcodeType_MUL,
  AqvmInterpreterBytecodeOpcodeType_DIV,
  AqvmInterpreterBytecodeOpcodeType_REM,
  AqvmInterpreterBytecodeOpcodeType_NEG,
  AqvmInterpreterBytecodeOpcodeType_SHL,
  AqvmInterpreterBytecodeOpcodeType_SHR,
  AqvmInterpreterBytecodeOpcodeType_SAR,
  AqvmInterpreterBytecodeOpcodeType_IF,
  AqvmInterpreterBytecodeOpcodeType_AND,
  AqvmInterpreterBytecodeOpcodeType_OR,
  AqvmInterpreterBytecodeOpcodeType_XOR,
  AqvmInterpreterBytecodeOpcodeType_CMP,
  AqvmInterpreterBytecodeOpcodeType_INVOKE,
  AqvmInterpreterBytecodeOpcodeType_RETURN,
  AqvmInterpreterBytecodeOpcodeType_GOTO,
  AqvmInterpreterBytecodeOpcodeType_THROW,
  AqvmInterpreterBytecodeOpcodeType_WIDE = 0xFF
};
```
以上是目前的AQ虚拟机指令集的全部指令，后续可能有所更改。</br>
AQ虚拟机的字节码的`操作符`采用定长字节码，长度为`1`个字节。如果需要扩展`操作符`的长度，则采用`WIDE`指令。（目前且未来很长一段时间仍不需要使用）</br>

AQ虚拟机的`操作数`采用变长字节码，`操作数`个数一般固定，但`操作数`的第一个字节是`操作数长度`，指定后续读取的操作数的长度。因此`操作数`的长度不固定。</br>

以下是AQ虚拟机指令的解释：
| 指令名称 | 16进制 | 参数 | 解释 |
| --- | --- | --- | --- |
| NOP | 0x00 | 无 | 空指令 |

Unfinished Business.

> We are working hard on developing the `AQ virtual machine`. We would appreciate it if you could give us a star on Github. If you want to learn more or participate in the development work, please follow our official website: https://www.axa6.com and GitHub: https://github.com/aq-org/AQ.</br>

> This article is published under the AQ License: https://github.com/aq-org/AQ/blob/main/LICENSE. If needed, please adapt or reprint according to the AQ License.