import { inject, Injectable, signal } from '@angular/core';
import { BoardInterface } from "@app/boards/types/board.interface";
import { SocketService } from "@app/shared/services/socket.service";
import SocketEvents from "@app/shared/types/socket-events.enum";

@Injectable()
export class BoardService {
  private socketService = inject(SocketService);
  public board = signal<BoardInterface | null>(null);

  public leaveBoard(boardId: string): void {
    this.board.set(null);
    this.socketService.emit(SocketEvents.BoardsLeave, {boardId});
  }
}
