import utils from '@/common'

import globalData from '@/common/globalData'

var loopTimer = null;

// #ifndef APP-PLUS
const plus = {
    device: {
        uuid: '51F4A6FB-F065-4183-D54C-CAB31C9EDA00'
    }
};
// #endif

const state = {
    //用户id
    user_id: 0,
    //用户名
    user_name: '',
    //电话号码
    phone: '',
    //设备唯一标识
    unique_identifier: plus.device.uuid,
    //是否首次登录
    isFirstLogin: 0,
    //收到的红包数量
    hongbaoCount: 0,
    //是否是商家
    isBusiness: 0,
    //待支付订单数
    myPayOrder: 0,
    //发出的红包数量
    sendCount: 0,
    //店铺id
    storefrontId: 0,
    //粉丝数
    userFollows: 0,
    //用户头像
    userIcon: '',
    //用户名
    userName: '',
    //累计收益额
    userIncome: 0,
    //余额
    userMoney: 0,
    //用户积分
    userScroe: 0,
    //未读私信数量
    chatCount: 0,
    //互动消息数量
    msgCount: 0,
    //系统消息数量
    notifyCount: 0,
    //购物车
    shopcart: [],
}
const filters = ['unique_identifier'];

const getters = {
    //当前用户是否已经登录
    hasLogin(state) {
        return !!state.user_id;
    },
    userinfo(state) {
        return state;
    },
    //购物车商品数量
    shopcartCount(state) {
        let count = 0;
        state.shopcart.forEach(item => {
            count += item.count;
        });
        return count;
    }
}

const mutations = {
    //退出登录
    logout(state, payload) {
        Object.keys(state).forEach(key => {
            if (filters.indexOf(key) === -1) {
                switch (utils.type(state[key])) {
                    case 'string':
                        state[key] = '';
                        break;
                    case 'number':
                        state[key] = 0;
                        break;
                    case 'object':
                        state[key] = {};
                        break;
                    case 'array':
                        state[key] = [];
                        break;
                }
            }
        })
    },
    //设置用户数据
    setUserInfo(state, payload) {
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
    //登录
    login({ dispatch, commit, getters, state }, payload) {
        return new Promise((resolve, reject) => {
            if (getters.hasLogin) {
                resolve();
            } else {
                utils.request({
                    user_name: payload.user_name,
                    password: payload.password,
                }, utils.api.login).then(res => {
                    dispatch('setUserInfo', res);
                    dispatch('getUserInfo').then(res => {
                        uni.$emit('login');
                        resolve();
                    }).catch(res => {
                        reject();
                    });
                    dispatch('loopMessageCount');
                }).catch(res => {
                    reject();
                });
            }
        })
    },
    //注册
    register({ dispatch, commit, state }) {

    },
    //退出登录
    logout({ dispatch, commit, getters, state }) {
        if (getters.hasLogin) {
            clearInterval(loopTimer);
            commit('logout');
            dispatch('storage/setStorage', {
                'user': state
            }, { root: true });
            uni.$emit('logout');
        }
    },
    //获取用户信息
    getUserInfo({ dispatch, commit, state }) {
        return new Promise((resolve, reject) => {
            utils.request({}, utils.api.getUserInfo).then(res => {
                dispatch('setUserInfo', res);
                resolve();
            }).catch(res => {
                reject();
            });
        })
    },
    //设置用户数据
    setUserInfo({ dispatch, commit, state }, payload) {
        commit('setUserInfo', payload);
        dispatch('storage/setStorage', {
            'user': state
        }, { root: true });
    },
    //获取未读信息数据
    getMessageCount({ dispatch, state }) {
        return new Promise((resolve, reject) => {
            utils.request({
                api: utils.api.getMessageCount,
                hasErrorTips: false,
            }).then(res => {
                dispatch('setUserInfo', res);
                dispatch('updageTabBarBadge');
                resolve(res);
            }).catch(res => {
                reject(res);
            });
        })
    },
    //轮询请求未读消息数据
    loopMessageCount({ dispatch, state }) {
        if (state.user_id) {
            clearInterval(loopTimer);
            dispatch('getMessageCount');
            loopTimer = setInterval(() => {
                dispatch('getMessageCount');
            }, 5000);
        }
    },
    //停止轮询请求未读消息数据
    stopMessageCount() {
        clearInterval(loopTimer);
    },
    //更新底部栏未读数角标
    updageTabBarBadge({ state }) {
        let count = state.msgCount + state.chatCount + state.notifyCount;
        if (count) {
            uni.setTabBarBadge({ index: 3, text: String(count) });
        } else {
            uni.removeTabBarBadge({ index: 3 });
        }
    },
    //加入商品到购物车
    addShopcart({ dispatch, state }, payload) {
        payload = String(payload);
        let data = state.shopcart.find(item => {
            if (item.id === payload) {
                return true;
            }
        })
        if (data) {
            data.count++;
        } else {
            state.shopcart.push({
                id: payload,
                count: 1
            });
        }
        dispatch('setUserInfo', {
            shopcart: state.shopcart
        });
        globalData.refreshShopcart = true;
    },
    //设置购物车商品数量
    setShopcartCount({ dispatch, state }, payload) {
        let data = state.shopcart.find(item => {
            if (item.id === String(payload.id)) {
                return true;
            }
        })
        if (data) {
            data.count = payload.count;
            dispatch('setUserInfo', {
                shopcart: state.shopcart
            });
        }
    },
    //从购物车删除商品
    removeShopcart({ dispatch, state }, payload) {
        if (utils.type(payload, 'array')) {
            let list = [];
            payload = payload.map(item => {
                return String(item);
            });
            state.shopcart.forEach(item => {
                if (payload.indexOf(item.id) === -1) {
                    list.push(item);
                }
            });
            state.shopcart = list;
        } else {
            state.shopcart = [];
        }
        dispatch('setUserInfo', {
            shopcart: state.shopcart
        });
    },
}

export default {
    state,
    getters,
    mutations,
    actions
}