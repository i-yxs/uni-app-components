<template>
    <view @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd" @touchcancel="handleTouchEnd">
        <slot></slot>
    </view>
</template>
<script>
/**
 * gesture-view 手势事件组件
 * @description 用于
 * @event       {Function}      doubletap      双击屏幕
 * @event       {Function}      dragstart      拖拽开始
 * @event       {Function}      drag           拖拽中
 * @event       {Function}      dragend        拖拽结束
 * @event       {Function}      pinchin        双指向内缩放
 * @event       {Function}      pinchout       双指向外缩放
 * @event       {Function}      rotate         旋转
 * @event       {Function}      swipeup        向上滑动
 * @event       {Function}      swipedown      向下滑动
 * @event       {Function}      swipeleft      向左滑动
 * @event       {Function}      swiperight     向右滑动
 * @event       {Function}      hold           长按事件
 */
export default {
    props: {},
    methods: {
        handleTouchStart(res) {
            this.downPointX = res.changedTouches[0].clientX;
            this.downPointY = res.changedTouches[0].clientY;
            this.downTimestamp = Date.now();
            this.lockDirection = null;
        },
        handleTouchMove(res) {
            let moveX = res.touches[0].clientX - this.downPointX;
            let moveY = res.touches[0].clientY - this.downPointY;
            if (!this.lockDirection) {
                if (Math.abs(moveX) > Math.abs(moveY)) {
                    this.lockDirection = "h";
                } else {
                    this.lockDirection = "v";
                }
            }
            this.$emit("drag", {
                moveX,
                moveY,
                direction: this.lockDirection
            });
        },
        handleTouchEnd(res) {
            //滑动的速度每100ms超过100才触发手势事件
            let speed = 80;
            let times = 300;
            let pastTime = Date.now() - this.downTimestamp;
            switch (this.lockDirection) {
                case "h":
                    let moveX = res.changedTouches[0].clientX - this.downPointX;
                    if (Math.abs(moveX) / (pastTime / times) > speed) {
                        if (moveX > 0) {
                            this.$emit("gestureright");
                        } else {
                            this.$emit("gestureleft");
                        }
                    }
                    break;
                case "v":
                    let moveY = res.changedTouches[0].clientY - this.downPointY;
                    if (Math.abs(moveY) / (pastTime / times) > speed) {
                        if (moveY > 0) {
                            this.$emit("gesturebottom");
                        } else {
                            this.$emit("gesturetop");
                        }
                    }
                    break;
            }
        }
    }
};
</script>
<style lang="scss" scoped>
</style>

