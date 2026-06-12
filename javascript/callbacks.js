function greet(name,callback){
    callback(name,34);
}

function greetHello(name,age){
    console.log(`Hello ${name} ,your age is ${age}`);
}

greet("Ram",greetHello);