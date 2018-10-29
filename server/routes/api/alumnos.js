const Alumno = require('../../models/Alumno');

module.exports = (app) => {
  app.get('/api/alumnos', (req, res, next) => {
    Alumno.find()
      .exec()
      .then((data) => res.json(data))
      .catch((err) => next(err));
  });

  app.post('/api/alumnos', function (req, res, next) {
    let body = req.body;

    const alumno = new Alumno(body);
    // curso.nombre = body.nombre
    // curso.cantHoras = body.cantHoras
    // curso.duracionMeses = body.duracionMeses
    // curso.costoCurso = body.costoCurso
    // curso.costoMatricula = body.costoMatricula
    // curso.user_alta = body.userAlta
    // curso.fecha_alta = body.fechaAlta

    alumno.save()
      .then(() => res.json(alumno))
      .catch((err) => next(err));
  });

  // app.delete('/api/alumno/:id', function (req, res, next) {
  //   Curso.findOneAndRemove({ _id: req.params.id })
  //     .exec()
  //     .then((curso) => res.json())
  //     .catch((err) => next(err));
  // });

  app.put('/api/alumnos/:id', (req, res, next) => {
    Alumno.update({_id: req.params.id}, req.body)
      .then((resp) => res.json(resp)).catch((err) => next(err))
  });

  app.put('/api/alumnos_status', (req, res, next) => {
    Alumno.updateMany(
      {_id: {$in: req.body.ids}}, 
      {$set: { "enabled" : req.body.toStatus, "user_mod": req.body.user, "fecha_mod": req.body.fecha }}
    ).then((resp) => res.json(resp)).catch(err => next(err))
  });
};
