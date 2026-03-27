const jwt = require('jsonwebtoken')
const user = require('../models/userSchema')
const appError = require('../errors/appErrors')
const dtos = require('../dtos/dtos')

const autenticar = async (req,res,next)=>{
    try{

        const headers = req.headers.authorization

        if(!headers){
           return next(new appError("erro token ausente",401))
        }

        //separando o header e pegando so o token
        const token = headers.split(" ")[1]
        
        //verificar token valido
        const tokenValido = jwt.verify(token,process.env.JWT_SECRET)
        if(!tokenValido){
           return next(new appError("token invalido",401))
        }

        const verificarId = await user.findById(tokenValido.id)
        if(!verificarId){
            return next(new appError("o token nao corresponde a nenhum user!",401))
        }

        req.User = dtos.retornarUserAutenticado(verificarId)


        next()


    }catch(erro){
        return res.status(401).json({message:"token expirado"})
    }

}

module.exports = autenticar