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
      {$set: { "enabled" : req.body.toStatus, "user_modify": req.body.user, "last_modify": req.body.fecha }}
    ).then((resp) => res.json(resp)).catch(err => next(err))
  });
};
