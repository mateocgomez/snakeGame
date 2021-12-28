let renderTimeLast = 0;
const SNAKE_SPEED = 5;
const snakeBody = [
  {
    x: 11,
    y: 11,
  },
];
let gameOver = false;
let inputDirection = { x: 0, y: 0 };
let lastInputDirection = { x: 0, y: 0 };
const GRID_SIZE = 21;
let food = getRandomFoodPosition();
const EXPANSION_RATE = 1;
let newSegments = 0;
let score = 0;
const gameBoard = document.getElementById("snake-board");

window.addEventListener("keydown", ({ key }) => {
  const { x, y } = lastInputDirection;
  switch (key) {
    case "ArrowUp":
      if (y !== 0) break;
      inputDirection = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (y !== 0) break;
      inputDirection = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (x !== 0) break;
      inputDirection = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (x !== 0) break;
      inputDirection = { x: 1, y: 0 };
      break;
  }
});

function getInputDirection() {
  return inputDirection;
}

function main(currentTime) {
  if (gameOver) {
    if (confirm("Thanks for playing, try again press ok")) {
      window.location = "/";
    }
    return;
  }
  window.requestAnimationFrame(main);
  const secondsRender = (currentTime - renderTimeLast) / 1000;
  if (secondsRender < 1 / SNAKE_SPEED) return;
  renderTimeLast = currentTime;
  update();
  draw(gameBoard);
  foodUpdate();
}

window.requestAnimationFrame(main);

function update() {
  addSegments();
  const inputDirection = getInputDirection();
  for (let i = snakeBody.length - 2; i >= 0; i--) {
    snakeBody[i + 1] = { ...snakeBody[i] };
  }
  snakeBody[0].x += inputDirection.x;
  snakeBody[0].y += inputDirection.y;
  foodUpdate();
}

function draw(gameBoard) {
  gameBoard.innerHTML = "";
  snakeBody.forEach(({ x, y }) => {
    const snakeEl = document.createElement("div");
    snakeEl.style.gridRowStart = y;
    snakeEl.style.gridColumnStart = x;
    snakeEl.classList.add("snake");
    gameBoard.appendChild(snakeEl);
  });
  foodDraw(gameBoard);
  scoreDraw(gameBoard);
  checkDeath();
}

function expandSnake(amount) {
  newSegments += amount;
  score = score + amount;
}

function onSnake(position, { ignoreHead = false } = {}) {
  return snakeBody.some((segment, index) => {
    if (ignoreHead && index === 0) {
      return false;
    }
    return equalPositions(segment, position);
  });
}

function equalPositions(pos1, pos2) {
  return pos1.x === pos2.x && pos1.y === pos2.y;
}

function addSegments() {
  for (let i = 0; i < newSegments; i++) {
    snakeBody.push({ ...snakeBody[snakeBody.length - 1] });
  }
  newSegments = 0;
}

function foodUpdate() {
  if (onSnake(food)) {
    expandSnake(EXPANSION_RATE);
    food = getRandomFoodPosition();
  }
}

function scoreDraw(gameBoard) {
  let text = document.createTextNode(`SCORE: ${score}`);
  gameBoard.appendChild(text);
}

function foodDraw(gameBoard) {
  const foodEl = document.createElement("div");
  foodEl.style.gridRowStart = food.y;
  foodEl.style.gridColumnStart = food.x;
  foodEl.classList.add("food");
  gameBoard.appendChild(foodEl);
}

function getRandomFoodPosition() {
  let newFoodPosition;
  while (newFoodPosition == null || onSnake(newFoodPosition)) {
    newFoodPosition = randomGridPosition();
  }
  return newFoodPosition;
}

function randomGridPosition() {
  return {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  };
}

function getSnakeHead(params) {
  return snakeBody[0];
}

function snakeIntersection() {
  return onSnake(snakeBody[0], { ignoreHead: true });
}
function outSideGrid(position) {
  return (
    position.x < 1 ||
    position.x > GRID_SIZE ||
    position.y < 1 ||
    position.y > GRID_SIZE
  );
}

function checkDeath() {
  gameOver = outSideGrid(getSnakeHead()) || snakeIntersection();
}
