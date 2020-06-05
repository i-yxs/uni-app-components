const state = {
    //手机品牌
    brand: '',
    //手机型号
    model: '',
    //设备像素比
    pixelRatio: 1,
    //屏幕宽度
    screenWidth: 0,
    //屏幕高度
    screenHeight: 0,
    //状态栏的高度
    statusBarHeight: 0,
    //应用设置的语言
    language: '',
    //引擎版本号
    version: '',
    //操作系统版本
    system: '',
    //客户端平台
    platform: '',
    //用户字体大小设置
    fontSizeSetting: 0,
    //客户端基础库版本
    SDKVersion: '',
}

const getters = {

}

const mutations = {
    setSystemInfo(state, payload) {
        Object.keys(payload).forEach(key => {
            state[key] = payload[key];
        })
    }
}

const actions = {
    //获取系统信息
    getSystemInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            uni.getSystemInfo({
                success(res) {
                    commit('setSystemInfo', res);
                    resolve(state);
                }
            });
        });
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}