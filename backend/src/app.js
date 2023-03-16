const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const cors = require('kcors');

const database = require('./database');


// Create a new Koa instance for our API
const app = new Koa();

// Export the instance for server.js to run
module.exports = app;

// Use the koa-logger middleware to display the summary of
// requests and responses in the console
app.use(logger());

// Set up CORS middleware to tell the browser
// that requests from all domains are allowed
app.use(cors({ credentials: true }));

// Set up JSON parsing for request bodies.
// Allows the use of `ctx.request.body
app.use(bodyParser());

// Lists Chat entries in the database and returns them
// in the response body with status code 200
const listChats = async (ctx) => {
  let options = {};
  let chats = "No chats found";
  if (ctx.params.room) {
    options = {where: {room: ctx.params.room}};
    chats = await database.Chat.findAll(options);
  } else {
    chats = await database.Chat.findAll(options);
  }

  const response = {
    results: chats,
  };

  ctx.body = response;
  /*
  ctx.body = "";
  for (var i = 0; i < response.results.length; i++) {
    current_msg = response.results[i];
    ctx.body += current_msg.message+" "+current_msg.i;
  }*/
};

// Creates a Chat entry in the database and returns it
// in the response body with status code 201.
// Fails with 500 if message was not provided
const greeting = async (ctx) => {
  ctx.body = "Tervetuloa chattipalstalle";
  ctx.status = 200
}
const createChat = async (ctx) => {
  const { body } = ctx.request;

  const { message, nickname, room } = body;

  const chat = await database.Chat.create({ message, nickname, room });

  ctx.body = chat;
  ctx.status = 201;
};

// A Koa router for connecting endpoints to middleware
const publicRouter = new Router({ prefix: '/api' });

// Connect the GET /api/chats endpoint to listChats middleware
publicRouter.get('/chats/:room(\\d+)*', listChats);
publicRouter.get('/Terve',greeting);

// Connect the POST /api/chats endpoint to createChats middleware
publicRouter.post('/chats', createChat);

// Add the router middleware to the Koa instance
app.use(publicRouter.routes());

// Add a middleware for responding to OPTIONS with a list of
// allowed methods
app.use(publicRouter.allowedMethods());