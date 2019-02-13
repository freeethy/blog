var arr = [3, 6, 7, 1, 8, 86, 24, 9, 2, 5];

function bubbleSort(array) {
  for (let i = 0; i < array.length; i++) {
    for (let j = array.length - 1; j >= i; j--) {
      if (array[j] < array[j - 1]) {
        [array[j], array[j - 1]] = [array[j - 1], array[j]];
      }
    }
  }
}
bubbleSort(arr);
console.log(arr);
