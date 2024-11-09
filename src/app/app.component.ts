import { Component } from '@angular/core';
import { ChessboardComponent } from './chessboard/chessboard.component'; // Импортируйте ваш компонент

@Component({
  selector: 'app-root',
  template: `
    <h1>Игра "Атомный конь"</h1>
    <p>Цель игры — заполнить всю доску числами, следуя правилам хода коня.</p>
    <p>Выберите клетку для следующего хода.</p>
    <app-chessboard></app-chessboard>
    <p>by m3kskssssssss</p>
  `,
  styles: [`
    h1 {
      text-align: center;
    }
    p {
      text-align: center;
    }
  `],
  standalone: true, // Укажите, что это standalone компонент
  imports: [ChessboardComponent] // Импортируйте ChessboardComponent
})
export class AppComponent {
  title = 'atomic-knight';
}
