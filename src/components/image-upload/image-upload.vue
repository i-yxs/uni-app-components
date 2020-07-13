<!--
* @description 图片上传组件
* @author i-yxs
!-->
<template>
    <!--图片选择-->
    <view class="image-upload">
        <view class="preview-list">
            <view class="preview-item" v-for="(item, idx) in imageList" :key="idx">
                <view :class="['preview-wrap', size, {round: round, circle: circle}]">
                    <image
                        class="preview-image"
                        :src="item.thumb"
                        mode="aspectFill"
                        @click="handlePreviewImage(item.path)"
                    />
                    <view
                        class="delete-button"
                        @click="handleDeleteImage(idx, 'image')"
                        v-if="currentConfig.isDelete"
                    ></view>
                </view>
            </view>
            <view class="preview-item" v-for="(item, idx) in uploadList" :key="idx">
                <view :class="['preview-wrap', size, {round: round, circle: circle}]">
                    <image
                        class="preview-image"
                        :src="item.thumb"
                        mode="aspectFill"
                        @click="handlePreviewImage(item.path)"
                    />
                    <view class="upload-progress" v-if="item.progress < 100">
                        <view
                            class="error-text"
                            @click="handleRestart(item)"
                            v-if="item.progress === -1"
                        >重试</view>
                        <view class="progress-bar" v-else>
                            <view class="progress" :style="{width: item.progress + '%'}"></view>
                        </view>
                    </view>
                    <view
                        class="delete-button"
                        @click="handleDeleteImage(idx, 'upload')"
                        v-if="(item.progress === 100 || item.progress === -1) && currentConfig.isDelete"
                    ></view>
                </view>
            </view>
            <view class="preview-item" v-if="!isMaxmaxCount">
                <view
                    :class="['action-button', size, {round: round, circle: circle}]"
                    @click="handleChooseButton"
                ></view>
            </view>
        </view>
        <view class="image-upload-canvas">
            <!-- #ifdef MP-WEIXIN -->
            <canvas
                canvas-id="ImageUploadCanvas"
                :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"
            ></canvas>
            <!-- #endif -->
            <!-- #ifndef MP-WEIXIN -->
            <canvas
                :canvas-id="canvasId"
                :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"
            ></canvas>
            <!-- #endif -->
        </view>
        <popup-layer direction="bottom" :visible="isPopupVisible" @masktap="isPopupVisible = false">
            <view class="source-type-select">
                <view
                    class="option-item"
                    v-for="(item, idx) in sourceTypeEnum"
                    :key="idx"
                    @click="handleChooseImage(item.name)"
                >{{item.text}}</view>
            </view>
        </popup-layer>
    </view>
</template>
<script>
/**
 * image-upload 图片上传
 * @description 该组件相比于其他同类组件多了处理进度显示、图片上传、图片处理（开发者可以在图片处理前、后操作canvas，可以实现诸如图片裁剪、添加水印等等功能）
 * @property    {Array}     image       网络图片的列表，由父组件指定，仅能进行删除操作，推荐配合.sync修饰符使用
 * @property    {Array}     upload      上传列表，用于把上传列表传递给父组件，推荐配合.sync修饰符使用
 * @property    {String}    size        指定组件显示的尺寸
 *  @value String   mini            最小尺寸
 *  @value String   small           小尺寸
 *  @value String   medium          中尺寸
 *  @value String   normal          默认尺寸
 * @property    {Boolean}   round       是否圆角
 * @property    {Boolean}   circle      是否圆形
 * @property    {Object}    config      配置选项
 *  @value Number   quality         指定导出图片的质量
 *  @value Number   maxSize         指定该属性会将图片等比压缩至该值以下
 *  @value Number   timeout         处理超时时间，上传超时时间需要在manifest.json配置
 *  @value Number   fileType        指定导出图片的格式，默认png
 *  @value Number   maxCount        最大选择数量
 *  @value Boolean  isDelete        是否显示删除按钮
 *  @value String   sourceType      指定选择图片方式
 *      @value String   album       从相册选择
 *      @value String   camera      使用相机拍照
 *  @value String   uploadUrl       上传服务器的url
 *  @value String   uploadName      上传服务器的name
 *
 *  只有设置了image的值时，才会生效的配置
 *
 *  @value String   baseUrl         用于拼接不带域名信息的图片路径
 *  @value String   pathKey         用于获取image列表内的图片路径 key
 *  @value String   thumbKey        用于获取image列表内的缩略图路径 key
 *  @value String   baseUrlKey      用于获取image列表内的域名信息 key，优先级比baseUrl低
 *
 * @event       {Function}  drawbefore      绘制图片前触发事件
 * @event       {Function}  drawafter       绘制图片后触发事件
 */
