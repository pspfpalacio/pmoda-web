const Instructor = require('../../models/Instructor');

module.exports = (app) => {
  app.get('/api/instructors', (req, res, next) => {
    Instructor.find()
      .exec()
      .then((data) => res.json(data))
      .catch((err) => next(err));
  });

  app.post('/api/instructors', function (req, res, next) {
    let body = req.body;

    const instructor = new Instructor(body);
    // curso.nombre = body.nombre
    // curso.cantHoras = body.cantHoras
    // curso.duracionMeses = body.duracionMeses
    // curso.costoCurso = body.costoCurso
    // curso.costoMatricula = body.costoMatricula
    // curso.user_alta = body.userAlta
    // curso.fecha_alta = body.fechaAlta

    instructor.save()
      .then(() => res.json(instructor))
      .catch((err) => next(err));
  });

  // app.delete('/api/alumno/:id', function (req, res, next) {
  //   Curso.findOneAndRemove({ _id: req.params.id })
  //     .exec()
  //     .then((curso) => res.json())
  //     .catch((err) => next(err));
  // });

  app.put('/api/instructors/:id', (req, res, next) => {
    Instructor.update({_id: req.params.id}, req.body)
      .then((resp) => res.json(resp)).catch((err) => next(err))
  });

  app.put('/api/instructors_status', (req, res, next) => {
    Instructor.updateMany(
      {_id: {$in: req.body.ids}}, 
      {$set: { "enabled" : req.body.toStatus, "user_mod": req.body.user, "fecha_mod": req.body.fecha }}
    ).then((resp) => res.json(resp)).catch(err => next(err))
  });
};
