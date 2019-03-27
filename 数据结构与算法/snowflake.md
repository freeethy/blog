# snowflake

SnowFlake 算法生成 id 的结果是一个 64bit 大小的整数

- 所有生成的 id 按时间趋势递增
- 整个分布式系统内不会产生重复 id（因为有 datacenterId 和 workerId 来做区分）

## code

```js
import bigInt from "big-integer";

class SnowFlake {
  constructor(workerId, dataCenterId, sequence) {
    this.workerId = workerId;
    this.dataCenterId = dataCenterId;
    this.sequence = sequence;
    // 1970-1-1
    this.twepoch = 1288834974657;
    this.workerIdBits = 5;
    this.dataCenterIdBits = 5;
    this.maxWorkerId = -1 ^ (-1 << this.workerIdBits);
    this.maxDataCenterId = -1 ^ (-1 << this.dataCenterIdBits);
    this.sequenceBits = 12;
    this.workerIdShift = this.sequenceBits; // 值为：12
    this.dataCenterIdShift = this.sequenceBits + this.workerIdBits; // 值为：17
    this.timestampLeftShift =
      this.sequenceBits + this.workerIdBits + this.dataCenterIdBits; // 值为：22
    this.sequenceMask = -1 ^ (-1 << this.sequenceBits); // 值为：4095
    this.lastTimestamp = -1;

    if (this.workerId > this.maxWorkerId || this.workerId < 0) {
      throw new Error(
        `worker Id can't be greater than ${maxWorkerId} or less than 0`
      );
    }
    if (dataCenterId > this.maxDatacenterId || dataCenterId < 0) {
      throw new Error(
        `datacenter Id can't be greater than ${
          this.maxDatacenterId
        } or less than 0`
      );
    }
  }

  getWorkerId() {
    return this.workerId;
  }

  getDataCenterId() {
    return this.dataCenterId;
  }

  timeGen() {
    return Date.now();
  }

  tilNextMillis(lastTimestamp) {
    let timestamp = this.timeGen();
    while (timestamp <= lastTimestamp) {
      timestamp = this.timeGen();
    }

    return timestamp;
  }

  nextId() {
    let timestamp = this.timeGen();

    if (timestamp < this.lastTimestamp) {
      throw new Error(
        "Clock moved backwards. Refusing to generate id for " +
          (this.lastTimestamp - timestamp)
      );
    }

    if (this.lastTimestamp === timestamp) {
      this.sequence = (this.sequence + 1) & this.sequenceMask;
      if (this.sequence === 0) {
        timestamp = this.tilNextMillis(this.lastTimestamp);
      }
    } else {
      this.sequence = 0;
    }

    this.lastTimestamp = timestamp;

    let shiftNum =
      (this.dataCenterId << this.dataCenterIdShift) |
      (this.workerId << this.workerIdShift) |
      this.sequence;

    let nfirst = new bigInt(String(timestamp - this.twepoch), 10);
    nfirst = nfirst.shiftLeft(this.timestampLeftShift);

    let nnextId = nfirst.or(new bigInt(String(shiftNum), 10)).valueOf();
    return nnextId;

    // return (
    //   ((timestamp - twepoch) << timestampLeftShift) |
    //   (datacenterId << datacenterIdShift) |
    //   (workerId << workerIdShift) |
    //   sequence
    // );
  }
}

let snowFlake;

export function createSnowFlake(workerId = 1, dataCenterId = 1, sequence = 1) {
  if (!snowFlake) {
    snowFlake = new SnowFlake(workerId, dataCenterId, sequence);
  }

  return snowFlake;
}

export default SnowFlake;
```

## 参考

- (理解分布式 id 生成算法 SnowFlake)[https://segmentfault.com/a/1190000011282426?utm_source=tag-newest]()
- (Snowflake(雪花算法)的 JavaScript 实现)[https://www.cnblogs.com/du-blog/p/9250660.html]
