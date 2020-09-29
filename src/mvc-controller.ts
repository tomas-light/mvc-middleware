import { Request, Response } from "express";
import path from "path";

export class MvcController {
    private __type__: InstanceType<any>;
    private request: Request;
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
        const result = this.toJson(model);
        this.response.status(200).send(result);
    }
    created(model?: any) {
        const result = this.toJson(model);
        this.response.status(201).send(result);
    }
    accepted(model?: any) {
        const result = this.toJson(model);
        this.response.status(202).send(result);
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
    redirect(status: number, url: string) {
        this.response.redirect(status, url);
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

    serverError(message?: string) {
        this.response.status(500).send(message);
    }

    private toJson(model?: any) {
        if (typeof model !== 'object') {
            return model;
        }

        return JSON.stringify(model);
    }

    protected sendResponse(model: any, statusCode: number = 200) {
        const result = this.toJson(model);
        this.response.status(statusCode).send(result);
    }
}
