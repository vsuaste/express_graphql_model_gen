module.exports.local_graphql_book = `
module.exports = \`
  type Book  {
      title: String
      genre: String
        publisher: Publisher
        peopleFilter(input: searchPersonInput): [Person]
  }

  enum BookField {
    id
    title
    genre
  }

  input searchBookInput {
    field: BookField
    value: typeValue
    operator: Operator
    searchArg: [searchBookInput]
  }

  type Query {
    books(input: searchBookInput): [Book]
    readOneBook(id: ID!): Book
  }

    type Mutation {
    addBook( title: String, genre: String, publisherId: Int   ): Book
    deleteBook(id: ID!): String!
    updateBook(id: ID!, title: String, genre: String, publisherId: Int  ): Book!
    bulkAddBookXlsx: [Book]
    bulkAddBookCsv: [Book]
}
  \`;`;


module.exports.webservice_graphql_publiser = `
module.exports = \`
  type Publisher  {
      name: String
      phone: String
          booksFilter(input: searchBookInput): [Book]
  }

  enum PublisherField {
    id
    name
    phone
  }

  input searchPublisherInput {
    field: PublisherField
    value: typeValue
    operator: Operator
    searchArg: [searchPublisherInput]
  }

  type Query {
    publishers(input: searchPublisherInput): [Publisher]
    readOnePublisher(id: ID!): Publisher
  }

  \`;`;
