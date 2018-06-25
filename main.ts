import { Composite, Engine, Render, Bodies, World, Mouse, MouseConstraint } from 'matter-js';
import { PageQuery } from './page-query';

const worldHeight = window.innerHeight;
const worldWidth = window.innerWidth;

const engine = Engine.create();

// create a renderer
var render = Render.create({
  element: document.querySelector('.debug-element'),
  engine: engine,
  options: {
    width: worldWidth,
    height: worldHeight
  }

});




var ground = Bodies.rectangle(worldWidth/2, worldHeight - 30, worldWidth, 60, { isStatic: true });
var left = Bodies.rectangle(0, worldHeight/2, 60, worldHeight, { isStatic: true });
var right = Bodies.rectangle(worldWidth-30, worldHeight/2, 60, worldHeight, { isStatic: true });

// add all of the bodies to the world
World.add(engine.world, [ground,left, right]);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

const query = new PageQuery({
  container: document.querySelector('.svg-content')
})

// add mouse control
var mouse = Mouse.create(render.body),
mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: true
        }
    }
});

World.add(engine.world, mouseConstraint);

render.mouse = mouse;

class HTMLRenderer {
  private frameIndex;
  constructor(private bodies) {

  }
  render() {
    const { world } = engine;

    const bodies = Composite.allBodies(world);
    const constraints = Composite.allConstraints(world);

    for(let body of bodies) {
      if(body.reference) {
        body.reference.update();
      }
    }

  }

  run() {
    const frame = () => {
      this.render();
      this.frameIndex = requestAnimationFrame(frame);
    }
    frame();
  }
}


const pageBodies = query.collect();
World.add(engine.world, pageBodies);

const pageRenderer = new HTMLRenderer(pageBodies);
pageRenderer.run();