import popupLayer from "@/components/popup-layer/popup-layer";

// #ifdef H5
import EXIF from "./EXIF";
// #endif

//默认配置
const DefaultConfig = {
    quality: 1,
    maxSize: 1000,
    timeout: 10000,
    fileType: "png",
    isDelete: true,
    sourceType: "",
    uploadUrl: "",
    uploadName: "",
    maxCount: 9,
    urlKey: "",
    pathKey: "path",
    thumbKey: "thumb",
    baseUrl: ""
};
export default {
    name: "image-upload",
    components: { popupLayer },
    props: {
        image: {
            type: Array,
            default: () => []
        },
        upload: {
            type: Array,
            default: () => []
        },
        size: {
            type: String,
            default: "normal"
        },
        round: {
            type: Boolean,
            default: false
        },
        circle: {
            type: Boolean,
            default: false
        },
        config: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            // #ifdef MP-WEIXIN
            canvasId: "ImageUploadCanvas", //canvas的Id
            // #endif
            // #ifndef MP-WEIXIN
            canvasId: `ImageUploadCanvas${Date.now()}`, //canvas的Id
            // #endif
            canvasWidth: 0, //canvas的宽度
            canvasHeight: 0, //canvas的高度
            isPopupVisible: false, //用于表示source-type弹出层的显示状态
            sourceTypeEnum: [
                //枚举选择图片的方式
                { name: "camera", text: "使用相机拍照" },
                { name: "album", text: "从相册选择" }
            ],
            imageList: [], //图片列表，父组件传递过来仅用于展示的图片列表
            uploadList: [] //上传列表，包含正在上传和等待上传的图片列表
        };
    },
    watch: {
        //监听image的变化，一旦发生变化，将数据转换成用于渲染的数据格式
        image: {
            immediate: true,
            handler() {
                let config = this.currentConfig;
                this.imageList = this.image.map(item => {
                    let url = config.baseUrl || item[config.baseUrlKey] || "";
                    let path = item[config.pathKey];
                    let thumb = item[config.thumbKey] || path;
                    return {
                        path: url + path,
                        thumb: url + thumb
                    };
                });
            }
        }
    },
    computed: {
        //当前图片数量
        imageCount() {
            return this.imageList.length + this.uploadList.length;
        },
        //当前配置
        currentConfig() {
            return Object.assign({}, DefaultConfig, this.config);
        },
        //是否达到最大上传图片张数
        isMaxmaxCount() {
            return this.imageCount >= this.currentConfig.maxCount;
        }
    },
    mounted() {
        let queuesKey = "____upload_queues____";
        //获取屏幕dpr
        this.dpr = uni.getSystemInfoSync().pixelRatio;
        //队列处理列表，因为所有组件共用一个canvas，所以这里用$root保存队列数据
        this.queues = this.$root[queuesKey] = this.$root[queuesKey] || [];
        //context2d
        this.context2d = uni.createCanvasContext(this.canvasId, this);
    },
    methods: {
        //队列处理
        queuesHandle() {
            let count = -1;
            let handle = () => {
                if (++count >= this.queues.length) {
                    this.queues.length = 0;
                    return;
                }
                let imageData = this.queues[count];
                //选择完图片进度+10
                imageData.progress = 10;

                this.drawImage(imageData)
                    .then(path => {
                        //压缩完成进度+20
                        imageData.path = path;
                        imageData.progress = 30;
                        return this.drawThumb(imageData);
                    })
                    .then(thumb => {
                        //缩略图绘制完成进度+20
                        imageData.thumb = thumb;
                        imageData.progress = 50;
                        /**
                         * 如果uploadUrl、uploadName有值则上传文件
                         */
                        let config = this.currentConfig;
                        if (config.uploadUrl && config.uploadName) {
                            return this.uploadFile(imageData.path, res => {
                                //更新上传进度
                                imageData.progress =
                                    (res.progress / 100) * 49 + 50;
                            });
                        }
                    })
                    .then(res => {
                        imageData.progress = 100;
                        imageData.dataModel = res;
                        this.updateUpload();
                        handle();
                    })
                    .catch(res => {
                        console.error(res);
                        //处理失败，还原状态
                        imageData.progress = -1;
                        this.updateUpload();
                        handle();
                    });
            };
            handle();
        },
        //加入到队列
        joinQueues(imageData) {
            let length = this.queues.length;
            this.queues.push(imageData);
            if (length === 0) {
                this.queuesHandle();
            }
        },
        //绘制图片
        drawImage(imageData) {
            return new Promise((resolve, reject) => {
                if (imageData.path) {
                    resolve(imageData.path);
                } else {
                    this.getImageInfo(imageData.original)
                        .then(imageInfo => {
                            /**
                             * 把图片压缩至指定尺寸以下
                             */
                            let width = imageInfo.width,
                                height = imageInfo.height,
                                ratio =
                                    Math.max(
                                        imageInfo.width,
                                        imageInfo.height
                                    ) / this.currentConfig.maxSize;

                            if (ratio > 1) {
                                width = (imageInfo.width / ratio) | 0;
                                height = (imageInfo.height / ratio) | 0;
                            }
                            width = width / this.dpr;
                            height = height / this.dpr;

                            this.canvasWidth = width;
                            this.canvasHeight = height;

                            setTimeout(() => {
                                this.context2d.save();
                                /**
                                 * 抛出drawbefore事件，用户可以自行绘制内容
                                 * 比如可以利用clip限制绘制区域
                                 */
                                this.$emit("drawbefore", {
                                    dpr: this.dpr,
                                    width: width,
                                    height: height,
                                    image: imageData.original,
                                    source: imageData.source,
                                    context2d: this.context2d
                                });
                                /**
                                 * H5端拍照照片会有方向的问题，这里使用EXIF.js获取方向
                                 * 然后修正照片的方向
                                 */
                                // #ifdef H5
                                let x = 0,
                                    y = 0;
                                this.context2d.save();
                                if (imageData.source === "camera") {
                                    let orientation =
                                        EXIF.getTag(this, "Orientation");
                                    // 根据旋转角度，对图片进行旋转
                                    switch (orientation) {
                                        case 3:
                                            // 旋转180°
                                            [x, y] = [-width, -height];
                                            this.context2d.rotate(
                                                (180 * Math.PI) / 180
                                            );
                                            break;
                                        case 6:
                                            // 旋转90°
                                            [x, y] = [0, -height];
                                            [width, height] = [height, width];
                                            this.context2d.rotate(
                                                (90 * Math.PI) / 180
                                            );
                                            break;
                                        case 8:
                                            // 旋转-90°
                                            [x, y] = [-width, 0];
                                            [width, height] = [height, width];
                                            this.context2d.rotate(
                                                (-90 * Math.PI) / 180
                                            );
                                            break;
                                    }
                                }
                                this.canvasWidth = width;
                                this.canvasHeight = height;
                                this.context2d.drawImage(
                                    imageData.original,
                                    x,
                                    y,
                                    width,
                                    height
                                );
                                this.context2d.restore();
                                // #endif
                                // #ifndef H5
                                this.context2d.drawImage(
                                    imageData.original,
                                    0,
                                    0,
                                    width,
                                    height
                                );
                                // #endif
                                this.context2d.restore();
                                /**
                                 * 抛出drawafter事件，用户可以自行绘制内容
                                 * 比如可以在图片上绘制水印
                                 */
                                this.$emit("drawafter", {
                                    dpr: this.dpr,
                                    width: width,
                                    height: height,
                                    image: imageData.original,
                                    source: imageData.source,
                                    context2d: this.context2d
                                });
                                this.context2d.restore();

                                let timer = this.handleTimeout(reject);

                                this.context2d.draw(false, () => {
                                    clearTimeout(timer);
                                    /**
                                     * 延迟300ms
                                     * 解决低配置安卓手机create bitmap failed错误
                                     */
                                    setTimeout(() => {
                                        this.exportImage()
                                            .then(res => {
                                                resolve(res);
                                            })
                                            .catch(res => {
                                                reject(res);
                                            });
                                    }, 300);
                                });
                            }, 300);
                        })
                        .catch(res => {
                            reject(res);
                        });
                }
            });
        },
        //绘制缩略图
        drawThumb(imageData) {
            return new Promise((resolve, reject) => {
                if (imageData.thumb) {
                    resolve(imageData.thumb);
                } else {
                    this.getImageInfo(imageData.path)
                        .then(imageInfo => {
                            let wh = 100,
                                sx = 0,
                                sy = 0,
                                sWidht = 0,
                                sHeight = 0;

                            let min = Math.min(
                                imageInfo.width,
                                imageInfo.height
                            );

                            if (imageInfo.width > min) {
                                sx = (imageInfo.width - min) / 2;
                            }
                            if (imageInfo.height > min) {
                                sy = (imageInfo.height - min) / 2;
                            }

                            this.canvasWidth = wh;
                            this.canvasHeight = wh;

                            setTimeout(() => {
                                this.context2d.drawImage(
                                    imageData.path,
                                    sx,
                                    sy,
                                    min,
                                    min,
                                    0,
                                    0,
                                    wh,
                                    wh
                                );
                                let timer = this.handleTimeout(reject);

                                this.context2d.draw(false, () => {
                                    clearTimeout(timer);

                                    setTimeout(() => {
                                        this.exportImage()
                                            .then(res => {
                                                resolve(res);
                                            })
                                            .catch(res => {
                                                reject(res);
                                            });
                                    }, 300);
                                });
                            }, 300);
                        })
                        .catch(res => {
                            reject(res);
                        });
                }
            });
        },
        //导出图片
        exportImage() {
            return new Promise((resolve, reject) => {
                let timer = this.handleTimeout(reject);
                uni.canvasToTempFilePath(
                    {
                        x: 0,
                        y: 0,
                        quality: this.currentConfig.quality,
                        fileType: this.currentConfig.fileType,
                        canvasId: this.canvasId,
                        success(res) {
                            resolve(res.tempFilePath);
                        },
                        fail(res) {
                            reject(res);
                        },
                        complete: () => {
                            clearTimeout(timer);
                        }
                    },
                    this
                );
            });
        },
        //上传图片
        uploadFile(path, progressUpdate) {
            return new Promise((resolve, reject) => {
                let uploadTask = uni.uploadFile({
                    url: this.currentConfig.uploadUrl,
                    filePath: path,
                    name: this.currentConfig.uploadName,
                    success(res) {
                        if (res.statusCode >= 200 && res.statusCode < 300) {
                            try {
                                resolve(JSON.parse(res.data));
                            } catch (err) {
                                resolve(res.data);
                            }
                        } else {
                            reject(`上传失败 ${res.statusCode}`);
                        }
                    },
                    fail(err) {
                        reject(err);
                    }
                });
                uploadTask.onProgressUpdate(progressUpdate);
            });
        },
        //Promise方式获取图片信息
        getImageInfo(path) {
            return new Promise((resolve, reject) => {
                uni.getImageInfo({
                    src: path,
                    success(res) {
                        resolve(res);
                    },
                    fail(res) {
                        reject(res);
                    }
                });
            });
        },
        //更新upload的值
        updateUpload() {
            let upload = this.uploadList.map(item => {
                if (item.progress === -1) {
                    //处理失败or上传失败
                    return 10001;
                } else if (item.progress < 100) {
                    //正在处理中
                    return 10002;
                } else if (item.dataModel) {
                    //上传完成
                    return item.dataModel;
                } else {
                    //处理完成，不上传
                    return item.path;
                }
            });
            this.$emit("update:upload", upload);
        },
        //超时处理
        handleTimeout(func) {
            return setTimeout(() => {
                func("处理超时！");
            }, this.currentConfig.timeout);
        },
        //重试按钮事件
        handleRestart(imageData) {
            imageData.progress = 0;
            this.joinQueues(imageData);
        },
        //选择按钮事件
        handleChooseButton() {
            let sourceType = this.currentConfig.sourceType.toLocaleLowerCase();
            if (
                this.sourceTypeEnum.findIndex(
                    item => item.name === sourceType
                ) > -1
            ) {
                handleChooseImage();
            } else {
                this.isPopupVisible = true;
            }
        },
        //根据指定方式获取图片
        handleChooseImage(type) {
            let count = this.currentConfig.maxCount - this.imageCount;
            let sourceType = [type || this.currentConfig.sourceType];
            uni.chooseImage({
                count,
                sourceType,
                success: res => {
                    let files = Array.prototype.slice.apply(res.tempFiles);
                    if (files.length > this.currentConfig.maxCount) {
                        files.length = this.currentConfig.maxCount;
                    }
                    files = files.map(item => {
                        let data = {
                            path: "", //待上传的图片url
                            thumb: "", //缩略图
                            original: item.path, //原始图片
                            source: type, //获取图片的方式
                            progress: 0, //处理进度
                            dataModel: null //服务器返回的数据
                        };
                        this.joinQueues(data);
                        return data;
                    });
                    this.uploadList = this.uploadList.concat(files);
                    this.updateUpload();
                }
            });
            this.isPopupVisible = false;
        },
        //图片预览
        handlePreviewImage(url) {
            let urls = this.imageList
                .map(item => {
                    return item.path;
                })
                .concat(
                    this.uploadList.map(item => {
                        return item.path;
                    })
                );
            uni.previewImage({
                current: url,
                urls: urls
            });
        },
        //删除按钮事件
        handleDeleteImage(index, type) {
            switch (type) {
                case "image":
                    this.image.splice(index, 1);
                    this.$emit("update:image", this.image);
                    break;
                case "upload":
                    this.uploadList.splice(index, 1);
                    this.updateUpload();
                    break;
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.image-upload {
    .preview-list {
        display: flex;
        flex-wrap: wrap;
    }
    .preview-item {
        padding: 10rpx;
    }
    .preview-wrap,
    .action-button {
        background: #f5f5f5;
        position: relative;
        &.mini {
            width: 80rpx;
            height: 80rpx;
            font-size: 38rpx;
            .delete-button {
                font-size: 24rpx;
                width: 34rpx;
                height: 34rpx;
            }
        }
        &.small {
            width: 100rpx;
            height: 100rpx;
            font-size: 54rpx;
            .delete-button {
                font-size: 28rpx;
                width: 36rpx;
                height: 36rpx;
            }
        }
        &.medium {
            width: 120rpx;
            height: 120rpx;
            font-size: 58rpx;
            .delete-button {
                font-size: 32rpx;
                width: 40rpx;
                height: 40rpx;
            }
        }
        &.normal {
            width: 140rpx;
            height: 140rpx;
            font-size: 68rpx;
            .delete-button {
                font-size: 32rpx;
                width: 40rpx;
                height: 40rpx;
            }
        }
        &.round {
            border-radius: 8rpx;
        }
        &.circle {
            border-radius: 50%;
        }
    }
    .preview-image {
        width: 100%;
        height: 100%;
        border-radius: inherit;
    }
    .delete-button {
        position: absolute;
        right: -12rpx;
        top: -12rpx;
        color: #fff;
        background: #f00;
        border: solid 4rpx #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.1);
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAUVBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////8IN+deAAAAGnRSTlMA3Rn2nRw2Od+ZEZAW1su+tnp1OyvkzcOkCrVe4iQAAACASURBVBjTVdBJFsMgDANQmRaaEjK16eT7H7TxI0SOdv4LkI30ngtc0jhniKoEZxfVHpNWpemCKE5vZncAoava7Ap4fdKwv5DXw6jDi0bdjfkNZl+csorhp1DqvxaJtNpvpLJzFqep9QumXfBG5b5UiZB6F6qNUzPqgtI/4JO3+Q//Tg1DxXJGTgAAAABJRU5ErkJggg==);
        background-position: 50% 50%;
        background-size: 50%;
        background-repeat: no-repeat;
    }
    .upload-progress {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        border-radius: inherit;
        .error-text {
            color: #fff;
            font-size: 26rpx;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .progress-bar {
            position: absolute;
            left: 10rpx;
            right: 10rpx;
            top: 50%;
            height: 10rpx;
            border-radius: 5rpx;
            transform: translateY(-50%);
            background: #fff;
            .progress {
                width: 0;
                height: inherit;
                border-radius: inherit;
                background: #23abe8;
            }
        }
    }
    .action-button {
        display: flex;
        align-items: center;
        justify-content: center;
        background: #d7d7d7;
        color: #aaa;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8BAMAAADI0sRBAAAALVBMVEUAAACqqqqqqqqqqqqqqqqqqqqpqamrq6urq6upqamqqqqqqqqsrKyqqqqqqqolvvo/AAAADnRSTlMA7xGTBtmYLt3UnUNCIUMR+RwAAACySURBVDjLY0AB3KbBGxhwA7t37x7jlmV/BwQFOKW5QNILcEq7gqRDcEorgqSFRqVHpYmRdgRJi6AJOinBwEWQtCycqwKS3TxREAbkQNIP4VxJawYG5nd4gAFDHT7p5wzr8Em/YujDJ/2CIQ6f9FOGPHzSzxjO4ZN+w8CGTzqBgaE4EFewiJoTDFTMKBmUqWVUeqhJe4Kkp+CUZoMkXlyAByR9gAEnyAPlG9yA3aIZtZYDAB8RruivqOskAAAAAElFTkSuQmCC);
        background-position: 50% 50%;
        background-size: 50%;
        background-repeat: no-repeat;
    }
    .source-type-select {
        background: #fff;
        .option-item {
            text-align: center;
            position: relative;
            line-height: 50rpx;
            padding: 26rpx;
            font-size: 32rpx;
            color: #666;
            &:active {
                background: #f9f9f9;
            }
            &:after {
                content: "";
                position: absolute;
                left: 0;
                right: 0;
                border-width: 0;
                bottom: 0;
                border-bottom: solid 1px #ddd;
                transform: scaleY(0.5);
                transform-origin: 0 100%;
            }
        }
    }
    .image-upload-canvas {
        position: fixed;
        left: -9999px;
        top: -9999px;
        opacity: 0;
        pointer-events: none;
    }
}
</style>
