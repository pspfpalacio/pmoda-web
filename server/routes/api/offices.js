const Office = require('../../models/Office');

module.exports = (app) => {
  app.get('/api/offices', (req, res, next) => {
    Office.find()
      .exec()
      .then((resp) => res.json(resp))
      .catch((err) => next(err));
  });

  app.post('/api/offices', function (req, res, next) {
    let body = req.body;
    const office = new Office(body);
    office.save()
      .then(() => res.json(office))
      .catch((err) => next(err));
  });

  app.put('/api/offices/:id', (req, res, next) => {
    Office.update({_id: req.params.id}, req.body)
      .then((resp) => res.json(resp)).catch((err) => next(err))
  });
};
