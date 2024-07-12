---
publishDate: 2024-07-12T21:10:23+08:00
title: ¿Cómo escribir un lenguaje de programación desde cero - AQ?
excerpt: ¿Cómo escribir un lenguaje de programación desde cero? AQ es un lenguaje de programación interpretado rápido, pequeño, sencillo y seguro.
image: https://www.axa6.com/aq.png
category: Blog
tags:
  - AQ
  - Blog
metadata:
  canonical: https://www.axa6.com/es/how-to-write-a-programming-language-from-scratch
---

# Introducción
¿Cómo diseñar un lenguaje de programación desde cero? ¿Qué partes debe incluir un nuevo lenguaje de programación?</br>
Este artículo detallará el proceso de desarrollo de un lenguaje de programación a través del diseño de AQ, comenzando desde cero hasta diseñar, desarrollar el compilador y la infraestructura relacionada, y finalmente completar la construcción de un lenguaje de programación.</br>

# Introducción a AQ

**AQ** es un **lenguaje de programación** "interpretado". Es "rápido", "pequeño", "simple" y "seguro". Además, los programas escritos en AQ también se pueden "compilar". El código fuente de `AQ` está disponible en `GitHub`, es de código abierto y sigue la `Licencia AQ`.

Dirección de GitHub: https://github.com/aq-org/AQ, donde puede obtener el código fuente de `AQ`.

## Características

- **Rápido** (compilación de `código fuente` y `velocidad de ejecución`)
- **Pequeño** (tamaño `código fuente`)
- **Simple** (fácil de aprender)
- **Seguro** (`gestión de memoria` y `verificaciones de código` seguras)
- **Multiplataforma** (compatible con `Windows`, `Linux` y `MacOS`, etc.)
- Sintaxis similar a C++ (rápida de entender)
- Interpretado (`compilación` opcional)
- Gratis (sigue la `Licencia AQ`)
- Código abierto (basado en "Licencia AQ")

#Diseño
## Plan original
AQ inicialmente comenzó a desarrollarse en octubre de 2023 y se reestructuró el 1 de febrero de 2024, con múltiples revisiones que conforman el marco actual.</br>

El plan original era implementar el compilador en C++ y luego desarrollar la máquina virtual. Sin embargo, dado que el compilador necesitaba traducirse al código de bytes de la máquina virtual y debido al tiempo prolongado de desarrollo del compilador, la versión original fue abandonada. pero se puede encontrar en las confirmaciones.</br>

## Nuevo plan
El nuevo plan es desarrollar primero la "máquina virtual AQ" y luego implementar el compilador por otros medios. Dado que está desarrollada en C, la "máquina virtual AQ" reduce la sobrecarga de rendimiento y obtiene un soporte más amplio. dividido en `intérprete`, `memoria`, `tiempo de ejecución` y `biblioteca del sistema operativo`.</br>

1. El "intérprete" es el motor de ejecución de la "máquina virtual AQ". Las funciones de ejecución de instrucciones de Bytecode se están desarrollando actualmente.</br>
2. La "memoria" es el almacenamiento de la "máquina virtual AQ". Por razones de eficiencia, la "máquina virtual AQ" se basa en una arquitectura de registro. Se agregará un mecanismo de recolección de basura en el futuro.</br>
3. El "tiempo de ejecución" es el entorno dependiente de la "máquina virtual AQ", incluido el manejo de errores, la salida estándar y otros componentes necesarios, lo que proporciona un entorno de ejecución básico para AQ.</br>
4. La `biblioteca del sistema operativo` es el componente necesario para que la `máquina virtual AQ` interactúe con el sistema operativo.</br>

Estas cuatro partes del diseño incluyen esencialmente la mayoría de los componentes de la máquina virtual de un lenguaje interpretado. A medida que la funcionalidad del lenguaje de programación continúa expandiéndose en el futuro, se pueden implementar actualizaciones agregando componentes.</br>


## Razones y ventajas
El lenguaje AQ está diseñado como un lenguaje interpretado para compatibilidad multiplataforma. En el futuro, un mayor trabajo de desarrollo del compilador para diferentes sistemas operativos puede hacer que el desarrollo sea más eficiente, lo que también reduce la pérdida de rendimiento.</br>

> Estamos trabajando arduamente en el desarrollo de la "máquina virtual AQ". Si desea obtener más información o participar en el trabajo de desarrollo, siga nuestro sitio web oficial: https://www.axa6.com y GitHub: https://github. .com/aq-org/AQ.</br>

> Este artículo está publicado bajo la licencia AQ: https://github.com/aq-org/AQ/blob/main/LICENSE Si es necesario, adáptelo o reimprima de acuerdo con la licencia AQ.