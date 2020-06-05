import Vue from 'vue'
import App from './App'
import store from './store'
import utils from './common'
import globalData from './common/globalData'

Vue.config.productionTip = false

App.mpType = 'app'

Vue.prototype = Object.assign(Vue.prototype, {
    $store: store,
    $utils: utils,
    $globalData: globalData,
})

const app = new Vue({
    ...App
})
app.$mount()
