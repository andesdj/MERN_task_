const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
exports.crearUsuario = async (req, res) => {
  //Revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  //Extraer email and password
  const { email, password } = req.body;

  try {
    //Revisar que sea unico el usuario

    let usuario = await Usuario.findOne({ email });

    //Check si existe un previo
    if (usuario) {
      return res.status(400).json({ msg: "El usuario ya existe" });
    }
    //guardar usuarios
    usuario = new Usuario(req.body);

    //HASEAR PASSWORD
    const salt = await bcryptjs.genSalt(10);
    usuario.password = await bcryptjs.hash(password, salt);
    await usuario.save();

    //Crear y firmar el JWT
    // 1 crear el JWT con el payload
    const payload = {
      usuario: {
        id: usuario.id,
      },
    };
    //2 Firmar el JWT la palabra sea igual para firmar como para autenticar
    // Expira en 1h
    jwt.sign(
      payload,
      process.env.SECRETA,
      {
        //1 hora de sesión
        //expiresIn: 3600, 
         //10 hora de sesión
        expiresIn: 36000,

      },
      (error, token) => {
        if (error) throw error;
        //Mensaje de confirmación
        res.json({ token });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send("Hay un error !!!");
  }
};
