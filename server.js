require('dotenv').config()
const express = require('express')
const erroGlobal = require('./src/middleware/errorHanlder')
const userDataBase = require("./src/config/db")
const router = require('./src/routes/routes')
const app = express()
const helmet = require('helmet')
app.use(express.json())
app.use(helmet())

//base de dados
userDataBase()



app.use('/api',router)



app.use(erroGlobal)
app.listen(process.env.PORT,()=>{
    console.log('runing at port ',process.env.PORT)
})