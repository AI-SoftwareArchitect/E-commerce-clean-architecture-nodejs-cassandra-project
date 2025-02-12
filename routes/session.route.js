const express = require('express');
const Router = express.Router;

Router.get('/session', (req, res) => {
    if (req.session.user) {
      res.status(200).json({ user: req.session.user });
    } else {
      res.status(200).json({ user: null });
    }
});
  