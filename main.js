/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.querySelector("#main");
const ctx = canvas.getContext("2d");
const admin = document.querySelector(".admin");
const lis = document.querySelectorAll("ul.admin-list>li");

ctx.lineWidth = 10;

const headerRight = document.querySelector(".header__right");
const graphClear = headerRight.querySelector(".clear");
const graphInit = headerRight.querySelector(".init");

admin.addEventListener("click", () => {
  const arrow = admin.querySelector(".arrow");
  const list = admin.querySelector(".admin-list");
  arrow.classList.toggle("arrow_active");
  list.classList.toggle("hidden");
});

window.addEventListener("load", () => {
  canvas.width = window.innerWidth - 250;
  canvas.height = window.innerHeight - 150;
  canvas.style.width = canvas.width;
  canvas.style.height = canvas.height;
  ctx.textAlign = "center";
  ctx.font = "30px Arial";
});

let graph = {};
// const graph = {
//   1: ["2", "25"],
//   2: ["1", "3"],
//   3: ["2", "8"],
//   4: ["8"],
//   5: ["6"],
//   6: ["5", "22"],
//   7: ["8", "22"],
//   8: ["3", "7", "4", "26"],
//   9: ["26", "10"],
//   10: ["9", "19", "20"],
//   11: ["25", "14", "13"],
//   12: ["26", "12", "12", "27"],
//   13: ["11", "28", "18"],
//   14: ["14", "14", "11"],
//   15: ["18", "30"],
//   16: ["19", "17"],
//   17: ["16", "31"],
//   18: ["13", "15", "18", "18", "24"],
//   19: ["27", "10", "16"],
//   20: ["10", "21", "23"],
//   21: ["20", "32"],
//   22: ["6", "7"],
//   23: ["20"],
//   24: ["18"],
//   25: ["1", "11"],
//   26: ["8", "12", "9"],
//   27: ["12", "19"],
//   28: ["13", "29"],
//   29: ["28"],
//   30: ["15"],
//   31: ["17"],
//   32: ["21"],
// };
let circleList = {};
// const circleList = {
//   1: {
//     x: 85,
//     y: 95,
//   },
//   2: {
//     x: 115,
//     y: 268,
//   },
//   3: {
//     x: 80,
//     y: 441,
//   },
//   4: {
//     x: 142,
//     y: 566,
//   },
//   5: {
//     x: 154,
//     y: 697,
//   },
//   6: {
//     x: 412,
//     y: 719,
//   },
//   7: {
//     x: 311,
//     y: 573,
//   },
//   8: {
//     x: 223,
//     y: 462,
//   },
//   9: {
//     x: 455,
//     y: 404,
//   },
//   10: {
//     x: 625,
//     y: 668,
//   },
//   11: {
//     x: 418,
//     y: 159,
//   },
//   12: {
//     x: 281,
//     y: 201,
//   },
//   13: {
//     x: 656,
//     y: 285,
//   },
//   14: {
//     x: 605,
//     y: 121,
//   },
//   15: {
//     x: 1004,
//     y: 201,
//   },
//   16: {
//     x: 797,
//     y: 463,
//   },
//   17: {
//     x: 954,
//     y: 488,
//   },
//   18: {
//     x: 802,
//     y: 285,
//   },
//   19: {
//     x: 613,
//     y: 464,
//   },
//   20: {
//     x: 841,
//     y: 598,
//   },
//   21: {
//     x: 982,
//     y: 709,
//   },
//   22: {
//     x: 465,
//     y: 573,
//   },
//   23: {
//     x: 1100,
//     y: 516,
//   },
//   24: {
//     x: 1091,
//     y: 332,
//   },
//   25: {
//     x: 235,
//     y: 86,
//   },
//   26: {
//     x: 274,
//     y: 332,
//   },
//   27: {
//     x: 468,
//     y: 269,
//   },
//   28: {
//     x: 802,
//     y: 103,
//   },
//   29: {
//     x: 1101,
//     y: 76,
//   },
//   30: {
//     x: 1283,
//     y: 199,
//   },
//   31: {
//     x: 1249,
//     y: 391,
//   },
//   32: {
//     x: 1237,
//     y: 596,
//   },
// };
let searchOrder = [];
let selectV;

