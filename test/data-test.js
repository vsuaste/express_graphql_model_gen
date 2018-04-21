module.exports.resolver = `/*
    Resolvers for basic CRUD operations
*/

const person = require('../models/index').person;
const searchArg = require('../utils/search-argument');
var checkAuthorization = require('../utils/check-authorization');

module.exports = {
    people: function(_, context) {
      if(checkAuthorization(context,'people', 'read')==true)
      {
        return person.findAll();
      }else{
        return "You don't have authorization to perform this action";
      }
    },

    searchPerson: function({
        input
    },context) {
      if(checkAuthorization(context, 'people', 'read')==true)
      {
        let arg = new searchArg(input);
        let arg_sequelize = arg.toSequelize();
        return person.findAll({
            where: arg_sequelize
        });
      }else{
        return "You don't have authorization to perform this action";
      }
    },

    readOnePerson: function({
        id
    },context) {
      if(checkAuthorization(context, 'people', 'read')==true)
      {
        return person.findOne({
            where: {
                id: id
            },
            include: [{
                all: true
            }]
        });
      }else{
        return "You don't have authorization to perform this action";
      }
    },

    addPerson: function(input, context) {
      if(checkAuthorization(context,'people','create')==true)
      {
        return person.create(input)
            .then(person => {
                return person;
            });
      }else{
        return "You don't have authorization to perform this action";
      }
    },

    deletePerson: function({
        id
    }, context) {
      if(checkAuthorization(context,'people','delete')==true)
      {
        return person.findById(id)
            .then(person => {
                return person.destroy()
                    .then(() => {
                        return 'Item succesfully deleted';
                    });
            });
      }else{
        return "You don't have authorization to perform this action";
      }
    },

    updatePerson: function(input, context) {
      if(checkAuthorization(context,'people','update')==true)
      {
        return person.findById(id)
            .then(person => {
                return person.update(input);
            });
      }else{
        return "You don't have authorization to perform this action";
      }
    }
}`;

module.exports.graphql = `module.exports =\`

type Person  {
  firstName: String
  lastName: String
  email: String

  dogs: [Dog]
}

enum PersonField {
  id
  firstName
  lastName
  email
}

input searchPersonInput {
  field: PersonField
  value: typeValue
  operator: Operator
  searchArg: [searchPersonInput]
}

type Query {
  people: [Person]
  searchPerson(input: searchPersonInput): [Person]
  readOnePerson(id: ID): Person
}

type Mutation {
  addPerson( firstName: String, lastName: String, email: String  ): Person
  deletePerson(id: ID!): String!
  updatePerson(id: ID!, firstName: String, lastName: String, email: String ): Person!
}
\`;`;

module.exports.sequelize = `

'use strict';

module.exports = function(sequelize, DataTypes) {
    var Person = sequelize.define('person', {

        firstName: {
            type: Sequelize.STRING
        },

        lastName: {
            type: Sequelize.STRING
        },

        email: {
            type: Sequelize.STRING
        },

    });

    Person.associate = function(models) {


        Person.hasMany(models.dog);


    };

    return Person;
};

`
