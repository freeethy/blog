const MyPromise = require("./promise");
new MyPromise(function(resolve, reject) {
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
    console.log(data);
  },
  err => {
    console.log(err);
  }
);
