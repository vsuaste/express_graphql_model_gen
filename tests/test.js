var fs = require('fs');
const test = require('./data-test');
const funks = require('../funks');
const assert = require('assert');

/*
  Generate graphQL schema, resolvers and sequelize model
  for sample-test.json file
*/
funks.generateTests(__dirname + '/sample-test.json').then(()=>{

    //TEST GraphQL schema
    fs.readFile(__dirname + '/created-schema.js', 'utf8', (err, data) =>{
      let test_graphql =  test.graphql.replace(/\s/g, '');
      let created_graphql = data.replace(/\s/g, '');
      assert.strictEqual(created_graphql, test_graphql, "GraphQL schema test failed");
      console.log("GraphQL schema test passed succesfully!");
    });

    // TEST Resolver
    fs.readFile(__dirname + '/created-resolvers.js', 'utf8', (err, data) =>{
      let test_resolver = test.resolver.replace(/\s/g, '');
      let created_resolver = data.replace(/\s/g, '');
      assert.strictEqual(created_resolver, test_resolver, "Resolver test failed");
      console.log("Resolvers test passed succesfully!");
    });

    //TEST Sequelize model
    fs.readFile(__dirname + '/created-model.js', 'utf8', (err, data)=> {
      let test_sequelize =  test.sequelize.replace(/\s/g, '');
      created_sequelize = data.replace(/\s/g, '');
      assert.strictEqual(created_sequelize, test_sequelize, "Sequelize schema test failed");
      console.log("Sequelize schema test passed succesfully!");
    });

});



//testing();
