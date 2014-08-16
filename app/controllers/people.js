'use strict';

var Person = require('../models/person');

exports.index = function(req, res){
  Person.all(function(err, people){
    res.render('people/index', {people:people});
  });
};

exports.create = function(req, res){
  Person.create(req.body, function(){
    res.redirect('/people');
  });
};

exports.newItem = function(req, res){
  res.render('people/:id/items/new', {id:req.params.id});
};

exports.addItem = function(req, res){
  Person.findById(req.params.id, function(err, person){
    person.addItem(req.body);
    person.save(function(){
      res.redirect('/people/:id');
    });
  });
};

exports.deleteById = function(req, res){
  Person.findById(req.params.id, function(err, person){
    person.deleteById(req.params.name);
    person.save(function(){
      res.send();
    });
  });
};

exports.init = function(req, res){
  res.render('people/init');
};

