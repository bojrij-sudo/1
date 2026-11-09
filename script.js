const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const recordEl = document.getElementById('record');
const messageEl = document.getElementById('message');

const GRID = 20;                 // клеток по каждой стороне
const CELL = canvas.width / GRID; // размер клетки в пикселях

let snake, dir, food, score, gameOver, timer;

let record = Number(localStorage.getItem('snakeRecord') || 0);
recordEl.textContent = record;

function reset() {
  snake = [{ x: 9, y: 10 }, { x: 8, y: 10 }, { x: 7, y: 10 }];
  dir = { x: 1, y: 0 };
  score = 0;
  gameOver = false;
  messageEl.classList.add('hidden');
  scoreEl.textContent = score;
  placeFood();
}

function placeFood() {
  do {
    food = {
      x: Math.floor(Math.random() * GRID),
      y: Math.floor(Math.random() * GRID)
    };
  } while (snake.some(s => s.x === food.x && s.y === food.y));
}

function step() {
  if (gameOver) return;

  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

  // столкновение со стеной или с собой
  const hitWall = head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID;
  const hitSelf = snake.some(s => s.x === head.x && s.y === head.y);
  if (hitWall || hitSelf) {
    gameOver = true;
    if (score > record) {
      record = score;
      localStorage.setItem('snakeRecord', record);
      recordEl.textContent = record;
    }
    messageEl.classList.remove('hidden');
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.textContent = score;
    placeFood();
  } else {
    snake.pop(); // хвост убираем, если еду не съели
  }

  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // еда
  ctx.fillStyle = '#e17055';
  ctx.beginPath();
  ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2.5, 0, Math.PI * 2);
  ctx.fill();

  // змейка
  snake.forEach((s, i) => {
    ctx.fillStyle = i === 0 ? '#00b894' : '#55efc4';
    ctx.fillRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2);
  });
}

document.addEventListener('keydown', (e) => {
  if (gameOver && e.code === 'Space') {
    reset();
    draw();
    return;
  }

  if (e.key === 'ArrowUp'    && dir.y !== 1)  dir = { x: 0,  y: -1 };
  if (e.key === 'ArrowDown'  && dir.y !== -1) dir = { x: 0,  y: 1 };
  if (e.key === 'ArrowLeft'  && dir.x !== 1)  dir = { x: -1, y: 0 };
  if (e.key === 'ArrowRight' && dir.x !== -1) dir = { x: 1,  y: 0 };
  if (e.key === 'w' && dir.y !== 1)  dir = { x: 0,  y: -1 };
  if (e.key === 's' && dir.y !== -1) dir = { x: 0,  y: 1 };
  if (e.key === 'a' && dir.x !== 1)  dir = { x: -1, y: 0 };
  if (e.key === 'd' && dir.x !== -1) dir = { x: 1,  y: 0 };
});

// главный цикл: 8 шагов в секунду
timer = setInterval(step, 125);

reset();
draw();
