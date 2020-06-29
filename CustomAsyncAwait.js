Promise.delay = function(ms, value){
    return new Promise((resolve, reject) => {
        if(value && typeof value.then === 'function'){
            value.catch(e => reject(e)).then(res => setTimeout(resolve.bind(this, res), ms));
        } else setTimeout(resolve.bind(this, value), ms)
    })
}

Promise.coroutine = function(generator){
    if(generator.constructor.name !== 'GeneratorFunction') throw new Error("Wrong argument");
    const itr = generator();

    function rec(v) {
        const res = itr.next(v);
        if (res.done) return res.value;
        else new Promise((resolve) => resolve(res.value)).then(x => rec(x));
    }
    return rec();
}

let p1 = new Promise((resolve, reject) => {
    setTimeout(() => resolve("Hello, "), 1000)
})


let p2 = (value) => new Promise((resolve, reject) => {
    setTimeout(() => resolve(value + "world!"), 5000)
})

/*
1) const itr = generator() => instance of Generator Object is being created 

2) return rec() => recursive function is called

note: it seems to be it's impossible to this iteratively since every iterative approach i tried resulted in heap space overflow.
      because the promise is pushed out of the synchronous code

3) const res = itr.next(v) => at first call with undefined argument iterator is being adjusted to the first yield expression
   yield evaluates, returns an instance whose value is set to a pending promise.

   note: as i understand from the engine's POV it looks like this:
   yield args[0]
   next(argument)
   let res = ...

4) if the returned object's value's done property is true returns the promise

5) else synchronously calls itself passing the obtained value.
   the generator function execution has been halted at the moment of assignment, so
   .next() passes the value to the waiting variable

   res === "Hello, " after the first yield expression execution

6) -> step 3

*/
function* gen(args) {
    let res = yield args[0]
    
    res = yield args[1](res)

    console.log(res)
}

let arr = [p1, p2];

Promise.coroutine(gen.bind(this, arr));