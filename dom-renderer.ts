import { HTMLMatterBody } from './html-matter-body';
import { Engine, Composite } from 'matter-js';

export class DOMRenderer {
  constructor(private engine: Engine) {

  }

  render() {
    const allBodies = Composite.allBodies(this.engine.world);
    let domBodies = allBodies.filter(body => body.reference !== undefined);

    for(let body of domBodies){
      let domBody: HTMLMatterBody = (<any>body).reference;
      domBody.update();
    }
  }

  run() {
    const loop = () => {
      this.render();
      requestAnimationFrame(loop)
    };

    loop();
  }
}

