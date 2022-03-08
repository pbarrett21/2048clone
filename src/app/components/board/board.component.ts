import {Component, HostListener, OnInit} from '@angular/core';
import {TileInfo} from '../tile/tile.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  // boardState: TileInfo[][] = [
  //   [
  //     {number: 2, color: 'red', location: {row: 0, col: 0}, moveAmount: {x: 0, y: 0}},
  //     {number: 0, color: 'original', location: {row: 0, col: 1}, moveAmount: {x: 0, y: 0}},
  //     {number: 4, color: 'original', location: {row: 0, col: 2}, moveAmount: {x: 0, y: 0}},
  //     {number: 0, color: 'original', location: {row: 0, col: 3}, moveAmount: {x: 0, y: 0}}
  //   ],
  //   [
  //     {number: 2, color: 'red', location: {row: 1, col: 0}, moveAmount: {x: 0, y: 0}},
  //     {number: 0, color: 'original', location: {row: 1, col: 1}, moveAmount: {x: 0, y: 0}},
  //     {number: 0, color: 'original', location: {row: 1, col: 2}, moveAmount: {x: 0, y: 0}},
  //     {number: 0, color: 'original', location: {row: 1, col: 3}, moveAmount: {x: 0, y: 0}}
  //   ],
  //   [
  //     {number: 2, color: 'red', location: {row: 2, col: 0}, moveAmount: {x: 0, y: 0}},
  //     {number: 4, color: 'original', location: {row: 2, col: 1}, moveAmount: {x: 0, y: 0}},
  //     {number: 0, color: 'original', location: {row: 2, col: 2}, moveAmount: {x: 0, y: 0}},
  //     {number: 0, color: 'original', location: {row: 2, col: 3}, moveAmount: {x: 0, y: 0}}
  //   ],
  //   [
  //     {number: 2, color: 'red', location: {row: 3, col: 0}, moveAmount: {x: 0, y: 0}},
  //     {number: 0, color: 'original', location: {row: 3, col: 1}, moveAmount: {x: 0, y: 0}},
  //     {number: 0, color: 'original', location: {row: 3, col: 2}, moveAmount: {x: 0, y: 0}},
  //     {number: 0, color: 'original', location: {row: 3, col: 3}, moveAmount: {x: 0, y: 0}}
  //   ]
  // ]
  boardState: TileInfo[][] = [];
  gameScore: number = 0;
  largestTile: number = 0;
  winThreshold: number = 2048;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.isGameOver()) return;
    switch (event.key) {
      case 'ArrowRight':
        this.moveRight(this.boardState);
        break;
      case 'ArrowLeft':
        this.moveLeft();
        break;
      case 'ArrowUp':
        this.moveUp();
        break;
      case 'ArrowDown':
        this.moveDown();
        break;
      default:
        console.error('=============>', event.key);
    }
  }

  ngOnInit(): void {
    this.createBoard();
    this.generateRandomStartingTiles();
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
      console.error('=============> game over or current move choice not possible');
    }
  }

  isAMovePossible(): boolean {
    // check for possible moves on x-axis
    for (let i = 0; i < 4; i++) {
      let row = this.boardState[i];
      for (let j = 3; j > 0; j--) {
        if (row[j].number !== 0 && row[j-1].number === row[j].number) {
          return true;
        }
      }
    }

    // check for possible moves on y-axis
    this.boardState = this.transposeBoard();
    for (let i = 0; i < 4; i++) {
      let col = this.boardState[i];
      for (let j = 3; j > 0; j--) {
        if (col[j].number !== 0 && col[j-1].number === col[j].number) {
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
      if (rowTiles[i].number !== 0 && rowTiles[i-1].number === rowTiles[i].number) {
        rowTiles[i].number = rowTiles[i-1].number * 2;
        this.gameScore += rowTiles[i-1].number * 2;
        rowTiles[i-1].number = 0;
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
  moveRight(boardState: TileInfo[][]) {
    const beforeBoard = [...boardState];
    for (let i = 0; i < 4; i++) {
      this.moveRowRight(i, boardState);
    }
    const afterBoard = this.boardState;
    this.doAfterEveryMove(beforeBoard, afterBoard);
  }

  moveLeft() {
    const reversedBoard: TileInfo[][] = this.reverseBoard();
    this.moveRight(reversedBoard);
    this.boardState = this.reverseBoard();
  }

  moveDown() {
    this.boardState = this.transposeBoard();
    this.moveRight(this.boardState);
    this.boardState = this.transposeBoard();
  }

  moveUp() {
    this.boardState = this.transposeBoard();
    this.moveLeft();
    this.boardState = this.transposeBoard();
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

  createNewCell(rowNum: number, cellNum: number, num: number = 0): TileInfo {
    return {
      number: num,
      color: 'original',
      location: {row: rowNum, col: cellNum},
      moveAmount: {x: 0, y: 0}
    };
  }

  // moveRight(cell: TileInfo, boardState: TileInfo[][]) {
  //   if (cell.number !== 0) {
  //     const rowIndex = cell.location.row;
  //     let colIndex = 3;
  //     let safety = 0;
  //     let rowTiles: TileInfo[] = [...boardState[rowIndex]];
  //     while (colIndex !== -1) {
  //       if (rowTiles[colIndex].number !== 0 && colIndex < 3 && safety < 100 && rowTiles[colIndex + 1].number === 0) {
  //         const temp: TileInfo = rowTiles[colIndex];
  //         rowTiles[colIndex + 1] = {...rowTiles[colIndex], moveAmount: {x: rowTiles[colIndex].moveAmount.x + 1, y: 0}};
  //         rowTiles[colIndex] = this.createNewCell(temp.location.row, temp.location.col);
  //         colIndex++;
  //         safety++;
  //       } else {
  //         colIndex--;
  //       }
  //     }
  //     this.boardState[rowIndex].forEach(cell => {
  //       if (cell.number !== 0) {
  //         const matchingCell: TileInfo | undefined = rowTiles.find(match => match.location === cell.location);
  //         if (matchingCell) cell.moveAmount = matchingCell.moveAmount;
  //       }
  //     });
  //     this.boardState = [...this.boardState];
  //     // this.boardState[rowIndex] = rowTiles;
  //     console.error('=============> rowTiles: ', rowTiles);
  //     console.error('=============> this.boardState[rowIndex]: ', this.boardState[rowIndex]);
  //     // setTimeout(() => {
  //     //   let rowWithoutMovementAndUpdatedLoc: TileInfo[] = [];
  //     //   this.boardState[rowIndex].forEach(cell => {
  //     //     let locationX = cell.location.row;
  //     //     if (cell.moveAmount.x !== 0) {
  //     //       locationX = locationX + cell.moveAmount.x;
  //     //     }
  //     //     rowWithoutMovementAndUpdatedLoc.push({...cell, moveAmount: {x: 0, y:0}});
  //     //   });
  //     //   this.boardState[rowIndex] = rowWithoutMovementAndUpdatedLoc;
  //     //   this.moveRightReal(cell, boardState);
  //     //   // console.error('=============> rowWithoutMovementAndUpdatedLoc: ', rowWithoutMovementAndUpdatedLoc);
  //     //
  //     // }, 100)
  //     // for (let rowCell of boardState[rowIndex]) {
  //     //   if (rowCell.number !== 0) {
  //     //     rowTiles.push(rowCell);
  //     //   }
  //     // }
  //     // for (let i = 4 - rowTiles.length; i > 0; i--) {
  //     //   rowTiles.unshift(this.createNewCell(rowIndex, i));
  //     // }
  //     // // [1 0 0 0] [0 0 0 1] len 1 len 4
  //     // // [1 0 2 0] [0 0 1 2] len 2 len 4
  //     // console.error('=============> rowTiles: ', rowTiles);
  //     // this.boardState[rowIndex] = rowTiles;
  //   }
  // }
}
