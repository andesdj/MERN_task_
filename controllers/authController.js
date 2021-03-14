const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

//Crear metodo para

exports.autenticarUsuario = async (req, res) => {
  //Revisar errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  //Extraer email y password
  const { email, password } = req.body;

  try {
    //1Revisar que sea un usuario registrado
    let usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(400).json({ msg: "El usuario no existe" });
    }
    // 2 revisar su pass
    const passCorrecto = await bcryptjs.compare(password, usuario.password);
    if (!passCorrecto) {
      return res.status(400).json({ msg: "Password incorrecto" });
    }

    // 3 si usuario y password son correctos, devolvemos un TOKEN
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
        // expiresIn: 3600,
        expiresIn: 360000, //100 hora de sesión
      },
      (error, token) => {
        if (error) throw error;
        //Mensaje de confirmación
        res.json({ token });
      }
    );

    //FIN Crear TOKEN
  } catch (err) {
    console.log("ERROR!!!!!!!!!!!!");
    console.log(err);
  }
};

//Obtiene que usuario esta autenticado

exports.usuarioAutenticado = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select("-password");
    res.json({ usuario });
  } catch (error) {
    console.log("ERROR!!!!!!!!!!!!");
    res.status(500).json({ msg: "Hubo un error al obtener los datos" });
  }
};
