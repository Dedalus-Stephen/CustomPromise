const fetch = require("node-fetch");

function PromiseAll(arr) {
    if (arr.length === 0) return Promise.resolve(arr);
    if (
        typeof arr == null ||
        typeof arr == 'undefined' ||
        typeof arr[Symbol.iterator] !== 'function'
    ) throw new Error("Passed argument exception");

    // it's possible to promisify the input but it will affect the time complexity
    // arr = arr.map(el => Promise.resolve(el));

    return new Promise((resolve, reject) => {
        const res = [];
        arr.forEach(x => {
            try { // <- to handle unexpected corner cases
                if (x && typeof x.then === 'function') { //check if promise
                    x.then(x => {
                        res.push(x);
                        if (res.length == arr.length) resolve(res);
                    }).catch(e => reject(e));
                } else {
                    res.push(x);
                    if (res.length == arr.length) resolve(res);
                }
            } catch (e) {
                reject(e);
            }
        })
    })
}











/*
******************

TEST CASES

******************
*/
// let p1 = new Promise((resolve, reject) => {
//     setTimeout(() => resolve(1), 2000);
// })

// let p2 = new Promise((resolve, reject) => {
//     setTimeout(() => resolve(2), 2000);
// })

// let p3 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         reject("error")
//     }, 2000);
// })

// let p4 = new Promise((resolve, reject) => {
//     fetch('https://jsonplaceholder.typicode.com/todos/1')
//         .then(response => resolve(response.json()))
// })

// let p4_1 = new Promise((resolve, reject) => {
//     fetch('https://jsonplaceholder.typicode.com/todos/1')
//         .then(response => reject("no"))
// })

// let p10 = new Promise((resolve, reject) => {
//     resolve("")
// })

// let p12 = new Promise((resolve, reject) => {
//     reject("rejected")
// })

//standart function processes such values like null, undefined, etc.
// let t5 = undefined;
// let t6 = null;
// let t7 = 'string';
// let t8 = false;
// let t9 = () => null;
// let t11 = new Error("e");

// Promise.all([p12]).catch(console.log).then(console.log)
// PromiseAll([p12]).catch(console.log).then(console.log);

// let mix = [t6, p12]
// Promise.all(mix).then(console.log).catch(console.log);
// PromiseAll(mix).then(console.log).catch(console.log);

// let allButOne = [p12, p1, p2, p4, t5, t6, t7, t9(), t11];
// Promise.all(allButOne).then(console.log).catch(console.log);
// PromiseAll(allButOne).then(console.log).catch(console.log);

// let mix1 = [p10, t11, 3];

// Promise.all(mix1).then(console.log).catch(console.log);
// PromiseAll(mix1).then(console.log).catch(console.log);

// let errArr = [new Error()];

// Promise.all(errArr).then(console.log).catch(console.log);
// PromiseAll(errArr).then(console.log).catch(console.log);

// let allResolveCases = [p1, p2, p4, t5, t6, t7, t8, t9(), t11];
// Promise.all(allResolveCases).then(console.log)
// PromiseAll(allResolveCases).then(console.log);





