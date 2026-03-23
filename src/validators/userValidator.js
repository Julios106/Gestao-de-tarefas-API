const joi = require('joi')

const userValidator = joi.object({
    nome: joi.string().required().messages({
        "string.base":"o nome deve ser valido",
        "any.required":"o nome e obrigatorio"
    }),

    email:joi.string().email().required().messages({
        "string.email":"o email deve ser valido",
        "any.required":"o email e obrigatorio"
    }),

    senha: joi.string().min(6).required().messages({
        "string.min":"a senha deve ter no minimo 6 caracteris",
        "any.required":"a senha e obrigatoria"
    })
})

module.exports = userValidator