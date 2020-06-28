<template>
    <view class="content">
        <popup-layer :visible="visible1" direction="top" @masktap="visible1 = false">
            <view class="top"></view>
        </popup-layer>
        <popup-layer :visible="visible2" direction="bottom" @masktap="visible2 = false">
            <view class="bottom"></view>
        </popup-layer>
        <popup-layer :visible="visible3" direction="left" @masktap="visible3 = false">
            <view class="left"></view>
        </popup-layer>
        <popup-layer :visible="visible4" direction="right" @masktap="visible4 = false">
            <view class="right"></view>
        </popup-layer>
        <popup-layer :visible="visible5" direction="center" @masktap="visible5 = false">
            <view class="center"></view>
        </popup-layer>
        <button type="primary" @click="visible1 = true">顶部</button>
        <button type="primary" @click="visible2 = true">底部</button>
        <button type="primary" @click="visible3 = true">左侧</button>
        <button type="primary" @click="visible4 = true">右侧</button>
        <button type="primary" @click="visible5 = true">中间</button>
    </view>
</template>
<script>
import popupLayer from "@/components/popup-layer/popup-layer";

export default {
    components: { popupLayer },
    props: {},
    data() {
        return {
            visible1: false,
            visible2: false,
            visible3: false,
            visible4: false,
            visible5: false,
        };
    },
    computed: {},
    methods: {
    },
    onShow() {},
    onLoad(param) {},
    onUnload() {}
};
</script>
<style lang="scss" scoped>
.top {
    background: #fff;
    width: 100vw;
    height: 50vh;
}
.bottom {
    background: #fff;
    width: 100vw;
    height: 50vh;
}
.left {
    background: #fff;
    width: 50vw;
    height: 100vh;
}
.right {
    background: #fff;
    width: 50vw;
    height: 100vh;
}
.center{
    background: #fff;
    width: 50vw;
    height: 50vh;
}
</style>