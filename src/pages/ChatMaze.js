import React, { useState, useEffect } from 'react';
const generateEmptyMaze = (rows, cols) => {
    return Array.from({ length: rows }, () => Array(cols).fill(1));
};
const carveMaze = (maze) => {
    const directions = [
        [0, 1], [1, 0], [0, -1], [-1, 0]
    ];

    const shuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    const carve = (x, y) => {
        maze[x][y] = 0;

        shuffle(directions);

        for (const [dx, dy] of directions) {
            const nx = x + dx * 2, ny = y + dy * 2;
            if (nx > 0 && nx < maze.length && ny > 0 && ny < maze[0].length && maze[nx][ny] === 1) {
                maze[x + dx][y + dy] = 0;
                carve(nx, ny);
            }
        }
    };

    carve(1, 1);  // Start carving from (1, 1)
    return maze;
};
const Maze = ({ rows, cols }) => {
    const [maze, setMaze] = useState([]);
    
    useEffect(() => {
        const initialMaze = generateEmptyMaze(rows, cols);
        const carvedMaze = carveMaze(initialMaze);
        setMaze(carvedMaze);
    }, [rows, cols]);

    return (
        <div>
            {maze.map((row, rowIndex) => (
                <div key={rowIndex} style={{ display: 'flex' }}>
                    {row.map((cell, colIndex) => (
                        <div key={colIndex} style={{
                            width: '20px',
                            height: '20px',
                            backgroundColor: cell === 1 ? 'black' : 'white',
                            border: cell === 1 ? '1px solid black' : '1px solid gray'
                        }}></div>
                    ))}
                </div>
            ))}
        </div>
    );
};

const MazeApp = () => (
    <div>
        <h1>Recursive Backtracking Maze</h1>
        <Maze rows={21} cols={21} />
    </div>
);


export default MazeApp;