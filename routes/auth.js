//Rutas para autenticar
const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const authController = require("../controllers/authController");
const auth = require("../middleware/auth");
// Auth users ENDPOINT
// api/auth
router.post(
  "/",
  [
    check("email", "Agrega un email válido").isEmail(),
    check("password", "El password debe ser mínimo de 6 caracteres").isLength({
      min: 6,
    }),
  ],
  authController.autenticarUsuario
);
//Obtiene el usuario Autenticado
router.get("/", auth, authController.usuarioAutenticado);

module.exports = router;
