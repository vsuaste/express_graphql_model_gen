module.exports.resolver = `/*
    Resolvers for basic CRUD operations
*/

const person = require('../models/index').person;
const searchArg = require('../utils/search-argument');

module.exports = {
    people: function(_, context) {
        return person.findAll();
    },

    searchPerson: function({
        input
    }) {
        let arg = new searchArg(input);
        let arg_sequelize = arg.toSequelize();
        return person.findAll({
            where: arg_sequelize
        });
    },

    readOnePerson: function({
        id
    }) {
        return person.findOne({
            where: {
                id: id
            },
            include: [{
                all: true
            }]
        });
    },

    addPerson: function(input, context) {
        return person.create(input)
            .then(person => {
                return person;
            });
    },

    deletePerson: function({
        id
    }, context) {
        return person.findById(id)
            .then(person => {
                return person.destroy()
                    .then(() => {
                        return 'Item succesfully deleted';
                    });
            });
    },

    updatePerson: function(input, context) {
        return person.findById(id)
            .then(person => {
                return person.update(input);
            });
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
