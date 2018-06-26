import { Mouse, World, Render, MouseConstraint, Engine, Bodies } from 'matter-js';
import { HTMLMatterBody } from './html-matter-body';

export class PageWorld {
  worldHeight: number = 400;
  worldWidth: number = 400;
  viewportWidth: number = 400;
  viewportHeight: number = 400;
  worldBoundsPadding: number = 200;
  wallBodies:any[];

  constructor(
    private engine: Engine
  ) {
    this.init();
  }

  setWorldSize(w, h){
    this.worldWidth = w;
    this.worldHeight = h;
  }

  setViewportSize(w, h){
    this.viewportWidth = w;
    this.viewportHeight = h;
  }

  init() {
    this.update();
  }

  update(){
    this.updateBounds();
    this.updateWalls();
  }

  resize() {
    this.setViewportSize(window.innerWidth, window.innerHeight);
    this.setWorldSize(window.innerWidth, document.body.offsetHeight);

    this.update();
  }

  updateBounds () {
    const padding = this.worldBoundsPadding;
    const { world } = this.engine;

    world.bounds.min.x = -padding
    world.bounds.min.y = -padding
    world.bounds.max.x = this.worldWidth + padding;
    world.bounds.max.y = this.worldHeight + padding;
  }

  updateWalls() {
    if(this.wallBodies){
      World.remove(this.engine.world, this.wallBodies);
    }

    const paddingX = 50;
    const paddingY = 50;
    const wallSize = 50;
    const width = this.worldWidth
    const height = this.worldHeight;

    const rect = {
      x: -wallSize/2 - paddingX,
      y: -wallSize/2,
      width: width + wallSize + paddingX*2,
      height: height + wallSize,
      thickness: wallSize
    }
    this.wallBodies = [
      Bodies.rectangle(rect.x, rect.y + rect.height/2, rect.thickness, rect.height, { isStatic: true }),//left
      Bodies.rectangle(rect.x + rect.width/2, rect.y, rect.width, rect.thickness, { isStatic: true }),//top
      Bodies.rectangle(rect.x + rect.width/2, rect.y + rect.height, rect.width, rect.thickness, { isStatic: true }),//bottom
      Bodies.rectangle(rect.x + rect.width, rect.y + rect.height/2, rect.thickness, rect.height, { isStatic: true }),//right
      // Bodies.rectangle(rect.x + rect.width/2, rect.y + rect.height - rect.thickness/2, rect.width, rect.thickness, { isStatic: true }),//bottom
    ];

    World.add(this.engine.world, this.wallBodies);
  }

  createBody(allowedTags) {
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

    World.add(this.engine.world, bodies);
  }
}
