import {AppComponent} from './app.component';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {LogicService} from './services/logic.service';

describe('AppComponent', () => {
  let spectator: Spectator<AppComponent>;

  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [],
    providers: [{provide: LogicService, useValue: {startNewGame: () => {}}}],
    shallow: true
  });

  beforeEach(async () => {
    spectator = createComponent();
    spectator.detectChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('arrowKey input should call handleKeyBoardEvent', () => {
    const handleKeyBoardEventSpy = spyOn(spectator.component, 'handleKeyboardEvent');
    dispatchEvent(new Event('keydown'));
    expect(handleKeyBoardEventSpy).toHaveBeenCalled();
  });

  describe('handleKeyBoardEvent should call the correct method in logicService', () => {
    it('ArrowRight should call logicService.moveRight', () => {

    });
  });

});
