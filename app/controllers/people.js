'use strict';

var Person = require('../models/person');

exports.init = function(req, res){
  res.render('people/init');
};

exports.create = function(req, res){
  var person = new Person(req.body);
  person.insert(function(){
    res.redirect('/people');
  });
};

exports.index = function(req, res){
  Person.all(function(err, people){
    res.render('people/index', {people:people});
  });
};

exports.show = function(req, res){
  Person.findById(req.params.id, function(person){
    res.render('people/show', {person:person});
  });
};

exports.items = function(req, res){
  Person.findById(req.params.id, function(person){
    res.render('people/items', {person:person});
  });
};

exports.addItem = function(req, res){
  Person.findById(req.params.id, function(person){
    person.addItem(req.body, function(){
      res.redirect('/people/' + req.params.id);
    });
  });
};

exports.destroy = function(req,res){
  Person.deleteById(req.params.id, function(){
    res.redirect('/people');
  });
};
