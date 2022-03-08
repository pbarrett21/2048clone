import {Injectable} from '@angular/core';
import {GameData} from '../models/GameData';
import {TileInfo} from '../models/TileInfo';

@Injectable({
  providedIn: 'root'
})
export class LogicService {

  boardState: TileInfo[][] = [];
  largestTile: number = 0;
  gameScore: number = 0;
  winThreshold: number = 2048;
  bestScore: number = 0;

  startNewGame(): GameData {
    this.clearBoard();
    this.createBoard();
    this.generateRandomStartingTiles();
    return {
      boardState: this.boardState,
      largestTile: this.largestTile,
      gameScore: this.gameScore,
      bestScore: this.bestScore,
      winThreshold: this.winThreshold,
      isGameOver: this.isGameOver()
    };
  }

  clearBoard() {
    this.bestScore = this.gameScore > this.bestScore ? this.gameScore : this.bestScore;
    this.boardState = [];
    this.largestTile = 0;
    this.gameScore = 0;
    this.winThreshold = 2048;
  }

  createBoard(): void {
    for (let i = 0; i < 4; i++) {
      this.boardState.push([]);
      for (let j = 0; j < 4; j++) {
        this.boardState[i].push(this.createNewCell(i, j));
      }
    }
  }

  generateRandomStartingTiles() {
    let coords1 = this.createRandomTuple();
    let coords2 = this.createRandomTuple();
    while (coords1[0] === coords2[0] && coords1[1] === coords2[1]) {
      coords1 = this.createRandomTuple();
      coords2 = this.createRandomTuple();
    }
    this.boardState[coords1[0]][coords1[1]] = this.createNewCell(coords1[0], coords1[1], this.random2or4());
    this.boardState[coords2[0]][coords2[1]] = this.createNewCell(coords2[0], coords2[1], this.random2or4());
  }

  createNewCell(rowNum: number, cellNum: number, num: number = 0): TileInfo {
    return {
      number: num,
      color: 'original',
      location: {row: rowNum, col: cellNum},
      moveAmount: {x: 0, y: 0}
    };
  }

  createRandomTuple(): number[] {
    return Array.from([0, 0], x => x + Math.floor(Math.random() * 4));
  }

  random2or4(): number {
    return Math.random() > 0.5 ? 4 : 2;
  }

  doAfterEveryMove(beforeBoard: TileInfo[][], afterBoard: TileInfo[][]): void {
    if (!this.isGameOver() && this.didAnyTilesMove(beforeBoard, afterBoard)) {
      this.createNewTileAfterMove();
    } else {
      if (this.isGameOver()) {
        this.bestScore = this.gameScore > this.bestScore ? this.gameScore : this.bestScore;
      }
    }
  }

  isAMovePossible(): boolean {
    // check for possible moves on x-axis
    for (let i = 0; i < 4; i++) {
      let row = this.boardState[i];
      for (let j = 3; j > 0; j--) {
        if (row[j].number !== 0 && row[j - 1].number === row[j].number) {
          return true;
        }
      }
    }

    // check for possible moves on y-axis
    this.boardState = this.transposeBoard();
    for (let i = 0; i < 4; i++) {
      let col = this.boardState[i];
      for (let j = 3; j > 0; j--) {
        if (col[j].number !== 0 && col[j - 1].number === col[j].number) {
          this.boardState = this.transposeBoard();
          return true;
        }
      }
    }
    this.boardState = this.transposeBoard();
    return false;
  }

  isGameOver() {
    return this.largestTile >= this.winThreshold || this.isBoardFull();
  }

