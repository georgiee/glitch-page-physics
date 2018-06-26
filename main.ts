import { DOMRenderer } from './dom-renderer';
import { HTMLMatterBody } from './html-matter-body';
import { Bounds, Engine, Render, Bodies, World } from 'matter-js';

import { PageWorld } from './page-world';

const engine = Engine.create();
engine.world.gravity.y = 1;




// create a renderer
const render = Render.create(<any>{
  element: document.querySelector('.matter-debug'),
  engine: engine,
  options: {
    wireframeBackground: 'transparent',
    background: 'transparent',
    width: window.innerWidth,
    height: window.innerHeight,
    hasBounds: true,
    showAngleIndicator: true
  }

});
// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

const page = new PageWorld(engine, render);

const translate = {
  x: 0,
  y: 0
};


function bindToPageScroll() {
  translate.y = (window.pageYOffset);
  Bounds.shift(render.bounds, translate);
};

window.addEventListener('mousewheel', bindToPageScroll)

window.addEventListener('DOMContentLoaded', () => {
  page.setViewportSize(window.innerWidth, window.innerHeight);
  page.setWorldSize(window.innerWidth, document.body.offsetHeight);

  page.init();
bindToPageScroll();

})


const allowedTags = ['p', 'button', 'img','a'];

window.addEventListener('mousedown', event => {
  const { pageX, pageY } = event;
  // const body = Bodies.circle(pageX, pageY, 20);

  // World.add(engine.world, body)

  let elements = document.querySelectorAll( ":hover" );
  let list = elements = Array.prototype.slice.call(elements);
  list = list.filter(el => {
    return allowedTags.indexOf(el.nodeName.toLowerCase()) != -1 &&
    el.dataset.matterBody === undefined
  });

  const bodies = list.map(el => {
    let htmlBody = new HTMLMatterBody(el);
    return htmlBody.body;
  })

  World.add(engine.world, bodies);
})



const domRenderer = new DOMRenderer(engine);
domRenderer.run();