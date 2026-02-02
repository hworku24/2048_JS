2048 Game Clone

A fully functional clone of the classic 2048 puzzle game built with JavaScript, HTML, and SCSS.
This project reimagines the original 2048 with modular JavaScript classes, a dynamic board renderer, local high-score persistence, and an adaptive layout for screens.

 Game Features 🎮

Responsive 4x4 game grid built with semantic HTML and styled using SCSS variables.

Real-time score and best-score tracking stored in localStorage.

Keyboard controls (arrow keys for movement).

Game state management (Idle → Playing → Win/Lose).

Start/Restart buttons with smooth re-rendering.

Side-mounted score box dynamically generated and aligned beside the board.

Clean modular structure separating logic (Game.class.js) from UI (main.js + main.scss).

🧱 File Structure
2048-game/
│
├── modules/
│   └── Game.class.js          # Core game logic (movement, merging, win/loss detection)
│
├── scripts/
│   └── main.js                # UI logic, DOM updates, event handlers
│
├── styles/
│   └── main.scss              # Complete SCSS styling (board, tiles, score boxes)
│
├── tests/
│   └── Game.class.test.js     # Unit tests for core logic
│
├── index.html                 # Root page containing the board and controls
└── package.json               # Project metadata, dependencies, and build scripts

 Installation Running Locally ⚙️

Clone the repo:

git clone https://github.com/yourusername/2048-game.git
cd 2048-game


Install dependencies:

npm install


Run locally:

You can use a simple local server:

npx http-server .


or

python3 -m http.server


Then open http://localhost:8080
 (or whichever port it shows).

🕹️ How to Play

Use arrow keys (↑, ↓, ←, →) to slide tiles.

Merge equal tiles to reach higher numbers.

Try to create a tile with 2048!

When no moves remain, the game displays a “Game Over” message.
If you reach 2048, you’ll see a “You Win!” banner — but you can keep playing for higher scores.
