Function.prototype.customCall = function(context, ...args){
    const uid = Array.from(this.toString()).map(ch => ch.charCodeAt(0)*Math.random()).toString();
    if(context) context[uid] = this;
    else return () => this(...args);
    const result = context[uid](...args); 
    delete context[uid];
    return result;
}

Function.prototype.customBind = function(context, ...args){
    const uid = Array.from(this.toString()).map(ch => ch.charCodeAt(0)*Math.random()).toString();
    if(context) context[uid] = this;
    else return this.customCall(null, ...args);
    return () => context[uid].customCall(context, ...args)
}



