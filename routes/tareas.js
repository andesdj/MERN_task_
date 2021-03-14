const express = require("express");
const router = express.Router();
const tareaController = require("../controllers/tareaController");
const auth = require("../middleware/auth");
const {check} = require("express-validator");
const { route } = require("./proyectos");
// Crea tareas ENDPOINT: api/tareas
router.post("/",
    auth,
    [
        check("nombre", "El nombre de la tarea es obligatorio").not().isEmpty(),
    ],
    tareaController.crearTarea
);

//Obtener las tareas del proyecto
router.get("/",
auth,
tareaController.obtenerTareas

);

//Actualizar las tareas
router.put("/:id",
auth,
    // [
    //     check("nombre", "El nombre de la tarea es obligatorio").not().isEmpty(),
    //     check("proyecto", "El proyecto es obligatorio").not().isEmpty(),
    // ],
    tareaController.actualizarTarea

);
// Elmiminar tarea  por su ID
router.delete("/:id",
auth,
tareaController.eliminarTarea,
)

module.exports = router;
