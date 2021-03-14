const express = require("express");
const router = express.Router();
const proyectoController = require("../controllers/proyectoController");
const auth = require("../middleware/auth");
const {check} = require("express-validator");
// Crea proyectos ENDPOINT: api/proyectos
router.post("/",
    auth,
    [check("nombre", "El nombre del proyecto es obligatorio").not().isEmpty()],
    proyectoController.crearProyecto
);

//Obtener todos los proyectos de un usuario
router.get("/",
    auth,
    proyectoController.obtenerProyectos
);

// Actualiza proyetos via ID
router.put("/:id",
    auth,
    [check("nombre", "El nombre del proyecto es obligatorio").not().isEmpty()],
    proyectoController.actualizarProyecto
)

// Actualiza proyetos via ID
router.delete("/:id",
    auth,
    proyectoController.eliminarProyecto
)


module.exports = router;
