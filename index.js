const express = require('express')
const conectarDB = require('./config/db')
const cors = require('cors')

// criar o servidor
const app = express()

// conectar com BD
conectarDB()

// habilitar cors
app.use(cors())

// habilitar express.json (anterior// era bodyparser)
app.use( express.json({ extended: true }));

// Port da app
const PORT = process.env.PORT || 4000
// iniciar app

//importar route
app.use('/api/usuarios', require('./routes/usuarios'))
//importar route
app.use('/api/auth', require('./routes/auth'))
app.use('/api/proyectos', require('./routes/proyectos'))
app.use('/api/tareas', require('./routes/tareas'))

app.listen(PORT, () => {
  console.log(`Servidor correndo em PORT ${PORT}`);
})
