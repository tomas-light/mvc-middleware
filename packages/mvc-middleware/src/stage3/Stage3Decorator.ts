import type { Stage3MethodDecorator } from '../decorators/StageMethodDecorator.js';
import type { Stage3PropertyDecorator } from '../decorators/StagePropertyDecorator.js';

export interface Stage3Decorator extends Stage3MethodDecorator, Stage3PropertyDecorator {
  (route: string): Stage3MethodDecorator;
  (route: string): Stage3PropertyDecorator;
}
