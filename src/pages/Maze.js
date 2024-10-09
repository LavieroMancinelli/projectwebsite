import React, { useState, useEffect, useRef } from 'react';

const generate = (dim, animateWallStep, setIsGenerating, setHasGenerated) => {
    setHasGenerated(false);
    // generate board
    let boardDim = dim * 2 + 1;
    let cycleDelay = boardDim >= 20 ? 1 : 20;
    let board = [];
    let walls = [];
    for (let i = 0; i < boardDim; i++) {
        let row = [];
        for (let j = 0; j < boardDim; j++) {
            if (i === 0 || j === 0 || i === boardDim - 1 || j === boardDim - 1) {
                    row.push([1,new Set([[i,j]])]);
                } // walls on edges
            else if (i % 2 === 0 || j % 2 === 0) {
                row.push([1,new Set([[i,j]])]);
                if (!(i % 2 === 0 && j % 2 === 0)) { // add to walls if seperates two open spaces
                    walls.push([i,j]);
                }
            } // walls on even squares
            else {
                row.push([0,new Set([[i,j]])]);
            };
        }
        board.push(row);
    } 

    // entrance and exit
    board[0][1][0] = 0;
    board[boardDim-1][boardDim-2][0] = 0;

    // NEED TO NOT STORE SETS ON CELLS BECAUSE WHEN UPDATE ONE NEED TO UPDATE ALL CONNECTED SETS

    // fisher-yates shuffle wall array
    for (let i = walls.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [walls[i], walls[j]] = [walls[j], walls[i]]; // Swap elements
    }

    let wallI = 0;
    const processWall = () =>  {
        if (wallI < walls.length) {
            let i = walls[wallI][0], j = walls[wallI][1];
            let adj = [];
            if (i-1>0 && board[i-1][j][0] == 0) adj.push([i-1,j]); // add adj
            if (j-1>0 && board[i][j-1][0] == 0) adj.push([i,j-1]);
            if (i+1<boardDim-1 && board[i+1][j][0] == 0) adj.push([i+1,j]);
            if (j+1<boardDim-1 && board[i][j+1][0] == 0) adj.push([i,j+1]);
            //console.log(adj.length);
            let duplicate = false; // verify adj spaces no duplicate sets
            for (let adjI = 0; adjI < adj.length; adjI++) {
                for (let adjJ = 0; adjJ < adj.length; adjJ++) {
                    let iI = adj[adjI][0], iJ = adj[adjI][1];
                    let jI = adj[adjJ][0], jJ = adj[adjJ][1];
                    if (adjI != adjJ && board[iI][iJ][1] == board[jI][jJ][1]) {
                        duplicate = true;
                        //console.log("DENIED at", i, ",", j);
                        break;
                    }
                }
            }

            if (!duplicate && adj.length > 0) { // if no adj spaces have dup sets
                //console.log("passed at", i, ",", j);
                board[i][j][0] = 0;  // make this wall a space
                let sumSet = new Set();
                sumSet.add([i,j]); // add wall to adj spaces' sets
                for (let adjI = 0; adjI < adj.length; adjI++) { // combine sets of adj spaces into sumSet
                    let curI = adj[adjI][0], curJ = adj[adjI][1];
                    sumSet = sumSet.union(board[curI][curJ][1]);
                }

                for (let item of sumSet) { // set sets of cells in sumSet to sumSet
                    let curI = item[0], curJ = item[1];
                    board[curI][curJ][1] = sumSet;
                }
            }
            wallI++;
            animateWallStep(board);
            setTimeout(processWall, cycleDelay);
        }

        if (wallI >= walls.length) {
            setIsGenerating(false);
            setHasGenerated(true);
            animateWallStep(board);
        }
    };

    processWall();
        
    //console.log("Final wallI", wallI);
    return board;
};


