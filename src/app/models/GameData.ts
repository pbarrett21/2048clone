import {TileInfo} from './TileInfo';

export interface GameData {
  boardState: TileInfo[][];
  largestTile: number;
  gameScore: number;
  bestScore: number;
  winThreshold: number;
  isGameOver: boolean;
}
