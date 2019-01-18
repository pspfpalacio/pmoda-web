const Curso = require('../../models/Curso');

module.exports = (app) => {
  app.get('/api/cursos', (req, res, next) => {
    Curso.find()
      .exec()
      .then((curso) => res.json(curso))
      .catch((err) => next(err));
  });

  app.post('/api/cursos', function (req, res, next) {
    let body = req.body;

    const curso = new Curso(body);
    // curso.nombre = body.nombre
    // curso.cantHoras = body.cantHoras
    // curso.duracionMeses = body.duracionMeses
    // curso.costoCurso = body.costoCurso
    // curso.costoMatricula = body.costoMatricula
    // curso.user_alta = body.userAlta
    // curso.fecha_alta = body.fechaAlta

    curso.save()
      .then(() => res.json(curso))
      .catch((err) => next(err));
  });

  app.delete('/api/cursos/:id', function (req, res, next) {
    Curso.findOneAndRemove({ _id: req.params.id })
      .exec()
      .then((curso) => res.json())
      .catch((err) => next(err));
  });

  app.put('/api/cursos/:id', (req, res, next) => {
    Curso.update({_id: req.params.id}, req.body)
      .then((resp) => res.json(resp)).catch((err) => next(err))
  });

  app.put('/api/cursos_status', (req, res, next) => {
    Curso.updateMany(
      {_id: {$in: req.body.ids}}, 
      {$set: { "enabled" : req.body.toStatus, "user_modify": req.body.user, "last_modify": req.body.fecha }}
    ).then((resp) => res.json(resp)).catch(err => next(err))
  });
};
