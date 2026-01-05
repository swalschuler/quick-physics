// module aliases
var Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite,
  Events = Matter.Events;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
  element: document.body,
  engine: engine,
});

const gridSize = 20;

let LEFT = 100;
let BOTTOM = 300;
function getCoordinates(col, row) {
  return { x: LEFT + col * gridSize, y: BOTTOM + row * gridSize };
}

// 2x2 square
let squareCenter = getCoordinates(4, 4);
let square = Bodies.rectangle(
  squareCenter.x - 5,
  squareCenter.y,
  gridSize * 2,
  gridSize * 2,
  {
    inertia: Infinity,
  }
);
// tshape
let tCenter = getCoordinates(6, 1);
let tShape1 = Bodies.rectangle(
  tCenter.x,
  tCenter.y - gridSize / 2,
  gridSize * 3,
  gridSize
);
let tShape2 = Bodies.rectangle(
  tCenter.x,
  tCenter.y + gridSize / 2,
  gridSize,
  gridSize
);
let tShape = Matter.Body.create({
  parts: [tShape1, tShape2],
  inertia: Infinity,
  render: {
    fillStyle: "red",
    strokeStyle: "black",
    lineWidth: 1,
  },
});
Matter.Body.rotate(tShape, Math.PI);

let iCenter = getCoordinates(3.5, 3);
let iShape = Bodies.rectangle(
  iCenter.x,
  iCenter.y,
  gridSize * 1,
  gridSize * 4,
  {
    inertia: Infinity,
    angle: Math.PI / 2,
  }
);

let zCenter = getCoordinates(1, 5);
let zShape1 = Bodies.rectangle(
  zCenter.x - gridSize / 2,
  zCenter.y - gridSize / 2,
  gridSize * 2,
  gridSize
);
let zShape2 = Bodies.rectangle(
  zCenter.x + gridSize / 2,
  zCenter.y + gridSize / 2,
  gridSize * 2,
  gridSize
);
let zShape = Matter.Body.create({
  parts: [zShape1, zShape2],
  inertia: Infinity,
});

let sCenter = getCoordinates(6.7, 5);
let sShape1 = Bodies.rectangle(
  sCenter.x,
  sCenter.y - gridSize,
  gridSize * 2,
  gridSize
);
let sShape2 = Bodies.rectangle(
  sCenter.x - gridSize,
  sCenter.y,
  gridSize * 2,
  gridSize
);
let sShape = Matter.Body.create({
  parts: [sShape1, sShape2],
  inertia: Infinity,
});

let lCenter = getCoordinates(7, 7);
let lShape1 = Bodies.rectangle(lCenter.x, lCenter.y, gridSize * 3, gridSize);
let lShape2 = Bodies.rectangle(
  lCenter.x + gridSize,
  lCenter.y - gridSize,
  gridSize,
  gridSize
);
let lShape = Matter.Body.create({
  parts: [lShape1, lShape2],
  inertia: Infinity,
});

let rCenter = getCoordinates(1, 7);
let rShape1 = Bodies.rectangle(rCenter.x, rCenter.y, gridSize * 3, gridSize);
let rShape2 = Bodies.rectangle(
  rCenter.x - gridSize,
  rCenter.y - gridSize,
  gridSize,
  gridSize
);
let rShape = Matter.Body.create({
  parts: [rShape1, rShape2],
  inertia: Infinity,
});

var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
var roof = Bodies.rectangle(400, -10, 810, 60, { isStatic: true });
var lWall = Bodies.rectangle(-10, 200, 60, 800, { isStatic: true });
var rWall = Bodies.rectangle(810, 200, 60, 800, { isStatic: true });

let left = Bodies.rectangle(
  getCoordinates(-1, 0).x,
  getCoordinates(-1, 0).y,
  gridSize,
  gridSize * 16,
  { isStatic: true, friction: 0.1 }
);
let right = Bodies.rectangle(
  getCoordinates(9, 0).x - 15,
  getCoordinates(9, 0).y,
  gridSize,
  gridSize * 16,
  { isStatic: true, friction: 0.1 }
);
let bottom = Bodies.rectangle(
  getCoordinates(4, 8).x,
  getCoordinates(4, 8).y,
  gridSize * 10,
  gridSize,
  { isStatic: true }
);

// set up mouse stuff.
const mouse = Matter.Mouse.create(render.canvas);
const mouseConstraint = Matter.MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2,
    render: {
      visible: false,
    },
  },
});

// add all of the bodies to the world
Composite.add(engine.world, [
  ground,
  roof,
  lWall,
  rWall,

  mouseConstraint,

  tShape,
  iShape,
  zShape,
  sShape,
  lShape,
  rShape,
  square,

  left,
  right,
  bottom,
]);

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);

let CLICKED = false;
render.canvas.addEventListener("mousedown", (e) => {
  CLICKED = true;
});

render.canvas.addEventListener("mousemove", (e) => {
  CLICKED = false;
});

render.canvas.addEventListener("mouseup", (e) => {
  if (!CLICKED) {
    return;
  }

  let clickedBody = mouseConstraint.body;
  if (clickedBody && clickedBody !== bottom) {
    Matter.Body.rotate(clickedBody, Math.PI / 2);
  }
  CLICKED = false;
});

let lockedY = null;
Events.on(mouseConstraint, "startdrag", (event) => {
  if (event.body === bottom) {
    lockedY = bottom.position.y;
  }
});

Events.on(mouseConstraint, "mousemove", () => {
  if (mouseConstraint.body === bottom) {
    Matter.Body.setPosition(bottom, {
      x: mouseConstraint.mouse.position.x,
      y: bottom.position.y,
    });
  }
});
