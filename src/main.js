import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
// import 'element-ui/lib/theme-default/index.css'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n) // 通过插件的形式挂载

Vue.config.productionTip = false;

Vue.use(ElementUI);

const i18n = new VueI18n({
  locale: 'en-US',    // 语言标识
  //this.$i18n.locale // 通过切换locale的值来实现语言切换
  messages: {
    'zh-CN': require('./common/lang/zh'),   // 中文语言包
    'en-US': require('./common/lang/en')    // 英文语言包
  }
})

new Vue({
	el: '#app',
  i18n,  // 不要忘记
	router,
	store,
	template: '<App/>',
	components: { App }
})
