const expect = require('chai').expect;
var fs = require('fs');
const test = require('./data-test');
const funks = require('../funks');

//Generate code
funks.generateCode(__dirname + '/test-data-json',__dirname + '/test-data-output' );


//Test for each case with generated code
describe('GrpahQL Schemas', function(){
  it('GraphQL Local Storage Schema', function(){
    fs.readFile(__dirname + '/test-data-output/schemas/project.js', 'utf8', (err, data) =>{
      let test_graphql =  test.local_graphql_project.replace(/\s/g, '');
      let created_graphql = data.replace(/\s/g, '');
      expect(created_graphql).to.be.equal(test_graphql);
    });
  });

  it('GraphQL Webservice Schema', function(){
    fs.readFile(__dirname + '/test-data-output/schemas/specie.js', 'utf8', (err, data) =>{
      let test_graphql = test.webservice_graphql_specie.replace(/\s/g, '');
      let created_graphql = data.replace(/\s/g, '');
      expect(created_graphql).to.be.equal(test_graphql);
    });
  });

});


describe('Resolvers', function(){
  it('Local Storage Resolver', function(){
    fs.readFile(__dirname + '/test-data-output/resolvers/project.js', 'utf8', (err, data) =>{
      let test_resolver =  test.local_resolver_project.replace(/\s/g, '');
      let created_resolver = data.replace(/\s/g, '');
      expect(created_resolver).to.be.equal(test_resolver);
    });
  });

  it('Webservice Resolver', function(){
    fs.readFile(__dirname + '/test-data-output/resolvers/specie.js', 'utf8', (err, data) =>{
      let test_resolver = test.webservice_resolver_specie.replace(/\s/g, '');
      let created_resolver = data.replace(/\s/g, '');
      expect(created_resolver).to.be.equal(test_resolver);
    });
  });

});

describe('Models', function(){
  it('Local Storage Model', function(){
    fs.readFile(__dirname + '/test-data-output/models/researcher.js', 'utf8', (err, data) =>{
      let test_model =  test.local_model_researcher.replace(/\s/g, '');
      let created_model = data.replace(/\s/g, '');
      expect(created_model).to.be.equal(test_model);
    });
  });

  it('Webservice Model', function(){
    fs.readFile(__dirname + '/test-data-output/models-webservice/specie.js', 'utf8', (err, data) =>{
      let test_model = test.webservice_model_specie.replace(/\s/g, '');
      let created_model = data.replace(/\s/g, '');
      expect(created_model).to.be.equal(test_model);
    });
  });

});


describe('Migrations', function(){
  it('Local Migration', function(){

    fs.readdirSync(__dirname + '/test-data-output/migrations')
    .filter(function(file){
      return (file.slice(-14)==='-researcher.js');
    }).forEach(function(file){
      console.log("Files: ",file);
      fs.readFile(__dirname + '/test-data-output/migrations/'+file, 'utf8', (err, data) =>{
        let test_migration =  test.local_migration_researcher.replace(/\s/g, '');
        let created_migration = data.replace(/\s/g, '');
        expect(created_migration).to.be.equal(test_migration);
      });
    })


  });

  // it('Through Migration', function(){
  //   fs.readFile(__dirname + '/test-data-output/models-webservice/specie.js', 'utf8', (err, data) =>{
  //     let test_model = test.webservice_model_specie.replace(/\s/g, '');
  //     let created_model = data.replace(/\s/g, '');
  //     expect(created_model).to.be.equal(test_model);
  //   });
  // });

});
