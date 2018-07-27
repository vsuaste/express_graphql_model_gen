module.exports.local_graphql_book = `
module.exports = \`
  type Book  {
      title: String
      genre: String
        publisher: Publisher
        peopleFilter(input: searchPersonInput): [Person]
  }

  enum BookField {
    id
    title
    genre
  }

  input searchBookInput {
    field: BookField
    value: typeValue
    operator: Operator
    searchArg: [searchBookInput]
  }

  type Query {
    books(input: searchBookInput): [Book]
    readOneBook(id: ID!): Book
  }

    type Mutation {
    addBook( title: String, genre: String, publisherId: Int   ): Book
    deleteBook(id: ID!): String!
    updateBook(id: ID!, title: String, genre: String, publisherId: Int  ): Book!
    bulkAddBookXlsx: [Book]
    bulkAddBookCsv: [Book]
}
  \`;`;


module.exports.webservice_graphql_publiser = `
module.exports = \`
  type Publisher  {
      name: String
      phone: String
          booksFilter(input: searchBookInput): [Book]
  }

  enum PublisherField {
    id
    name
    phone
  }

  input searchPublisherInput {
    field: PublisherField
    value: typeValue
    operator: Operator
    searchArg: [searchPublisherInput]
  }

  type Query {
    publishers(input: searchPublisherInput): [Publisher]
    readOnePublisher(id: ID!): Publisher
  }

  \`;`;

module.exports.local_resolver_person = `
/*
    Resolvers for basic CRUD operations
*/

const person = require('../models/index').person;
const searchArg = require('../utils/search-argument');
const fileTools = require('../utils/file-tools');
var checkAuthorization = require('../utils/check-authorization');

person.prototype.dogsFilter = function({
    input
}, context) {
    if (input === undefined) {
        return this.getDogs({
            include: [{
                all: true
            }]
        });
    } else {
        let arg = new searchArg(input);
        let arg_sequelize = arg.toSequelize();
        return this.getDogs({
            where: arg_sequelize,
            include: [{
                all: true
            }]
        });
    }
}
person.prototype.booksFilter = function({
    input
}, context) {
    if (input === undefined) {
        return this.getBooks({
            include: [{
                all: true
            }]
        });
    } else {
        let arg = new searchArg(input);
        let arg_sequelize = arg.toSequelize();
        return this.getBooks({
            where: arg_sequelize,
            include: [{
                all: true
            }]
        });
    }
}




module.exports = {

    people: function({
        input
    }, context) {
        if (checkAuthorization(context, 'people', 'read') == true) {
            if (input === undefined) {
                return person.findAll({
                    include: [{
                        all: true
                    }]
                });
            } else {
                let arg = new searchArg(input);
                let arg_sequelize = arg.toSequelize();
                return person.findAll({
                    where: arg_sequelize,
                    include: [{
                        all: true
                    }]
                });
            }
        } else {
            return "You don't have authorization to perform this action";
        }
    },

    readOnePerson: function({
        id
    }, context) {
        if (checkAuthorization(context, 'people', 'read') == true) {
            return person.findOne({
                where: {
                    id: id
                },
                include: [{
                    all: true
                }]
            });
        } else {
            return "You don't have authorization to perform this action";
        }
    },

    addPerson: function(input, context) {
        if (checkAuthorization(context, 'people', 'create') == true) {
            return person.create(input)
                .then(person => {
                    return person;
                });
        } else {
            return "You don't have authorization to perform this action";
        }
    },

    bulkAddPersonXlsx: function(_, context) {
        let xlsxObjs = fileTools.parseXlsx(context.request.files.xlsx_file.data.toString('binary'));
        return person.bulkCreate(xlsxObjs, {
            validate: true
        });
    },

    bulkAddPersonCsv: function(_, context) {
        //delim = context.request.body.delim;
        //cols = context.request.body.cols;
        return fileTools.parseCsv(context.request.files.csv_file.data.toString())
            .then((csvObjs) => {
                return person.bulkCreate(csvObjs, {
                    validate: true
                });
            });
    },

    deletePerson: function({
        id
    }, context) {
        if (checkAuthorization(context, 'people', 'delete') == true) {
            return person.findById(id)
                .then(person => {
                    return person.destroy()
                        .then(() => {
                            return 'Item succesfully deleted';
                        });
                });
        } else {
            return "You don't have authorization to perform this action";
        }
    },

    updatePerson: function(input, context) {
        if (checkAuthorization(context, 'people', 'update') == true) {
            return person.findById(input.id)
                .then(person => {
                    return person.update(input);
                });
        } else {
            return "You don't have authorization to perform this action";
        }
    }
}
`;


module.exports.webservice_resolver_publisher = `
const publisher = require('../models-webservice/publisher');
const searchArg = require('../utils/search-argument');
const resolvers = require('./index');



publisher.prototype.booksFilter = function({
    input
}, context) {
    if (input === undefined) {
        return resolvers.books({
            "input": {
                "field": "publisherId",
                "value": {
                    "value": this.id
                },
                "operator": "eq"
            }
        }, context);
    } else {
        return resolvers.books({
                "input": input
            }, context)
            .then((result) => {
                return result.filter(item => {
                    if (item.publisherId == this.id) {
                        return true;
                    }
                });
            });
    }

}



module.exports = {
    publishers: function({
        input
    }, context) {
        /*
        YOUR CODE GOES HERE
        */
    },

    readOnePublisher: function({
        id
    }, context) {
        /*
        YOUR CODE GOES HERE
        */
    }
}`;

module.exports.local_model_person = `
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
        Person.belongsToMany(models.book, {
            through: 'books_to_people'
        });
    };

    return Person;
};
`;

module.exports.webservice_model_publisher = `
  module.exports = class publisher {

      constructor({
          id,
          name,
          phone
      }) {
          this.id = id;
          this.name = name;
          this.phone = phone;
      }
  }
`;
