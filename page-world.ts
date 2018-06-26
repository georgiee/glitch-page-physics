import { Mouse, World, Render, MouseConstraint, Engine, Bodies } from 'matter-js';

export class PageWorld {
  worldHeight: number = 4000;
  worldWidth: number = 400;
  viewportWidth: number = 400;
  viewportHeight: number = 400;
  worldBoundsPadding: number = 200;

  constructor(
    private engine: Engine,
    private renderer: Render
  ) {
    this.addMouse();
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
    this.createWalls();
    this.updateBounds();
  }

  updateBounds () {
    const padding = this.worldBoundsPadding;
    const { world } = this.engine;

    world.bounds.min.x = -padding
    world.bounds.min.y = -padding
    world.bounds.max.x = this.worldWidth + padding;
    world.bounds.max.y = this.worldHeight + padding;
  }

  addMouse() {

    var mouse = Mouse.create(this.renderer.canvas),
    mouseConstraint = MouseConstraint.create(this.engine, <any>{
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });

    World.add(this.engine.world, mouseConstraint);

  }

  createWalls() {
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
    const wallBodies = [
      Bodies.rectangle(rect.x, rect.y + rect.height/2, rect.thickness, rect.height, { isStatic: true }),//left
      Bodies.rectangle(rect.x + rect.width/2, rect.y, rect.width, rect.thickness, { isStatic: true }),//top
      Bodies.rectangle(rect.x + rect.width/2, rect.y + rect.height, rect.width, rect.thickness, { isStatic: true }),//bottom
      Bodies.rectangle(rect.x + rect.width, rect.y + rect.height/2, rect.thickness, rect.height, { isStatic: true }),//right
      // Bodies.rectangle(rect.x + rect.width/2, rect.y + rect.height - rect.thickness/2, rect.width, rect.thickness, { isStatic: true }),//bottom
    ];

    World.add(this.engine.world, wallBodies);
  }

}
