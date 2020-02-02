const Proyecto = require('../models/Proyecto')
const {validationResult} = require('express-validator')

exports.crearProyecto = async (req, res) => {

  // verificar se há error
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    //se houver erros
    return res.status(400).json({ erros: errores.array() });
  }

  try {
    // criar novo projeto
    const proyecto = new Proyecto(req.body)

    // salvar o nome do autor/criador do projeto via jwt
    proyecto.creador = req.usuario.id

    // salvamos o projeto
    proyecto.save()
    res.json(proyecto)
  } catch (error) {
    console.log(error);
    res.send(500).send('Houve um erro')
  }
}

// obter todos os projetos do usuario atual 
exports.obtenerProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find({creador: req.usuario.id}).sort({creado: -1})
    res.json({proyectos})
  } catch (error) {
    console.log(error);
    res.status(500).send('Houve um erro')
  }
}

// atualizar um projeto
exports.actualizarProyecto = async (req, res) => {
  // verificar se há error
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    //se houver erros
    return res.status(400).json({ erros: errores.array() });
  }

  // extrair a info do projeto
  const {nombre} = req.body
  const nuevoProyecto = {}

  if(nombre) {
    nuevoProyecto.nombre = nombre
  }

  try {
    // verificar o ID do projeto
    // console.log(req.params.id);
    let proyecto = await Proyecto.findById(req.params.id)
    
    // verificar se existe o projeto
    if(!proyecto) {
      return res.status(404).json({msg: 'Projeto não encontrado'})
    }
    // verificar o criador do projeto
    if(proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({msg: 'Não autorizado'})
    }
    // atualizar
    proyecto = await Proyecto.findByIdAndUpdate({_id: req.params.id}, {$set: nuevoProyecto}, {new: true} )
    res.json({proyecto})

  } catch (error) {
    console.log(error);
    res.status(500).send('Erro do servidor')
  }
}

// elimina um projeto pelo seu id
exports.eliminarProyecto = async (req, res) => {
  try {
    // verificar o ID do projeto
    // console.log(req.params.id);
    let proyecto = await Proyecto.findById(req.params.id)
    
    // verificar se existe o projeto
    if(!proyecto) {
      return res.status(404).json({msg: 'Projeto não encontrado'})
    }
    // verificar o criador do projeto
    if(proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({msg: 'Não autorizado'})
    }

    // eliminar o projeto
    await Proyecto.findOneAndRemove({_id: req.params.id})
    res.json({msg: 'Projeto removido!'})
  } catch (error) {
    console.log(error);
    res.status(500).send('Erro do servidor')
  }
}
