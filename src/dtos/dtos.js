

function userRegister (data) {
    return {
        nome:data.nome,
        email:data.email,
        senha:data.senha
    }
}

function retornarUser (data){
    return {
        success:true,
        message:"Registro feito com sucesso!" ,       
        id:data._id,
        nome:data.nome,
        email:data.email
    }
}

function retornarUserAutenticado(data){
    return {     
        id:data._id,
        nome:data.nome,
        email:data.email
    }    
}

//campo para atualizar usuario 
function retornarUserAtualizado(data){
    return {
        _id:data._id,
        nome:data.nome,
        email:data.email
    }
}

//dtos de tarefas
function novaTask (data){
    return {
        titulo:data.titulo,
        descricao:data.descricao

    }
}



module.exports = {
    userRegister,
    retornarUser,
    retornarUserAutenticado,
    novaTask,
    retornarUserAtualizado
}