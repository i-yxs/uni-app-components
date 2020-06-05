<template>
    <view class="dialog-popup" :class="{visible: visible}">
        <view class="popup-mask" @click="handleMaskTap"></view>
        <view :class="['popup-body', direction]">
            <slot></slot>
        </view>
    </view>
</template>
<script>
/**
 * popup-layer 弹出层
 * @description 弹出层
 * @property    {Boolean}   visible     是否显示
 * @property    {String}    direction   显示方向
 * 	@value top      弹出层从顶部滑入
 * 	@value bottom   弹出层从底部滑入
 * 	@value left     弹出层从左侧滑入
 * 	@value right    弹出层从右侧滑入
 * 	@value center   弹出层从中间弹出
 * @event       {Function}  masktap      点击遮罩层时触发事件
 */
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        /**
         * 显示的方位
         */
        direction: {
            type: String,
            default: "top"
        }
    },
    methods: {
        handleMaskTap() {
            this.$emit("masktap");
        }
    }
};
</script>
<style lang="scss" scoped>
.dialog-popup {
    position: fixed;
    left: 0;
    right: 0;
    top: var(--window-top);
    bottom: var(--window-bottom);
    z-index: 99;
    pointer-events: none;
    .popup-mask {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        opacity: 0;
        transition: 0.3s ease-in-out;
    }
    .popup-body {
        position: absolute;
        opacity: 0;
        transition: 0.3s ease-in-out;
        &.top {
            left: 0;
            top: 0;
            right: 0;
            transform: translateY(-100%);
        }
        &.bottom {
            left: 0;
            bottom: 0;
            right: 0;
            transform: translateY(100%);
        }
        &.left {
            left: 0;
            top: 0;
            bottom: 0;
            transform: translateX(-100%);
        }
        &.right {
            right: 0;
            top: 0;
            bottom: 0;
            transform: translateX(100%);
        }
        &.center {
            top: 50%;
            left: 50%;
            transform: translate3d(-50%, -50%, 0) scale3d(0.6, 0.6, 1);
            transition: 0.3s cubic-bezier(0, 0, 0.5, -1);
        }
    }
    &.visible {
        pointer-events: initial;
        .popup-mask {
            opacity: 1;
        }
        .popup-body {
            opacity: 1;
            &.top {
                transform: translateY(0);
            }
            &.bottom {
                transform: translateY(0);
            }
            &.left {
                transform: translateX(0);
            }
            &.right {
                transform: translateX(0);
            }
            &.center {
                transform: translate3d(-50%, -50%, 0) scale3d(1, 1, 1);
                transition: 0.3s cubic-bezier(0, 0, 0, 1.5);
            }
        }
    }
}
</style>

