// 用于分享
/* test 1 */
console.log("start");
setTimeout(() => {
  console.log("setTimeout");
}, 0);
// 只IE10实现了
// setImmediate(() => {
//   console.log("setTimeout");
// });
Promise.resolve()
  .then(() => {
    console.log("promise then 1");
  })
  .then(() => {
    console.log("promise then 2");
  });
console.log("end");
/* test 1 end */

//
//
//
//

/* 函数的调用栈 */
function A() {}
function B() {
  A();
}
function C() {
  B();
}
C();
/* 函数的调用栈 end */
