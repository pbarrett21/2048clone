import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TileInfo} from '../../models/TileInfo';
import {LogicService} from '../../services/logic.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {

  @Input() boardState: TileInfo[][] = [];
  @Output() tryAgain: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public logicService: LogicService) {
  }

  startNewGame() {
    this.tryAgain.emit(true);
  }

}
