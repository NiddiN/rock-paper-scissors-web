import RoomsView from '@/views/RoomsView.vue';
import RoomView from '@/views/RoomView.vue';
import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/room/:id',
    name: 'room',
    component: RoomView,
  },
  {
    path: '/rooms',
    name: 'rooms',
    component: RoomsView,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
