import {Component, Input} from '@angular/core';
import {GameData} from '../../models/GameData';
import {LogicService} from '../../services/logic.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {

  @Input() gameState: GameData = {} as GameData;

  constructor(private logicService: LogicService) {
  }

  startNewGame() {
    this.gameState = this.logicService.startNewGame();
  }

  isTouchEnabled = () => ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
}
