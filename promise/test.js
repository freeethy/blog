const MyPromise = require("./promise");
let p1 = new MyPromise(function(resolve, reject) {
  setTimeout(() => {
    var p1 = new Promise(function(resolve, reject) {
      setTimeout(function() {
        resolve("ok");
      }, 2000);
    });
    if (Math.random() > 0.5) {
      resolve(p1);
    } else {
      reject("This is reject!");
    }
  }, 1000);
}).then(
  function(data) {
    return new MyPromise(function(resolve, reject) {
      console.log(data);
      resolve(1);
    });
  },
  err => {
    console.log(err);
  }
);
