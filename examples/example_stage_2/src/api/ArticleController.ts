import { Request, Response } from 'express';
import { MvcController } from 'mvc-middleware';
import { api, GET, POST } from 'mvc-middleware/stage2';
import { Logger } from '../Logger';

@api
export default class ArticleController extends MvcController {
  static articles = ['article-1', 'article-2'];

  constructor(
    private logger: Logger,
    request: Request,
    response: Response
  ) {
    super(request, response);

    const message = `${request.method.toUpperCase()}: ${request.url}`;
    this.logger.log(message);
  }

  @GET
  health() {
    return this.noContent();
  }

  @GET // articles
  async articles() {
    return this.ok(ArticleController.articles);
  }

  @POST('articles')
  async addArticle(payload: { articleName: string }) {
    const { articleName } = payload;
    ArticleController.articles.push(articleName);

    return this.ok('article is created');
  }
}
// fetch('/articles', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({ articleName: 'new-article' }),
// });
