document.addEventListener('DOMContentLoaded', () => {
    // Game state
    let grid = [];
    let score = 0;
    let bestScore = localStorage.getItem('bestScore') || 0;
    let gameOver = false;
    let canMove = true;
    
    // DOM elements
    const gridSize = 4;
    const gridContainer = document.querySelector('.grid-container');
    const tileContainer = document.querySelector('.tile-container');
    const scoreElement = document.getElementById('score');
    const bestScoreElement = document.getElementById('best-score');
    const newGameButton = document.getElementById('new-game');
    const tryAgainButton = document.getElementById('try-again');
    const gameOverElement = document.getElementById('game-over');
    
    // Initialize the game
    function initGame() {
        // Reset game state
        grid = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
        score = 0;
        gameOver = false;
        canMove = true;
        
        // Update UI
        updateScore();
        clearTiles();
        gameOverElement.classList.add('hidden');
        
        // Add initial tiles
        addRandomTile();
        addRandomTile();
    }
    
    // Add a random tile (2 or 4) to an empty cell
    function addRandomTile() {
        const emptyCells = [];
        
        // Find all empty cells
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                if (grid[row][col] === 0) {
                    emptyCells.push({ row, col });
                }
            }
        }
        
        if (emptyCells.length > 0) {
            // Choose a random empty cell
            const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            // 90% chance for 2, 10% chance for 4
            grid[row][col] = Math.random() < 0.9 ? 2 : 4;
            createTile(row, col, grid[row][col]);
        }
    }
    
    // Create a new tile element with animation
    function createTile(row, col, value) {
        const tile = document.createElement('div');
        tile.className = `tile tile-${value}`;
        tile.textContent = value;
        tile.dataset.row = row;
        tile.dataset.col = col;
        tile.dataset.value = value;
        
        // Position the tile
        updateTilePosition(tile, row, col);
        
        tileContainer.appendChild(tile);
        return tile;
    }
    
    // Update tile position on the grid
    function updateTilePosition(tile, row, col) {
        const size = (gridContainer.offsetWidth - 50) / 4; // 10px gap * 5 (4 gaps + 1)
        const x = col * (size + 10) + 10;
        const y = row * (size + 10) + 10;
        
        tile.style.width = `${size}px`;
        tile.style.height = `${size}px`;
        tile.style.transform = `translate(${x}px, ${y}px)`;
    }
    
    // Clear all tiles from the board
    function clearTiles() {
        while (tileContainer.firstChild) {
            tileContainer.removeChild(tileContainer.firstChild);
        }
    }
    
    // Update the score display
    function updateScore() {
        scoreElement.textContent = score;
        bestScoreElement.textContent = bestScore;
    }
    
    // Check if there are any valid moves left
    function hasValidMoves() {
        // Check for empty cells
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                if (grid[row][col] === 0) {
                    return true;
                }
                
                // Check adjacent cells for possible merges
                const current = grid[row][col];
                const directions = [
                    { dr: 0, dc: 1 },  // right
                    { dr: 1, dc: 0 },  // down
                ];
                
                for (const { dr, dc } of directions) {
                    const newRow = row + dr;
                    const newCol = col + dc;
                    
                    if (newRow < gridSize && newCol < gridSize && grid[newRow][newCol] === current) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }
    
    // Handle keyboard input
    function handleKeyDown(event) {
        if (!canMove || gameOver) return;
        
        let moved = false;
        
        // Make a copy of the grid before the move
        const previousGrid = grid.map(row => [...row]);
        
        switch (event.key) {
            case 'ArrowUp':
                moved = moveTiles('up');
                break;
            case 'ArrowDown':
                moved = moveTiles('down');
                break;
            case 'ArrowLeft':
                moved = moveTiles('left');
                break;
            case 'ArrowRight':
                moved = moveTiles('right');
                break;
            default:
                return; // Ignore other keys
        }
        
        // If the grid changed, add a new tile and check for game over
        if (moved) {
            canMove = false;
            
            // Wait for animations to complete
            setTimeout(() => {
                addRandomTile();
                updateScore();
                
                if (!hasValidMoves()) {
                    endGame();
                }
                
                canMove = true;
            }, 200);
        }
    }
    
    // Move tiles in the specified direction
    function moveTiles(direction) {
        let moved = false;
        const size = grid.length;
        
        // Create a copy of the grid to track merged tiles
        const merged = Array(size).fill().map(() => Array(size).fill(false));
        
        // Define the order to process cells based on direction
        const rowOrder = direction === 'down' 
            ? Array.from({ length: size }, (_, i) => size - 1 - i) 
            : Array.from({ length: size }, (_, i) => i);
            
        const colOrder = direction === 'right' 
            ? Array.from({ length: size }, (_, i) => size - 1 - i) 
            : Array.from({ length: size }, (_, i) => i);
        
        // Process each cell in the appropriate order
        for (const row of rowOrder) {
            for (const col of colOrder) {
                if (grid[row][col] === 0) continue;
                
                let newRow = row;
                let newCol = col;
                let currentRow = row;
                let currentCol = col;
                let canMoveFurther = true;
                
                // Move the tile as far as possible in the specified direction
                while (canMoveFurther) {
                    let nextRow = newRow;
                    let nextCol = newCol;
                    
                    // Calculate the next position based on direction
                    switch (direction) {
                        case 'up': nextRow--; break;
                        case 'down': nextRow++; break;
                        case 'left': nextCol--; break;
                        case 'right': nextCol++; break;
                    }
                    
                    // Check if the next position is valid
                    if (nextRow >= 0 && nextRow < size && nextCol >= 0 && nextCol < size) {
                        if (grid[nextRow][nextCol] === 0) {
                            // Move to empty cell
                            newRow = nextRow;
                            newCol = nextCol;
                        } else if (grid[nextRow][nextCol] === grid[currentRow][currentCol] && !merged[nextRow][nextCol]) {
                            // Merge with matching value
                            newRow = nextRow;
                            newCol = nextCol;
                            canMoveFurther = false;
                        } else {
                            canMoveFurther = false;
                        }
                    } else {
                        canMoveFurther = false;
                    }
                }
                
                // If the tile moved or merged, update the grid and animate
                if (newRow !== row || newCol !== col) {
                    moved = true;
                    
                    // Check if this is a merge
                    if (grid[newRow][newCol] !== 0) {
                        // Merge the tiles
                        const mergedValue = grid[newRow][newCol] * 2;
                        grid[newRow][newCol] = mergedValue;
                        grid[row][col] = 0;
                        
                        // Update score
                        score += mergedValue;
                        if (score > bestScore) {
                            bestScore = score;
                            localStorage.setItem('bestScore', bestScore);
                        }
                        
                        // Mark as merged to prevent multiple merges in one move
                        merged[newRow][newCol] = true;
                        
                        // Animate merge
                        const tile = getTileAt(row, col);
                        if (tile) {
                            // Move to the merged position
                            updateTilePosition(tile, newRow, newCol);
                            
                            // After animation, update the tile value and class
                            setTimeout(() => {
                                tile.textContent = mergedValue;
                                tile.className = `tile tile-${mergedValue}`;
                                tile.dataset.value = mergedValue;
                                
                                // Remove the tile that was merged into
                                const mergedTile = getTileAt(newRow, newCol, tile);
                                if (mergedTile) {
                                    mergedTile.remove();
                                }
                            }, 100);
                        }
                    } else {
                        // Just move the tile
                        grid[newRow][newCol] = grid[row][col];
                        grid[row][col] = 0;
                        
                        // Animate movement
                        const tile = getTileAt(row, col);
                        if (tile) {
                            updateTilePosition(tile, newRow, newCol);
                            tile.dataset.row = newRow;
                            tile.dataset.col = newCol;
                        }
                    }
                }
            }
        }
        
        return moved;
    }
    
    // Get the tile element at the specified position
    function getTileAt(row, col, exclude = null) {
        const tiles = tileContainer.querySelectorAll('.tile');
        for (const tile of tiles) {
            if (tile === exclude) continue;
            if (parseInt(tile.dataset.row) === row && parseInt(tile.dataset.col) === col) {
                return tile;
            }
        }
        return null;
    }
    
    // Handle game over
    function endGame() {
        gameOver = true;
        gameOverElement.classList.remove('hidden');
    }
    
    // Event listeners
    document.addEventListener('keydown', handleKeyDown);
    newGameButton.addEventListener('click', initGame);
    tryAgainButton.addEventListener('click', initGame);
    
    // Touch event support
    let touchStartX = 0;
    let touchStartY = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, false);
    
    document.addEventListener('touchend', (e) => {
        if (!touchStartX || !touchStartY) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY;
        
        // Determine the direction of the swipe
        if (Math.abs(dx) > Math.abs(dy)) {
            // Horizontal swipe
            if (dx > 0) {
                // Right swipe
                if (canMove && !gameOver) {
                    const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
                    handleKeyDown(event);
                }
            } else {
                // Left swipe
                if (canMove && !gameOver) {
                    const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
                    handleKeyDown(event);
                }
            }
        } else {
            // Vertical swipe
            if (dy > 0) {
                // Down swipe
                if (canMove && !gameOver) {
                    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
                    handleKeyDown(event);
                }
            } else {
                // Up swipe
                if (canMove && !gameOver) {
                    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
                    handleKeyDown(event);
                }
            }
        }
        
        // Reset touch coordinates
        touchStartX = 0;
        touchStartY = 0;
    }, false);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const tiles = tileContainer.querySelectorAll('.tile');
        tiles.forEach(tile => {
            const row = parseInt(tile.dataset.row);
            const col = parseInt(tile.dataset.col);
            updateTilePosition(tile, row, col);
        });
    });
    
    // Start the game
    initGame();
});
