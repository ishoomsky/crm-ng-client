import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { BoardService } from "@app/boards/services/board.service";
import { JsonPipe, NgForOf, NgIf } from "@angular/common";
import { SocketService } from "@app/shared/services/socket.service";
import SocketEvents from "@app/shared/types/socket-events.enum";
import { NavigationStart, Router, RouterOutlet } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { BoardsApiService } from "@app/boards/services/boards-api.service";
import { ColumnsApiService } from "@app/boards/services/columns-api.service";
import { TopbarComponent } from "@app/shared/components/topbar/topbar.component";
import { InlineFormComponent } from "@app/shared/components/inline-form/inline-form.component";
import { ColumnInputInterface } from "@app/shared/types/column-input.interface";
import { ColumnInterface } from "@app/shared/types/column.interface";
import { TaskInterface } from "@app/shared/types/task.interface";
import { TasksApiService } from "@app/boards/services/tasks-api.service";
import { TaskInputInterface } from "@app/shared/types/task-input.interface";
import { BoardInterface } from "@app/boards/types/board.interface";

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    JsonPipe,
    NgIf,
    TopbarComponent,
    NgForOf,
    InlineFormComponent,
    RouterOutlet
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
  providers: [BoardsApiService, ColumnsApiService, BoardService, TasksApiService]
})
export class BoardComponent implements OnInit {
  @Input() boardId!: string;

  private router = inject(Router);
  private socketService = inject(SocketService);
  private boardsApiService = inject(BoardsApiService);
  private columnsApiService = inject(ColumnsApiService);
  private tasksApiService = inject(TasksApiService);

  private destroyRef = inject(DestroyRef);
  public boardService = inject(BoardService);
  ngOnInit() {
    this.initializeListeners();
    this.socketService.emit(SocketEvents.BoardsJoin, {boardId: this.boardId});
    this.fetchData();
  }

  private initializeListeners(): void {
    this.router.events
      .subscribe((event) => {
        if (
          event instanceof NavigationStart &&
          !event.url.includes('/boards/')
          ) {
          this.boardService.leaveBoard(this.boardId);
        }
      });
    // Columns
    this.socketService
      .listen<ColumnInterface>(SocketEvents.ColumnsCreateSuccess)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((column) => {
        this.boardService.addColumn(column);
      });

    this.socketService
      .listen<ColumnInterface>(SocketEvents.ColumnsUpdateSuccess)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((column) => {
        this.boardService.updateColumn(column);
      });

    this.socketService
      .listen<string>(SocketEvents.ColumnsDeleteSuccess)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((columnId) => {
        this.boardService.deleteColumn(columnId);
      });
    // Tasks
    this.socketService
      .listen<TaskInterface>(SocketEvents.TasksCreateSuccess)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((task) => {
        this.boardService.addTask(task);
      });

    this.socketService
      .listen<TaskInterface>(SocketEvents.TasksUpdateSuccess)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((task) => {
        this.boardService.updateTask(task);
      });

    this.socketService
      .listen<string>(SocketEvents.TasksDeleteSuccess)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((taskId) => {
        this.boardService.deleteTask(taskId);
      });

    // Boards
    this.socketService
      .listen<BoardInterface>(SocketEvents.BoardsUpdateSuccess)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((board) => {
        this.boardService.updateBoard(board);
      });

    this.socketService
      .listen<void>(SocketEvents.BoardsDeleteSuccess)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.router.navigateByUrl('/boards');
      });
  }

  public fetchData() {
    if (!this.boardId) {
      throw new Error('Cannot get board id from the url');
    }

    this.boardsApiService.getBoard(this.boardId)
      .subscribe((board) => {
        this.boardService.board.set(board);
      });

    this.columnsApiService.getColumns(this.boardId)
      .subscribe((columns) => {
        this.boardService.columns.set(columns);
      })

    this.tasksApiService.getTasks(this.boardId)
      .subscribe((tasks) => {
        this.boardService.setTasks(tasks);
      })
  }

  public createColumn(title: string): void {
    const columnInput: ColumnInputInterface = {
      title,
      boardId: this.boardId,
    };
    this.columnsApiService.createColumn(columnInput);
  }

  public createTask(title: string, columnId: string): void {
    const taskInput: TaskInputInterface = {
      title,
      boardId: this.boardId,
      columnId,
    };
    this.tasksApiService.createTask(taskInput);
  }

  public getTasksByColumn(columnId: string, tasks: TaskInterface[]): TaskInterface[] {
    return tasks.filter((task) => task.columnId === columnId);
  }

  public updateBoardName(boardName: string): void {
    this.boardsApiService.updateBoard(this.boardId, {title: boardName});
  }
  public deleteBoard(): void {
    if (confirm(`The board [${this.boardService.board()?.title}] will be deleted. Are you sure?`)) {
      this.boardsApiService.deleteBoard(this.boardId);
    }
  }

  public updateColumn(title: string, columnId: string): void {
    this.columnsApiService.updateColumn(this.boardId, columnId, {title});
  }

  public deleteColumn(columnId: string): void {
    if (confirm(`The column will be deleted. Are you sure?`)) {
      this.columnsApiService.deleteColumn(this.boardId, columnId);
    }
  }
  public openTask(taskId: string): void {
    this.router.navigate(['boards', this.boardId, 'tasks', taskId]);
  }

}
