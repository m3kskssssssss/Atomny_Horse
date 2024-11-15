import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Импортируйте CommonModule

interface Cell {
  number: number | null; // Номер хода или null, если клетка пустая
  isHighlighted: boolean; // Для подсветки доступных ходов
}

@Component({
  selector: 'app-chessboard',
  standalone: true, // Укажите, что это standalone компонент
  templateUrl: './chessboard.component.html',
  styleUrls: ['./chessboard.component.css'],
  imports: [CommonModule] // Импортируйте CommonModule
})
export class ChessboardComponent {
  board: Cell[][] = [];
  currentMove: number = 0;
  knightPosition: { x: number, y: number } | null = null;
  isMoving: boolean = false; // Переменная для отслеживания состояния перемещения

  constructor() {
    this.initializeBoard();
  }

  initializeBoard() {
    this.board = Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => ({ number: null, isHighlighted: false }))
    );
  }

  onCellClick(x: number, y: number) {
    if (this.knightPosition === null) {
      // Устанавливаем начальную позицию коня
      this.knightPosition = { x, y };
      this.board[x][y].number = 1; // Устанавливаем номер первого хода
      this.currentMove = 1; // Устанавливаем текущий ход
      this.highlightPossibleMoves(); // Подсвечиваем возможные ходы
    } else if (this.isValidMove(x, y)) {
      this.makeMove(x, y);
    }
  }

  isValidMove(x: number, y: number): boolean {
    return this.knightPosition !== null &&
           this.isKnightMove(this.knightPosition.x, this.knightPosition.y, x, y) &&
           this.board[x][y].number === null;
  }

  isKnightMove(startX: number, startY: number, endX: number, endY: number): boolean {
    const dx = Math.abs(endX - startX);
    const dy = Math.abs(endY - startY);
    return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
  }

  makeMove(x: number, y: number) {
  if (this.knightPosition) {
    this.board[this.knightPosition.x][this.knightPosition.y].isHighlighted = false;
  }

  this.isMoving = true; // Устанавливаем состояние перемещения

  // Устанавливаем новую позицию коня
  this.knightPosition = { x, y };
  this.currentMove++;

  // Обновляем клетку с номером хода
  this.board[x][y] = { number: this.currentMove, isHighlighted: false };

  // Запускаем анимацию
  const knightElement = document.querySelector('.knight') as HTMLElement;
  const cellElement = document.querySelector(`.cell:nth-child(${y + 1})`) as HTMLElement;
  const cellRect = cellElement.getBoundingClientRect();

  // Устанавливаем позицию коня в новую клетку
  knightElement.style.transform = `translate(${cellRect.left}px, ${cellRect.top}px)`;

  setTimeout(() => {
    this.isMoving = false; // Сбрасываем состояние перемещения
    this.highlightPossibleMoves(); // Подсвечиваем возможные ходы
    this.checkGameStatus();
  }, 500); // Задержка для анимации
}


  highlightPossibleMoves() {
  const moves = [
    { dx: 2, dy: 1 }, { dx: 2, dy: -1 },
    { dx: -2, dy: 1 }, { dx: -2, dy: -1 },
    { dx: 1, dy: 2 }, { dx: 1, dy: -2 },
    { dx: -1, dy: 2 }, { dx: -1, dy: -2 }
  ];

  // Сбрасываем подсветку для всех клеток
  this.board.forEach(row => row.forEach(cell => cell.isHighlighted = false));

  if (this.knightPosition) {
    for (const move of moves) {
      const newX = this.knightPosition.x + move.dx;
      const newY = this.knightPosition.y + move.dy;
      if (this.isInBounds(newX, newY) && this.board[newX][newY].number === null) {
        this.board[newX][newY].isHighlighted = true; // Подсвечиваем доступные клетки
      }
    }
  }
}

  isInBounds(x: number, y: number): boolean {
    return x >= 0 && x < 10 && y >= 0 && y < 10;
  }


  targetCell: { x: number, y: number } | null = null; // Целевая клетка для анимации


  checkGameStatus() {
    const allFilled = this.board.flat().every(cell => cell.number !== null);
    const noMovesLeft = !this.knightPosition || !this.getPossibleMoves(this.knightPosition.x, this.knightPosition.y).length;

    if (allFilled) {
      alert('Вы выиграли!');
    } else if (noMovesLeft) {
      alert('Игра проиграна!');
    }
  }

  getPossibleMoves(x: number, y: number): { x: number, y: number }[] {
    const moves = [
      { dx: 2, dy: 1 }, { dx: 2, dy: -1 },
      { dx: -2, dy: 1 }, { dx: -2, dy: -1 },
      { dx: 1, dy: 2 }, { dx: 1, dy: -2 },
      { dx: -1, dy: 2 }, { dx: -1, dy: -2 }
    ];

    return moves
      .map(move => ({ x: x + move.dx, y: y + move.dy }))
      .filter(pos => this.isInBounds(pos.x, pos.y) && this.board[pos.x][pos.y].number === null);
  }

  resetGame() {
    this.initializeBoard();
    this.currentMove = 0;
    this.knightPosition = null;
  }
}
