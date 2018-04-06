var fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const inflection = require('inflection');
const jsb = require('js-beautify').js_beautify;
const {promisify} = require('util');
const ejsRenderFile = promisify( ejs.renderFile );

parseFile = function(jFile){
  let data=fs.readFileSync(jFile, 'utf8');
  let words=JSON.parse(data);
  return words;
}


// Generate the Javascript code (GraphQL-schema/resolvers/Sequelize-model) using EJS templates
generateJs = async function(templateName, options) {
  let renderedStr = await ejsRenderFile(__dirname + '/views/' +
    templateName +
    '.ejs', options, {})
  let prettyStr = jsb(renderedStr)
  return prettyStr;
}

attributesToString = function(attributes){

  let str_attributes="";
  for(key in attributes)
  {
    str_attributes+= key + ': ' + attributes[key] + ', '
  }

  return str_attributes.slice(0,-2);
}

/*
  Generates GraphQL Schema Type, Query, Mutation
  given the json schema
*/
module.exports.generateSchema = async function(schema, dir_write){

    let dataSchema = parseFile(schema);
    let opts = {
      name : dataSchema.model,
      namePl: inflection.pluralize(dataSchema.model.toLowerCase()),
      attributes: dataSchema.attributes,
      attributesStr: attributesToString(dataSchema.attributes)
    }

    let generatedSchema = await generateJs('create-graphql-schema' , opts);

    //write file to specific directory
    fs.writeFile(dir_write + '/schemas/' + dataSchema.model + '.js' , generatedSchema, function(err) {
      if (err)
      {
        return console.log(err);
      }
    });
}

/*
  Generates Sequelize model given the json schema
*/
module.exports.generateModel = async function(schema, dir_write){

  let dataSchema = parseFile(schema);
  let opts = {
    name : dataSchema.model,
    namePl: inflection.pluralize(dataSchema.model.toLowerCase()),
    nameLc: dataSchema.model.toLowerCase(),
    attributes: dataSchema.attributes
  }

  let generatedSchema = await generateJs('create-sequelize-schema' , opts);

  //write file to specific directory
  fs.writeFile(dir_write + '/models/' + dataSchema.model + '.js' , generatedSchema, function(err) {
    if (err){
      return console.log(err);
    }
  });
}

/*
  Generates Resolvers (basic CRUD operations) for the model given
  in the json schema
*/
module.exports.generateResolvers = async function(schema, dir_write){

  let dataSchema = parseFile(schema);
  let opts = {
    name : dataSchema.model,
    namePl: inflection.pluralize(dataSchema.model.toLowerCase()),
    nameLc: dataSchema.model.toLowerCase(),
    attributes: dataSchema.attributes,
  }

  let generatedResolvers = await generateJs('create-resolvers' , opts);

  //write file to specific directory
  fs.writeFile(dir_write + '/resolvers/' + dataSchema.model + '.js' , generatedResolvers, function(err) {
    if (err)
    {
      return console.log(err);
    }
  });



}

module.exports.writeSchemaCommons = function(){

  let commons = `module.exports = \`

  enum Operator{
    like
    or
    and
    eq
    between
    in
  }

  input typeValue{
    type: String
    value: String!
  }

\`;`;

  fs.writeFile(__dirname + '/generated_files/schemas/' +  'commons.js' , commons, function(err) {
    if (err)
      return console.log(err);
    });
}


module.exports.generateTests = async function(jsonSchema){
  let dataSchema = parseFile(jsonSchema);
  let opts = {
    name : dataSchema.model,
    namePl: inflection.pluralize(dataSchema.model.toLowerCase()),
    nameLc: dataSchema.model.toLowerCase(),
    attributes: dataSchema.attributes,
    attributesStr: attributesToString(dataSchema.attributes)
  }

  let generatedSchema = await generateJs('create-graphql-schema' , opts);
  fs.writeFile(__dirname + '/tests' +  '/created-schema.js' , generatedSchema, function(err) {
    if (err)
      return console.log(err);
    });

  let generatedModel = await generateJs('create-sequelize-schema' , opts);
  fs.writeFile(__dirname + '/tests' +  '/created-model.js' , generatedModel, function(err) {
    if (err)
      return console.log(err);
    });

  let generatedResolvers = await generateJs('create-resolvers' , opts);
  fs.writeFile(__dirname + '/tests' +  '/created-resolvers.js' , generatedResolvers, function(err) {
    if (err)
      return console.log(err);
    });


}
