const Tarea = require("../models/Tarea");
const Proyecto = require("../models/Proyecto");
const { validationResult } = require("express-validator");

//Crea una nueva tarea
exports.crearTarea = async (req, res) => {
  //Revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const { proyecto } = req.body;
    //const { proyecto } = req.body;
    //Extraer proyecto y comprobar si existe
    const existeProyecto = await Proyecto.findById(proyecto);
    if (!existeProyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    //Revisar si el proyecto es del usuario autenticado
    //Vertificar el creador del prpyecto debe ser igual al usuario
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "Tarea no autorizada para crearse" });
    }

    //Crear la tarea
    const tarea = new Tarea(req.body);
    await tarea.save();
    res.json(tarea);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error al crear la tarea" });
  }
};

//Obtiene las tareas por proyecto
exports.obtenerTareas = async (req, res) => {
  //Extraer el proyecto
  try {
    const { proyecto } = req.query;
    console.log(req.query);
    //Extraer proyecto y comprobar si existe
    const existeProyecto = await Proyecto.findById(proyecto);
    if (!existeProyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    //Revisar si el proyecto es del usuario autenticado
    //Vertificar el creador del prpyecto debe ser igual al usuario
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res
        .status(401)
        .json({ msg: "No está autorizado para ver las tareas" });
    }

    //Obtener tareas pro proyecto
    const tareas = await Tarea.find({ proyecto }).sort({creado: -1});
    res.json({ tareas });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "No se pudieron obtener las tareas" });
  }
};

exports.actualizarTarea = async (req, res) => {
  try {
    // Extraer elproyecto, el nombre de la tarea y su estado
    const { proyecto, nombre, estado } = req.body;
    //Verificar si la tarea existe
    let tarea = await Tarea.findById(req.params.id);
    if (!tarea) {
      return res.status(404).json({ msg: "Tarea no encontrada" });
    }
    // Consultar el proyecto por ID
    const existeProyecto = await Proyecto.findById(proyecto);

    //Vertificar el creador del prpyecto debe ser igual al usuario
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "Tarea no autorizada para crearse" });
    }
    //Crear nuevo obj con la nueva información
    // Solo modifica los datos que se modifiquen
    let nuevaTarea = {};
    nuevaTarea.nombre = nombre;
    nuevaTarea.estado = estado;
    // Guardar la tarea

    tarea = await Tarea.findOneAndUpdate({ _id: req.params.id }, nuevaTarea, {
      new: true,
    });
    res.json({ tarea });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "No se pudo actualizar la tarea" });
  }
};

exports.eliminarTarea = async (req,res)=>{

    try {

    const { proyecto} = req.query;
    //Verificar si la tarea existe
    let tarea = await Tarea.findById(req.params.id);
    if (!tarea) {
      return res.status(404).json({ msg: "Tarea no encontrada" });
    }
    // Consultar el proyecto por ID
    const existeProyecto = await Proyecto.findById(proyecto);

    //Vertificar el creador del prpyecto debe ser igual al usuario
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "Tarea no autorizada para crearse" });
    }

    //Eliminar
    await Tarea.findOneAndRemove({_id: req.params.id});

    res.json({ msg: "Tarea eliminada" });



        
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "No se pudo Eliminar la tarea" });
    }
}