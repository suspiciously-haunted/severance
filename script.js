const container = document.getElementById("container");
const rows = 200;
const cols = 200;
let isFollowing = false;
let floatingBox = null;
let trackedCells = [];
let magCells = [];

for (let i = 0; i < rows; i++) {
  const row = document.createElement("div");
  row.className = "row";
  for (let j = 0; j < cols; j++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.textContent = Math.floor(Math.random() * 10);
    cell.dataset.row = i;
    cell.dataset.col = j;
    row.appendChild(cell);
  }
  container.appendChild(row);
}


function getCell(row, col) {
  return document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
}

container.addEventListener("click", (e) => {
  if (e.target.classList.contains("cell")) {
    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);

    trackedCells.forEach((cell) => cell.classList.remove("magnify"));
    trackedCells = [];
    
    if (row > 0 && row < rows - 1 && col > 0 && col < cols - 1) {
      for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
          const cell = getCell(r, c);
          if (cell) {
            cell.classList.add("magnify");
            trackedCells.push(cell);
          }
        }
      }
    }

    if (floatingBox) {
      floatingBox.remove();
    }
    isFollowing = false;
  }
});

container.addEventListener("mousemove", (e) => {
  if (isFollowing && floatingBox) {
    floatingBox.style.left = `${e.clientX - floatingBox.offsetWidth / 2}px`;
    floatingBox.style.top = `${e.clientY - floatingBox.offsetHeight / 2}px`;
  }
  const target = e.target;
  if (target.classList.contains("cell")) {
    magCells.forEach((cell) => cell.classList.remove("magnify"));
    magCells = [];

    const row = parseInt(target.dataset.row);
    const col = parseInt(target.dataset.col);

    if (row > 0 && row < rows - 1 && col > 0 && col < cols - 1) {
      for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
          const cell = getCell(r, c);
          if (cell) {
            cell.classList.add("magnify");
            magCells.push(cell); 
          }
        }
      }
    }
  }
});

const bottomPanel = document.getElementById("bottom-panel");
bottomPanel.addEventListener("click", () => {
  trackedCells.forEach((cell) => {
    cell.textContent = ""; 
    cell.classList.remove("magnify");
  });

  trackedCells.forEach((cell) => {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (col > 0) {
      const leftNeighbor = getCell(row, col - 1);
      if (leftNeighbor) {
        cell.textContent = leftNeighbor.textContent;
        leftNeighbor.textContent = randomValue(); 
      }
    }
    if (col < cols - 1) {
      const rightNeighbor = getCell(row, col + 1);
      if (rightNeighbor) {
        cell.textContent = rightNeighbor.textContent;
        rightNeighbor.textContent = randomValue(); 
      }
    }
  });

  trackedCells.forEach((cell) => {
    if (cell.textContent === "") {
      cell.textContent = randomValue();
    }
  });

  trackedCells = []; 
  isFollowing = false;
  if (floatingBox) {
    floatingBox.remove();
  }
});


function randomValue() {
  return Math.floor(Math.random() * 10); 
}

function positionFloatingBox(row, col) {
  const clickedCell = getCell(row, col);
  const rect = clickedCell.getBoundingClientRect();
  floatingBox.style.left = `${rect.left}px`;
  floatingBox.style.top = `${rect.top}px`;
}

function updateFloatingBox(row, col) {
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      const cell = getCell(r, c);
      if (cell) {
        const newCell = document.createElement("div");
        newCell.className = "cell";
        newCell.textContent = cell.textContent;
        floatingBox.appendChild(newCell);
      }
    }
  }
}

container.addEventListener("click", (e) => {
  if (e.target.classList.contains("cell")) {
    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);

    if (floatingBox) {
      floatingBox.remove();
    }

    if (!isFollowing) {
      isFollowing = true;
      floatingBox = document.createElement("div");
      floatingBox.classList.add("floating-box");
      document.body.appendChild(floatingBox);

      positionFloatingBox(row, col);
      updateFloatingBox(row, col);
    } else {
      isFollowing = false;
      if (floatingBox) {
        floatingBox.remove();
      }
    }
  }
});


const progressBars = document.querySelectorAll('.box .progress-bar');
const messageBanner = document.getElementById('message-banner');

function checkProgress() {
  let total = 0;

  progressBars.forEach((progressBar) => {
    const value = parseInt(progressBar.value) || 0;
    total += value;
  });

  const avg = total / progressBars.length;
  const overallProgress = document.getElementById("overall-progress");
  const label = document.getElementById("overall-progress-label");

  if (overallProgress && label) {
    overallProgress.value = avg;
    label.textContent = `${Math.round(avg)}% complete`;
  }

  const allComplete = avg === 100;

  messageBanner.style.display = allComplete ? 'block' : 'none';
}

document.querySelectorAll('.box').forEach((box) => {
  const progressBar = box.querySelector('.progress-bar');

  box.addEventListener('click', () => {
    if (trackedCells.length > 0) {
      const current = parseInt(progressBar.value) || 0;
      const newValue = Math.min(current + 100, 100);
      progressBar.value = newValue;
      progressBar.setAttribute('data-percent', newValue);
      checkProgress();
    }
  });
});

