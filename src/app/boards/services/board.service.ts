import { inject, Injectable, signal } from '@angular/core';
import { BoardInterface } from "@app/boards/types/board.interface";
import { SocketService } from "@app/shared/services/socket.service";
import SocketEvents from "@app/shared/types/socket-events.enum";
import { ColumnInterface } from "@app/shared/types/column.interface";
import { TaskInterface } from "@app/shared/types/task.interface";

@Injectable()
export class BoardService {
  private socketService = inject(SocketService);
  public board = signal<BoardInterface | null>(null);
  public columns = signal<ColumnInterface[]>([]);
  public tasks = signal<TaskInterface[]>([]);

  public leaveBoard(boardId: string): void {
    this.board.set(null);
    this.socketService.emit(SocketEvents.BoardsLeave, {boardId});
  }

  public updateBoard(updatedBoard: BoardInterface): void {
    const board = this.board();
    if (board) {
      this.board.set({...board, title: updatedBoard.title});
    }
  }

  public setTasks(tasks: TaskInterface[]): void {
    this.tasks.set(tasks);
  }

  addColumn(column: ColumnInterface): void {
    const updatedColumns = [...this.columns(), column];
    this.columns.set(updatedColumns);
  }
  addTask(task: TaskInterface): void {
    const updatedTasks = [...this.tasks(), task];
    this.tasks.set(updatedTasks);
  }
}
