const mongoose = require('mongoose')

//userDB
const userDB = async()=>{
    try{
        await mongoose.connect(process.env.DATA_BASE)
            .then(console.log("Banco de dados conectado de usuarios!"))
    }catch(error){
        console.log('falha ao conectar ao banco de dados  ',error)
    }
}

module.exports = userDB