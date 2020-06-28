<template>
    <gesture-view>
        <view class="action-view">
            <view class="action-block"></view>
        </view>
    </gesture-view>
</template>
<script>
import gestureView from "@/components/gesture-view/gesture-view";

export default {
    components: { gestureView },
    props: {},
    data() {
        return {};
    },
    computed: {},
    methods: {},
    onShow() {},
    onLoad(param) {},
    onUnload() {}
};
</script>
<style lang="scss" scoped>
.action-view {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    .action-block {
        width: 20vw;
        height: 20vw;
        background: #007aff;
    }
}
</style>