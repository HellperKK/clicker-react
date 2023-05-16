import { Component } from '@angular/core';
import { ACHIEVEMENTS } from './gameElements/achievements';
import { Observable } from 'rxjs';
import { Building } from './gameElements/buildings';
import { Store } from '@ngrx/store';
import { produce } from 'immer';
import { Achievement } from './gameElements/achievements';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  money$: Observable<number>;
  buildings$: Observable<Array<Building>>;

  money: number;
  buildings: Array<Building>;
  tabIndex = 0;

  achievements = ACHIEVEMENTS;
  alerted = false;

  constructor(
    private store: Store<{ money: number; buildings: Array<Building> }>
  ) {}

  ngOnInit() {
    this.money$ = this.store.select('money');
    this.buildings$ = this.store.select('buildings');

    this.money$.subscribe((money) => (this.money = money));
    this.buildings$.subscribe((buildings) => (this.buildings = buildings));
  }

  ngDoCheck() {
    const gameState = { money: this.money, buildings: this.buildings };

    this.achievements.forEach((achivement: Achievement, index: number) => {
      if (!achivement.isDiscovered && achivement.condition(gameState)) {
        this.achievements = produce(
          this.achievements,
          (draft: Array<Achievement>) => {
            draft[index].isDiscovered = true;
          }
        );
        this.alerted = true;
      }
    });
  }

  setTabIndex(num: number) {
    this.tabIndex = num;
  }
}
