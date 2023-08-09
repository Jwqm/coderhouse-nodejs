const http = require('http');

const server = http.createServer((request, response) => {
    const now = new Date()
    const hour = now.getHours()

    let message = '';
    if (hour >= 6 && hour < 12) {
        message = "Buenos dias"
    } else if (hour >= 12 && hour < 20) {
        message = "Buenas Tardes"
    } else {
        message = "Buenas Noches"
    }

    response.writeHead(200, { "Content-Type": "text/plain" })
    response.end(message)
})

server.listen(8080, () => {
    console.log(`Listening on port ${server.address().port}`)
})