/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';
var expect = require('chai').expect,
    Person = require('../../app/models/person'),
    dbConnect = require('../../app/lib/mongodb'),
    Mongo = require('mongodb'),
    cp = require('child_process'),
    db = 'asset-lister';

describe('Person', function(){
  before(function(done){
    dbConnect(db, function(){
      done();
    });
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [db], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      done();
    });
  });

  describe('constructor', function(){
    it('should create a new Person object', function(){
      var p = new Person({name:'Bob', photo:'url.bob.png', cash:'5000'});
      expect(p).to.be.instanceof(Person);
      expect(p.name).to.equal('Bob');
      expect(p.photo).to.equal('url.bob.png');
      expect(p.cash).to.equal(5000);
      expect(p.items).to.have.length(0);
    });
  });

  describe('.create', function(){
    it('should create a person', function(done){
      var p = new Person({name:'Bob', photo:'url.bob.png', cash:'5000'});
      Person.create(p, function(err, person){
        expect(person._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });

  describe('.all', function(){
    it('should get all people', function(done){
      Person.all(function(err, people){
        expect(people).to.have.length(3);
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should find a person by its id', function(done){
      Person.findById(Mongo.ObjectID('100000000000000000000001'), function(person){
        expect(person.name).to.equal('Snowball');
        expect(person).to.be.instanceof(Person);
        done();
      });
    });
  });

  describe('#save', function(){
    it('should update an exiting person in the database', function(done){
      Person.findById('100000000000000000000001', function(person){
        person.cash = 2000;
        person.items = [];
        person.save(function(){
          expect(person.cash).to.equal(2000);
          expect(person.items).to.have.length(0);
          done();
        });
      });
    });
  });

  describe('#addItem', function(){
    it('should add an asset to a person', function(done){
      Person.findById('100000000000000000000001', function(person){
        person.addItem({name:'Kitten', photo:'kitten.jpg', price:'1000', count:'2', value:'2000'}, function(){
          expect(person.items).to.have.length(4);
          expect(person.items[3].name).to.equal('Kitten');
          expect(person.items[3].photo).to.equal('kitten.jpg');
          expect(person.items[3].price).to.be.closeTo(1000, 0.1);
          expect(person.items[3].total).to.be.closeTo(2000, 0.1);
          done();
        });
      });
    });
  });

  describe('-#assetValue', function(){
    it('should compute total value of assets', function(){
      Person.findById('100000000000000000000001', function(person){
        person.items.push(({name:'staple', photo:'staple.jpg', price:'10', count:'2', value:'20'}, {name:'kitten', photo:'kitten.jpg', price:'100', count:'5', value:'500'}), function(){
          expect(person.assets).to.be.closeTo(90525, 0.1);
        });
      });
    });
  });

  describe('.deleteById', function(){
    it('should delete person by its id', function(done){
      Person.deleteById(Mongo.ObjectID('100000000000000000000001'), function(person){
        Person.all(function(err, people){
          expect(people).to.have.length(2);
          done();
        });
      });
    });
  });
  // Last Bracket
});
