import { Routes } from "@angular/router";
import { BoardsComponent } from "@app/boards/components/boards/boards.component";

export const boardsRoute: Routes = [
  {
    path: '',
    component: BoardsComponent,
  },
];
