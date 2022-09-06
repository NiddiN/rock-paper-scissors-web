<template>
  <div class="room">
    <div class="score">
      <div class="score__user">{{ players[0]?.name || 'Empty' }}</div>
      <div class="score_points">0</div>
      -
      <div class="score_points">0</div>
      <div class="score__user">{{ players[1]?.name || 'Empty' }}</div>
    </div>
    <div class="game">
      <transition v-for="element in elements" :key="element" name="slide-fade">
        <div
          v-if="players?.length === 2"
          class="element"
          :class="getElementStyles(element)"
          @click="onElementSelected(element)"
        >
          <template v-if="element === 'scissors'">
            <ScissorsComponent class="scissors-component" :selected="selectedElement === 'scissors'" />
          </template>
          <template v-if="element === 'rock'">
            <RockComponent :selected="selectedElement === 'rock'" />
          </template>
          <template v-if="element === 'paper'">
            <PaperComponent :selected="selectedElement === 'paper'" />
          </template>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { io, Socket } from 'socket.io-client';

import ScissorsComponent from '../components/ScissorsComponent/ScissorsComponent.vue';
import RockComponent from '../components/RockComponent/RockComponent.vue';
import PaperComponent from '../components/PaperComponent/PaperComponent.vue';

import { RoomService } from '@/core/services';

interface IUser {
  id: number;
  name: string;
}

@Component({
  components: {
    ScissorsComponent,
    RockComponent,
    PaperComponent
  },
})
export default class RoomView extends Vue {
  elements: string[] = ['rock', 'paper', 'scissors'];
  selectedElement = '';
  socket: Socket = io('http://localhost:3000');
  id = Math.round(Math.random() * 100);
  user: IUser = {
    id: this.id,
    name: `User ${this.id}`,
  };
  players: IUser[] = [];
  roomId = this.$route.params.id;

  roomService = new RoomService();

  created() {
    setTimeout(() => this.players.push({ name: 'Kek', id: 1 }, { name: 'Lol', id: 2 }), 2000);
    this.socket.on('gamePlayers', (data) => {
      this.players = data.players;
    });
    this.socket.on('gameResult', (data) => {
      console.log(data);
    });
    // this.socket.emit('userJoinedTheRoom', { user: this.user, roomId: this.roomId })
  }

  destroyed() {
    // this.socket.emit('userLeftTheRoom', { user: this.user, roomId: this.roomId });
    this.socket.removeAllListeners();
  }

  getElementStyles(element: string): { [key: string]: boolean } {
    return { [`element__${element}`]: true, element_selected: this.selectedElement === element };
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
  height: 150px;
  justify-content: center;
  position: absolute;
  transition: all 0.3s;
  transform-origin: center;
  width: 150px;

  &__rock {
    border-color: #ff6fd4;
    transform: rotate($rotate * 1deg) translate(0, 150px) rotate($rotate * -1deg);

    &.element_selected {
      filter: drop-shadow(0px 0px 5px #ff6fd4);
    }
  }

  &__paper {
    border-color: #45c4ff;
    transform: rotate($rotate * 2 * 1deg) translate(0, 150px) rotate($rotate * 2 * -1deg);

    &.element_selected {
      filter: drop-shadow(0px 0px 5px #45c4ff);
    }
  }

  &__scissors {
    border-color: #fff648;
    transform: rotate($rotate * 3 * 1deg) translate(0, 150px) rotate($rotate * 3 * -1deg);

    &.element_selected {
      filter: drop-shadow(0px 0px 5px #fff648);
    }
  }
}

.scissors-component {
    transform: scale(0.8);
  }

.slide-fade-enter-active {
  transition: transform 0.5s ease;

  &:nth-child(2) {
    transition-delay: 0.05s;
  }

  &:nth-child(3) {
    transition-delay: 0.1s;
  }
}

.slide-fade-enter {
  transform: translate(0px, 0px);
  opacity: 0;
}
</style>
