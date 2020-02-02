const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const auth = require('../middleware/auth');
const {check} = require('express-validator')

// criar projetos
// api/proyectos
router.post('/', auth,
  [
    check('nombre', 'O nome do projeto é obrigatório').not().isEmpty()
  ],
  proyectoController.crearProyecto);

// obter todos os projetos
router.get('/', 
  auth, 
  proyectoController.obtenerProyectos
);

// atualizar projetos
router.put('/:id',
  auth,
  [
    check('nombre', 'O nome do projeto é obrigatório').not().isEmpty()
  ],
  proyectoController.actualizarProyecto
)

// eliminar um projeto
router.delete('/:id',
  auth,
  proyectoController.eliminarProyecto
)

module.exports = router;
