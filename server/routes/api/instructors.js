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
      {$set: { "enabled" : req.body.toStatus, "user_modify": req.body.user, "last_modify": req.body.fecha }}
    ).then((resp) => res.json(resp)).catch(err => next(err))
  });
};
