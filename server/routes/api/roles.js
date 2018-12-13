const Role = require('../../models/Role');

module.exports = (app) => {
  app.get('/api/roles', (req, res, next) => {
    Role.find()
      .exec()
      .then((role) => res.json(role))
      .catch((err) => next(err));
  });

  app.post('/api/roles', function (req, res, next) {
    let body = req.body;
    const role = new Role(body);
    role.save()
      .then(() => res.json(role))
      .catch((err) => next(err));
  });

  app.put('/api/roles/:id', (req, res, next) => {
    Role.update({_id: req.params.id}, req.body)
      .then((resp) => res.json(resp)).catch((err) => next(err))
  });
};
