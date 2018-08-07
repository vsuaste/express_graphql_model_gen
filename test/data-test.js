module.exports.local_graphql_project = `
module.exports = \`
  type Project  {
      name: String
      description: String
        specie: Specie
        researchersFilter(input: searchResearcherInput): [Researcher]
  }

  enum ProjectField {
    id
    name
    description
  }

  input searchProjectInput {
    field: ProjectField
    value: typeValue
    operator: Operator
    searchArg: [searchProjectInput]
  }

  type Query {
    projects(input: searchProjectInput): [Project]
    readOneProject(id: ID!): Project
  }

    type Mutation {
    addProject( name: String, description: String, specieId: Int   ): Project
    deleteProject(id: ID!): String!
    updateProject(id: ID!, name: String, description: String, specieId: Int  ): Project!
    bulkAddProjectXlsx: [Project]
    bulkAddProjectCsv: [Project]
}
  \`;`;


module.exports.webservice_graphql_specie = `
module.exports = \`
  type Specie  {
      nombre: String
      e_nombre_comun_principal: String
      e_foto_principal: String
      nombre_cientifico: String
          projectsFilter(input: searchProjectInput): [Project]
  }

  enum SpecieField {
    id
    nombre
    e_nombre_comun_principal
    e_foto_principal
    nombre_cientifico
  }

  input searchSpecieInput {
    field: SpecieField
    value: typeValue
    operator: Operator
    searchArg: [searchSpecieInput]
  }

  type Query {
    species(input: searchSpecieInput): [Specie]
    readOneSpecie(id: ID!): Specie
  }

  \`;`;

module.exports.local_resolver_project = `
/*
    Resolvers for basic CRUD operations
*/

const project = require('../models/index').project;
const searchArg = require('../utils/search-argument');
const fileTools = require('../utils/file-tools');
var checkAuthorization = require('../utils/check-authorization');
const specie = require('./specie');

project.prototype.researchersFilter = function({
    input
}, context) {
    if (input === undefined) {
        return this.getResearchers({
            include: [{
                all: true
            }]
        });
    } else {
        let arg = new searchArg(input);
        let arg_sequelize = arg.toSequelize();
        return this.getResearchers({
            where: arg_sequelize,
            include: [{
                all: true
            }]
        });
    }
}
project.prototype.specie = function(_, context) {
    return specie.readOneSpecie({
        "id": this.specieId
    }, context);
}




module.exports = {

    projects: function({
        input
    }, context) {
        if (checkAuthorization(context, 'projects', 'read') == true) {
            if (input === undefined) {
                return project.findAll({
                    include: [{
                        all: true
                    }]
                });
            } else {
                let arg = new searchArg(input);
                let arg_sequelize = arg.toSequelize();
                return project.findAll({
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

    readOneProject: function({
        id
    }, context) {
        if (checkAuthorization(context, 'projects', 'read') == true) {
            return project.findOne({
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

    addProject: function(input, context) {
        if (checkAuthorization(context, 'projects', 'create') == true) {
            return project.create(input)
                .then(project => {
                    return project;
                });
        } else {
            return "You don't have authorization to perform this action";
        }
    },

    bulkAddProjectXlsx: function(_, context) {
        let xlsxObjs = fileTools.parseXlsx(context.request.files.xlsx_file.data.toString('binary'));
        return project.bulkCreate(xlsxObjs, {
            validate: true
        });
    },

    bulkAddProjectCsv: function(_, context) {
        //delim = context.request.body.delim;
        //cols = context.request.body.cols;
        return fileTools.parseCsv(context.request.files.csv_file.data.toString())
            .then((csvObjs) => {
                return project.bulkCreate(csvObjs, {
                    validate: true
                });
            });
    },

    deleteProject: function({
        id
    }, context) {
        if (checkAuthorization(context, 'projects', 'delete') == true) {
            return project.findById(id)
                .then(project => {
                    return project.destroy()
                        .then(() => {
                            return 'Item succesfully deleted';
                        });
                });
        } else {
            return "You don't have authorization to perform this action";
        }
    },

    updateProject: function(input, context) {
        if (checkAuthorization(context, 'projects', 'update') == true) {
            return project.findById(input.id)
                .then(project => {
                    return project.update(input);
                });
        } else {
            return "You don't have authorization to perform this action";
        }
    }
}
`;


module.exports.webservice_resolver_specie = `
const specie = require('../models-webservice/specie');
const searchArg = require('../utils/search-argument');
const resolvers = require('./index');


specie.prototype.projectsFilter = function({
    input
}, context) {
    if (input === undefined) {
        return resolvers.projects({
            "input": {
                "field": "specieId",
                "value": {
                    "value": this.id
                },
                "operator": "eq"
            }
        }, context);
    } else {
        return resolvers.projects({
            "input": {
                "operator": "and",
                "searchArg": [{
                    "field": "specieId",
                    "value": {
                        "value": this.id
                    },
                    "operator": "eq"
                }, input]
            }
        }, context)
    }

}



module.exports = {
    species: function({
        input
    }, context) {
        /*
        YOUR CODE GOES HERE
        */
    },

    readOneSpecie: function({
        id
    }, context) {
        /*
        YOUR CODE GOES HERE
        */

    }
}
`;

module.exports.webservice_model_specie = `
module.exports = class specie {

    constructor({
        id,
        nombre,
        e_nombre_comun_principal,
        e_foto_principal,
        nombre_cientifico
    }) {
        this.id = id;
        this.nombre = nombre;
        this.e_nombre_comun_principal = e_nombre_comun_principal;
        this.e_foto_principal = e_foto_principal;
        this.nombre_cientifico = nombre_cientifico;
    }
}
`;

module.exports.local_model_researcher = `
'use strict';

module.exports = function(sequelize, DataTypes) {
    var Researcher = sequelize.define('researcher', {

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

    Researcher.associate = function(models) {
        Researcher.belongsToMany(models.project, {
            through: 'project_to_researcher'
        });
    };

    return Researcher;
};
`;

module.exports.local_migration_researcher = `
'use strict';

module.exports = {

    up: function(queryInterface, Sequelize) {
        return queryInterface.createTable('researchers', {

            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },

            createdAt: {
                type: Sequelize.DATE
            },

            updatedAt: {
                type: Sequelize.DATE
            },


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
    },

    down: function(queryInterface, Sequelize) {
        return queryInterface.dropTable('researchers');
    }

};
`;

module.exports.through_migration = `
'use strict';

module.exports = {

    up: function(queryInterface, Sequelize) {
        return queryInterface.createTable('project_to_researcher', {

            createdAt: {
                type: Sequelize.DATE
            },

            updatedAt: {
                type: Sequelize.DATE
            },

            researcherId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'researchers',
                    key: 'id'
                }
            },

            projectId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'projects',
                    key: 'id'
                }
            }
        });
    },

    down: function(queryInterface, Sequelize) {
        return queryInterface.dropTable('project_to_researcher');
    }

};
`;
