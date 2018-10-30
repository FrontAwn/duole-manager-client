import Vue from 'vue'
import App from '@/views/App'
import i18n from "./i18n.js"
import router from './router.js'
import store from './store.js'
import flexible from 'lib-flexible'
import {init as utilsInit} from 'utils'
import Emitter from '@/utils/Emitter'
import '@/assets/css/share.css'
import Http from "@/utils/Http"
import { sync } from 'vuex-router-sync'
sync(store,router);

Vue.config.productionTip = false

utilsInit();

new Vue({
  el: '#app',
  i18n,
  router,
  store,
  components: { App },
  template: '<App/>'
})
