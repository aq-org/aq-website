---
publishDate: 2024-07-12T21:18:53+08:00
title: Comment écrire un langage de programmation à partir de zéro ? - AQ
excerpt: Comment écrire un langage de programmation à partir de zéro ? AQ est un langage de programmation interprété rapide, petit, simple et sûr.
image: https://www.axa6.com/aq.png
category: Blog
tags:
  - AQ
  - Blog
metadata:
  canonical: https://www.axa6.com/fr/how-to-write-a-programming-language-from-scratch
---

# Introduction
Comment concevoir un langage de programmation à partir de zéro ? Quelles parties un nouveau langage de programmation doit-il inclure ?</br>
Cet article détaillera le processus de développement d'un langage de programmation à travers la conception d'AQ, en partant de zéro jusqu'à la conception, le développement du compilateur et de l'infrastructure associée, pour finalement terminer la construction d'un langage de programmation.</br>

# Introduction à l'AQ

**AQ** est un **langage de programmation** « interprété ». Il est « rapide », « petit », « simple » et « sécurisé ». Les programmes écrits en AQ peuvent également être « compilés ». le code source de « AQ » est disponible sur « GitHub », open source, et suit la « Licence AQ ».

Adresse GitHub : https://github.com/aq-org/AQ, où vous pouvez obtenir le code source de `AQ`.

## Caractéristiques

- **Rapide** (compilation du `code source` et `vitesse d'exécution`)
- **Petit** (taille du « code source »)
- **Simple** (facile à apprendre)
- **Sécurisé** (gestion sécurisée de la mémoire et vérification du code)
- **Multiplateforme** (prend en charge `Windows`, `Linux` et `MacOS`, etc.)
- Syntaxe de type C++ (rapide à comprendre)
- Interprété (`compilation` facultative)
- Gratuit (suit la « Licence AQ »)
- Open source (basé sur la « Licence AQ »)

#Conception
## Plan d'origine
AQ a initialement commencé son développement en octobre 2023 et a subi une restructuration le 1er février 2024, avec de multiples révisions formant le cadre actuel.</br>

Le plan initial était d'implémenter le compilateur en C++, puis de développer la machine virtuelle. Cependant, comme le compilateur devait traduire le bytecode de la machine virtuelle et en raison du temps de développement prolongé du compilateur, la version originale a été abandonnée. mais peut être trouvé dans les commits.</br>

## Nouveau plan
Le nouveau plan consiste à développer d'abord la « machine virtuelle AQ », puis à implémenter le compilateur par d'autres moyens. Puisqu'elle est développée en C, la « machine virtuelle AQ » réduit les performances et bénéficie d'un support plus large. divisé en « interprète », « mémoire », « runtime » et « bibliothèque du système d'exploitation ».</br>

1. L'« interprète » est le moteur d'exécution de la « machine virtuelle AQ ». Les fonctions d'exécution des instructions de bytecode sont en cours de développement.</br>
2. La « mémoire » est le stockage de la « machine virtuelle AQ » Pour des raisons d'efficacité, la « machine virtuelle AQ » est basée sur une architecture de registre. Un mécanisme de récupération de place sera ajouté à l'avenir.</br>
3. Le « runtime » est l'environnement dépendant de la « machine virtuelle AQ », y compris la gestion des erreurs, la sortie standard et d'autres composants nécessaires, fournissant un environnement d'exécution de base pour AQ.</br>
4. La « bibliothèque du système d'exploitation » est le composant nécessaire pour que la « machine virtuelle AQ » interagisse avec le système d'exploitation.</br>

Ces quatre parties de la conception incluent essentiellement la plupart des composants de la machine virtuelle d'un langage interprété. À mesure que les fonctionnalités du langage de programmation continuent de s'étendre à l'avenir, des mises à niveau peuvent être mises en œuvre en ajoutant des composants.</br>


## Raisons et avantages
Le langage AQ est conçu comme un langage interprété pour une compatibilité multiplateforme. À l'avenir, des travaux de développement ultérieurs du compilateur pour différents systèmes d'exploitation peuvent rendre le développement plus efficace, tout en réduisant également les pertes de performances.

> Nous travaillons dur sur le développement de la « machine virtuelle AQ ». Si vous souhaitez en savoir plus ou participer aux travaux de développement, veuillez suivre notre site officiel : https://www.axa6.com et GitHub : https://github. .com/aq-org/AQ.</br>

> Cet article est publié sous la licence AQ : https://github.com/aq-org/AQ/blob/main/LICENSE Si nécessaire, veuillez adapter ou réimprimer selon la licence AQ.