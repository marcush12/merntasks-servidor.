const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

// criar uma nova tarefa
exports.crearTarea = async (req, res) => {
  // verificar se há error
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    //se houver erros
    return res.status(400).json({ erros: errores.array() });
  }

  try {
    // extrair projeto e comprovar se existe
    const { proyecto } = req.body;

    const existeProyecto = await Proyecto.findById(proyecto);
    if (!existeProyecto) {
      return res.status(404).json({ msg: 'Projeto não encontrado' });
    }

    // verificar se o projeto atual pertence a um usuario autenticado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: 'Não autorizado' });
    }

    // criamos a tarefa
    const tarea = new Tarea(req.body);
    await tarea.save();
    res.json({ tarea });
  } catch (error) {
    console.log(error);
    res.status(500).send('Houve um erro');
  }
};

// obter as tarefas por projeto
exports.obtenerTareas = async (req, res) => {
  try {
    // extrair projeto e comprovar se existe
    const { proyecto } = req.query; // req.body

    const existeProyecto = await Proyecto.findById(proyecto);
    if (!existeProyecto) {
      return res.status(404).json({ msg: 'Projeto não encontrado' });
    }

    // verificar se o projeto atual pertence a um usuario autenticado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: 'Não autorizado' });
    }

    // obter as tarefas por projeto
    const tareas = await Tarea.find({ proyecto }).sort({creado: -1});
    res.json({ tareas });
  } catch (error) {
    console.log(error);
    res.status(500).send('Houve um erro');
  }
};

// atualizar tarefa
exports.actualizarTarea = async (req, res) => {
  try {
    // extrair projeto e comprovar se existe
    const { proyecto, nombre, estado } = req.body;

    // verificar se a tarefa existe ou não
    let tarea = await Tarea.findById(req.params.id)
    if(!tarea) {
      return res.status(404).json({ msg: 'Tarefa inexistente' });
    }

    // extrair projeto
    const existeProyecto = await Proyecto.findById(proyecto);
    
    // verificar se o projeto atual pertence a um usuario autenticado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: 'Não autorizado' });
    }

    // criar um obj com a nova info
    const nuevaTarea = {}

    nuevaTarea.nombre = nombre
    
    nuevaTarea.estado = estado

    // salvar a tarefa
    tarea = await Tarea.findOneAndUpdate({_id: req.params.id}, nuevaTarea, {new: true})

    res.json({tarea})

  } catch (error) {
    console.log(error);
    res.status(500).send('Houve um erro');
  }
};

// eliminar tarefa 
exports.eliminarTarea = async (req, res) => {
  try {
    // extrair projeto e comprovar se existe
    const { proyecto } = req.query;

    // verificar se a tarefa existe ou não
    let tarea = await Tarea.findById(req.params.id)
    if(!tarea) {
      return res.status(404).json({ msg: 'Tarefa inexistente' });
    }

    // extrair projeto
    const existeProyecto = await Proyecto.findById(proyecto);
    
    // verificar se o projeto atual pertence a um usuario autenticado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: 'Não autorizado' });
    }

    // eliminar 
    await Tarea.findOneAndRemove({_id: req.params.id})
    res.json({msg: 'Tarefa Eliminada!'})

  } catch (error) {
    console.log(error);
    res.status(500).send('Houve um erro');
  }
}
