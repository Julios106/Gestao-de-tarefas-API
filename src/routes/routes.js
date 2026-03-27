const express = require('express')
const router = express.Router()
const controller = require('../controllers/controller')
const validator = require('../middleware/joiMiddleware')
const autenticar = require('../middleware/authMiddleware')
const taskController = require('../controllers/taskController')

//rotas do usuario
router.post('/user/register',validator,controller.register)
router.post('/login',controller.login)
router.get('/perfil',autenticar,controller.perfil)
router.get('/listar',controller.listar)

//atualizar dados do user
router.put('/user/atualizar',autenticar,controller.atulizarUser)

//atualizar senha
router.put('/user/atualizar-senha',autenticar,controller.atualizarSenha)

//deletar user e com as respectivas tarefas
router.delete('/user/delete',autenticar,controller.deletarUser)

//parte de tarefas...
router.post('/nova-task',autenticar,taskController.addTask)
router.get('/user/tarefas',autenticar,taskController.mostrarTask)
router.get('/listar-tarefas',taskController.listar_tarefas)

//atualizar tarefa
router.put('/tarefa-atualizar/:id',autenticar,taskController.atualizarTask)//atualizar pendente/feito
router.put('/tarefa-atualizar-dados/:id',autenticar,taskController.atualiarDadosTask )

//deletar tarefas
router.delete('/deletar-tarefa/:id',autenticar,taskController.deletarTask)


module.exports = router