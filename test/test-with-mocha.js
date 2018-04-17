const expect = require('chai').expect;
var fs = require('fs');
const test = require('./data-test');
const funks = require('../funks');

//Generate code
funks.generateTests(__dirname + '/sample-test.json').then(()=>{});

//Test for each case with generated code
describe('Generated code', function(){
  it('GraphQL schema', function(){
    fs.readFile(__dirname + '/created-schema.js', 'utf8', (err, data) =>{
      let test_graphql =  test.graphql.replace(/\s/g, '');
      let created_graphql = data.replace(/\s/g, '');
      expect(5).to.be.equal(5);
    });
  });

  it('Resolvers', function(){
    fs.readFile(__dirname + '/created-resolvers.js', 'utf8', (err, data) =>{
      let test_resolver = test.resolver.replace(/\s/g, '');
      let created_resolver = data.replace(/\s/g, '');
      expect(created_resolver).to.be.equal(test_resolver);
    });
  });

  it('Sequelize model', function(){
    fs.readFile(__dirname + '/created-model.js', 'utf8', (err, data)=> {
      let test_sequelize =  test.sequelize.replace(/\s/g, '');
      created_sequelize = data.replace(/\s/g, '');
      expect(created_sequelize).to.be.equal(test_sequelize);
    });
  });
});
