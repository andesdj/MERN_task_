const Proyecto = require("../models/Proyecto");
const { validationResult } = require("express-validator");
exports.crearProyecto = async (req, res) => {
  //Revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    //Crear un Proyecto

    const proyecto = new Proyecto(req.body);

    //Guardar el creador via JWT
    proyecto.creador = req.usuario.id;
    //Guardar el usuario
    proyecto.save();
    res.json(proyecto);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Hubo un error al crear el proyecto" });
  }
};

//Obtener todos los proyectos del usuario actual
exports.obtenerProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({
      creado: -1,
    });
    res.json({ proyectos });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Hubo un error al obtener los proyectos" });
  }
};

//Actualizar un proyecto via ID del proy y en el header la auth del user
exports.actualizarProyecto = async (req, res) => {
  //Revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  //Extraer la información del proyecto
  const { nombre } = req.body;
  const nuevoProyecto = {};

  if (nombre) {
    nuevoProyecto.nombre = nombre;
  }

  try {
    //Revisar el ID DEL PROYECTO
    let proyecto = await Proyecto.findById(req.params.id);
    //Si el proyecto existe
    if (!proyecto) {
      return res.status(404).json({ msg: "El proyecto no ha sido encontrado" });
    }
    //Vertificar el creador del prpyecto debe ser igual al usuario
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res
        .status(401)
        .json({ msg: "Proyecto no autorizado para update" });
    }

    //Actualizar con el Schema de mongoose
    proyecto = await Proyecto.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: nuevoProyecto },
      { new: true }
    );
    return res.json({ proyecto });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error en el servidor" });
  }
};

//Elimina proyecto por su ID
exports.eliminarProyecto = async (req, res) => {
  try {
    //Revisar el ID DEL PROYECTO
    let proyecto = await Proyecto.findById(req.params.id);
    //Si el proyecto existe
    if (!proyecto) {
      return res.status(404).json({ msg: "El proyecto no ha sido encontrado" });
    }
    //Vertificar el creador del prpyecto debe ser igual al usuario
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res
        .status(401)
        .json({ msg: "Proyecto no autorizado para update" });
    }

    // Eliminar el proyecto
    await Proyecto.findByIdAndRemove({ _id: req.params.id });
    return res.json({ msg: "Proyecto eliminado correctamente!!" });

    return res.json({ proyecto });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error en el servidor" });
  }
};
