import { AppModule } from '../../app/app.module';
import { Events } from 'ionic-angular';

export function PageTrack(viewName?): ClassDecorator {
  return function (constructor: any) {
    const ionViewDidEnter = constructor.prototype.ionViewDidEnter;

    constructor.prototype.ionViewDidEnter = function (...args: any[]) {
      const events = AppModule.injector.get(Events);
      if (viewName) {
        events.publish('view:enter', viewName);
      }
      else {
        events.publish('view:enter', this.constructor.name);
      }
      ionViewDidEnter && ionViewDidEnter.apply(this, args);
      // console.log('--ClassDecorator--', this.constructor.name);
    }
  }
}