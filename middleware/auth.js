const jwt = require("jsonwebtoken");

module.exports= function (req,res, next ){
    //Leer tojen header 
    const token= req.header('x-auth-token');

    console.log(token);
    //Revisar si no hay token
    if(!token){
        res.status(401).json({msg: "No hay token , permiso no válido"})
    }

    //Validar token

    try{
        const cifrado = jwt.verify(token, process.env.SECRETA);
        req.usuario=cifrado.usuario;
        next();
    }
    catch(err){
        res.status(401).json({msg: "Token no válido"})
    }
}