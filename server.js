'use strict';
const Hapi = require('hapi');
const {graphiqlHapi, graphqlHapi} = require('apollo-server-hapi');
const { makeExecutableSchema } = require('graphql-tools');

const HOST = 'localhost';
const PORT = 8888;

const server = Hapi.server({
  host: HOST,
  port: PORT
});

const books = [
  {
    id: 1,
    title: 'Harry Potter and the Sorcerer\'s stone',
    author: 'J.K. Rowling'
  },
  {
    id: 2,
    title: 'Jurassic Park',
    author: 'Michael Crichton'
  }
];

const typeDefs = `
  type Query { books: [Book] }
  type Book { id: ID, title: String, author: String }
`;

// The resolvers
const resolvers = {
  Query: { books: () => books },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});


server.route({
  method: 'Get',
  path: '/ping',
  handler: (request, h) => {
    return 'pong';
  }
});

async function start() {

  await server.register({
    plugin: graphqlHapi,
    options: {
      path: '/graphql',
      graphqlOptions: {
        schema: schema
      },
      route: {
        cors: true
      }
    }
  });

  await server.register({
    plugin: graphiqlHapi,
    options: {
      path: '/graphiql',
      graphiqlOptions: {
        endpointURL: '/graphql'
      }
    }
  });

  try {
    await server.start();
  } catch(err) {
    console.log(err);
    process.exit(1);
  }

  console.log(`Server running at: ${server.info.uri}`);
};

start();

