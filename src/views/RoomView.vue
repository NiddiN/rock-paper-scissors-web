<template>
  <div class="room">
    <div class="score">
      <div class="score__user">{{ players[0]?.name || 'Empty'}}</div>
      <div class="score_points">0</div>
      -
      <div class="score_points">0</div>
      <div class="score__user">{{ players[1]?.name || 'Empty'}}</div>
    </div>
    <div class="game">
      <div
        class="element"
        :class="getElementStyles(element)"
        :key="element"
        @click="onElementSelected(element)"
        v-for="element in elements"
      >
        {{ element }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { io, Socket } from 'socket.io-client';

import { RoomService } from '@/core/services';

interface IUser {
  id: number;
  name: string;
}

@Component
export default class RoomView extends Vue {
  elements: string[] = ['rock', 'paper', 'scissors'];
  selectedElement = '';
  socket: Socket = io('http://localhost:3000');
  id = Math.round(Math.random() * 100)
  user: IUser = {
    id: this.id,
    name: `User ${this.id}`
  }
  players: IUser[] = [];

  roomService = new RoomService();

  created() {
    this.socket.on('gamePlayers', (data) => {
      this.players = data.players;
    })
    this.socket.on('gameResult', (data) => {
      console.log(data);
    })
    this.socket.emit('userConnectedToTheRoom', { user: this.user, roomId: this.$route.params.id })
  }

  getElementStyles(element: string): { [key: string]: boolean } {
    return { [`element_${element}`]: true, element_selected: this.selectedElement === element };
  }

  onElementSelected(element: string) {
    if (this.selectedElement === element) {
      return;
    }

    this.selectedElement = element;

    this.socket.emit('elementChose', { userId: this.user.id, roomId: this.$route.params.id, element });
  }
}
</script>

<style lang="scss">
.room {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  width: 100%;
}

.score {
  display: flex;
  font-size: 2em;
  gap: 10px;
  justify-content: center;
  padding: 40px;

  &__user {
    text-decoration: underline;
  }
}

.game {
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
  position: relative;
}

.element {
  $circleRadius: 360;
  $itemsAmount: 3;
  $rotate: $circleRadius / $itemsAmount;

  align-items: center;
  border: 1px solid;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  height: 100px;
  justify-content: center;
  position: absolute;
  transform-origin: center;
  width: 100px;

  &_rock {
    transform: rotate($rotate * 1deg) translate(0, 150px) rotate($rotate * -1deg);
  }

  &_paper {
    transform: rotate($rotate * 2 * 1deg) translate(0, 150px) rotate($rotate * 2 * -1deg);
  }

  &_scissors {
    transform: rotate($rotate * 3 * 1deg) translate(0, 150px) rotate($rotate * 3 * -1deg);
  }

  &_selected {
    box-shadow: 0 0 20px 1px #000;
  }
}
</style>
