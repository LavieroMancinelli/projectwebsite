import React, { useState, useEffect } from 'react';

const generate = (dim) => {
    // generate board
    let boardDim = dim * 2 + 1;
    let board = [];
    let walls = [];
    let sets = [];
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

    // cant use walls.length > 0 because it should end with some walls left
    for (let wallI = 0; wallI < walls.length; wallI++) {
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
    }
        
    //console.log("Final wallI", wallI);
    return board;
};


function Maze({board}) {
    const boardSize = board.length;
    const cellSize = `${60 / boardSize}vh`
    return (
        <div>
            {board.map((row, rowIndex) => (
                <div key={rowIndex} style={{ display: 'flex' }}>
                    {row.map((cell, colIndex) => (
                        <div key={colIndex} style={{
                            width: cellSize,
                            height: cellSize,
                            backgroundColor: cell[0] === 1 ? 'black' : 'white',
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
    const handleGenerate = () => {
        const newBoard = generate(20);
        setBoard(newBoard);
    };

    return (
        <div>
            <div className="mazeBox">
                <h1>Maze Page</h1>
                <p>Enjoy the maze game!</p>
                <button className="startMaze" onClick={handleGenerate}>Generate Maze</button>
                <button className="startGame" onClick={handleGenerate}>Start Game</button>
                <Maze board={board}/>
            </div>
        </div>
    );
}

export default MazeApp;