  isBoardFull(): boolean {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.boardState[i][j].number === 0) {
          return false;
        }
      }
    }
    return !this.isAMovePossible()
  }

  createNewTileAfterMove(): void {
    let coords = this.createRandomTuple();
    while (this.boardState[coords[0]][coords[1]].number !== 0) {
      coords = this.createRandomTuple();
    }
    this.boardState[coords[0]][coords[1]] = this.createNewCell(coords[0], coords[1], this.random2or4())
  }

  moveRowRight(rowIndex: number, boardState: TileInfo[][]) {
    const rowTiles: TileInfo[] = this.condenseAndShiftRow(rowIndex, boardState[rowIndex]);
    this.checkForMerges(rowTiles);
    // condense again after merge [0 2 2 2] => Merge => [0 2 0 4] => Condense => [0 0 2 4]
    this.boardState[rowIndex] = this.condenseAndShiftRow(rowIndex, rowTiles);
  }

  condenseAndShiftRow(rowIndex: number, row: TileInfo[]): TileInfo[] {
    let rowTiles: TileInfo[] = [];
    for (let rowCell of row) {
      if (rowCell.number !== 0) {
        if (rowCell.number > this.largestTile) {
          this.largestTile = rowCell.number;
        }
        rowTiles.push({...rowCell});
      }
    }
    for (let i = 4 - rowTiles.length; i > 0; i--) {
      rowTiles.unshift(this.createNewCell(rowIndex, i));
    }
    return rowTiles;
  }

  checkForMerges(rowTiles: TileInfo[]) {
    for (let i = 3; i > 0; i--) {
      if (rowTiles[i].number !== 0 && rowTiles[i - 1].number === rowTiles[i].number) {
        rowTiles[i].number = rowTiles[i - 1].number * 2;
        this.gameScore += rowTiles[i - 1].number * 2;
        this.bestScore = this.gameScore > this.bestScore ? this.gameScore : this.bestScore;
        rowTiles[i - 1].number = 0;
      }
    }
  }

  // check if tiles actually moved locations
  didAnyTilesMove(beforeBoard: TileInfo[][], afterBoard: TileInfo[][]): boolean {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (beforeBoard[i][j].number !== afterBoard[i][j].number) {
          return true;
        }
      }
    }
    return false;
  }

  // every movement ultimately uses this method after array transforms
  moveRight(boardState: TileInfo[][]): GameData {
    const beforeBoard = [...boardState];
    for (let i = 0; i < 4; i++) {
      this.moveRowRight(i, boardState);
    }
    const afterBoard = this.boardState;
    this.doAfterEveryMove(beforeBoard, afterBoard);
    return {
      boardState: this.boardState,
      largestTile: this.largestTile,
      gameScore: this.gameScore,
      bestScore: this.bestScore,
      winThreshold: this.winThreshold,
      isGameOver: this.isGameOver()
    };
  }

  moveLeft(): GameData {
    const reversedBoard: TileInfo[][] = this.reverseBoard();
    this.moveRight(reversedBoard);
    this.boardState = this.reverseBoard();
    return {
      boardState: this.boardState,
      largestTile: this.largestTile,
      gameScore: this.gameScore,
      bestScore: this.bestScore,
      winThreshold: this.winThreshold,
      isGameOver: this.isGameOver()
    };
  }

  moveDown(): GameData {
    this.boardState = this.transposeBoard();
    this.moveRight(this.boardState);
    this.boardState = this.transposeBoard();
    return {
      boardState: this.boardState,
      largestTile: this.largestTile,
      gameScore: this.gameScore,
      bestScore: this.bestScore,
      winThreshold: this.winThreshold,
      isGameOver: this.isGameOver()
    };
  }

  moveUp(): GameData {
    this.boardState = this.transposeBoard();
    this.moveLeft();
    this.boardState = this.transposeBoard();
    return {
      boardState: this.boardState,
      largestTile: this.largestTile,
      gameScore: this.gameScore,
      bestScore: this.bestScore,
      winThreshold: this.winThreshold,
      isGameOver: this.isGameOver()
    };
  }

  reverseBoard(): TileInfo[][] {
    const reversedBoard: TileInfo[][] = [];
    for (let boardRow of this.boardState) {
      const reversedRow = [...boardRow].reverse();
      reversedBoard.push(reversedRow);
    }
    return reversedBoard;
  }

  transposeBoard(): TileInfo[][] {
    return this.boardState[0].map((col, i) => this.boardState.map(row => row[i]));
  }

  isGameLost(): boolean {
    return this.isGameOver() && this.largestTile < this.winThreshold;
  }

  isGameWon(): boolean {
    return this.largestTile >= this.winThreshold;
  }

  keepPlaying(): void {
    this.winThreshold = 100000000;
  }

}
