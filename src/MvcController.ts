import { Request, Response } from 'express';

export class MvcController {
  constructor(protected request: Request, protected response: Response) {
    if (new.target === MvcController) {
      throw new TypeError('Cannot construct MvcController instances directly');
    }
  }

  /** request url */
  protected get url() {
    return this.request.url;
  }

  /** request headers */
  protected get headers() {
    return this.request.headers;
  }

  /**
   * @example
   * // route is '/student/:id'
   * const { id } = this.urlParams(); // { id: string }
   * */
  protected get urlParams() {
    return this.request.params;
  }

  /** to be able to get key-value pairs of the data passed in a body of the request, you need to add
   * `express.urlencoded()` or `express.json()` middlewares to your express app
   * */
  protected get body() {
    return this.request.body;
  }

  /** is an object containing the property for each query string parameter in the route
   * @example
   * // route is '/view?search=Joe&age=25'
   * const { search, age } = this.searchParams(); // { search: 'Joe', age: 25, }
   * */
  protected get searchParams() {
    return this.request.query;
  }

  /** 200 status */
  ok(model?: any) {
    this.sendResponse(model, 200);
  }

  /** 201 status */
  created(model?: any) {
    this.sendResponse(model, 201);
  }

  /** 202 status */
  accepted(model?: any) {
    this.sendResponse(model, 202);
  }

  /** 204 status */
  noContent() {
    this.response.sendStatus(204);
  }

  /** 302 status */
  found(url: string) {
    this.redirect(302, url);
  }

  /** 308 status */
  permanentRedirect(url: string) {
    this.redirect(308, url);
  }

  /** It checks if your status code is valid for this operation and perform redirection if it is.
   * @example
   * this.redirect(150, ''); // throws an Error(  `Invalid argument: statusCode (150). Status code should be in interval 300 - 308`) */
  redirect(statusCode: number, url: string) {
    if (statusCode < 300 || statusCode > 308) {
      throw new Error(
        `Invalid argument: statusCode (${statusCode}). Status code should be in interval 300 - 308`
      );
    }
    this.response.redirect(statusCode, url);
  }

  /** 400 status */
  badRequest(model?: any) {
    this.sendResponse(model, 400);
  }

  /** 401 status */
  unauthorized(model?: any) {
    this.sendResponse(model, 401);
  }

  /** 403 status */
  forbid() {
    this.response.sendStatus(403);
  }

  /** 404 status */
  notFound(model?: any) {
    this.sendResponse(model, 404);
  }

  /** 409 status */
  conflict(model?: any) {
    this.sendResponse(model, 409);
  }

  /** 500 status */
  serverError(model?: any) {
    this.sendResponse(model, 500);
  }

  /**
   * It uses `JSON.stringify` for object type models and add Content-Type: application/json to headers.
   * If you'll pass not an object, it will be returned "as is" without any side effects.
   * */
  protected toJson(model?: any) {
    if (typeof model !== 'object') {
      return model;
    }

    this.response.setHeader('Content-Type', 'application/json');
    return JSON.stringify(model);
  }

  /**
   *
   * @param model - if a string - just send it with  specified status,
   * if is not a string `toJson` method will be called to transform the data into payload
   * @param statusCode - default 200
   * @example
   * this.sendResponse('some data'); // throws an Error(`Invalid argument: statusCode (5).`)
   * this.sendResponse('some data', 5); // throws an Error(`Invalid argument: statusCode (5).`)
   * */
  protected sendResponse(model: any, statusCode = 200) {
    if (
      statusCode < 100 ||
      (statusCode > 103 && statusCode < 200) ||
      (statusCode > 226 && statusCode < 300) ||
      (statusCode > 308 && statusCode < 400) ||
      (statusCode > 449 && statusCode < 500) ||
      statusCode > 526
    ) {
      throw new Error(`Invalid argument: statusCode (${statusCode}).`);
    }
    const result = typeof model !== 'string' ? this.toJson(model) : model;
    this.response.status(statusCode).send(result);
  }
}
