import { Render, Engine, Bounds } from 'matter-js';


export class DOMScene {
  render: Render;
  canvas: HTMLCanvasElement;
  viewTranslation = {x:0, y:0};

  constructor(private engine: Engine) {
    this.createCanvas();
    this.createDebugRenderer();

    this.handlePageScroll = this.handlePageScroll.bind(this);
    window.addEventListener('mousewheel', this.handlePageScroll);
  }

  resize() {
    console.log('resize')
    this.createDebugRenderer();
  }

  handlePageScroll() {
    this.viewTranslation.y = window.pageYOffset;
    this.updateBounds();
  };

  updateBounds() {
    Bounds.shift(this.render.bounds, this.viewTranslation);
  }

  createCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    canvas.oncontextmenu = () => false;
    canvas.onselectstart = () => false;

    this.canvas = canvas;
  }

  createDebugRenderer() {
    this.render = Render.create(<any>{
      element: document.querySelector('.matter-debug'),
      canvas: this.canvas,
      options: {
        wireframeBackground: 'transparent',
        background: 'transparent',
        width: window.innerWidth,
        height: window.innerHeight,
        hasBounds: true,
        showAngleIndicator: true
      }
    });

    this.render.engine = this.engine;
  }

  run() {
    const loop = () => {
      Render.world(this.render);
      requestAnimationFrame(loop);
    }

    loop();
  }
}