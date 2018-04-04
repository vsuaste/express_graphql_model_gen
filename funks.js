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
module.exports.generateSchema = async function(schema){

    let dataSchema = parseFile(schema);
    let opts = {
      name : dataSchema.model,
      namePl: inflection.pluralize(dataSchema.model.toLowerCase()),
      attributes: dataSchema.attributes,
      attributesStr: attributesToString(dataSchema.attributes)
    }

    let generatedSchema = await generateJs('create-graphql-schema' , opts);

    //write file to specific directory
    fs.writeFile(__dirname + '/generated_files/schemas/' + dataSchema.model + '.js' , generatedSchema, function(err) {
      if (err)
        return console.log(err);
      });

    return 'Schema ' + dataSchema.model + ' written into ' + __dirname + '/generated_files/schemas/ succesfully!' ;
}

/*
  Generates Sequelize model given the json schema
*/
module.exports.generateModel = async function(schema){

  let dataSchema = parseFile(schema);
  let opts = {
    name : dataSchema.model,
    namePl: inflection.pluralize(dataSchema.model.toLowerCase()),
    nameLc: dataSchema.model.toLowerCase(),
    attributes: dataSchema.attributes,
    attributesStr: attributesToString(dataSchema.attributes)
  }

  let generatedSchema = await generateJs('create-sequelize-schema' , opts);

  //write file to specific directory
  fs.writeFile(__dirname + '/generated_files/models/' + dataSchema.model + '.js' , generatedSchema, function(err) {
    if (err)
      return console.log(err);
    });

  return 'Schema ' + dataSchema.model + ' written into ' + __dirname + '/generated_files/models/ succesfully!' ;

}
