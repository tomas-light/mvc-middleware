import { json } from 'body-parser';
import cors from 'cors';
import express from 'express';
import http from 'http';
import { MvcMiddleware } from 'mvc-middleware';
import path from 'path';

const controllersPath = path.join(__dirname, 'api');

const expressApp = express();
expressApp.use(cors()).use(json());

const mvcMiddleware = new MvcMiddleware(expressApp);

(async () => {
  await mvcMiddleware.registerControllers(controllersPath);

  http.createServer(expressApp).listen(80, 'localhost');
})();
