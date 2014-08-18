'use strict';

var Mongo = require('mongodb'),
    _ = require('lodash');

function Person(o){
  this.name = o.name;
  this.photo = o.photo;
  this.cash = parseFloat(o.cash);
  this.items = [];
}

Object.defineProperty(Person, 'collection', {
  get: function(){return global.mongodb.collection('people');}
});

Object.defineProperty(Person.prototype, 'assetValue', {
  get: function(){
    if(!this.items.length){return 0;}

    console.log(this.items);

    var sum = _.reduce(this.items, (function(sum, item){
      return sum + item.total;}), 0);
    return sum;
  }
});

Object.defineProperty(Person.prototype, 'total', {
  get: function(){
    return (this.cash + this.assetValue) * 1;
  }
});

Person.create = function(o, cb){
  var p = new Person(o);
  Person.collection.save(p, cb);
};

Person.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Person.collection.findOne({_id:_id}, function(err, obj){
    var person = changePrototype(obj);
    cb(person);
  });
};

Person.all = function(cb){
  Person.collection.find().toArray(cb);
};

Person.prototype.addItem = function(o, cb){
  var item = {name:o.name, photo:o.photo, count: parseInt(o.count), price: parseFloat(o.price), total: 0};
  item.total = item.count * item.price;
  this.items.push(item);
  Person.collection.update({_id:this._id}, {$push:{items:item}}, cb);
};

Person.prototype.save = function(cb){
  Person.collection.save(this, cb);
};

Person.deleteById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Person.collection.findAndRemove({_id:_id}, cb);
};

module.exports = Person;

// PRIVATE FUNCTIONS //

function changePrototype(o){
  return _.create(Person.prototype, o);
}
