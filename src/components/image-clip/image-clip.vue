<template>
    <popup-layer direction="center" :visible="visible">
        <view class="image-clip">
        </view>
    </popup-layer>
</template>
<script>
/**
 * image-clip 图片裁剪
 * @description 图片裁剪让用户选择图片的显示区域，但该组件并不提供导出裁剪后图片的功能，只返回裁剪区域的数据信息
 * @property    {Boolean}   visible     是否显示
 */
import popupLayer from "@/components/popup-layer/popup-layer";
export default {
    name: "image-clip",
    components: { popupLayer },
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    methods: {}
};
</script>
<style lang="scss" scoped>

</style>

