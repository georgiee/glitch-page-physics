import SVG from 'svg.js';
import chroma from 'chroma-js';
import { Engine, Render, Bodies, World, Body } from 'matter-js';
import {vec2, mat3} from 'gl-matrix';

const colors = chroma.scale(['yellow', 'navy']).mode('lch');
let counter = 0;

export class PageQuery {
  elements: any[] = [];
  container: HTMLElement;

  constructor({ container }) {
    this.container = container;
  }

  collect():Body[] {
    const allRects = this.container.querySelectorAll('rect');
    const bodies:any[] = [];
    for(let rect of <any>allRects) {

      const body = this.createBody(rect);
      bodies.push(body)
    }

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

}

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