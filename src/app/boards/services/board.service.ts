import { Injectable, signal } from '@angular/core';
import { BoardInterface } from "@app/boards/types/board.interface";

@Injectable()
export class BoardService {
  public board = signal<BoardInterface | null>(null);
}
