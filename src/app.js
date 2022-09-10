const express = require('express')
require('dotenv').config()
const { default: mongoose } = require('mongoose')

const route = require('./routes/route')
const { bad } = require('./utility/response')

const port = process.env.PORT || 3030
const app = express()

app.use(express.json())

mongoose.connect(process.env.MONGODB)
    .then(_ => console.log('MONGO_DB IS CONNECTED!'))
    .catch(e => console.log(e.message))

app.use('/api/', route)
app.use('/**', (req, res) => {
    bad(res, 404, 'Opps, Something wents worng. There is response related to this path')
})

app.listen(port, (_) => {
    if (_) return console.log(_.message)
    return console.log('SERVER IS RUNNING ON PORT:', port)
})
