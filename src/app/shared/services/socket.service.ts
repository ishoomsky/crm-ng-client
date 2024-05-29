import { Injectable } from "@angular/core";
import { CurrentUserInterface } from "@app/auth/types/current-user.interface";
import { io, Socket } from "socket.io-client";
import { environment } from "@environments/environment";

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket | undefined;
  public setupSocketConnection(currentUser: CurrentUserInterface): void {
    this.socket = io(environment.socketApiUrl, {
      auth: {
        token: currentUser.token,
      },
    });
  }

  public disconnect(): void {
    if (!this.socket) {
      throw new Error('Socket connection is not established')
    }
    this.socket.disconnect();
  }

  public emit(eventName: string, message: any): void {
    if (!this.socket) {
      throw new Error('Socket connection is not established')
    }
    this.socket.emit(eventName, message);
  }
}
