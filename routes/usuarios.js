// Rutas para crear usuarios
const express = require("express");
const usuarioController = require("../controllers/usuarioController");
const { check } = require("express-validator");

const router = express.Router();

// Crear un usuario ENDPONINT
// api/usuarios
router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("email", "Agrega un email válido").isEmail(),
    check("password", "El password debe ser mínimo de 6 caracteres").isLength({
      min: 6,
    }),
  ],

  usuarioController.crearUsuario
);
module.exports = router;
