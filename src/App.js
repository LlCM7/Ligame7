import React, { useState } from 'react';
import './App.css';

function Square({ value, onSquareClick, size }) {
  return (
     <button className="square" onClick={onSquareClick} style={{ width: size, height: size }}>
       {value}
     </button>
   );
}

function Board({ xIsNext, squares, onPlay, size, onUndo, onReset }) {
  function handleClick(i) {
     const nextSquares = squares.slice();
     if (calculateWinner(nextSquares, size)) {
       return;
     }
     nextSquares[i] = xIsNext ? 'X' : 'O';
     onPlay(nextSquares);
   }

   const winner = calculateWinner(squares, size);
   let status;
   if (winner) {
     status = 'Winner: ' + winner;
   } else {
     status = 'Next player: ' + (xIsNext ? 'X' : 'O');
   }

   return (
     <>
       <div className="status">{status}</div>
       <div className="board" style={{ gridTemplateColumns: `repeat(${size}, 40px)` }}>
         {Array(size * size).fill(null).map((_, index) => (
           <Square
             key={index}
             value={squares[index]}
             onSquareClick={() => handleClick(index)}
             size={40}
           />
         ))}
       </div>
       <button onClick={onUndo}>Undo</button>
       <button onClick={onReset}>Reset Game</button>
     </>
   );
}

export default function Game() {
  const size = 15; // 五子棋棋盘大小
  const [history, setHistory] = useState([Array(size * size).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    setHistory([...history.slice(0, currentMove + 1), nextSquares]);
    setCurrentMove(currentMove + 1);
  }

  function undoLastMove() {
    if (currentMove > 0) {
      setCurrentMove(currentMove - 1);
    }
  }

  function resetGame() {
    setHistory([Array(size * size).fill(null)]);
    setCurrentMove(0);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          size={size}
          onUndo={undoLastMove}
          onReset={resetGame}
        />
      </div>
    </div>
  );
}

function calculateWinner(squares, size) {
  const lines = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      // Check horizontal, vertical, and diagonal lines
      if (col + 4 < size) lines.push([squares[row * size + col], squares[row * size + col + 1], squares[row * size + col + 2], squares[row * size + col + 3], squares[row * size + col + 4]]);
      if (row + 4 < size) lines.push([squares[row * size + col], squares[(row + 1) * size + col], squares[(row + 2) * size + col], squares[(row + 3) * size + col], squares[(row + 4) * size + col]]);
      if (row + 4 < size && col + 4 < size) lines.push([squares[row * size + col], squares[(row + 1) * size + col + 1], squares[(row + 2) * size + col + 2], squares[(row + 3) * size + col + 3], squares[(row + 4) * size + col + 4]]);
      if (row - 4 >= 0 && col + 4 < size) lines.push([squares[row * size + col], squares[(row - 1) * size + col + 1], squares[(row - 2) * size + col + 2], squares[(row - 3) * size + col + 3], squares[(row - 4) * size + col + 4]]);
      if (row + 4 < size && col - 4 >= 0) lines.push([squares[row * size + col], squares[(row + 1) * size + col - 1], squares[(row + 2) * size + col - 2], squares[(row + 3) * size + col - 3], squares[(row + 4) * size + col - 4]]);
    }
  }
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].every(cell => cell === lines[i][0] && cell !== null)) {
      return lines[i][0];
    }
  }
  return null;
}