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
  if(attributes==='undefined') return str_attributes;

  for(key in attributes)
  {
    str_attributes+= key + ': ' + attributes[key] + ', '
  }

  return str_attributes.slice(0,-2);
}


writeSchemaCommons = function(dir_write){

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

writeIndexModelsCommons = function(dir_write){

  let index =  `
  const fs = require('fs');
  const path = require('path')
  sequelize = require('../connection');

  var models = {};

  //grabs all the models in your models folder, adds them to the models object
  fs.readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    models[model.name] = model;
  });
  //Important: creates associations based on associations defined in associate function in the model files
  Object.keys(models).forEach(function(modelName) {
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }
  });
  //update tables with association (temporary, just for testing purposes)
  //this part is suppose to be done in the migration file
  sequelize.sync({force: true});
  module.exports = models;
  `;

  fs.writeFile(dir_write + '/models/' +  'index.js' , index, function(err) {
    if (err)
      return console.log(err);
    });
}

module.exports.addAssociations = function(associations, summary_associations, source_model)
{
    //console.log(typeof associations);
    if(typeof associations === 'object')
    {
      Object.entries(associations).forEach(([key, value])=>{
        value.forEach( association => {
          summary_associations[key].push([source_model, association.target]);
        });
      });
    }
}

module.exports.getOpts = function(jsonFile){
  let dataModel = parseFile(jsonFile);
  let opts = {
    name : dataModel.model,
    nameLc: dataModel.model.toLowerCase(),
    namePl: inflection.pluralize(dataModel.model.toLowerCase()),
    attributes: dataModel.attributes,
    assoc_attributes: (dataModel.assoc_attributes==='undefined' ? []: dataModel.assoc_attributes),
    foreign_attributes: (dataModel.foreign_attributes==='undefined' ? []: dataModel.foreign_attributes),
    attributesStr: attributesToString(dataModel.attributes),
    foreign_attributesStr: attributesToString(dataModel.foreign_attributes),
    associations: dataModel.associations
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

module.exports.writeCommons = function(dir_write){
  writeSchemaCommons(dir_write);
  writeIndexModelsCommons(dir_write);
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
