import utils from '@/common'

const QQMapWX = require('@/common/utils/qqmap-wx-jssdk.min.js');

const state = {
    //纬度
    latitude: 22.656493,
    //经度
    longitude: 114.072016,
    //速度，单位m/s
    speed: 0,
    //位置的精确度
    accuracy: 0,
    //高度，单位 m
    altitude: 0,
    //垂直精度，单位 m（Android 无法获取，返回 0）
    verticalAccuracy: 0,
    //水平精度，单位 m
    horizontalAccuracy: 0,
    //省份
    province: '广东省',
    //城市
    city: '深圳市',
    //区域
    district: '龙岗区',
}

const getters = {
    location(state) {
        return state;
    }
}

const mutations = {
    //设置位置信息
    setLocation(state, payload) {
        if (payload) {
            Object.keys(payload).forEach(key => {
                if (key in state) {
                    state[key] = payload[key];
                }
            })
        }
    },
}

const actions = {
    //设置位置信息
    setLocation({ dispatch, commit, state }, payload) {
        commit('setLocation', payload);
        dispatch('storage/setStorage', {
            'location': state
        }, { root: true });
    },
    //获取地址信息
    getLocation({ dispatch, commit, state, rootState }) {
        return new Promise((resolve, reject) => {
            let data = {};
            uni.getLocation({
                type: 'gcj02',
                success(res) {
                    dispatch('setLocation', res);
                    //如果上一次获取的位置信息和最新的位置信息距离大于500米，则重新获取中文位置信息
                    if (utils.getDistance(res.latitude, res.longitude, state.latitude, state.longitude, false) > 500) {
                        dispatch('getGeocoder').finally(() => {
                            resolve(state);
                        })
                    } else {
                        resolve(state);
                    }
                },
                fail(res) {
                    //获取失败时，则使用缓存的位置信息
                    let location = rootState.storage.location;
                    if (location) {
                        dispatch('setLocation', location);
                    }
                    resolve(res);
                    //uni.showModal({
                    //    title: '获取定位信息失败!',
                    //    content: '请前往设置\n检查是否禁用视街app获取定位权限',
                    //    showCancel: false,
                    //    success() {
                    //        dispatch('getGeocoder').then(() => {
                    //            resolve(state);
                    //        }).catch(() => {
                    //            reject(state);
                    //        });
                    //    }
                    //});
                }
            });
        });
    },
    //获取中文地址信息
    getGeocoder({ commit, state }) {
        return new Promise((resolve, reject) => {
            var qqmapsdk = new QQMapWX({
                key: utils.mapkey
            });
            qqmapsdk.reverseGeocoder({
                location: {
                    latitude: state.latitude,
                    longitude: state.longitude
                },
                success(res) {
                    dispatch('setLocation', res.result.ad_info);
                    resolve(res);
                },
                fail(res) {
                    console.log(JSON.stringify(res));
                    reject(res);
                },
            })
        });
    },
}

export default {
    state,
    getters,
    mutations,
    actions
}