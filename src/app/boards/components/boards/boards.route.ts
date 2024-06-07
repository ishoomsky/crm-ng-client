import { Routes } from "@angular/router";
import { BoardsComponent } from "@app/boards/components/boards/boards.component";
import { TaskModalComponent } from "@app/boards/components/task-modal/task-modal.component";

export const boardsRoute: Routes = [
  {
    path: '',
    component: BoardsComponent,
  },
];
