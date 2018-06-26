import { mat2d, vec2 } from 'gl-matrix';
import { Body, Bodies } from 'matter-js';
import transform from 'dom-css-transform';



var cumulativeOffset = function(element) {
  var top = 0, left = 0;
  do {
      top += element.offsetTop  || 0;
      left += element.offsetLeft || 0;
      element = element.offsetParent;
  } while(element);

  return {
      top: top,
      left: left
  };
};

let globalId = 0;

export class HTMLMatterBody {
  private _id = globalId++;
  private _body: Body;
  private _initialRect: DOMRect | ClientRect;
  private _pageOffset;
  private _width:number = 100;
  private _height:number = 100;

  constructor(
    private element:HTMLElement
  ){
    this.build();
  }

  build() {
    this._initialRect = this.element.getBoundingClientRect();
    this._pageOffset = cumulativeOffset(this.element);
    this._width = this._initialRect.width;
    this._height = this._initialRect.height;
    const x = this._pageOffset.left + this.width/2;
    const y = this._pageOffset.top + this.height/2;

    this._body = Bodies.rectangle(x, y, this.width, this.height);
    this._body.reference = this;
    this.element.dataset.matterBody = String(globalId);
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get offsetX() {
    return this._pageOffset.left;
  }

  get offsetY() {
    return this._pageOffset.top;
  }

  update() {

    const matrix = mat2d.create();
    const { position } = this.body;

    const newX = position.x - this.width/2;
    const newY = position.y - this.height/2;

    const posVector = vec2.fromValues(newX - this.offsetX, newY - this.offsetY);

    mat2d.translate(matrix, matrix, posVector);
    mat2d.rotate(matrix, matrix, this.body.angle);
    transform(this.element, matrix);
  }

  get body () {
    return this._body;
  }

}