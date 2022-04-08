const resource = '/lessons';

module.exports = (app) => {
  app
    .post(resource, (req, res) => {
      res.send('Got a POST request');
    });
};
