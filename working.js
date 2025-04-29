<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Scrollable Random Matrix</title>
  <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="container"></div>
  <div id="bottom-panel">
    <div class="box">01<progress class="progress-bar" value="0" max="100"></progress></div>
    <div class="box">02<progress class="progress-bar" value="0" max="100"></progress></div>
    <div class="box">03<progress class="progress-bar" value="0" max="100"></progress></div>
    <div class="box">04<progress class="progress-bar" value="0" max="100"></progress></div>
    <div class="box">05<progress class="progress-bar" value="0" max="100"></progress></div>
  </div>
  <script src="script.js"></script>
</body>
</html>

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
            trackedCells.push(cell); // Track the 9 cells
          }
        }
      }
    }

    // If following is enabled, create the floating box
    if (floatingBox) {
      floatingBox.remove();
    }
    isFollowing = false; // Stop following when a new click happens
  }
});

// Handle mousemove event to magnify cells under the cursor
container.addEventListener("mousemove", (e) => {
  if (isFollowing && floatingBox) {
    floatingBox.style.left = `${e.clientX - floatingBox.offsetWidth / 2}px`;
    floatingBox.style.top = `${e.clientY - floatingBox.offsetHeight / 2}px`;
  }
  const target = e.target;
  if (target.classList.contains("cell")) {
    // Clear any previously magnified cells
    magCells.forEach((cell) => cell.classList.remove("magnify"));
    magCells = [];

    const row = parseInt(target.dataset.row);
    const col = parseInt(target.dataset.col);

    // Track the 9 cells around the cursor
    if (row > 0 && row < rows - 1 && col > 0 && col < cols - 1) {
      for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
          const cell = getCell(r, c);
          if (cell) {
            cell.classList.add("magnify");
            magCells.push(cell); // Track the 9 cells
          }
        }
      }
    }
  }
});

// Handle click on the bottom panel
const bottomPanel = document.getElementById("bottom-panel");
bottomPanel.addEventListener("click", () => {
  // Clear the text content of the tracked cells (disappear effect)
  trackedCells.forEach((cell) => {
    cell.textContent = ""; // Make the 9 cells disappear by clearing the text
    cell.classList.remove("magnify"); // Remove magnify effect
  });

  // Shift cells around the cleared cells
  trackedCells.forEach((cell) => {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (col > 0) {
      const leftNeighbor = getCell(row, col - 1);
      if (leftNeighbor) {
        cell.textContent = leftNeighbor.textContent;
        leftNeighbor.textContent = randomValue(); // Set random value in the left neighbor
      }
    }
    if (col < cols - 1) {
      const rightNeighbor = getCell(row, col + 1);
      if (rightNeighbor) {
        cell.textContent = rightNeighbor.textContent;
        rightNeighbor.textContent = randomValue(); // Set random value in the right neighbor
      }
    }
  });

  // After shifting, set random values in the cleared cells
  trackedCells.forEach((cell) => {
    if (cell.textContent === "") {
      cell.textContent = randomValue();
    }
  });

  trackedCells = []; // Clear the tracked cells after processing
  isFollowing = false; // Reset following state after the bottom panel is clicked
  if (floatingBox) {
    floatingBox.remove(); // Remove the floating box
  }
});

// Function to generate a random number
function randomValue() {
  return Math.floor(Math.random() * 10); // Random value between 0 and 9
}

// Function to position the floating box at the clicked cell
function positionFloatingBox(row, col) {
  const clickedCell = getCell(row, col);
  const rect = clickedCell.getBoundingClientRect();
  floatingBox.style.left = `${rect.left}px`;
  floatingBox.style.top = `${rect.top}px`;
}

// Function to update the floating box content
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

// Handle click event on the floating box to start following
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
document.querySelectorAll('.box').forEach((box) => {
  const progressBar = box.querySelector('.progress-bar');

  box.addEventListener('click', () => {
    if (trackedCells.length > 0) {
      const current = parseInt(progressBar.value) || 0;
      const newValue = Math.min(current + 10, 100);
      progressBar.value = newValue;
      progressBar.setAttribute('data-percent', newValue);
    }
  });
});
