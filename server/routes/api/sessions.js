const Session = require('../../models/Session');

module.exports = (app) => {
  app.get('/api/sessions', (req, res, next) => {
    Session.find()
      .exec()
      .then((session) => res.json(session))
      .catch((err) => next(err));
  });

  app.get('/api/sessions/active/:id', (req, res, next) => {
    Session.findOne({ sessionId: req.params.id })
      .exec()
      .then((session) => res.json(session))
      .catch((err) => next(err));
  });

  app.post('/api/sessions', function (req, res, next) {
    let body = req.body;

    const session = new Session();
    session.user = body.user;
    session.sessionId = body.sessionId;
    session.fechaHora = body.fechaHora;
    session.enabled = body.enabled;

    session.save()
      .then(() => res.json(session))
      .catch((err) => next(err));
  });

  app.delete('/api/sessions/:id', function (req, res, next) {
    Session.findOneAndRemove({ _id: req.params.id })
      .exec()
      .then((session) => res.json())
      .catch((err) => next(err));
  });

  app.put('/api/sessions/:id/update', (req, res, next) => {
    Session.findById(req.params.id)
      .exec()
      .then((session) => {
        console.log("body", req.body)
        console.log("data", req.data)
        session = req.body

        session.save()
          .then(() => res.json(session))
          .catch((err) => next(err));
      })
      .catch((err) => next(err));
  });

//   app.put('/api/counters/:id/decrement', (req, res, next) => {
//     Counter.findById(req.params.id)
//       .exec()
//       .then((counter) => {
//         counter.count--;

//         counter.save()
//           .then(() => res.json(counter))
//           .catch((err) => next(err));
//       })
//       .catch((err) => next(err));
//   });
};
