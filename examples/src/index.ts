import { json } from 'body-parser';
import { container } from 'cheap-di';
import express, { RequestHandler } from 'express';
import http from 'http';
import { MvcMiddleware } from 'mvc-middleware';
import { api } from 'mvc-middleware/dist/decorators/api';
import path from 'path';

const app = express();
app.use(json({ limit: '50mb' }) as RequestHandler);

const controllersPath = path.join(__dirname, 'api');

new MvcMiddleware(app, container).registerControllers(controllersPath);

const server = http.createServer(app);

const host = 'localhost';
const port = 3000;

server.listen(port, host);