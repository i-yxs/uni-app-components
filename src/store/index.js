import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import system from './modules/system'
import storage from './modules/storage'
import location from './modules/location'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        user: {
            namespaced: true,
            ...user
        },
        system: {
            namespaced: true,
            ...system
        },
        storage: {
			namespaced: true,
            ...storage
        },
        location: {
            namespaced: true,
            ...location
        },
	}
})

export default store