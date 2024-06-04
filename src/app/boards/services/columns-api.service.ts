import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "@environments/environment.development";
import { ColumnInterface } from "@app/shared/types/column.interface";
import { ColumnInputInterface } from "@app/shared/types/column-input.interface";
import { SocketService } from "@app/shared/services/socket.service";
import SocketEvents from "@app/shared/types/socket-events.enum";

@Injectable()
export class ColumnsApiService {
  private httpClient = inject(HttpClient);
  private socketService = inject(SocketService)

  public getColumns(boardId: string): Observable<ColumnInterface[]> {
    const url = `${environment.apiUrl}/boards/${boardId}/columns`;
    return this.httpClient.get<ColumnInterface[]>(url);
  }

  public createColumn(columnInput: ColumnInputInterface): void {
    this.socketService.emit(SocketEvents.ColumnsCreate, columnInput);
  }

  public updateColumn(boardId: string, columnId: string, fields: {title: string}): void {
    this.socketService.emit(SocketEvents.ColumnsUpdate, {boardId, columnId, fields});
  }

  public deleteColumn(boardId: string, columnId: string): void {
    this.socketService.emit(SocketEvents.ColumnsDelete, {boardId, columnId});
  }
}
