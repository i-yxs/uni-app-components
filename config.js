export const ENV = process.env.VUE_APP_ENV
console.log('%c当前 process.env.VUE_APP_ENV： ', 'background: green; color: #fff;', ENV)
const config = {
    'development': { // 开发
        BASE_API: 'http://119.145.28.223:11009/sy.api',
    },
    'staging': { // 测试

    },
    'production': { // 生产

    }
}
export const envConfig = config[ENV]
export default envConfig
