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

    ok(model: any) {
        if (typeof model !== 'object') {
            this.response.send(model);
            return;
        }

        const json = JSON.stringify(model);
        this.response.send(json);
    }
}
