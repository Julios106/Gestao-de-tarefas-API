const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    titulo:{type:String,required:true},
    descricao:{type:String},
    status:{type:String},
    userId:{
        type:mongoose.mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    }
})

const task = mongoose.model('Tarefas',taskSchema)

module.exports = task