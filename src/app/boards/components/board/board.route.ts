import { Routes } from "@angular/router";
import { BoardComponent } from "@app/boards/components/board/board.component";

export const boardRoute: Routes = [
  {
    path: '',
    component: BoardComponent,
  },
];
