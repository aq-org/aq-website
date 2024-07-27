AQ虚拟机的日志输出

简介
日志输出是调试程序的重要手段之一，同时是判断程序运行状态的重要方法之一。许多程序都会采用printf函数直接进行输出。但在项目体积增大后将会难以进行检查和修正。为解决这个问题，AQ虚拟机特意设计了专门的日志输出函数，确保日志的规范和统一。

设计思路
AQ虚拟机的日志输出函数的设计参考了常见的日志格式。为保证可读性和存储效率，AQ虚拟机采取了JSON格式。同时在日志的内容上，AQ虚拟机统一规范了以下作为标准输出内容：

1. 时间 - 自动生成，用于指示事件发生的时间
2. 日志类型 - 用于指示事件的级别，一般情况分为三类"ERROR"、"WARNING"、"INFO"。
3. 日志代码 - 用于简介地获取事件发生的位置和内容。
4. 日志信息 - 详细地记录事件发生的内容。
5. Errno信息 - 自动生成，用于记录系统错误信息。包含errno码和对应的信息。
6. 其它信息 - 补充相关信息（如：系统信息，内存信息等）。

其中的时间、Errno信息由日志输出函数自动生成，减少了重复代码。其余内容均由传入参数指定。因此在日志输出时可以保证内容的一致性，更加容易定位和发现问题。

参考了目前流行的日志输出方式，目前AQ虚拟机采取屏幕输出（控制台输出）和文件输出（日志文件输出）两种方式。屏幕输出用于快速地展现日志信息，文件输出用于长期存储日志信息。

在这些内容中，对于参数的输入来说，因为使用JSON格式，因此一般情况下字符串需要加上引号（如："ERROR"），而数字、布尔值等则不需要或根据对应规则传入参数。

同时，在正式的生产环境中，要对这个日志输出函数进行修改，以帮助用户更好地了解错误和相关信息。

详细标准
目前的日志输出函数在/aqvm/base中。

logging.h

AqvmBase_OutputLog
输出包含 |type|、|code|、|message|、|other_info|、time、errno 等信息的日志，打印到控制台或其他设备，并写入日志文件。无返回值。
|type|、|code|和|message|是必需的，一般不应该设置为空。但如果不需要，|other_info| 可以设置为 NULL。一般来说，|type| 应为 "ERROR"、"WARNING"或 "INFO"。|code| 应该是一个完整的函数名加上简明的错误描述，用下划线分隔（例如，AqvmBase_OutputLog_TestInfo）。|message| 应该是详细准确的描述。另一方面，|other_info| 应该是当前日志的附加信息（如系统信息）。
注意：如果需要使用该函数，请使用 json 格式。输出为 json 格式。例如，AqvmBase_OutputLog("\"type\"", "\"code\"", "\"message\"", "\"other_info\"")；

```C
void AqvmBase_OutputLog(const char* type, const char* code,
                                   const char* message,
                                   const char* other_info) {
  if (type == NULL) {
    type = "NULL";
  }
  if (code == NULL) {
    code = "NULL";
  }
  if (message == NULL) {
    message = "NULL";
  }
  if (other_info == NULL) {
    other_info = "NULL";
  }

  char time_str[28];
  time_t current_time = time(NULL);
  strftime(time_str, 28, "\"%Y-%m-%dT%H:%M:%S%z\"", localtime(&current_time));

  fprintf(stderr,
          "{\"Time\":%s,\"Type\":%s,\"Code\":%s,\"Message\":%s,\"ErrnoInfo\":{"
          "\"Errno\":%d,\"Message\":\"%s\"},\"OtherInfo\":%s}\n",
          time_str, type, code, message, errno, strerror(errno), other_info);

  FILE* log_ptr = fopen(".aqvm_debug_report.log", "a");
  if (log_ptr == NULL) {
    fprintf(
        stderr,
        "{\"Time\":%s,\"Type\":%s,\"Code\":%s,\"Message\":%s,\"ErrnoInfo\":{"
        "\"Errno\":%d,\"Message\":\"%s\"},\"OtherInfo\":%s}\n",
        time_str, "ERROR", "AqvmBase_OutputLog_OutputToFileError",
        "Failed to open log file", errno, strerror(errno), "NULL");
    return;
  }
  fprintf(log_ptr,
          "{\"Time\":%s,\"Type\":%s,\"Code\":%s,\"Message\":%s,\"ErrnoInfo\":{"
          "\"Errno\":%d,\"Message\":\"%s\"},\"OtherInfo\":%s}\n",
          time_str, type, code, message, errno, strerror(errno), other_info);
  fclose(log_ptr);
}
```

