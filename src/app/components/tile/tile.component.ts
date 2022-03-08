import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

export interface TileInfo {
  number: number;
  color: string;
  location: {row: number, col: number};
  moveAmount: {x: number, y: number};
}

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent implements OnChanges {

  @Input() tileInfo: TileInfo = {} as TileInfo;
  @Output() animationFinished = new EventEmitter();

  constructor() { }

  determineStyle(tileInfo: TileInfo) {
    if (tileInfo.number !== 0) return 'tile-' + tileInfo.number;
    return 'original'
  }

  animateTile(tileInfo: TileInfo): string {
    return `transform: translate(${tileInfo.moveAmount.x * 105}px, 0px)`;
  }

  ngOnChanges(changes: SimpleChanges): void {
  }
}
