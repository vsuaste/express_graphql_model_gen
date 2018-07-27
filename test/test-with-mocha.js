const expect = require('chai').expect;
var fs = require('fs');
const test = require('./data-test');
const funks = require('../funks');

//Generate code
funks.generateCode(__dirname + '/test-data-json',__dirname + '/test-data-output' );


//Test for each case with generated code
describe('GrpahQL Schemas', function(){
  it('GraphQL Local Storage Schema', function(){
    fs.readFile(__dirname + '/test-data-output/schemas/book.js', 'utf8', (err, data) =>{
      let test_graphql =  test.local_graphql_book.replace(/\s/g, '');
      let created_graphql = data.replace(/\s/g, '');
      expect(created_graphql).to.be.equal(test_graphql);
    });
  });

  it('GraphQL Webservice Schema', function(){
    fs.readFile(__dirname + '/test-data-output/schemas/publisher.js', 'utf8', (err, data) =>{
      let test_graphql = test.webservice_graphql_publiser.replace(/\s/g, '');
      let created_graphql = data.replace(/\s/g, '');
      expect(created_graphql).to.be.equal(test_graphql);
    });
  });

});


describe('Resolvers', function(){
  it('Local Storage Resolver', function(){
    fs.readFile(__dirname + '/test-data-output/resolvers/person.js', 'utf8', (err, data) =>{
      let test_resolver =  test.local_resolver_person.replace(/\s/g, '');
      let created_resolver = data.replace(/\s/g, '');
      expect(created_resolver).to.be.equal(test_resolver);
    });
  });

  it('Webservice Resolver', function(){
    fs.readFile(__dirname + '/test-data-output/resolvers/publisher.js', 'utf8', (err, data) =>{
      let test_resolver = test.webservice_resolver_publisher.replace(/\s/g, '');
      let created_resolver = data.replace(/\s/g, '');
      expect(created_resolver).to.be.equal(test_resolver);
    });
  });

});
