
//promises have one of these states which regulate the behavior
const states = {
    "0": "pending",
    "1": "fulfilled",
    "2": "rejected"
}

//probably the native function uses function-constructor instead of class but why not
class CustomPromise {
    constructor(executor) {

        //set initial state to PENDING
        this.state = states[0];

        this.val = undefined;

        this.reason = undefined;

        //this array is needed to keep the track of waiting promises on the then-catch chain in FIFO order
        //probably other structures like LinkedList will also fit, but i find this approach easiest
        this.orderQueue = [];

        /*
            This is tricky and took me while to get my head around it.

            Suppose passing to a standart promise a synchronous callback, e.g. function that adds two numbers
            and calling a simple log after the promise declaration:

            new Promise((resolve, reject) => {resolve(1 + 2)}).then(console.log)

            console.log("something")

            In spite of being a synchronous code the promise execution will be async. delayed and "something" will be printed before.

            This happens because accd. to A+ spec:

            <<onFulfilled or onRejected must not be called until the execution context stack contains only platform code>>.

            So the Standart tells us to implement the passed callback's function asynchronously, i.e. to push into the API container =>
            where it will be executed => send to Message Queue => where it will wait till the Event Loop does a cycle, i.e. waits
            execution stuck to become empty.

        */
        setTimeout(() => {
            try {
                executor(this.onFulfilled.bind(this), this.onRejected.bind(this));
            } catch (e) {

            }
        }, 10);
    }

    //binded to /this/ Object Variable
    onFulfilled(val) {
        //once settled can't go back
        if (this.state = states[0]) {
            this.state = states[1];
            this.val = val;
            //notify waiting promises about success
            this.backtrackTheChain();
        }
    }

    //binded to /this/ Object Variable
    onRejected(r) {
        //once settled can't go back
        if (this.state === states[0]) {
            this.state = states[2];
            this.reason = r;
            //notify waiting promises about reject
            this.backtrackTheChainR();
        }
    }

    //this method using the queue declared above makes sure to notify all the waiting chained promises that a value is ready
    backtrackTheChain() {
        this.orderQueue.forEach(([waitingPromise, successCallback]) => {
            //if the passed arg is not a function simply return the observed value w.out executing
            if (typeof successCallback !== 'function') return waitingPromise.onFulfilled(this.val);
            const res = successCallback(this.val);
            if (res && res.then === 'function') { //check if promise
                res.then(val => waitingPromise.onFulfilled(val), val => waitingPromise.onRejected(val));
            } else {
                waitingPromise.onFulfilled(res);
            }
        })
        this.orderQueue = [];
    }

    backtrackTheChainR() {
        this.orderQueue.forEach(([waitingPromise, successCallback, failCallback]) => {
            if (typeof failCallback !== 'function') return waitingPromise.onRejected(this.reason);
            const res = failCallback(this.reason);
            if (res && res.then === 'function') {
                res.then(val => waitingPromise.onFulfilled(val), reason => waitingPromise.onRejected(reason));
            } else {
                waitingPromise.onFulfilled(res)
            }
        })
        this.orderQueue = [];
    }

    //the producer appoach is choosen to spare the implementation from the repeated code
    producer(successCallback, failCallback) {
        const waitingPromise = new CustomPromise();
        //queue promises are based on their closures 
        this.orderQueue.push([waitingPromise, successCallback, failCallback]);
        // console.log(this.orderQueue.length); //delete this

        if (this.state === states[1]) {
            this.backtrackTheChain();
        } else if (this._state === states[2]) {
            this.backtrackTheChainR();
        }

        return waitingPromise;
    }

    then(successCallback, failCallback) {
        return this.producer(successCallback, failCallback)
    }

    catch(failCallback) {
        return this.producer(undefined, failCallback);
    }
}
