import {Component, HostListener, OnInit} from '@angular/core';
import {LogicService} from './services/logic.service';
import {GameData} from './models/GameData';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  gameState: GameData | undefined;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.logicService.isGameOver()) return;
    switch (event.key) {
      case 'ArrowRight':
        this.gameState = this.logicService.moveRight(this.logicService.boardState);
        break;
      case 'ArrowLeft':
        this.gameState = this.logicService.moveLeft();
        break;
      case 'ArrowUp':
        this.gameState = this.logicService.moveUp();
        break;
      case 'ArrowDown':
        this.gameState = this.logicService.moveDown();
        break;
      default:
        console.error('=============>', event.key);
    }
  }

  constructor(public logicService: LogicService) {
  }

  ngOnInit() {
    this.gameState = this.logicService.startNewGame();
  }

}
