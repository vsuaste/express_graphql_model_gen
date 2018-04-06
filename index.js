const program = require('commander');
var fs = require('fs');
const funks = require('./funks');

program
  .version('0.0.1')
  .description('Code generator for GraphQL server');

program
  .command('--generate <json-files-folder> [dir_to_write]')
  .alias('g')
  .description('Generate code for all models described in the input json file (json-file)')
  .action((json_dir, dir_write) => {

    dir_write = (dir_write===undefined) ? __dirname : dir_write;

      fs.mkdirSync(dir_write+"/models");
      fs.mkdirSync(dir_write+"/resolvers");
      fs.mkdirSync(dir_write+"/schemas");

      fs.readdirSync(json_dir).forEach( async (json_file) => {

        funks.generateSchema(json_dir+'/'+json_file, dir_write)
        .then( () => {
          console.log('Schema ' + json_file + ' written into ' + dir_write + '/schemas/ succesfully!');
        });

        funks.generateModel(json_dir+'/'+json_file, dir_write)
        .then( () => {
          console.log('Model ' + json_file + ' written into ' + dir_write + '/models/ succesfully!');
        });

        funks.generateResolvers(json_dir+'/'+json_file, dir_write)
        .then( () => {
          console.log('Resolvers ' + json_file + ' written into ' + dir_write + '/resolvers/ succesfully!');
        });

      });

      funks.writeSchemaCommons();
  });

program.parse(process.argv);
