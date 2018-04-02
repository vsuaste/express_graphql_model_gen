var fs = require('fs');
const path = require('path');
const ejs = require('ejs');
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

module.exports.generateSchema = async function(schema){

    let dataSchema = parseFile(schema);
    let opts = {
      name : dataSchema.model,
      attributes: dataSchema.attributes
    }

    let generatedSchema = await generateJs('create-graphql-schema' , opts);

    //write file to specific directory
    fs.writeFile(__dirname + '/generated_files/schemas/' + dataSchema.model + '.js' , generatedSchema, function(err) {
      if (err)
        return console.log(err);
      });

    return 'Schema ' + dataSchema.model + ' written into ' + __dirname + '/generated_files/schemas/ succesfully!' ;
}
