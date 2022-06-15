const express = require('express')
const cors = require('cors')
let app = express()

app.use(cors())

app.get('/', (req,res)=>{
    res.json({
        code: 200,
        msg: 'success',
        data: []
    })
})

app.get('/login', (req,res)=>{
    res.json({
        code: 200,
        msg: 'success',
        data: []
    })
})

app.listen(3000, ()=>{
    console.log('http://localhost:3000')
})