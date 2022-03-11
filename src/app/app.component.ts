import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {LogicService} from './services/logic.service';
import {GameData} from './models/GameData';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  gameState: GameData | undefined;
  defaultTouch = {x: 0, y: 0, time: 0};

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.logicService.isGameOver()) return;
    this.handleKeyBoardEvent(event);
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
    let touch = event.touches[0] || event.changedTouches[0];

    if (event.type === 'touchstart') {
      this.defaultTouch = {
        x: touch.pageX,
        y: touch.pageY,
        time: event.timeStamp
      };
    } else if (event.type === 'touchend') {
      let deltaX = touch.pageX - this.defaultTouch.x;
      let deltaY = touch.pageY - this.defaultTouch.y;
      let deltaTime = event.timeStamp - this.defaultTouch.time;

      if (deltaTime < 500) {
        // touch movement lasted less than 500 ms
        if (Math.abs(deltaX) > 60) {
          // delta x is at least 60 pixels
          if (deltaX > 0) {
            this.gameState = this.logicService.moveRight(this.logicService.boardState);
          } else {
            this.gameState = this.logicService.moveLeft();
          }
        }

        if (Math.abs(deltaY) > 60) {
          // delta y is at least 60 pixels
          if (deltaY > 0) {
            this.gameState = this.logicService.moveDown();
          } else {
            this.gameState = this.logicService.moveUp();
          }
        }
      }
    }
  }

}
