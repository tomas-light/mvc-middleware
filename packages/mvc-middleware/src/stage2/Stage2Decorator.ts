import type { Stage2MethodDecorator } from '../decorators/StageMethodDecorator.js';
import type { Stage2PropertyDecorator } from '../decorators/StagePropertyDecorator.js';

export interface Stage2Decorator extends Stage2MethodDecorator, Stage2PropertyDecorator {
  (route: string): Stage2MethodDecorator;
  (route: string): Stage2PropertyDecorator;
}
