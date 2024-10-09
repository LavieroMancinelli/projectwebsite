import React, { useState, useEffect } from 'react';

const generate = (dim, animateWallStep, instant = false) => {
    // generate board
    let boardDim = dim * 2 + 1;
    let board = [];
    let walls = [];
    let sets = [];
    let timeouts = [];
    let isInstant = instant;
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
    const processWall = (instant = false) =>  {
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
            if (!isInstant) { 
                const timeoutId = setTimeout(() => processWall(false), 100);
                timeouts.push(timeoutId);
                return;
            } else {
                timeouts.forEach((timeout) => {clearTimeout(timeout)});
                timeouts = [];
            }
        }
        if (isInstant) {
            animateWallStep(board);
            timeouts.forEach((timeout) => {clearTimeout(timeout)});
            timeouts = [];
        }
    };

    const startGeneration = () => {
        if (instant) {
            timeouts.forEach(clearTimeout);
            timeouts = [];
            isInstant = true;
        }
        processWall();
    };
    
    startGeneration();
        
    //console.log("Final wallI", wallI);
    return board;
};


const Maze = ({board, playerPos, setPlayerPos, setWin}) => {
    const boardSize = board.length;
    const cellSize = `${60 / boardSize}vh`;

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
                console.log("game won");
            }
            return newPos;
        });
    };

    useEffect(() => {
        window.addEventListener('keydown', movePlayer);
        return () => window.removeEventListener('keydown', movePlayer);
    }, [board]);
    

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
    const [dim, setDim] = useState(5);
    const [accelFromGen, setAccelFromGen] = useState(false);
    const [genClass, setGenClass] = useState('startMaze');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isInstant, setIsInstant] = useState(false);

    const animateWallStep = (updatedBoard) => {
        setBoard([...updatedBoard]);
    }

    const handleGenerate = () => {
        setIsGenerating(true);
        setIsInstant(false);
        //setAccelFromGen((prevAccelFromGen) => !prevAccelFromGen)
        //setGenClass(prevClass => prevClass.includes('deployed') ? 'menuArea' : 'menuArea deployed');
        const newBoard = generate(dim, animateWallStep);
        setBoard(newBoard);
        setPlayerPos([-1,-1]);
        setWin(false);
    };

    const handleSpeedUp = () => {
        setIsGenerating(false);
        setIsInstant(false);
        generate(dim, animateWallStep, true);
    }

    const handleStartGame = () => {
        setPlayerPos([0,1]);
        setWin(false);
    };

/*
    useEffect(() => {
        if (winDeploy) {
            setTimeout(() => {
                setWinMessageVisible(true);
            }, 200);
        } else {
            setWinMessageVisible(false);
        }
    }, [winDeploy]);
    */

    return (
        <div>
            <div className="mazeBox">
                <h1>Maze Generator</h1>
                <p>Using randomized Kruskal's algorithm</p>
                <div className="genAndDimSlider">
                    {isGenerating ? (
                        <button className="speedUp" onClick={handleSpeedUp}>Speed Up</button>
                    ) : (
                        <button className="startMaze" onClick={handleGenerate}>Generate Maze</button>
                    )}
                    <div className="dimSliderBox">
                        <input
                            type="range"
                            id="dimSlider"
                            min="1"
                            max="50"
                            value={dim}
                            onChange={(e) => setDim(Number(e.target.value))}
                        />
                        <label htmlFor="dimSlider">Size: {dim}</label>
                    </div>
                    <button className="startGame" onClick={handleStartGame}>Start Game</button>
                </div>
                {win && <div className="winMessage">Maze solved!</div>}
                <Maze board={board} playerPos={playerPos} setPlayerPos={setPlayerPos} setWin={setWin}/>
            </div>
        </div>
    );
}

export default MazeApp;
