const jwt = require('jsonwebtoken')

module.exports = function(req, res, next) {
  // ler token do header
  const token = req.header('x-auth-token')
  console.log(token);
  // verificar se não há token
  if(!token) {
    return res.status(401).json({msg: 'Token inexistente; não autorizado'})
  }
  // validar o token
  try {
    const cifrado = jwt.verify(token, process.env.SECRETA)
    req.usuario = cifrado.usuario
    next()
  } catch (error) {
    res.status(401).json({msg: 'Token inválido'})
  }
}
