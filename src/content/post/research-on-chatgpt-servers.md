---
publishDate: 2024-06-08T19:32:08+08:00
title: Research on ChatGPT Servers - AQ
excerpt: In today's development using ChatGPT, we discovered information related to ChatGPT servers. Next, we will introduce the relevant research on ChatGPT servers.
image: https://www.axa6.com/aq.png
category: Blog
tags:
  - AQ
  - Blog
  - AI
  - OpenAI
  - ChatGPT
  - GPT-4o
  - GPT
  - Coze
metadata:
  canonical: https://www.axa6.com/research-on-chatgpt-servers
---

# Introduction
In today's development using ChatGPT, we discovered information related to ChatGPT servers. Next, we will introduce the relevant research on ChatGPT servers.

# ChatGPT Information
## Test Location
Although we have an OpenAI account, due to financial and other constraints, we rarely or never use ChatGPT services on the official website. We have been using services from Microsoft, but after learning about ByteDance's Coze, we have adopted it as our long-term service. Because it allows free use of the GPT-4o model and has good third-party support, we believe it has an environment similar to ChatGPT.</br>

## Test Content
The test content includes network, CPU, files, and related content. It is still being improved.</br>

## CPU
According to the test, its CPU information is:
```
processor       : 0
vendor_id       : GenuineIntel
cpu family      : 6
model           : 106
model name      : Intel(R) Xeon(R) Platinum 8336C CPU @ 2.30GHz
stepping        : 6
microcode       : 0xd0003d1
cpu MHz         : 2978.209
cache size      : 55296 KB
physical id     : 0
siblings        : 64
core id         : 6
cpu cores       : 32
apicid          : 12
initial apicid  : 12
fpu             : yes
fpu_exception   : yes
cpuid level     : 27
wp              : yes
flags           : fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm constant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid dca sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l3 invpcid_single ssbd mba ibrs ibpb stibp ibrs_enhanced tpr_shadow vnmi flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid cqm rdt_a avx512f avx512dq rdseed adx smap avx512ifma clflushopt clwb intel_pt avx512cd sha_ni avx512bw avx512vl xsaveopt xsavec xgetbv1 xsaves cqm_llc cqm_occup_llc cqm_mbm_total cqm_mbm_local wbnoinvd dtherm ida arat pln pts hwp hwp_act_window hwp_epp hwp_pkg_req avx512vbmi umip pku ospke avx512_vbmi2 gfni vaes vpclmulqdq avx512_vnni avx512_bitalg tme avx512_vpopcntdq rdpid md_clear pconfig flush_l1d arch_capabilities
bugs            : spectre_v1 spectre_v2 spec_store_bypass swapgs
bogomips        : 4600.00
clflush size    : 64
cache_alignment : 64
address sizes   : 46 bits physical, 57 bits virtual
power management:
```
For unknown reasons, it seems to have not fully output. But it is basically reliable.</br>

At the same time, we also tested ChatGPT on the official OpenAI website:</br>
```
processor	: 0
vendor_id	: GenuineIntel
cpu family	: 6
model		: 106
model name	: unknown
stepping	: unknown
cpu MHz		: 2793.437
...
processor	: 1
vendor_id	: GenuineIntel
cpu family	: 6
model		: 106
model name	: unknown
stepping	: unknown
cpu MHz		: 2793.437
...
```

## Network
```
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
```
As for `ifconfig`：</br>
```
sh: 1: ifconfig: not found
```

## Operating System
```
Linux fed-dp-abaafbccd4-66ff457479-ll8cb 5.4.56.bsk.9-amd64 #5.4.56.bsk.9 SMP Debian 5.4.56.bsk.9 Wed Aug 25 03:42:38 UTC 20 x86_64 GNU/Linux
```

### GPU
We originally thought we could see relevant information, but unfortunately:</br>
```
sh: 1: lspci: not found
```
```
sh: 1: nvidia-smi: not found
```

## Memory
```
               total        used        free      shared  buff/cache   available
Mem:         2097152      468352     1152016         132      476784     1628800
Swap:              0           0           0
```
From here, it can be roughly seen that the system resources that ChatGPT can call are most likely from a virtual machine.

To be continued...

> We are working hard on developing the `AQ virtual machine`. We would appreciate it if you could give us a star on Github. If you want to learn more or participate in the development work, please follow our official website: https://www.axa6.com and GitHub: https://github.com/aq-org/AQ.</br>

> This article is published under the AQ License: https://github.com/aq-org/AQ/blob/main/LICENSE. If needed, please adapt or reprint according to the AQ License.