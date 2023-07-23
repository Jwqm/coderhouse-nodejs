const prueba = undefined;
const variableAsignada = prueba || 'sin valor'
const nullish = prueba ?? 'sin valor'
console.log(variableAsignada);
console.log(nullish);

const test1 = 0;
const test2 = prueba || 'sin valor'
const test3 = prueba ?? 'sin valor'
console.log(test2);
console.log(test3);