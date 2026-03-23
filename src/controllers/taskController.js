const appError = require('../errors/appErrors')
const task = require('../models/taskSchema')
const dtos = require('../dtos/dtos')
const mongoose = require('mongoose')

//adicionar tarefa
const addTask = async(req,res,next)=>{
    try{
        const tarefa = dtos.novaTask(req.body)

        const novaTask = await task.create({
            ...tarefa,
            status:"pendente",
            userId:req.User.id
        })

        res.status(201).json({
            success:true,
            message:"Tarefa criada",
            data:novaTask
        })
    }catch(erro){
        next(erro)
    }
}

//mostrar tarefa ao usuario
const mostrarTask = async (req,res,next)=>{
    try{

        const mostrarTask = await task.find({
            userId:req.User.id
        })

        if(!mostrarTask){
            next(new appError("nenhuma tarefa encontrada",404))
        }

        res.status(200).json({
            success:true,
            message:"Tarefa:",
            data:mostrarTask
        })

    }catch(erro){
        next(erro)
    }
}

//listar todas tarefas para o admin. eu
const listar_tarefas = async(req,res,next)=>{
    try{
        const totalTask = await task.countDocuments()
        const tarefas = await task.find()

        res.json({
            total:totalTask,
            Tarefas:tarefas
        })
    }catch(erro){
        next(erro)
    }
}

//atualizar  estado da tarefas pendente/feito
const atualizarTask = async(req,res,next)=>{
    try{

        const id = req.params.id

        const tarefa = await task.findOne({
            _id:id,
            userId:req.User.id
        })

        if(!tarefa){
           return next(new appError('tarefa nao encontrada',404))
        }

        //atualizar estado
        if(tarefa.status === 'pendente'){
            tarefa.status = 'feito'
        }else if(tarefa.status === 'feito'){
            tarefa.status = 'pendente'
        }

        //salvar no banco
        const save = await tarefa.save()

        res.status(200).json({
            success:true,
            message:"tarefa atualizada",
            data:save
        })



    }catch(erro){
        next(erro)
    }
}

//atualiar dados da tarefa
const atualiarDadosTask = async(req,res,next)=>{
    try{
        const id = req.params.id
        const dados = dtos.novaTask(req.body)

        const taskAtualizada = await task.findOneAndUpdate({
            _id:id,
            userId:req.User.id
        },
        dados,
        {returnDocument: 'after'}//retorna o documento atualizado
        )

        if(!taskAtualizada){
            return next(new appError("tarefa nao encontrada",404))
        }

        const save = await taskAtualizada.save()

        res.status(200).json({
            success:true,
            message:'tarefa atualizada',
            data:save
        })

    }catch(erro){
        next(erro)
    }
}

const deletarTask = async(req,res,next)=>{
    try{
       const id = req.params.id
        if(!mongoose.Types.ObjectId.isValid(id)){
            return next(new appError("id invalido",401))
        }
       const encontrar = await task.findOneAndDelete({
        _id:id,
        userId:req.User.id
       })

       if(!encontrar){
        return next(new appError('tarefa nao encontrada',404))
       }

       res.status(200).json({
        success:true,
        message:"tarefa deletada",
        data:encontrar
       })

    }catch(erro){
        next(erro)
    }
}

module.exports = {
    addTask,
    mostrarTask,
    listar_tarefas,
    atualizarTask,
    atualiarDadosTask,
    deletarTask  

}