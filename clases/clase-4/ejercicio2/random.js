let obj = {
}

for (let i = 0; i < 10000; i++) {
    const randomNumber = Math.round(Math.random() * 20)
    if (obj[randomNumber]) {
        obj[randomNumber] += 1
    } else {
        obj[randomNumber] = 1
    }
}
console.table('Generacion de tabla random:', obj)