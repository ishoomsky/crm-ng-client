import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "@environments/environment.development";
import { SocketService } from "@app/shared/services/socket.service";
import { TaskInterface } from "@app/shared/types/task.interface";
import { ColumnInputInterface } from "@app/shared/types/column-input.interface";
import SocketEvents from "@app/shared/types/socket-events.enum";
import { TaskInputInterface } from "@app/shared/types/task-input.interface";

@Injectable()
export class TasksApiService {
  private httpClient = inject(HttpClient);
  private socketService = inject(SocketService)

  public getTasks(boardId: string): Observable<TaskInterface[]> {
    const url = `${environment.apiUrl}/boards/${boardId}/tasks`;
    return this.httpClient.get<TaskInterface[]>(url);
  }

  public createTask(taskInput: TaskInputInterface): void {
    this.socketService.emit(SocketEvents.TasksCreate, taskInput);
  }
}