graphClear.addEventListener("click", () => {
  graph = {};
  circleList = {};
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

graphInit.addEventListener("click", initCircle);

canvas.addEventListener("click", (event) => {
  const { offsetX, offsetY } = event;
  for (const circle in circleList) {
    const { x, y } = circleList[circle];

    if (
      offsetX >= x - 50 &&
      offsetX <= x + 50 &&
      offsetY >= y - 50 &&
      offsetY <= y + 100
    ) {
      selectCircle(x, y, circle);
      break;
    }
  }
});

canvas.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  const { offsetX, offsetY } = event;
  let checker = true;

  for (const circle in circleList) {
    const { x, y } = circleList[circle];
    if (
      offsetX >= x - 100 &&
      offsetX <= x + 100 &&
      offsetY >= y - 100 &&
      offsetY <= y + 100
    ) {
      checker = false;
      break;
    }
  }

  if (
    offsetX >= canvas.width - 50 ||
    offsetX <= 50 ||
    offsetY >= canvas.height - 50 ||
    offsetY <= 50
  )
    checker = false;
  if (checker) drawCircle(offsetX, offsetY, Object.keys(circleList).length + 1);
});

function drawCircle(offsetX, offsetY, n) {
  ctx.beginPath();
  ctx.arc(offsetX, offsetY, 50, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.fillText(n, offsetX, offsetY + 10, 50);
  circleList[n] = {
    x: offsetX,
    y: offsetY,
  };
  graph[n] = [];
}

function selectCircle(x, y, n) {
  if (!selectV) {
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.arc(x, y, 50, 0, Math.PI * 2, true);
    ctx.stroke();
    ctx.strokeStyle = "black";
    selectV = { x, y, n };
  } else {
    ctx.beginPath();
    ctx.moveTo(selectV.x, selectV.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(selectV.x, selectV.y, 50, 0, Math.PI * 2, true);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.fillText(selectV.n, selectV.x, selectV.y + 10, 50);

    ctx.beginPath();
    ctx.arc(x, y, 50, 0, Math.PI * 2, true);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.fillText(n, x, y + 10, 50);

    graph[selectV.n].push(n);
    graph[n].push(selectV.n);
    selectV = false;
  }
}

function drawBlue(node) {
  const { x, y } = circleList[node];
  ctx.strokeStyle = "blue";
  ctx.beginPath();
  ctx.arc(x, y, 50, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.strokeStyle = "black";
}

function drawBlack(node) {
  const { x, y } = circleList[node];
  ctx.strokeStyle = "black";
  ctx.beginPath();
  ctx.arc(x, y, 50, 0, Math.PI * 2, true);
  ctx.stroke();
}

lis.forEach((li) => {
  li.addEventListener("click", (event) => {
    const { target } = event;
    const tarFunc = new Function(`return ${target.innerText}`)();
    const st = prompt("start num");
    tarFunc(st);
  });
});

function DFS(st) {
  const vis = Array(Object.keys(graph).length).fill(0);
  searchOrder = [];
  searchOrder.push(st);
  function dfs(st) {
    vis[st] = 1;
    for (const i of graph[st]) {
      if (!vis[i]) {
        searchOrder.push(i);
        dfs(i);
      }
    }
  }
  dfs(st);
  console.log(searchOrder);
  orderDraw();
}

function BFS(st) {
  const vis = Array(Object.keys(graph).length).fill(0);
  searchOrder = [];
  searchOrder.push(st);
  const queue = [st];
  while (queue.length) {
    const node = queue.shift();
    vis[node] = 1;
    console.log(node);
    for (const i of graph[node]) {
      if (!vis[i]) {
        queue.push(i);
        searchOrder.push(i);
      }
    }
  }
  console.log(searchOrder);
  orderDraw();
}

// function MST() {
//   console.log("MST func");
// }

function printGraph() {
  console.log(graph);
  console.log(circleList);
}

function orderDraw() {
  let num = 0;
  for (const order of searchOrder) {
    sleep(1000 * num).then(() => {
      drawBlue(order);
    });
    num++;
  }
  sleep(1000 * num).then(() => {
    alert(`
    순회 완료 
    순회 순서 : ${searchOrder.join(", ")}
    `);
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function initCircle() {
  for (const i of Object.keys(circleList)) {
    drawBlack(i);
    console.log(i);
  }
}
