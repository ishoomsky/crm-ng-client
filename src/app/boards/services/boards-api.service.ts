import { inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { BoardInterface } from "@app/boards/types/board.interface";
import { environment } from "@environments/environment.development";
import { SocketService } from "@app/shared/services/socket.service";
import SocketEvents from "@app/shared/types/socket-events.enum";

@Injectable()
export class BoardsApiService {
  private httpClient = inject(HttpClient);
  private socketService = inject(SocketService);

  public getBoards(): Observable<BoardInterface[]> {
    const url = environment.apiUrl + '/boards';
    return this.httpClient.get<BoardInterface[]>(url);
  }

  public createBoard(title: string): Observable<BoardInterface> {
    const url = environment.apiUrl + '/boards';

    return this.httpClient.post<BoardInterface>(url, {title});
  }

  public getBoard(boardId: string): Observable<BoardInterface> {
    const url = `${environment.apiUrl}/boards/${boardId}`;

    return this.httpClient.get<BoardInterface>(url);
  }
  public updateBoard(boardId: string, fields: {title: string}): void {
    this.socketService.emit(SocketEvents.BoardsUpdate, {boardId, fields});
  }

  public deleteBoard(boardId: string): void {
    this.socketService.emit(SocketEvents.BoardsDelete, {boardId});
  }
}
