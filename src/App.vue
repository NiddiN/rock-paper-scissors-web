<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import Vue from 'vue';
import { container } from 'inversify-props';
import { RoomService } from './core/services';
import { RoomServiceS } from './core/services/room.service';
import Component from 'vue-class-component';

@Component
export default class App extends Vue {
  created() {
    this.registerServices();
  }

  private registerServices() {
    container.addSingleton<RoomService>(RoomService, RoomServiceS);
  }
}
</script>

<style lang="scss">
body {
  padding: 0;
  margin: 0;
}

#app {
  background: radial-gradient(#333335, #111114);
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  width: 100vw;
}

nav {
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
