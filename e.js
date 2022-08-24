const fs = require('fs')
const os = require('os')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const IsOk = require('status-is-ok')
const app = express()
const port = 8000

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html')
})

app.get('/list', function(req, res) {
    let vidList = fs.readdirSync('./vids')
    res.json(vidList)
})

app.get('/vid-0', function (req, res) {
    const range = req.headers.range
    if (!range) {
        res.status(400).send('Requires Range header')
    }
    const videoPath = 'vids/202 - Identifying a Body.mp4'
    const videoSize = fs.statSync(videoPath).size
    const CHUNK_SIZE = 10 ** 6
    const start = Number(range.replace(/\D/g, ''))
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1)
    const contentLength = end - start + 1
    const headers = {
        'Content-Range': `bytes ${start}-${end}/${videoSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': contentLength,
        'Content-Type': 'video/mp4',
    }
    res.writeHead(206, headers)
    const videoStream = fs.createReadStream(videoPath, { start, end })
    videoStream.pipe(res)
})

app.post('/src-change', function(req, res) {
    console.log(req.body)

})

function ipCheck() {
    const interfaces = os.networkInterfaces()
    let addresses = []
    for (var k in interfaces) {
        for (var k2 in interfaces[k]) {
            var address = interfaces[k][k2]
            if (address.family === 'IPv4' && !address.internal) {
                addresses.push(address.address)
            }
        }
    }
    return addresses
    }

app.listen(port, function () {
    let ipArr = ipCheck()
    console.log(ipArr)

    if(ipArr.length > 1){
        for(const i of ipArr){
            const isUrlOk = new IsOk()
            isUrlOk.check(`http://${i}:${port}`)
            .then((data) => {
                console.log(`http://${i}:${port}`)
                console.log('status: ' + data.status + '\n')
            })
            .catch((err)=> {
                console.log(err)
            })
        }
    }
    else{
        console.log(`${ipCheck()[0]}:${port}`)
    }
    console.log(`\nhttp://localhost:${port}\n`)
})
