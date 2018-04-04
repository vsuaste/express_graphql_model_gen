const program = require('commander');

const funks = require('./funks');

program
  .version('0.0.1')
  .description('Code generator for GraphQL server');

program
  .command('--generate <json-file>')
  .alias('g')
  .description('Generate code for all models described in the input json file (json-file)')
  .action(async(jfile) => {
    /*
      output will be a statement that the schema was generated succesfully
      or error otherwise
    */
    let output = await funks.generateSchema(jfile);
    console.log(output);
  });

program.parse(process.argv);
