const User = require('../../models/User');

module.exports = (app) => {
  app.get('/api/users', (req, res, next) => {
    User.find()
      .exec()
      .then((user) => res.json(user))
      .catch((err) => next(err));
  });

  app.post('/api/users', function (req, res, next) {
    let body = req.body;
    const user = new User(body);
    user.save()
      .then(() => res.json(user))
      .catch((err) => next(err));
  });

  app.put('/api/users/:id', (req, res, next) => {
    User.update({_id: req.params.id}, req.body)
      .then((resp) => res.json(resp)).catch((err) => next(err))
  });

  app.put('/api/users_status', (req, res, next) => {
    User.updateMany(
      {_id: {$in: req.body.ids}}, 
      {$set: { "enabled" : req.body.toStatus, "user_modify": req.body.user, "last_modify": req.body.fecha }}
    ).then((resp) => res.json(resp)).catch(err => next(err))
  });

  // app.delete('/api/users/:id', function (req, res, next) {
  //   User.findOneAndRemove({ _id: req.params.id })
  //     .exec()
  //     .then((user) => res.json())
  //     .catch((err) => next(err));
  // });  

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
