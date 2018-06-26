import { DOMRenderer } from './dom-renderer';
import { Bounds, Engine, Render, Bodies, World } from 'matter-js';
import { DOMScene } from './dom-scene';
import debounce from 'lodash.debounce';

import { PageWorld } from './page-world';

const engine = Engine.create();
Engine.run(engine);

engine.world.gravity.y = 1;

const scene = new DOMScene(engine);

const page = new PageWorld(engine);
const domRenderer = new DOMRenderer(engine);

const resize = debounce(function(){
  scene.resize();
  page.resize();
}, 500);


window.addEventListener('resize', resize);

const allowedTags = ['p', 'button', 'img','a'];

window.addEventListener('mousedown', event => {
  page.createBody(allowedTags);
})

window.addEventListener('DOMContentLoaded', () => {
  domRenderer.run();
  scene.run();
  page.init();

  scene.resize();
  page.resize();
})

