import { Request, Response } from 'express';
import { MvcController } from 'mvc-middleware';
import { api, GET, POST } from 'mvc-middleware/stage2';

@api
export default class ArticleController extends MvcController {
  static articles = ['article-1', 'article-2'];

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
