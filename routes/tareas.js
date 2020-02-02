const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

// criar uma tarefa
// api/tareas
router.post(
  '/',
  auth,
  [
    check('nombre', 'O nome da tarefa é obrigatório')
      .not()
      .isEmpty(),
    check('proyecto', 'O nome do projeto é obrigatório')
      .not()
      .isEmpty()
  ],
  tareaController.crearTarea
);

// obter as tareas por projeto
router.get('/', auth, tareaController.obtenerTareas);

// actualizar tarefa
router.put('/:id',
  auth,
  tareaController.actualizarTarea
)

// eliminar tarefa
router.delete('/:id', 
  auth,
  tareaController.eliminarTarea
)

module.exports = router;
