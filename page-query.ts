import SVG from 'svg.js';
import chroma from 'chroma-js';
import { Engine, Render, Bodies, World, Body } from 'matter-js';
import { vec3, vec2, mat3, mat2d} from 'gl-matrix';
import transform from'dom-css-transform';

const colors = chroma.scale(['yellow', 'navy']).mode('lch');
let counter = 0;

export class PageQuery {
  elements: any[] = [];
  container: HTMLElement;

  constructor({ container }) {
    this.container = container;
  }

  collectSVG():Body[] {
    const allRects = this.container.querySelectorAll('rect');
    const bodies:any[] = [];
    for(let rect of <any>allRects) {

      const body = this.createBody(rect);
      bodies.push(body)
    }

    return bodies;
  }

  collectHTML(): Body[]  {
    let bodies:Body[] = [];
    const validObjects = this.container.querySelectorAll('h1, a');

    for(let item of <any>validObjects) {
      const wrapper = new HTMLBody(item);
      bodies.push(wrapper.getBody());
    }
    return bodies;
  }

  collect():Body[] {
    let bodies:Body[] = [];
    // bodies = [...this.collectSVG()];
    bodies = [...this.collectHTML()];
    return bodies;
  }

  createBody(element) {
    const svg = SVG.adopt(element);
    svg.fill(colors(counter++/10).hex());

    const box = Bodies.rectangle(svg.cx(), svg.cy(), svg.width(), svg.height());
    box.reference = new SVGBody(svg, box);
    svg.x(<any>null)
    svg.y(<any>null)
    return box;
  }
}

class HTMLBody {
  private body: Body;
  constructor(
      private element: HTMLElement) {

    const rect: DOMRect | ClientRect = element.getBoundingClientRect();
        console.log(rect)
    this.body = Bodies.rectangle(rect.width/2, 0,rect.width, rect.height);
    console.log(this.body)
    this.body.reference = this;
  }

  getBody(): Body {
    return this.body;
  }

  update() {

    const matrix = mat2d.create();
    const { position } = this.body;
    const posVector = vec2.fromValues(position.x, position.y);

    mat2d.translate(matrix, matrix, posVector);
    mat2d.rotate(matrix, matrix, this.body.angle);

    // console.log(matrix)
    // transform(this.element, matrix)
  }
}

document.addEventListener('click', event => {
  console.log('clack')
});

class SVGBody {
  constructor(
      private svg: svgjs.Element,
      private body: Body) {
  }

  update() {
    // console.log('update');
    const { position } = this.body;
    // this.svg.cx(position.x);
    // this.svg.cy(position.y);


    var myRectMatrix = new SVG.Matrix();
    myRectMatrix = myRectMatrix
    .translate(position.x - this.svg.width()/2, position.y-this.svg.height()/2)
    .rotate(this.body.angle * 180/Math.PI, this.svg.cx(), this.svg.cy())

    this.svg.transform({
      a: myRectMatrix.a,
      b: myRectMatrix.b,
      c: myRectMatrix.c,
      d: myRectMatrix.d,
      e: myRectMatrix.e,
      f: myRectMatrix.f,
    });
  }

}