const Maze = ({board, playerPos, setPlayerPos, setWin, setGameStarted, gameStarted}) => {
    const boardSize = board.length;
    const cellSize = `${600/boardSize}px`;//`${60 / boardSize}vh`;

    //const [playerPos, setPlayerPos] = useState([1,1])

    const movePlayer = (e) => {
        setPlayerPos((prevPos) => {
            if (prevPos[0] === -1 && prevPos[1] === -1) return prevPos;
            let newPos = { ...prevPos };
            if (e.key === 'ArrowUp' || e.key === 'w') {
                newPos[0] = Math.max(prevPos[0] - 1, 0);
            } else if (e.key === 'ArrowDown' || e.key === 's') {
                newPos[0] = Math.min(prevPos[0] + 1, boardSize - 1);
            } else if (e.key === 'ArrowLeft' || e.key === 'a') {
                newPos[1] = Math.max(prevPos[1] - 1, 0);
            } else if (e.key === 'ArrowRight' || e.key === 'd') {
                newPos[1] = Math.min(prevPos[1] + 1, boardSize - 1);
            }

            // prevent move into wall
            if (board[newPos[0]][newPos[1]][0] === 1 && 
                (newPos != [0,1] || newPos != [boardSize-1,boardSize-2])) {
                return prevPos;
            }
            // detect win
            if (newPos[0] === boardSize-1 && newPos[1] === boardSize-2) {
                setWin(true);
                setGameStarted(false);
                console.log("game won");
            }
            return newPos;
        });
    };

    useEffect(() => {
        if (gameStarted)
            window.addEventListener('keydown', movePlayer);
        else 
            window.removeEventListener('keydown', movePlayer);
        return () => window.removeEventListener('keydown', movePlayer);
    }, [gameStarted, board]);
    



    return (
        <div>
            {board.map((row, rowIndex) => (
                <div key={rowIndex} style={{ display: 'flex' }}>
                    {row.map((cell, colIndex) => (
                        <div key={colIndex} style={{
                            width: cellSize,
                            height: cellSize,
                            backgroundColor:
                                playerPos[0] === rowIndex && playerPos[1] === colIndex
                                    ? 'red'
                                    : cell[0] === 2
                                        ? 'green'
                                        : cell[0] === 3
                                            ? 'blue'
                                            : cell[0] === 1
                                                ? 'black'
                                                : 'white',
                            //border: cell === 1 ? '1px solid black' : '1px solid gray'
                        }}></div>
                    ))}
                </div>
            ))}
        </div>
    )
}