完整代码

```C
// Copyright 2024 AQ author, All Rights Reserved.
// This program is licensed under the AQ License. You can find the AQ license in
// the root directory.

#ifndef AQ_AQVM_RUNTIME_DEBUGGER_DEBUGGER_H_
#define AQ_AQVM_RUNTIME_DEBUGGER_DEBUGGER_H_

#include <stdint.h>

// Outputs log with |type|, |code|, |message|, |other_info|, time, errno and so
// on to printing to the console or other devices and writing to a log file. No
// return.
// |type|, |code|, and |message| are necessary and shouldn't be set to NULL in
// common. But |other_info| can be set to NULL if it is not needed. In general,
// |type| should be "ERROR", "WARNING" or "INFO". |code| should be a full
// function name plus a concise description of the error, separated by
// underscores (e.g., AqvmBase_OutputLog_TestInfo). |message|
// should be a detailed and accurate description. |other_info| on the other hand
// should be an additional information to the current log (e.g. system
// information).
// NOTICE: If you need to use the function, please use json format. The output
// is json format. For example, AqvmBase_OutputLog("\"type\"",
// "\"code\"", "\"message\"", "\"other_info\"");
void AqvmBase_OutputLog(const char* type, const char* code,
                                   const char* message, const char* other_info);

#endif
```

logging.c
完整代码

```C
// Copyright 2024 AQ author, All Rights Reserved.
// This program is licensed under the AQ License. You can find the AQ license in
// the root directory.

#include "aqvm/base/logging.h"

#include <errno.h>
#include <stdint.h>
#include <stdio.h>
#include <string.h>
#include <time.h>

void AqvmBase_OutputLog(const char* type, const char* code,
                                   const char* message,
                                   const char* other_info) {
  if (type == NULL) {
    type = "NULL";
  }
  if (code == NULL) {
    code = "NULL";
  }
  if (message == NULL) {
    message = "NULL";
  }
  if (other_info == NULL) {
    other_info = "NULL";
  }

  char time_str[28];
  time_t current_time = time(NULL);
  strftime(time_str, 28, "\"%Y-%m-%dT%H:%M:%S%z\"", localtime(&current_time));

  fprintf(stderr,
          "{\"Time\":%s,\"Type\":%s,\"Code\":%s,\"Message\":%s,\"ErrnoInfo\":{"
          "\"Errno\":%d,\"Message\":\"%s\"},\"OtherInfo\":%s}\n",
          time_str, type, code, message, errno, strerror(errno), other_info);

  FILE* log_ptr = fopen(".aqvm_debug_report.log", "a");
  if (log_ptr == NULL) {
    fprintf(
        stderr,
        "{\"Time\":%s,\"Type\":%s,\"Code\":%s,\"Message\":%s,\"ErrnoInfo\":{"
        "\"Errno\":%d,\"Message\":\"%s\"},\"OtherInfo\":%s}\n",
        time_str, "ERROR", "AqvmBase_OutputLog_OutputToFileError",
        "Failed to open log file", errno, strerror(errno), "NULL");
    return;
  }
  fprintf(log_ptr,
          "{\"Time\":%s,\"Type\":%s,\"Code\":%s,\"Message\":%s,\"ErrnoInfo\":{"
          "\"Errno\":%d,\"Message\":\"%s\"},\"OtherInfo\":%s}\n",
          time_str, type, code, message, errno, strerror(errno), other_info);
  fclose(log_ptr);
}
```

> 我们正在更加努力地开发`AQ虚拟机`。如果您想了解更多信息或参与开发工作，请关注我们的官网：https://www.axa6.com 和 Github：https://github.com/aq-org/AQ。</br>

> 本文章基于AQ License：https://github.com/aq-org/AQ/blob/main/LICENSE 发布，如有需要，请根据AQ License进行改编或转载。