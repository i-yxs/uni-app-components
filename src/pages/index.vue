<template>
    <view class="content">
        <uni-section title="视图组件" type="line"></uni-section>
        <uni-list>
            <uni-list-item
                v-for="(item, index) in view"
                :key="index"
                :title="item.name"
                @click="goDetailPage(item)"
            />
        </uni-list>
        <uni-section title="表单组件" type="line"></uni-section>
        <uni-list>
            <uni-list-item
                v-for="(item, index) in form"
                :key="index"
                :title="item.name"
                @click="goDetailPage(item)"
            />
        </uni-list>
    </view>
</template>
<script>
import uniList from "@/components/uni/uni-list/uni-list.vue";
import uniListItem from "@/components/uni/uni-list-item/uni-list-item.vue";
import uniSection from "@/components/uni/uni-section/uni-section.vue";

export default {
    components: { uniSection, uniList, uniListItem },
    props: {},
    data() {
        return {
            view: [
                {
                    name: "弹出层",
                    url: "popup-layer"
                },
                {
                    name: "手势事件",
                    url: "gesture-view"
                }
            ],
            form: [
                {
                    name: "图片上传",
                    url: "image-upload"
                }
            ]
        };
    },
    computed: {},
    methods: {
        goDetailPage(res) {
            let path = res.url;
            uni.navigateTo({
                url: `/pages/${path}/index`
            });
        }
    },
    onShow() {},
    onLoad(param) {},
    onUnload() {}
};
</script>
<style lang="scss" scoped>
.content{
    background: #efeff4;
}
</style>