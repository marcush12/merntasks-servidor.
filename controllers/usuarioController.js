const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {
  // verificar se há erros
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    //se houver erros
    return res.status(400).json({ erros: errores.array() });
  }

  // extrair email e password
  const { email, password } = req.body;

  try {
    // verficar se o usuario é único
    let usuario = await Usuario.findOne({ email });

    if (usuario) {
      return res
        .status(400)
        .json({ msg: 'Usuario já existente no nosso banco de dados' });
    }

    // criar novo usuario
    usuario = new Usuario(req.body);

    // hashear a senha
    const salt = await bcryptjs.genSalt(10);
    usuario.password = await bcryptjs.hash(password, salt);

    // guardar novo usuario
    await usuario.save();

    // criar e assinar jwt (header + payload + signature)
    const payload = {
      usuario: {
        id: usuario.id
      }
    };

    // assinar jwt
    jwt.sign(
      payload,
      process.env.SECRETA,
      {
        expiresIn: 3600 // 1 hora
      },
      (error, token) => {
        if (error) throw error;

        // mensagem de confirmação
        res.json({ token: token }); //obj nome:value; quando nome=valor basta nome
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send('Houve um erro');
  }
};
