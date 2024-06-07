import { Component, DestroyRef, effect, HostBinding, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { BoardService } from "@app/boards/services/board.service";
import { TaskInterface } from "@app/shared/types/task.interface";
import { InlineFormComponent } from "@app/shared/components/inline-form/inline-form.component";
import { NgIf } from "@angular/common";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { ColumnInterface } from "@app/shared/types/column.interface";
import { TasksApiService } from "@app/boards/services/tasks-api.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import SocketEvents from "@app/shared/types/socket-events.enum";
import { SocketService } from "@app/shared/services/socket.service";

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [
    InlineFormComponent,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.scss'
})
export class TaskModalComponent {
  @HostBinding('class') classes = 'task-modal';

  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private boardService = inject(BoardService);
  private formBuilder = inject(FormBuilder);
  private taskApiService = inject(TasksApiService);
  private socketService = inject(SocketService);
  private destroyRef = inject(DestroyRef);

  private boardId: string | null | undefined;
  private taskId: string | null | undefined;

  public columnForm = this.formBuilder.group<{columnId: string | undefined}>({
    columnId: undefined,
  })

  public task?: TaskInterface;
  public columns: ColumnInterface[] = [];
  constructor() {
    this.boardId = this.activatedRoute.parent?.snapshot.paramMap.get('boardId');
    this.taskId = this.activatedRoute.snapshot.paramMap.get('taskId');

    effect(() => {
      this.task = this.boardService.tasks().find((task) => task.id === this.taskId);
      this.initializeColumnFormValues();
    });

    effect(() => {
      this.columns = this.boardService.columns();
    });

    this.updateOnColumnIdChanges();
    this.deleteTaskOnSocketEvent();
  }

  public goToBoards(): void {
    this.router.navigate(['boards', this.boardId]);
  }

  public updateTaskName(updatedTaskName: string): void {
    if (this.boardId && this.taskId) {
      this.taskApiService.updateTask(this.boardId, this.taskId, {
        title: updatedTaskName,
      });
    }
  }

  public updateTaskDescription(updatedTaskDescription: string): void {
    if (this.boardId && this.taskId) {
      this.taskApiService.updateTask(this.boardId, this.taskId, {
        description: updatedTaskDescription,
      });
    }
  }

  public deleteTask(): void {
    if (this.boardId && this.taskId) {
      this.taskApiService.deleteTask(this.boardId, this.taskId);
    }
  }

  private initializeColumnFormValues(): void {
    if (this.task?.columnId) {
      this.columnForm.patchValue({
        columnId: this.task.columnId,
      });
    }
  }

  private updateOnColumnIdChanges(): void {
    this.columnForm.get('columnId')?.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((columnId) => {
        if (this.boardId && this.taskId && columnId && (this.task?.columnId !== columnId)) {
          this.taskApiService.updateTask(this.boardId, this.taskId, {
            columnId: columnId,
          })
        }
      });
  }

  private deleteTaskOnSocketEvent(): void {
    this.socketService
      .listen<string>(SocketEvents.TasksDeleteSuccess)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((taskId) => {
        this.goToBoards();
      });
  }
}
