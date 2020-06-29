let p = new Promise((resolve, reject) => {
    setTimeout(() => resolve(0), 2000);
})


let p1 = new Promise((resolve, reject) => {
    setTimeout(() => resolve(1), 1000);
})

let p3 = new Promise((resolve, reject) => {
    setTimeout(() => reject(2), 100);
})


function race(arr) {
    return new Promise((resolve, reject) => {
        arr.forEach(el => el.then(resolve).catch(reject));
    })
}

let arr = [p, p1, p3];

race(arr).then(console.log).catch(console.log);