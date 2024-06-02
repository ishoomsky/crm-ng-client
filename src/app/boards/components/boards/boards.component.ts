import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { BoardInterface } from "@app/boards/types/board.interface";
import { NgForOf } from "@angular/common";
import { InlineFormComponent } from "@app/shared/components/inline-form/inline-form.component";
import { TopbarComponent } from "@app/shared/components/topbar/topbar.component";
import { BoardsApiService } from "@app/boards/services/boards-api.service";

@Component({
  selector: 'app-boards',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgForOf,
    InlineFormComponent,
    TopbarComponent
  ],
  templateUrl: './boards.component.html',
  styleUrl: './boards.component.scss',
  providers: [BoardsApiService],
})
export class BoardsComponent implements OnInit {
  private boardsApiService = inject(BoardsApiService);

  public boards: BoardInterface[] = [];
  ngOnInit(): void {
    this.boardsApiService.getBoards().subscribe((boards) => {
      this.boards = boards;
    })
  }

  public createBoard(title: string): void {
    this.boardsApiService.createBoard(title)
      .subscribe((createdBoard) => {
        this.boards = [...this.boards, createdBoard];
      })
  }
}
