# Code-generator

Command line utility to auto-generate the structure files that [this server](https://github.com/vsuaste/server-graphql-sequelize)
will use to perform CRUD operations for each model created.

## Set up:
Clone the repository and run:
```
$ npm install
```

## Usage:

```
$ code-generator --generate <input-json-files> <output-directory>
```

```
INPUT:
<input-json-files> - directory where json models are stored
<output-directory> - directory where the generated code will be written
```
This command will create(if doesn't exist) four folders containing the files created for each model in the ```input-json-files```:

* models ----> sequelize model
* schemas ----> graphQL schema
* resolvers ----> basic CRUD resolvers 
* migrations ----> create and delete table migration file


## Example of use:
In the same directory of this repository run:

```
$ code-generator --generate ./example_json_files /your_path_directory
```
If you want to complete the example with the [server](https://github.com/vsuaste/server-graphql-sequelize)
make ```/your_path_directory``` the same directory where the server repository is stored.
