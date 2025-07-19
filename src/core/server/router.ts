import { Hono, type Handler } from 'hono';
import { createFactory } from 'hono/factory';

class Router {
  // private readonly factory = createFactory();
  private readonly router = new Hono();

  constructor(private readonly path: string) {}

  mount(app: Hono) {
    app.route(this.path, this.router);
  }

  get(path: string, handler: Handler) {
    this.router.get(path, (c, next) => handler(c, next));
  }

  post(path: string, handler: Handler) {
    this.router.post(path, (c, next) => handler(c, next));
  }

  delete(path: string, handler: Handler) {
    this.router.delete(path, (c, next) => handler(c, next));
  }

  put(path: string, handler: Handler) {
    this.router.put(path, (c, next) => handler(c, next));
  }

  use(handler: Handler) {
    this.router.use(handler);
  }
}

export default Router;
