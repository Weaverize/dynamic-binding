const bind = require('./bind');

var A = {
	a : ""
};

var B = {
	b : undefined	
};

var C = {};

console.log(A, B);

console.log('A = bind(A, "a", B, "b")')
bind(A, "a", B, "b");
console.log(A, B);

console.log('A.a = "coucou";')
A.a = "coucou";
console.log(A, B);
//*
console.log('B = bind(B, "b", A, "a")');
B = bind(B, "b", A, "a");
console.log('B.b = "bonjour"')
B.b = "bonjour";
console.log(A, B);

console.log('A.a = "le"')
A.a = "le";
console.log(A, B, C);

console.log('A = bind(A, "b", C, "c")');
A = bind(A, "b", C, "c");
console.log('A.a = "monde"');
A.a = "monde";
console.log('A.b = "hello"')
A.b = "hello";
console.log(A, B, C);

console.log('C.c = "rien"')
C.c = "rien";
console.log(A, B, C);

delete A.a;

console.log(A, B, C);

B.b = "ping !";

console.log(A, B, C);
//*/