const MazeApp = () => {
    const [board, setBoard] = useState([]);
    const [playerPos, setPlayerPos] = useState([0,1]);
    const [win, setWin] = useState(false);
    const [dim, setDim] = useState(10);
    const [isGenerating, setIsGenerating] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [solving, setSolving] = useState(false);

    const animateWallStep = (updatedBoard) => {
        setBoard([...updatedBoard]);
    }

    const handleGenerate = () => {
        setIsGenerating(true);
        const newBoard = generate(dim, animateWallStep, setIsGenerating, setHasGenerated);
        setBoard(newBoard);
        setPlayerPos([-1,-1]);
        setWin(false);
    };

    const handleStartGame = () => {
        setPlayerPos([0,1]);
        setWin(false);
        setGameStarted(true);
    };

    const handleAutoSolve = () => {
        autoSolve();
    };

    const autoSolve = () => {
        setSolving(true);
        let path = [[0,1]];
        let visited = new Set();
        const solveStep = () => {
            if (path.length > 0) {
                // get most recent space
                let [row, col] = path[path.length-1];
                // color explored spaces greem
                board[row][col][0] = 2;
                setBoard([...board]);
                visited.add([row,col]);

                // if reach end, color this path blue
                if (row == board.length-1 && col == board.length-2) {
                    console.log("autosolved");
                    path.forEach(([r,c]) => {
                        board[r][c][0] = 3;
                    });
                    setSolving(false);
                    setWin(true);
                    setGameStarted(false);
                    return;
                }

                let stepAdded = false;
                const directions = [[1,0],[0,1],[-1,0],[0,-1]];
                // check each direction (avoid double back)
                for (let [dRow, dCol] of directions) {
                    let newRow = row + dRow;
                    let newCol = col + dCol;
                    if (newRow >= 0 && newRow < board.length && newCol >= 0 && newCol < board.length
                        && board[newRow][newCol][0] === 0 && !visited.has([newRow,newCol])) {
                            path.push([newRow, newCol]);
                            stepAdded = true;
                            break;
                        }
                }
                // backtrack if couldn't move forward
                if (!stepAdded) {
                    path.pop();
                    return solveStep();
                }
                
                setTimeout(solveStep, 10);
            } else {
                setSolving(false);
            }
        };
        solveStep();
    };

    useEffect(() => {
        const disableArrowKeys = (e) => {
            if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {
                e.preventDefault();
            }
        };

        if (gameStarted) {
            window.addEventListener("keydown", disableArrowKeys);
        } else {
            window.removeEventListener("keydown", disableArrowKeys);
        }

        return () => {
            window.removeEventListener("keydown", disableArrowKeys);
        };
    }, [gameStarted]);

    return (
        <div>
            <div className="mazeBox">
                <h1>Maze Generator</h1>
                <p>Using Randomized Kruskal's Algorithm</p>
                <div className="genAndDimSlider">
                    {gameStarted ? (
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <button className="autoSolve" onClick={handleAutoSolve}>Auto Solve</button>
                            <div>Use arrow keys to move player to bottom right</div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            {isGenerating ? (
                                /*<button className="speedUp" onClick={handleSpeedUp}>Speed Up</button>*/
                                <div className="genText">Generating maze of size: {dim}...</div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <button className="startMaze" onClick={handleGenerate}>Generate Maze</button>
                                    <div className="dimSliderBox">
                                        <input
                                            type="range"
                                            id="dimSlider"
                                            min="1"
                                            max="40"
                                            value={dim}
                                            onChange={(e) => setDim(Number(e.target.value))}
                                        />
                                        <label htmlFor="dimSlider">Size: {dim}</label>
                                    </div>
                                </div>
                            )}
                            
                            {hasGenerated && !win && (
                                <button className="startGame" onClick={handleStartGame}>Start Game</button>
                            )}
                        </div>
                    )}
                    
                </div>
                {win && <div className="winMessage">Maze solved!</div>}
                <Maze board={board} playerPos={playerPos} setPlayerPos={setPlayerPos} setWin={setWin} setGameStarted={setGameStarted} gameStarted={gameStarted}/>
                
                <div className="kruskalText">
                    <h1>About Randomized Kruskal's Algorithm</h1>
                    <pre>The Randomized Kruskal's Algorithm is a variation of Kruskal's 
                        <br/>Algorithm to find a minimum spanning tree of a graph. 
                        <br/>Kruskal's Algorithm is essentially:
                        <br/>
                        <br/>       1. Initialize a forest of single-vertex trees for each vertex
                        <br/>          in input graph.
                        <br/>       2. Sort edges of the input graph by weight
                        <br/>       3. For each edge (in order of weight):
                        <br/>           - If adding the edge would not create a cycle: 
                        <br/>              - Add the edge to the forest and merge the trees it connects
                        <br/>
                        <br/>The version of Kruskal's Algorithm used to create this maze does not use
                        <br/>weights but applies a random order to add difficulty (and avoid the maze
                        <br/>looking like a barcode), hence its title, Randomized Kruskal's Algorithm:
                        <br/>
                        <br/>       1. Initialize the walls to separate single square cells. 
                        <br/>       2. Add all the walls to a single set and shuffle it. 
                        <br/>          Make a set for each cell containing only that cell.
                        <br/>       3. For each wall in the set of walls:
                        <br/>           - If the sets of adjacent spaces do not overlap: 
                        <br/>              - Make the wall a space and combine the sets of adjacent
                        <br/>                spaces including the space just created
                        <br/>
                        <br/>In this application, the initial constuction of walls creates a graph
                        <br/>of spaces (nodes) which can be connected by edges (walls). Each square's
                        <br/>set represents the tree of spaces it is connected to. When we remove a wall, 
                        <br/>we are adding an edge between the sets of adjacent spaces. So by only
                        <br/>removing a wall when the adjacent sets do not overlap, we are connecting
                        <br/>portions of the maze while guaranteeing that there are no cycles. Once all
                        <br/>the walls that can be removed have been, every edge that could have
                        <br/>been added without creating a cycle was added and now there is one set
                        <br/>that connects every space. Thus, we are left with a connected graph with no
                        <br/>cycles or a spanning tree. In other words, any space can be reached starting
                        <br/>from any other space, including the end square from the beginning square.
                        <br/><br/>
                        <h2>About the Auto Solver Function</h2>
                        <br/>The auto-solver function uses a simple recursive backtracking approach:
                        <br/>
                        <br/>       Beginning at the start square:
                        <br/>           1. Add most recent square to set of visited spaces.
                        <br/>           2. Add the first adjacent square that is not a wall
                        <br/>              and not visited to the path.
                        <br/>           3. If couldn't add a space to the path, backtrack (remove
                        <br/>              current space from path but not visited and call again)
                        <br/>           4. If a call finds the end, the solution is the path
                        <br/>
                        <br/>

                    </pre>
                </div>
            </div>
        </div>
    );
}

export default MazeApp;
