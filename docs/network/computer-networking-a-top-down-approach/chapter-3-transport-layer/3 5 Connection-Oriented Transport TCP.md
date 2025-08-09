# 3.5 Connection-Oriented Transport: TCP

## 3.5.1 TCP连接

被称为面向连接的，这是因为在一个应用进程可以开始想另一个应用进程发送数据之前，这两个进程必须先相互握手

TCP连接总是点对点，多播对于TCP来说是不可能的

三次握手

- TCP可从缓存中取出并放入报文段的数据量受限于最大报文段长度（MSS）
- MSS通常根据本地发送主机发送的最大链路层帧长度（最大传输单元（MTU））来确定
- MSS只是报文段里的应用层数据，而不包括首部的TCP报文段

## 3.5.2 TCP报文段结构

- 序号与确认号：被TCP发送发和接收方用来实现可靠数据传输
- 接受窗口：流量控制
- 首部长度：指示了以32bit的字为单位的TCP首部长度，由于TCP选项字段的原因，TCP首部的长度是可变的（通常，选项字段为空，所以TCP首部的典型长度20字节）
- 选项字段(可选与变长的)：用于发送方与接收方协商 MSS(最大报文段长)，或在高速网络环境下用作窗口调节因子。
- 标志字段
    - ACK：指示确认字段中的值是有效的
    - RST,SYN,FIN：连接建立与拆除
    - PSH：指示接收方应立即将数据交给上层
    - URG：报文段中存在着(被发送方的上层实体置位)“紧急”的数据

![](https://www.notion.soComputer%20Networking%20A%20Top-Down%20Approach.assets/image-20230307111555570.png)

## 3.5.3 往返时间的估计与超时

超时时间间隔应该大于该连接的往返时间（RTT）

### 1.估计往返时间

- 

报文段的样本RTT（SampleRTT）是从某报文段被发出到该报文段的确认被收到的时间量。大多数TCP的时间仅在某一时刻做一次SampleRTT测量，而不是为每个发送的报文段测量。TCP不为已被重传的报文段测量，只为传输一次的报文段测量。

- 指数加权移动平均（Exponential Weighted Moving Average, EWMA）
- 报文段的SampleRTT会一直波动，对SampleRTT采用取平均的方法，TCP维持一个SampleERTT均值（EstimatedRTT），获得一个新的SampleRTT时
    - *EstimatedRTT* = (1 − *α*) ∗ *EstimatedRTT* + *α* ∗ *SampleRTT*
    - α推荐值是 0.125，即新的SampleRTT权值为 1/8 。
- 测量RTT的变化也是有价值的，RTT偏差：DevRTT。用于估算SampleRTT一般会偏离EsimatedRTT的程度
    - *DevRTT* = (1 − *β*) ∗ *DevRTT* + *β* ∗ |*SampleRTT* − *EstimatedRTT*|
    - β推荐值0.25

### 2.设置和管理重传超时间隔

- *Timeoutinterval* = *EstinMrtedRTT* + 4 • *DevRTT*
- 推荐的初始值TimeoutInterval值1s，出现超时后，将会加倍

## 3.5.4 可靠数据传输

对于IP服务，数据报可能移除路由器缓存从而丢失，也可能乱序到达，也可能损坏。

TCP使用单一定时器，对于多个已发送还未被确认的报文段。

简化的TCP发送方

/*假设发送方不受TCP流量和拥塞控制的限制，来自上层数据的长度小于MSS,且数据传送只在一个方向进行。*/

```
NextSeqNum=InitialSeqNumber
SendBase=InitialSeqNumber
loop （永远） {
   switch （事件）
       事件:从上面应用程序接收到数据e
           生成具有序号NextSeqNum的TCP报文段
           if （定时器当前没有运行）
               启动定时器
      向IP传递报文段
      NextSeqNum=NextSeqNum+length（data）
      break;
       事件：定时器超时
           重传具有最小序号但仍未应答的报文段
           启动定时器
           break;
       事件：收到ACK,具有ACK字段值y
           if （y > SendBase）{
               SendBase=y
                   if （当前仍无任何应答报文段）{
                       启动定时器
                   }
           }
           break;
} /*结束永远循环*/
```

### 1 一些有趣的情况

### 2 超时间隔加倍

### 3 快速重传

- 超时周期相对较长时，增加了端到端时延。发送方可以在超时事件发生之前通过注意冗余ACK来检测丢包情况。

## 3.5.5 流量控制

- TCP的流量控制服务：速度匹配服务
- 拥塞控制：因为IP网络的拥塞而被遏制,发送方维护一个接收窗口的变量来流量控制
- 接收方有接受缓存：RcvBuffer
- LastByteRead:主机B上的应用进程从缓存读出的数据流的最后一个字节的编号。
- LastByteRcvd:从网络中到达的并且已放入主机B接收缓存中的数据流的最后一个字节的编号。
- TCP不允许已分配的缓存溢出，所以
- LastByteRcvd - LastByteRead≤RcvBuffer
- 接收窗口用rwnd表示，根据缓存可用空间的数量来设置，是动态的
- rwnd = RcvBuffer - [ LastByteRcvd - LastByteRead ]
- 接收端将变量rwnd放入发送A的报文段中
- LastByteSent 一 LastByteAcked≤rwnd
- 同时，rwnd为0时，发送方继续发送只有一个字节数据的报文段，这些报文段被接收方确认，缓存清空，返回的确认报文里包含一个非0的rwnd