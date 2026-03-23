const erroGlobal = (err,req,res,next) =>{

    const statusCode = err.statusCode || 500
    const message = err.message || "Erro interno do servidor"

    res.status(statusCode).json({
        success:false,
        message:message
    })

    console.log(err)
}

module.exports = erroGlobal