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
  @HostListener('touchstart', ['$event'])
  @HostListener('touchend', ['$event'])
  handleKeyboardOrSwipeEvent(event: any) {
    if (this.logicService.isGameOver()) return;
    console.error('=============> event: ', event.type);
    if (event.type === 'keydown') {
      this.handleKeyBoardEvent(event);
    }
    if (event.type === 'touchstart' || event.type === 'touchend') {
      this.handleSwipeEvent(event);
    }
  }

  constructor(public logicService: LogicService) {
  }

  ngOnInit() {
    this.gameState = this.logicService.startNewGame();
  }

  handleKeyBoardEvent(event: KeyboardEvent) {
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
    }
  }

  handleSwipeEvent(event: TouchEvent) {
    console.error('=============> event: ', event);
    // switch (event.key) {
    //   case 'ArrowRight':
    //     this.gameState = this.logicService.moveRight(this.logicService.boardState);
    //     break;
    //   case 'ArrowLeft':
    //     this.gameState = this.logicService.moveLeft();
    //     break;
    //   case 'ArrowUp':
    //     this.gameState = this.logicService.moveUp();
    //     break;
    //   case 'ArrowDown':
    //     this.gameState = this.logicService.moveDown();
    //     break;
    // }
  }

}
