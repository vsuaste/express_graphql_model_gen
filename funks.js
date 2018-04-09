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


module.exports.getOpts = function(jsonFile){
  let dataModel = parseFile(jsonFile);
  let opts = {
    name : dataModel.model,
    nameLc: dataModel.model.toLowerCase(),
    namePl: inflection.pluralize(dataModel.model.toLowerCase()),
    attributes: dataModel.attributes,
    attributesStr: attributesToString(dataModel.attributes)
  }

  return opts;
}


module.exports.generateSection = async function(section, opts, dir_write )
{
  let generatedSection = await generateJs('create-'+section ,opts);
  fs.writeFile(dir_write, generatedSection, function(err) {
    if (err)
    {
      return console.log(err);
    }
  });
}

module.exports.createNameMigration = function(dir_write, model_name)
{
  let date = new Date();
   date = date.toISOString().slice(0,19).replace(/[^0-9]/g, "");
  return dir_write + '/migrations/' + date + '-create-'+model_name +'.js';
}

module.exports.writeSchemaCommons = function(dir_write){

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

  fs.writeFile(dir_write + '/schemas/' +  'commons.js' , commons, function(err) {
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
