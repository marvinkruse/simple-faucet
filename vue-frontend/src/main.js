// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Router from 'vue-router'
import Vuex from 'vuex'
import store from './store'
import i18n from './lang' // 语言包

import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en'
import localeCN from 'element-ui/lib/locale/lang/zh-CN'
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import './assets/css/main.css';

import 'element-ui/lib/theme-chalk/index.css';

Vue.use(Router);
Vue.use(ElementUI, { locale })
let langNew = store.getters.language == 'en'?{ locale }:{ localeCN }
Vue.use(ElementUI, langNew)
// Vue.use(ElementUI);
Vue.use(Vuex)

Vue.config.productionTip = false


import Web3 from 'web3'
import faucetABI from './abi/SwanFaucet.json'
import tokenABI from './abi/ERC20.json'
const contractWeb3 = new Web3(process.env.BASE_NETWORK)
contractWeb3.setProvider(process.env.BASE_NETWORK);
Vue.prototype.$web3 = contractWeb3;
var token_address = '0xe11A86849d99F524cAC3E7A0Ec1241828e332C62'
var faucet_address = '0x099e67a3f29B16C6FFCC621f3c7Ddf64eAfBf632'
Vue.prototype.$faucetContract = new contractWeb3.eth.Contract(faucetABI, faucet_address)
Vue.prototype.$tokenContract = new contractWeb3.eth.Contract(tokenABI, token_address)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router,
  store,
  i18n,
  data: function(){
      return {
        token_address: '0xe11A86849d99F524cAC3E7A0Ec1241828e332C62',
        faucet_address: '0x099e67a3f29B16C6FFCC621f3c7Ddf64eAfBf632'
      }
  }
})
