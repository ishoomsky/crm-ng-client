import { Component, inject, OnInit } from '@angular/core';
import { BoardsService } from "@app/boards/services/boards.service";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { BoardInterface } from "@app/boards/types/board.interface";
import { NgForOf } from "@angular/common";
import { InlineFormComponent } from "@app/shared/components/inline-form/inline-form.component";

@Component({
  selector: 'app-boards',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgForOf,
    InlineFormComponent
  ],
  templateUrl: './boards.component.html',
  styleUrl: './boards.component.scss',
  providers: [BoardsService],
})
export class BoardsComponent implements OnInit {
  private boardsService = inject(BoardsService);

  public boards: BoardInterface[] = [];
  ngOnInit(): void {
    this.boardsService.getBoards().subscribe((boards) => {
      this.boards = boards;
    })
  }

  public createBoard(title: string): void {
    this.boardsService.createBoard(title)
      .subscribe((createdBoard) => {
        this.boards = [...this.boards, createdBoard];
      })
  }
}
