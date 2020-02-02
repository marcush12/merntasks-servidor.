// routes para criar usuarios
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const {check} = require('express-validator')

// criar um usuario
// api/usuarios

router.post('/', 
  [
    check('nombre', 'Nome é obrigatório').not().isEmpty(),
    check('email', 'Escreva um email válido').isEmail(),
    check('password', 'A Senha deve ter, no mínimo, 6 caracteres').isLength({min: 6})
  ],
  usuarioController.crearUsuario
);

module.exports = router;
