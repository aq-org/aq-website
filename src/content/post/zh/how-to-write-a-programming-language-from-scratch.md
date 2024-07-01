---
publishDate: 2024-05-28T23:05:54+08:00
title: How to write a programming language from scratch? - AQ
excerpt: How to write a programming language from scratch? AQ is a fast, small, simple and safe interpreted programming language.
image: ../../../assets/images/aq.png
category: Blog
tags:
  - AQ
  - Blog
metadata:
  canonical: https://www.axa6.com/how-to-write-a-programming-language-from-scratch
---

# Introduction
How to design a programming language from scratch? What parts should a new programming language include?</br>
This article will detail the process of developing a programming language through the design of AQ, starting from scratch to designing, developing the compiler, and related infrastructure, eventually completing the construction of a programming language.</br>

# Introduction to AQ

**AQ** is an `interpreted` **programming language**. It is `fast`, `small`, `simple`, and `secure`. Programs written in AQ can also be `compiled`. Additionally, the source code of `AQ` is available on `GitHub`, open source, and follows the `AQ License`.

GitHub address: https://github.com/aq-org/AQ, where you can obtain the source code of `AQ`.

## Features

- **Fast** (`source code` compilation and `run speed`)
- **Small** (`source code` size)
- **Simple** (easy to learn)
- **Secure** (safe `memory management` and `code checks`)
- **Cross-platform** (supports `Windows`, `Linux`, and `MacOS`, etc.)
- C++-like syntax (quick to grasp)
- Interpreted (optional `compilation`)
- Free (follows `AQ License`)
- Open source (based on `AQ License`)

# Design
## Original Plan
AQ initially began development in October 2023 and underwent restructuring on February 1, 2024, with multiple revisions forming the current framework.</br>

The original plan was to implement the compiler in C++ and then develop the virtual machine. However, since the compiler needed to translate to the virtual machine's bytecode and due to prolonged compiler development time, the original version was abandoned. The code has been entirely deleted but can be found in the commits.</br>

## New Plan
The new plan is to develop the `AQ virtual machine` first and then implement the compiler through other means. Since it's developed in C, the `AQ virtual machine` reduces performance overhead and gains broader support. The `AQ virtual machine` is currently divided into `interpreter`, `memory`, `runtime`, and `operating system library`.</br>

1. The `interpreter` is the execution engine of the `AQ virtual machine`. Bytecode instruction execution functions are currently being developed.</br>
2. `Memory` is the storage of the `AQ virtual machine`. For efficiency reasons, the `AQ virtual machine` is based on a register architecture. A garbage collection mechanism will be added in the future.</br>
3. The `runtime` is the dependent environment of the `AQ virtual machine`, including error handling, standard output, and other necessary components, providing a basic runtime environment for AQ.</br>
4. The `operating system library` is the necessary component for the `AQ virtual machine` to interact with the operating system.</br>

These four parts of the design essentially include most of the components of an interpreted language's virtual machine. As the functionality of the programming language continues to expand in the future, upgrades can be implemented by adding components.</br>


## Reasons and Advantages
The AQ language is designed as an interpreted language for multi-platform compatibility. In the future, further compiler development work for different operating systems can make development more efficient. Based on the register architecture, it also reduces performance loss.</br>

> We are working hard on developing the `AQ virtual machine`. If you want to learn more or participate in the development work, please follow our official website: https://www.axa6.com and GitHub: https://github.com/aq-org/AQ.</br>

> This article is published under the AQ License: https://github.com/aq-org/AQ/blob/main/LICENSE. If needed, please adapt or reprint according to the AQ License.