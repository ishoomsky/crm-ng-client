import { inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { BoardInterface } from "@app/boards/types/board.interface";
import { environment } from "@environments/environment.development";

@Injectable()
export class BoardsService {
  private httpClient = inject(HttpClient);

  public getBoards(): Observable<BoardInterface[]> {
    const url = environment.apiUrl + '/boards';
    return this.httpClient.get<BoardInterface[]>(url);
  }

}
