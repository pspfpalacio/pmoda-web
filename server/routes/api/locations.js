const Location = require('../../models/Location');

module.exports = (app) => {
  app.get('/api/locations', (req, res, next) => {
    Location.find()
      .exec()
      .then((data) => res.json(data))
      .catch((err) => next(err));
  });
};
