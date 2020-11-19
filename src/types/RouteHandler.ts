import { NextFunction, Request, Response } from 'express';

export type RouteHandler = (request: Request, response: Response, next: NextFunction) => void;
