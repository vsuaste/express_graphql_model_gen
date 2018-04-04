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
    let out_graphql_schema = await funks.generateSchema(jfile);
    console.log(out_graphql_schema);

    let out_sequelize_schema = await funks.generateModel(jfile);
    console.log(out_sequelize_schema);

    let out_resolvers = await funks.generateResolvers(jfile);
    console.log(out_resolvers);
  });

program.parse(process.argv);
