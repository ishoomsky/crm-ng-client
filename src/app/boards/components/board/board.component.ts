import { Component, inject, Input, OnInit } from '@angular/core';
import { BoardsService } from "@app/boards/services/boards.service";
import { BoardService } from "@app/boards/services/board.service";
import { JsonPipe, NgIf } from "@angular/common";

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
export class BoardComponent implements OnInit{
  @Input() boardId!: string;

  private boardsService = inject(BoardsService);
  public boardService = inject(BoardService);
  ngOnInit() {
    if (!this.boardId) {
      throw new Error('Cannot get board id from the url');
    }
    this.fetchData();
  }

  public fetchData() {

    this.boardsService.getBoard(this.boardId)
      .subscribe((board) => {
        this.boardService.board.set(board);
      });
  }
}
