var fs = require("fs");

function readFile(filename) {
  return new Promise(function(resolve, reject) {
    fs.readFile(filename, "utf8", function(err, data) {
      err ? reject(err) : resolve(data);
    });
  });
}

function* gen() {
  let a = yield readFile("./1.txt");
  let b = yield readFile("./1.txt");
  return "a" + a + "b" + b;
}

// let it = gen();

// let r1 = it.next("test");
// console.log(r1);

// r1.value.then(
//   function(data) {
//     console.log(data);
//   },
//   function(err) {
//     console.log(err);
//   }
// );

function co(gen) {
  let it = gen();
  return new Promise(function(resolve, reject) {
    let next = function(lastValue) {
      let { value, done } = it.next(lastValue);
      if (done) {
        resolve(value);
      } else {
        value.then(next, function(err) {
          reject(err);
        });
      }
    };

    next();
  });
}

// co(gen).then(
//   function(data) {
//     console.log(data);
//   },
//   function(err) {
//     console.log(err);
//   }
// );

async function readFileAsync(filename) {
  let a = await readFile(filename);
  return a;
}

let r = readFileAsync("./1.txt");
r.then(data => console.log(data, "data"));
