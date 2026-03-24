require('dotenv').config()
const express = require('express')
const erroGlobal = require('./src/middleware/errorHanlder')
const userDataBase = require("./src/config/db")
const router = require('./src/routes/routes')
const app = express()
const helmet = require('helmet')
const cors = require('cors')
const { swaggerUi, swaggerDocument } = require("./swagger");
app.use(express.json())
app.use(helmet())
app.use(cors())

//base de dados
userDataBase()

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use('/api',router)



app.use(erroGlobal)
app.listen(process.env.PORT,()=>{
    console.log('runing at port ',process.env.PORT)
})