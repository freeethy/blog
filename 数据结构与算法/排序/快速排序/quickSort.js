var arr = [3, 6, 7, 1, 8, 86, 24, 9, 2, 5];

function quickSort(array, left, right) {
  let originLeft = left;
  let originRight = right;

  if (left <= right) {
    // 取第一个元素为基准
    let pivot = array[left];
    while (left !== right) {
      while (left < right && array[right] >= pivot) {
        right--;
      }

      array[left] = array[right];

      while (left < right && array[left] <= pivot) {
        left++;
      }

      array[right] = array[left];
    }
    // 基准点归位
    array[right] = pivot;
    quickSort(array, originLeft, left - 1);
    quickSort(array, right + 1, originRight);
  }
}

quickSort(arr, 0, arr.length - 1);
console.log(arr);
