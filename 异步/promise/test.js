const MyPromise = require("./promise");
let p = new MyPromise(function(resolve, reject) {
  setTimeout(() => {
    var p1 = new MyPromise(function(resolve, reject) {
      setTimeout(function() {
        resolve("ok");
      }, 2000);
    });
    if (Math.random() > 0) {
      resolve(p1);
    } else {
      reject("This is reject!");
    }
  }, 1000);
})
  .then(
    function(data) {
      return new Promise(function(resolve, reject) {
        resolve(data);
      });
    },
    err => {
      console.log(err);
    }
  )
  .then(
    data => {
      console.log(data);
    },
    err => {
      console.log(err);
    }
  );
