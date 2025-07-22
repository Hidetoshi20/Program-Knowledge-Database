# 3.7 TCP Congestion Control

TCP让每一个发送方所感知到的网络拥塞程度来限制其能向连接发送流量的速率。如果TCP发送方感知到路径上没什么拥塞，那么发送方会增加发送速率，反之降低发送速率。这种方法有三个问题：

1. TCP发送方如何限制
2. TCP发送方如何感知路径的拥塞情况
3. TCP发送方用何种算法限制速率

运行在发送方的TCP拥塞控制机制跟踪一个变量：拥塞窗口（cwnd）

*LastByteSent* − *LastByteAcked* <  = *min*{*cwnd*, *rwnd*}

假设TCP接收缓存足够大

TCP的丢包事件：超时或者收到来自接收方的3个冗余ACK

TCP收到确认来增加窗口的长度

### 1.慢启动

一条TCP开始时，cwnd值设备一个MSS的较小值，每当传输的报文段首次被确认就增加1个MSS，指数增长

如果存在由超时指示的丢包事件，TCP发送方将cwnd设为1并重新开始慢启动过程。并且第二个状态变量ssthresh（慢启动阈值）设为$\frac{cwnd}{2}$!

第二种方式：检测到拥塞时ssthresh置为，当到达或超过ssthresh的值时，结束慢启动，TCP转移到拥塞避免模式，更为谨慎地增加cwnd!

第三种：检测到3个冗余ACK，TCP执行一种快速重传并进入快速恢复状态

### 2.拥塞避免

此时距离拥塞并不遥远，每个RTT只将cwnd的值增加一个MSS，这能够用几种通用的方式完成，一种是每个ACK将cwnd增加$MSS * \frac{MSS}{CWND}$字节，此为线性增长，!

当超时时，TCP将cwnd的值设为1，将ssthresh的值记录为$\frac{cwnd}{2}$

当收到3个冗余的ACK，ssthresh设为$\frac{cwnd}{2}$，cwnd设置为ssthresh+3，接下来进入快速恢复状态!

### 3.快速恢复

如果继续收到冗余ACK，那么依旧增加MSS

如果有新的ACK，那么cwnd设为ssthresh，进入拥塞避免

如果出现超时事件，快速恢复在执行如同在慢启动和拥塞避免中相同的动作后，迁移到慢启动状态：丢包事件后，cwnd设置为1个MSS，ssthresh设为$\frac{cwnd}{2}$，cwnd设置为ssthresh+3

### TCP Tahoe

早期版本，不管是超时还是3个冗余ACK都将cwnd设为1，进入慢启动

现版本称为TCP Reno

### AIMD原则

加法增大，乘法减小