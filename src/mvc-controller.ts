import { Request, Response } from 'express';
import path from 'path';

export class MvcController {
  private __type__: InstanceType<any>;
  protected request: Request;
  private response: Response;

  constructor(request: Request, response: Response) {
    if (new.target === MvcController) {
      throw new TypeError('Cannot construct MvcController instances directly');
    }

    this.__type__ = new.target;
    Object.defineProperty(this, '__type__', {
      configurable: false,
      enumerable: false,
      writable: false,
    });

    this.request = request;
    this.response = response;
  }

  getViewPath(viewName: string, area: string) {
    // @ts-ignore
    const appDir = path.dirname(require.main.filename);
    const publicPath = path.join(appDir, 'public');

    if (area) {
      return path.join(publicPath, 'views', area, `${viewName}.html`);
    }
    return path.join(publicPath, 'views', `${viewName}.html`);
  }

  view(viewName: string) {
    const pathToView = this.getViewPath(viewName, this.__type__.area);
    this.response.sendFile(pathToView);
  }

  ok(model?: any) {
    this.sendResponse(model, 200);
  }

  created(model?: any) {
    this.sendResponse(model, 201);
  }

  accepted(model?: any) {
    this.sendResponse(model, 202);
  }

  noContent() {
    this.response.sendStatus(204);
  }

  found(url: string) {
    this.redirect(302, url);
  }

  permanentRedirect(url: string) {
    this.redirect(308, url);
  }

  redirect(statusCode: number, url: string) {
    if (statusCode < 300 || statusCode > 308) {
      throw new Error(`Invalid argument: statusCode (${statusCode}). Status code should be in interval 300 - 308`);
    }
    this.response.redirect(statusCode, url);
  }

  badRequest(model?: any) {
    this.sendResponse(model, 400);
  }

  unauthorized(model?: any) {
    this.sendResponse(model, 401);
  }

  forbid() {
    this.response.sendStatus(403);
  }

  notFound(model?: any) {
    this.sendResponse(model, 404);
  }

  conflict(model?: any) {
    this.sendResponse(model, 409);
  }

  serverError(model?: any) {
    this.sendResponse(model, 500);
  }

  private toJson(model?: any) {
    if (typeof model !== 'object') {
      return model;
    }

    this.response.setHeader('Content-Type', 'application/json');
    return JSON.stringify(model);
  }

  protected sendResponse(model: any, statusCode: number = 200) {
    if (statusCode < 100 ||
      statusCode > 103 && statusCode < 200 ||
      statusCode > 226 && statusCode < 300 ||
      statusCode > 308 && statusCode < 400 ||
      statusCode > 449 && statusCode < 500 ||
      statusCode > 526
    ) {
      throw new Error(`Invalid argument: statusCode (${statusCode}).`);
    }
    const result = typeof model !== 'string' ? this.toJson(model) : model;
    this.response.status(statusCode).send(result);
  }

  protected get url() {
    return this.request.url;
  }

  protected get headers() {
    return this.request.headers;
  }

  protected get params() {
    return this.request.params;
  }

  protected get body() {
    return this.request.body;
  }

  protected get query() {
    return this.request.query;
  }
}
