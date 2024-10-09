import React, { useState, useEffect } from 'react';

const generate = (dim) => {
    // generate board
    let boardDim = dim * 2 + 1;
    let board = [];
    let walls = [];
    for (let i = 0; i < boardDim; i++) {
        let row = [];
        for (let j = 0; j < boardDim; j++) {
            if (i === 0 || j === 0 || i === boardDim - 1 || j === boardDim - 1) {
                    row.push([1,[[i,j]]]);
                } // walls on edges
            else if (i % 2 === 0 || j % 2 === 0) {
                row.push([1,[[i,j]]]);
                walls.push([i,j]);
                /*if (!(i % 2 === 0 && j % 2 === 0)) { // add to walls if seperates two open spaces
                    walls.push([i,j]);
                }*/
            } // walls on even squares
            else {
                row.push([0,[[i,j]]]);
            };
        }
        board.push(row);
    } 

    // cant use walls.length > 0 because it should end with some walls left
    let tempCycles = 300; //walls.length > 0
    while (walls.length > 0) {
        let wallI = Math.floor(Math.random() * walls.length);
        let i = walls[wallI][0], j = walls[wallI][1];
        console.log(i, ',', j);
        let adj = [];
        if (i-1>0 && board[i-1][j][0] == 0) adj.push([i-1,j]); // add adj
        if (j-1>0 && board[i][j-1][0] == 0) adj.push([i,j-1]);
        if (i+1<boardDim-1 && board[i+1][j][0] == 0) adj.push([i+1,j]);
        if (j+1<boardDim-1 && board[i][j+1][0] == 0) adj.push([i,j+1]);
        console.log(adj.length);
        let duplicate = false; // verify adj spaces no duplicate sets
        for (let adjI = 0; adjI < adj.length; adjI++) {
            for (let adjJ = 0; adjJ < adj.length; adjJ++) {
                let iI = adj[adjI][0], iJ = adj[adjI][1];
                let jI = adj[adjJ][0], jJ = adj[adjJ][1];
                if (adjI != adjJ && board[iI][iJ][1] == board[jI][jJ][1]) {
                    duplicate = true;
                    walls.splice(wallI,1); // remove wall from walls
                    break;
                }
            }
        }

        if (!duplicate && adj.length > 0) { // if no adj spaces have dup sets
            console.log("passed");
            board[i][j][0] = 0;  // make this wall a space
            board[adj[0][0]][adj[0][1]][1].push([i,j]); // add wall to adj spaces' sets
            let sumSet = [];
            for (let adjI = 1; adjI < adj.length; adjI++) { // combine sets of adj spaces into sumSet
                let prevI = adj[adjI-1][0], prevJ = adj[adjI-1][1], curI = adj[adjI][0], curJ = adj[adjI][1];
                //board[adj[adjI-1]][1].push.apply(board[adj[adjI-1]][1], board[adj[adjI]][1]);
                sumSet.push.apply(board[prevI][prevJ][1], board[curI][curJ][1]);
                //adj[adjI-1][1] = adj[adjI-1][1].concat(adj[adjI][1]);
            }

            for (let adjI = 0; adjI < adj.length; adjI++) { // set all adj sets to sumSet
                let curI = adj[adjI][0], curJ = adj[adjI][1];
                board[curI][curJ][1] = sumSet;
            }
            walls.splice(wallI,1); // remove wall from walls
            console.log("did we get here");
            tempCycles--;
        }
    }
        
    return board;
};


function Maze({dim}) {
    const [maze, setMaze] = useState([]);
    const size = 20; // number of rows/columns

    useEffect(() => {
        const initialMaze = generate(dim);
        setMaze(initialMaze);
    }, [dim]);

    return (
        <div>
            {maze.map((row, rowIndex) => (
                <div key={rowIndex} style={{ display: 'flex' }}>
                    {row.map((cell, colIndex) => (
                        <div key={colIndex} style={{
                            width: '1.5vh',
                            height: '1.5vh',
                            backgroundColor: cell[0] === 1 ? 'black' : 'white',
                            //border: cell === 1 ? '1px solid black' : '1px solid gray'
                        }}></div>
                    ))}
                </div>
            ))}
        </div>
    );
}

const MazeApp = () => {
    return (
        <div>
            <div className="mazeBox">
                <h1>Maze Page</h1>
                <p>Enjoy the maze game!</p>
                <button className="startMaze" onClick={generate}>Generate Maze</button>
                <Maze dim={20}/>
            </div>
        </div>
    );
}

export default MazeApp;
