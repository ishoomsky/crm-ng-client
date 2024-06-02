import { Component, DestroyRef, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { BoardService } from "@app/boards/services/board.service";
import { JsonPipe, NgForOf, NgIf } from "@angular/common";
import { SocketService } from "@app/shared/services/socket.service";
import SocketEvents from "@app/shared/types/socket-events.enum";
import { NavigationStart, Router } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { BoardsApiService } from "@app/boards/services/boards-api.service";
import { ColumnsApiService } from "@app/boards/services/columns-api.service";
import { TopbarComponent } from "@app/shared/components/topbar/topbar.component";
import { InlineFormComponent } from "@app/shared/components/inline-form/inline-form.component";
import { ColumnInputInterface } from "@app/shared/types/column-input.interface";
import { ColumnInterface } from "@app/shared/types/column.interface";

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    JsonPipe,
    NgIf,
    TopbarComponent,
    NgForOf,
    InlineFormComponent
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
  providers: [BoardsApiService, ColumnsApiService, BoardService]
})
export class BoardComponent implements OnInit {
  @Input() boardId!: string;

  private router = inject(Router);
  private socketService = inject(SocketService);
  private boardsApiService = inject(BoardsApiService);
  private columnsApiService = inject(ColumnsApiService);

  private destroyRef = inject(DestroyRef);
  public boardService = inject(BoardService);
  ngOnInit() {
    this.initializeListeners();
    this.socketService.emit(SocketEvents.BoardsJoin, {boardId: this.boardId});
    this.fetchData();
  }

  private initializeListeners(): void {
    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.boardService.leaveBoard(this.boardId);
      }
    })

    this.socketService
      .listen<ColumnInterface>(SocketEvents.ColumnsCreateSuccess)
      .subscribe((column) => {
        this.boardService.addColumn(column);
      })
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
  }

  test() {
    this.socketService.emit('columns:create', {boardId: this.boardId, title: 'FOO'})
  }

  public createColumn(title: string): void {
    const columnInput: ColumnInputInterface = {
      title,
      boardId: this.boardId,
    };
    this.columnsApiService.createColumn(columnInput);
  }
}
