// const Subject = require('../../models/Subject');
const inscriptionsService = require('../../services/inscriptions');
const alumnosService = require('../../services/alumnos');
const cursosService = require('../../services/cursos');

module.exports = (app) => {
  app.get('/api/inscriptions', (req, res, next) => {
    inscriptionsService.getInscriptions()
    .then(resp => {
      const inscriptions = [];
      resp.map(async data => {
        let inscription = data;
        await alumnosService.getAlumnoById(data.id_alumno).then((resp) => {
          inscription.alumno = resp;
        });
        await cursosService.getCursoById(data.id_curso).then((resp) => {
          inscription.curso = resp;
        });
        inscriptions.push(inscription);
      })
      res.json(inscriptions);
    })
    .catch(err => next(err));
    // Subject.find()
    //   .exec()
    //   .then((data) => res.json(data))
    //   .catch((err) => next(err));
  });

  // app.post('/api/subjects', function (req, res, next) {
  //   let body = req.body;

  //   const subject = new Subject(body);

  //   subject.save()
  //     .then(() => res.json(subject))
  //     .catch((err) => next(err));
  // });

  // app.delete('/api/alumno/:id', function (req, res, next) {
  //   Curso.findOneAndRemove({ _id: req.params.id })
  //     .exec()
  //     .then((curso) => res.json())
  //     .catch((err) => next(err));
  // });

  // app.put('/api/subjects/:id', (req, res, next) => {
  //   Subject.update({_id: req.params.id}, req.body)
  //     .then((resp) => res.json(resp)).catch((err) => next(err))
  // });

  // app.put('/api/subjects_status', (req, res, next) => {
  //   Subject.updateMany(
  //     {_id: {$in: req.body.ids}}, 
  //     {$set: { "enabled" : req.body.toStatus, "user_modify": req.body.user, "last_modify": req.body.fecha }}
  //   ).then((resp) => res.json(resp)).catch(err => next(err))
  // });
};
