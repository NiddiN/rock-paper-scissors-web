<template>
  <div class="roomsPage">
    <div>
      <input type="text" v-model="roomName" />
      <button @click="createRoom" :disabled="creating">Create</button>
    </div>
    <div class="table">
      <div class="table__row" v-for="room in rooms" :key="room.uid">
        <div style="flex: 3">{{ room.name }}</div>
        <div style="flex: 1">{{ room.playersAmount }}/{{ room.maxPlayers }}</div>
        <div style="flex: 1">
          <button :disabled="room.maxPlayers === room.playersAmount" @click="joinToTheRoom(room.uid)">Join</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Inject } from 'inversify-props';

import { RoomService } from '@/core/services';
import { IRoom } from '@/core/interfaces';
import { RoomServiceS } from '@/core/services/room.service';

@Component
export default class RoomsView extends Vue {
  @Inject(RoomServiceS) roomService!: RoomService;

  roomName = '';
  rooms: IRoom[] = [];
  creating = false;
  loading = false;

  async created() {
    await this.fetchRooms();
  }

  async createRoom() {
    if (!this.roomName) {
      return;
    }

    this.creating = true;
    await this.roomService.createRoom(this.roomName);
    await this.fetchRooms();
    this.creating = false;
  }

  async fetchRooms() {
    this.loading = true;
    this.rooms = await this.roomService.getRooms();
    this.loading = false;
  }

  async joinToTheRoom(uid: string) {
    const { canJoin } = await this.roomService.canJoinToTheRoom(uid);
    
    if (!canJoin) {
      return;
    }

    this.$router.push(`/room/${uid}`);
  }
}
</script>

<style lang="scss">
.roomsPage {
}

.table {
  width: 100%;

  &__row {
    display: flex;
    width: 100%;
  }
}
</style>
