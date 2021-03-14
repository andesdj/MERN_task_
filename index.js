const cors = require("cors");
const express = require("express");
const conectarDB = require("./config/db");
//Crear servidor
const app = express();

//Conectar a la DB Mongo
conectarDB();

//Habilitar Cors
app.use(cors());

//Habiolitar express.JSON para leer datos del usuario
app.use(express.json({ extended: true }));

// Puerto de la app
const PORT = process.env.PORT || 4000;

// IMPORTAR RUTAS ---> Middleware
//usuarios
app.use("/api/usuarios", require("./routes/usuarios"));

//Auth
app.use("/api/auth", require("./routes/auth"));

//Proyectos
app.use("/api/proyectos", require("./routes/proyectos"));

//Tareas
app.use("/api/tareas", require("./routes/tareas"));
//Arrancar la app
app.listen(PORT, "0.0.0.0", () => {
  console.log(`\nEl servidor está funcionando en el puerto ${PORT} \n`);
});
