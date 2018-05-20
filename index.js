#!/usr/bin/env node

const program = require('commander');
var fs = require('fs');
const funks = require('./funks');
console.log("Generating files...");

program
  .version('0.0.1')
  .description('Code generator for GraphQL server');

program
  .command('generate <json-files-folder> [dir_to_write]')
  .alias('g')
  .description('Generate code for each model described by each input json file in the \'json-files-folder\'')
  .action((json_dir, dir_write) => {
      console.log("Generating files...");
      dir_write = (dir_write===undefined) ? __dirname : dir_write;
      let sections = ['schemas', 'resolvers', 'models', 'migrations'];
      let models = [];
      let attributes_schema = {};
      let summary_associations = {'one-many': [], 'many-many': {}};

      // creates one folder for each of schemas, resolvers, models
      sections.forEach( (section) => {
        if(!fs.existsSync(dir_write+'/'+section))
        {
          fs.mkdirSync(dir_write+'/'+section);
        }
      });

      //get associations information (first iteration over json files)
      fs.readdirSync(json_dir).forEach((json_file) => {
          let opts = funks.getOpts(json_dir+'/'+json_file);
          models.push([opts.name , opts.namePl]);
          funks.getAllAttributesForSchema(opts,attributes_schema);
          console.log(attributes_schema);
      });

      // creates schema, resolvers and model for each json file provided (second iteration over json files)

      fs.readdirSync(json_dir).forEach( async (json_file) => {

          let opts = funks.getOpts(json_dir+'/'+json_file);

          funks.addAssociations( opts.associations, summary_associations, opts.table);
          funks.concatenateExtraAttributes(opts,attributes_schema[opts.name]);
          //console.log(opts);
          sections.forEach((section) =>{
              let file_name = "";
              if(section==='migrations')
              {
                file_name = funks.createNameMigration(dir_write,opts.nameLc);
              }else{
                file_name = dir_write + '/'+ section +'/' + opts.nameLc + '.js';
              }

              funks.generateSection(section, opts, file_name)
              .then( () => {
                  console.log(file_name + ' written succesfully!');
              });
          });
      });

      funks.writeCommons(dir_write);

      //write resolvers index for all models
      let index_resolvers_file = dir_write + '/resolvers/index.js';
      funks.generateSection('resolvers-index',{models: models} ,index_resolvers_file)
      .then( () => {
        console.log('resolvers-index written succesfully!');
      });

      funks.generateAssociationsMigrations(summary_associations,dir_write);

  });

program.parse(process.argv);
