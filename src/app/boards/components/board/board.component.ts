import { Component, DestroyRef, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { BoardsService } from "@app/boards/services/boards.service";
import { BoardService } from "@app/boards/services/board.service";
import { JsonPipe, NgIf } from "@angular/common";
import { SocketService } from "@app/shared/services/socket.service";
import SocketEvents from "@app/shared/types/socket-events.enum";
import { NavigationStart, Router } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    JsonPipe,
    NgIf
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
  providers: [BoardsService, BoardService]
})
export class BoardComponent implements OnInit {
  @Input() boardId!: string;

  private boardsService = inject(BoardsService);
  private socketService = inject(SocketService);
  private router = inject(Router);
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
  }

  public fetchData() {
    if (!this.boardId) {
      throw new Error('Cannot get board id from the url');
    }

    this.boardsService.getBoard(this.boardId)
      .subscribe((board) => {
        this.boardService.board.set(board);
      });
  }
}
