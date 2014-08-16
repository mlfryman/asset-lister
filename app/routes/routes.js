'use strict';

var morgan         = require('morgan'),
    bodyParser     = require('body-parser'),
    methodOverride = require('express-method-override'),
    home           = require('../controllers/home'),
    people         = require('../controllers/people');

module.exports = function(app, express){
  app.use(morgan('dev'));
  app.use(express.static(__dirname + '/../static'));
  app.use(bodyParser.urlencoded({extended:true}));
  app.use(methodOverride());

  app.get('/', home.index);
  app.get('/people', people.index);
  app.post('/people', people.create);
  app.get('/people/init', people.init);
  app.delete('/people', people.nukePerson);
  app.get('/people/:id/items/new', people.newItem);
  app.put('/people/:id', people.addItem);

  console.log('Routes Loaded');
};

