export interface TileInfo {
  number: number;
  color: string;
  location: {row: number, col: number};
  moveAmount: {x: number, y: number};
}
