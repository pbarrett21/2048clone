import {Component, Input} from '@angular/core';
import {TileInfo} from '../../models/TileInfo';
import {LogicService} from '../../services/logic.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {

  @Input() boardState: TileInfo[][] = [];

  constructor(public logicService: LogicService) {
  }

}
