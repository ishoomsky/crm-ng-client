import { Component, inject, OnInit } from '@angular/core';
import { BoardsService } from "@app/boards/services/boards.service";

@Component({
  selector: 'app-boards',
  standalone: true,
  imports: [],
  templateUrl: './boards.component.html',
  styleUrl: './boards.component.scss',
  providers: [BoardsService],
})
export class BoardsComponent implements OnInit {
  private boardsService = inject(BoardsService);

  ngOnInit(): void {
    this.boardsService.getBoards().subscribe((boards) => {
      console.log(boards)
    })
  }
}
