
# **2048 Game**

A fully functional implementation of the classic **2048** puzzle game built with **JavaScript**, **HTML**, and **SCSS**. The project uses a modular structure, a dynamic rendering pipeline, persistent high‑score storage, and a responsive layout that adapts across screen sizes.

## **Game Features 🎮**

- **Responsive 4×4 grid** built with semantic HTML and styled using SCSS variables.  
- **Real‑time score and best‑score tracking** stored in `localStorage`.  
- **Keyboard input** using arrow keys.  
- **Defined game state transitions** (`Idle → Playing → Win/Lose`).  
- **Start/Restart controls** with clean board reinitialization.  
- **Side‑aligned score panel** generated dynamically.  
- **Clear separation of concerns** between core logic (`Game.class.js`) and UI (`main.js`, `main.scss`).

## **File Structure 🧱**

Below is the file tree **with literal code fences**, exactly as it should appear in your README:

```
```text
2048-game/
├── modules/
│   └── Game.class.js         # Core logic: movement, merging, tile spawning
├── scripts/
│   └── main.js               # UI controller: DOM updates, event listeners
├── styles/
│   └── main.scss             # SCSS styling: layout, tiles, animations
├── tests/
│   └── Game.class.test.js    # Unit tests for game logic
├── index.html                # HTML entry point with board and controls
└── package.json              # Project metadata and scripts
```
```

## **Installation & Running Locally ⚙️**

### Clone the repository

```
```bash
git clone https://github.com/yourusername/2048-game.git
cd 2048-game
```
```

### Install dependencies

```
```bash
npm install
```
```

### Run locally

Using a simple local server:

```
```bash
npx http-server .
```
```

or:

```
```bash
python3 -m http.server
```
```

Open the URL shown in your terminal (commonly `http://localhost:8080`).

## **How to Play 🕹️**

- Use the arrow keys (↑, ↓, ←, →) to move tiles.  
- Matching tiles merge to form higher values.  
- The objective is to create the **2048** tile.  
- When no valid moves remain, the game ends with a **Game Over** message.  
- Reaching 2048 displays a **You Win** banner, and play can continue to pursue higher scores.

