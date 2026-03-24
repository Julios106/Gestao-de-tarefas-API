const appError = require('../errors/appErrors')
const hashDeSenha = require('bcrypt')
const jwt = require('jsonwebtoken')
const user = require('../models/userSchema')
const dtos = require('../dtos/dtos')
//
const task = require('../models/taskSchema')


const register = async (req,res,next)=>{
    try{
    const dados = dtos.userRegister(req.body)
    const senhaHash = await hashDeSenha.hash(dados.senha,10)

    const userCriado = await user.create({
        ...dados,
        senha:senhaHash
    })

    const retornarUserCriado = dtos.retornarUser(userCriado)

    res.status(201).json(retornarUserCriado)

    }catch(erro){
        next(erro)
    }

}

const listar = async (req,res,next)=>{
    try{
        const total = await user.countDocuments()
        const lista = await user.find()


        res.status(200).json({
            success:true,
            message:'usuarios cadastrados',
            total:total,
            data:lista
        })

    }catch(erro){
        next(erro)
    }
}

const login = async(req,res,next)=>{
    try{
        const email = req.body.email
        const senha = req.body.senha


        const verificarEmail = await user.findOne({email:email})
        if(!verificarEmail){
           return next(new appError("Email nao existe",401))
        }

        const compareSenha = await hashDeSenha.compare(senha,verificarEmail.senha)
        if(!compareSenha){
           return next(new appError("Senha incorreta",401))
        }

        const token = jwt.sign(
            {
                "id":verificarEmail._id,
                "email":verificarEmail.email
            },
            process.env.JWT_SECRET,
            {expiresIn:"1h"}

        )

        res.status(200).json({
            success:true,
            message:"login efetuado com sucesso",
            token

        })


    }catch(erro){
        next(erro)
    }
}


const perfil = async(req,res,next)=>{
    try{
        const total = await task.countDocuments({userId:req.User.id})
        const perfilTask = await task.find({userId:req.User.id})


        if(!perfilTask){
            return res.status(200).json({
            success:true,
            message:"bem vindo ao painel de tarefas",
            user:req.User,
            tarefas:"Ainda nao tem nenhuma tarefa"
        })

        }

        res.status(200).json({
            success:true,
            message:"bem vindo ao painel de tarefas",
            user:req.User,
            numero_tarefas:total,
            tarefas:perfilTask
        })
    }catch(erro){
        next(erro)
    }
}

//atualizar dados
const atulizarUser = async(req,res,next)=>{
    try{
        const nome = req.body.nome
        const email = req.body.email



        if(nome !== undefined && nome.trim() === ""){
            return next(new appError('campo "nome" nao pode estar vazio'))
        }

        if(email !== undefined && email.trim() === ""){
            return next(new appError('campo "email" nao pode estar vazio'))  
        }

        const dados = {}
        if(nome){
            dados.nome = nome;
        }

        if(email){
            dados.email = email;
        }




        const userAtualizado = await user.findOneAndUpdate({
            _id:req.User.id,    
        },dados,
        {returnDocument: 'after'}
        
        )

        if(!userAtualizado){
            return next(new appError("erro user nao encontrado",401))
        }



        userAtualizado.save()

        const retornar = dtos.retornarUserAtualizado(userAtualizado)

        res.status(200).json({
            success:true,
            message:"atualizado com sucesso",
            data:retornar
        })

    }catch(erro){
        next(erro)
    }
}

//atualizar senha
const atualizarSenha = async(req,res,next)=>{

    try{
        const email = req.body.email
        const senhaAntiga = req.body.senha_antiga
        const senhaNova = req.body.nova_senha

        if(!email || !senhaAntiga || !senhaNova){
            return next(new appError('todos os campos são obrigatórios',400))
        }else if(senhaNova === senhaAntiga){
            return next(new appError('nova senha não pode ser igual à antiga',400))
        }


        const userEmail = await user.findOne({
            _id:req.User.id,
            email:email

        })

        if(!userEmail){
            return next(new appError('email invalo',400))
        }

        const compararSenha =  await hashDeSenha.compare(senhaAntiga,userEmail.senha )

        if(!compararSenha){
            return next(new appError('senha antiga nao e valida',400))
        }
        
        const hashNovaSenha = await hashDeSenha.hash(senhaNova,10)

        const senha = {
            senha:hashNovaSenha
        }


        const atualizar = await user.findOneAndUpdate({
            _id:req.User.id
        }, senha)

        if(!atualizar){
            return next(new appError('erro inesperado',400))
        }

        const dados = dtos.retornarUserAtualizado(atualizar)

        res.status(200).json({
            success:true,
            message:"senha atualizada com sucesseo!",
            data:dados
        })


        




    }catch(erro){
        next(erro)
    }
}

const deletarUser = async(req,res,next)=>{

    try{

        const usuario = await user.findOne({_id:req.User.id})
        if(!usuario){
            next(new appError("usuario nao encontrado",400))
        }

        const senha = req.body.senha
        const compararSenha = await hashDeSenha.compare(senha,usuario.senha)

        if(!compararSenha){
            return next(new appError("senha incorreta",400))
        }

        const numeroDeTarefas = await task.countDocuments({userId:req.User.id})//contar tarefas
        await task.deleteMany({userId:req.User.id})//apagar todas tarefas do user
        

        const deleteUser = await user.findOneAndDelete({_id:req.User.id})
        if(!deleteUser){
            return next(new appError("error inesperado ao deletar o usuario! e provavel que todas tarefas do usuario tenham sido deletadas",400))
        }

        res.status(200).json({
            success:true,
            message:"todos os dados que constavam nessa conta e a conta foram deletados com sucesso! ADEUS",
            numeroDeTarefas:numeroDeTarefas
        })





    }catch(erro){
        next(erro)
    }
}

module.exports = {
    register,
    listar,
    login,
    perfil,
    atulizarUser,
    atualizarSenha,
    deletarUser
}


