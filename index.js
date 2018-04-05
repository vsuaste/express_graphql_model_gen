const program = require('commander');
var fs = require('fs');
const funks = require('./funks');

program
  .version('0.0.1')
  .description('Code generator for GraphQL server');

program
  .command('--generate <json-files-folder>')
  .alias('g')
  .description('Generate code for all models described in the input json file (json-file)')
  .action((json_dir) => {

      fs.readdirSync(json_dir).forEach( async (json_file) => {
        //console.log(json_file);
        /*
          output will be a statement that the schema was generated succesfully
          or error otherwise
        */
        let out_graphql_schema = await funks.generateSchema(json_dir+'/'+json_file);
        console.log(out_graphql_schema);

        let out_sequelize_schema = await funks.generateModel(json_dir+'/'+json_file);
        console.log(out_sequelize_schema);

        let out_resolvers = await funks.generateResolvers(json_dir+'/'+json_file);
        console.log(out_resolvers);
        });

      funks.writeSchemaCommons();
  });

program.parse(process.argv);
