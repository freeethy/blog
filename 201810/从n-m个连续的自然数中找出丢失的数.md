# 从 n-m 个连续的自然数中找出丢失的数 x(n<x<m)

看到一个题目： 从 n-m 个连续的自然数中找出丢失的数 x(n < x < m)

```javascript
var arr = [3, 5, 6, 2, 1];
find(arr); // 4
```

第一次看到题目时，想法比较简单

```javascript
// 先把数组排序，然后遍历时，后一项减前一项不为 1 ，则前一项加 1 即为丢失的数
// 但是这样时间复杂度比较高，排序时遍历，后面还需遍历一遍
var arr = [3, 5, 6, 2, 1];
arr.sort((a, b) => a - b);
for (let i = 0; i < arr.length - 1; i++) {
  if (arr[i + 1] - arr[i] != 1) {
    return arr[i] + 1;
  }
}
```

今天午休时突然想到下面的方法，只需要遍历一遍，记录一下啦

```javascript
var arr = [3, 5, 6, 2, 1]; // 丢失的数为4
function find(arr) {
  let len = arr.length;
  let sum = 0;
  let min = arr[0];
  let max = 0;

  // 找出最大最小的数，以及所有数的和
  for (let i = 0; i < len; i++) {
    sum += arr[i];
    if (arr[i] < min) {
      min = arr[i];
    }
    if (arr[i] > max) {
      max = arr[i];
    }
  }

  // 求出没丢数之前序列的和
  let osum = ((min + max) * (max - min + 1)) / 2;

  // 没丢之前的和 -丢掉一个数的和 = 丢掉的数
  return osum - sum;
}
console.log(find(arr)); // 4
```
