const validatorSchema = require('../validators/userValidator')
const appError = require('../errors/appErrors')

const validarUser = (req,res,next)=>{
    const {error} = validatorSchema.validate(req.body,{abortEarly:false})

    if(error){
        const errorMessage = error.details.map(det => det.message)
        return next(new appError(errorMessage,400))
    }

    next()
}

module.exports = validarUser 