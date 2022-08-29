import axios from 'axios';
import { IRoom } from '../interfaces';

export const RoomServiceS = Symbol('RoomService');

export class RoomService {
  readonly url = 'http://localhost:3000/room';

  getRooms(): Promise<IRoom[]> {
    return axios.get<IRoom[]>(this.url).then((response) => response.data);
  }

  createRoom(name: string): Promise<void> {
    return axios.post(this.url, { name });
  }

  canJoinToTheRoom(uid: string): Promise<{ canJoin: boolean; error: any }> {
    return axios
      .get<{ canJoin: boolean; error: any }>(`${this.url}/canJoin`, { params: { uid } })
      .then((response) => response.data);
  }
}
