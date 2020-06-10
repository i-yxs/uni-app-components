<template>
    <view class="content">
        <view class="title">1、最小尺寸、圆形、只添加水印不上传</view>
        <image-upload
            circle
            size="mini"
            :image.sync="imageList[0].image"
            :upload.sync="imageList[0].upload"
            :config="config"
            @drawbefore="handleDrawbefore"
            @drawafter="handleDrawafter"
        ></image-upload>
        <view class="title">2、小型尺寸、圆角、只添加水印不上传</view>
        <image-upload
            round
            size="small"
            :image.sync="imageList[1].image"
            :upload.sync="imageList[1].upload"
            :config="config"
            @drawbefore="handleDrawbefore"
            @drawafter="handleDrawafter"
        ></image-upload>
        <view class="title">3、中型尺寸、圆形、添加水印且上传</view>
        <image-upload
            circle
            size="medium"
            :image.sync="imageList[2].image"
            :upload.sync="imageList[2].upload"
            :config="config1"
            @drawbefore="handleDrawbefore"
            @drawafter="handleDrawafter"
        ></image-upload>
        <view class="title">4、默认尺寸、圆角形状、添加水印且上传</view>
        <image-upload
            round
            :image.sync="imageList[3].image"
            :upload.sync="imageList[3].upload"
            :config="config1"
            @drawbefore="handleDrawbefore"
            @drawafter="handleDrawafter"
        ></image-upload>
        <view class="title">4、仅展示，不可新增、删除</view>
        <image-upload
            round
            :image.sync="imageList[4].image"
            :upload.sync="imageList[4].upload"
            :config="config2"
        ></image-upload>
        <button type="primary" @click="handleSubmit">提交</button>
    </view>
</template>
<script>
import imageUpload from "@/components/image-upload/image-upload";

export default {
    components: { imageUpload },
    props: {},
    data() {
        return {
            imageList: [
                {
                    image: [
                        {
                            fileId: "0945fa5e-8d8a-4006-845b-dbfff17c62fc",
                            fileName:
                                "tmp_4cd559684be743cdb1998d40ce888efd5c0059c0672e3c55.png"
                        }
                    ],
                    upload: []
                },
                {
                    image: [
                        {
                            fileId: "0945fa5e-8d8a-4006-845b-dbfff17c62fc",
                            fileName:
                                "tmp_4cd559684be743cdb1998d40ce888efd5c0059c0672e3c55.png"
                        }
                    ],
                    upload: []
                },
                {
                    image: [
                        {
                            fileId: "0945fa5e-8d8a-4006-845b-dbfff17c62fc",
                            fileName:
                                "tmp_4cd559684be743cdb1998d40ce888efd5c0059c0672e3c55.png"
                        }
                    ],
                    upload: []
                },
                {
                    image: [
                        {
                            fileId: "0945fa5e-8d8a-4006-845b-dbfff17c62fc",
                            fileName:
                                "tmp_4cd559684be743cdb1998d40ce888efd5c0059c0672e3c55.png"
                        },
                        {
                            fileId: "cee29578-5109-4ff3-be5f-87e94e4a6df8",
                            fileName:
                                "tmp_c06e71429bcdf19bb8d4f08504f8999129206b1e1deacb9b.png"
                        }
                    ],
                    upload: []
                },
                {
                    image: [
                        {
                            fileId: "0945fa5e-8d8a-4006-845b-dbfff17c62fc",
                            fileName:
                                "tmp_4cd559684be743cdb1998d40ce888efd5c0059c0672e3c55.png"
                        },
                        {
                            fileId: "cee29578-5109-4ff3-be5f-87e94e4a6df8",
                            fileName:
                                "tmp_c06e71429bcdf19bb8d4f08504f8999129206b1e1deacb9b.png"
                        }
                    ],
                    upload: []
                }
            ],
            config: {
                baseUrl: "https://api.shunone.com/api/file/thumbImage/",
                pathKey: "fileId",
                maxCount: 1
            },
            //上传图片配置
            config1: {
                baseUrl: "https://api.shunone.com/api/file/thumbImage/",
                pathKey: "fileId",
                uploadUrl: "https://jsonplaceholder.typicode.com/posts/",
                uploadName: "file"
            },
            //仅展示用配置，不可新增、删除
            config2: {
                baseUrl: "https://api.shunone.com/api/file/thumbImage/",
                pathKey: "fileId",
                isDelete: false,
                maxCount: 0
            }
        };
    },
    computed: {},
    methods: {
        /**
         * 绘制图片前触发
         */
        handleDrawbefore({ dpr, width, height, image, source, context2d }) {
            /**
             * 绘制圆角图片
             */
            let roundRect = (w, h, r) => {
                if (w < 2 * r) r = w / 2;
                if (h < 2 * r) r = h / 2;
                context2d.beginPath();
                context2d.moveTo(r, 0);
                context2d.arcTo(w, 0, w, h, r);
                context2d.arcTo(w, h, 0, h, r);
                context2d.arcTo(0, h, 0, 0, r);
                context2d.arcTo(0, 0, w, 0, r);
                context2d.closePath();
            };
            roundRect(width, height, width / 2);
            context2d.clip();
        },
        /**
         * 绘制图片后触发
         */
        handleDrawafter({ dpr, width, height, image, source, context2d }) {
            //只有是相机拍摄的才绘制水印
            if (source === "camera") {
                /**
                 * 绘制时间水印
                 */
                let date = new Date();
                context2d.setTextBaseline("top");
                context2d.setFillStyle("#f00");
                context2d.setFontSize(16 / dpr);
                context2d.fillText(
                    `时间：${date.getFullYear()}-${date.getMonth() +
                        1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
                    20 / dpr,
                    20 / dpr
                );
            }
        },
        /**
         * 提交处理
         */
        handleSubmit() {
            let errorMsg = "";
            this.imageList.every((item, ridx) => {
                let count = item.image.length + 1;
                item.upload.every((item, cidx) => {
                    switch (item) {
                        case 10001:
                            errorMsg = `第${ridx + count}个组件的第${cidx +
                                count}张图片处理失败！`;
                            return false;
                        case 10002:
                            errorMsg = `第${ridx + count}个组件的第${cidx +
                                count}张图片正在处理中！`;
                            return false;
                    }
                    return true;
                });
                return !errorMsg;
            });

            if (errorMsg) {
                uni.showToast({
                    mask: false,
                    icon: "none",
                    title: errorMsg,
                    duration: 2000
                });
                return;
            }

            console.log(
                "upload1",
                this.imageList[0].image.concat(this.imageList[0].upload)
            );
            console.log(
                "upload2",
                this.imageList[1].image.concat(this.imageList[1].upload)
            );
            console.log(
                "upload3",
                this.imageList[2].image.concat(this.imageList[2].upload)
            );
            console.log(
                "upload4",
                this.imageList[3].image.concat(this.imageList[3].upload)
            );
        }
    },
    onShow() {},
    onLoad(param) {},
    onUnload() {}
};
</script>
<style lang="scss">
.title {
    font-size: 26rpx;
    padding: 30rpx 0;
    color: #666;
}
</style>