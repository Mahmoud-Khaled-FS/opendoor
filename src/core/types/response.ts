import type { StatusCode } from 'hono/utils/http-status';

export interface Responsible {
  toJSON(): any;
  status(): StatusCode;
}
