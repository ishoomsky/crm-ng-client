import { Routes } from "@angular/router";
import { BoardComponent } from "@app/boards/components/board/board.component";
import { TaskModalComponent } from "@app/boards/components/task-modal/task-modal.component";

export const boardRoute: Routes = [
  {
    path: '',
    component: BoardComponent,
    children: [
      {
        path: 'tasks/:taskId',
        component: TaskModalComponent,
      },
    ]
  },
];
