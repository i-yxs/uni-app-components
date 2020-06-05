const state = {
    $keys: [],
}

const getters = {
    keys(state) {
        return state.$keys;
    }
}

const mutations = {
    setStorageKeys(state, payload) {
        if (state.$keys.indexOf(payload) === -1) {
            state.$keys.push(payload);
            uni.setStorageSync('$keys', state.$keys);
        }
    },
    setStorage(state, payload) {
        state[payload.key] = payload.data;
        uni.setStorageSync(payload.key, payload.data);
    },
    removeStorage(state, payload) {
        let index = state.$keys.indexOf(payload);
        if (index > -1) {
            state.$keys.splice(index, 1);
            uni.setStorageSync('$keys', state.$keys);
        }
        delete state[payload];
        uni.removeStorageSync(payload);
    },
}

const actions = {
    getStorageInfo({ commit }) {
        //因为uniapp app端无法获取到key列表，所以使用一个固定key来储存keys
        return new Promise((resolve, reject) => {
            var keys = uni.getStorageSync('$keys');
            if (keys) {
                keys.forEach(key => {
                    commit('setStorageKeys', key);
                })
            }
        });
    },
    getStorage({ dispatch, commit, state }) {
        return new Promise((resolve, reject) => {
            dispatch('getStorageInfo')
            state.$keys.forEach(key => {
                commit('setStorage', {
                    key: key,
                    data: uni.getStorageSync(key)
                });
            });
            resolve()
        });
    },
    setStorage({ dispatch, commit, state }, payload) {
        return new Promise((resolve, reject) => {
            Object.keys(payload).forEach(key => {
                commit('setStorageKeys', key);
                commit('setStorage', {
                    key: key,
                    data: payload[key]
                });
            });
            resolve();
        });
    },
    clearStorage({ dispatch, commit, state }) {
        return new Promise((resolve, reject) => {
            Object.assign([], state.$keys).forEach(key => {
                commit('removeStorage', key);
            });
            resolve();
        });
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}