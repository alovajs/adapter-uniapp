# @alova/adapter-uniapp

uniapp adapter for alova.js

[![npm](https://img.shields.io/npm/v/@alova/adapter-uniapp)](https://www.npmjs.com/package/@alova/adapter-uniapp)
[![build](https://github.com/alovajs/adapter-uniapp/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/alovajs/adapter-uniapp/actions/workflows/main.yml)
[![coverage status](https://coveralls.io/repos/github/alovajs/adapter-uniapp/badge.svg?branch=main)](https://coveralls.io/github/alovajs/adapter-uniapp?branch=main)
![typescript](https://badgen.net/badge/icon/typescript?icon=typescript&label)
![license](https://img.shields.io/badge/license-MIT-blue.svg)

[Website](https://alova.js.org/extension/alova-adapter-uniapp) | core library [alova](https://github.com/alovajs/alova)

## Install

```bash
# npm
npm install @alova/adapter-uniapp --save

# yarn
yarn add @alova/adapter-uniapp
```

## Usage

### create alova

Calling **AdapterUniapp** will return _Request Adapter_, _Storage Adapter_, and _VueHook_, so you no longer need to set these three items, and the usage is exactly the same.

```javascript
import { createAlova } from 'alova';
import AdapterUniapp from '@alova/adapter-uniapp';

const alovaInst = createAlova(
   baseURL: 'https://api.alovajs.org',
   ...AdapterUniapp()
);
```

### Request

The usage method of the request is exactly the same as that used in the web environment. Already fully compatible with `uni.request`, you can specify [all configuration items] supported by `uni.request` in _config_ of method instance creation (https://uniapp.dcloud.net.cn/api/request/ request.html)

```html
<tempate>
   <view v-if="loading">Loading...</view>
   <view>The requested data is: {{ data }}</view>
</template>

<script setup>
   const list = () =>
     alovaInst. Get('/list', {
       // The set parameters will be passed to uni.request
       enableHttp2: true,
       sslVerify: true
     });
   const { loading, data, uploading } = useRequest(list);
</script>
```

### Upload

When `requestType: 'upload'` is set in the _config_ of the method instance, it means to upload the file, the request adapter will call `uni.uploadFile`, and the uploaded file data is placed in the data of the method instance, you need to specify in the data `name`, `filePath or files`, and `file` (if necessary), these 4 parameters will be passed to `uni.uploadFile`, at the same time, you can also specify other parameters besides these 4 parameters in data , the request adapter will pass them into the `formData` parameter.

Similarly, it is fully compatible with `uni.uploadFile`, you can specify [all configuration items] supported by `uni.uploadFile` in _config_ of method instance creation (https://uniapp.dcloud.net.cn/api /request/network-file.html#uploadfile), if there are additional parameters to be set, please specify them in _config_ of the method instance.

```html
<tempate>
   <view v-if="loading">Uploading...</view>
   <view>Upload progress: {{ uploading.loaded }}/{{ uploading.total }}</view>
   <button @click="handleImageChoose">Upload image</button>
   <!-- ... -->
</template>

<script setup>
   const uploadFile = (name, filePath, formData) =>
     alovaInst. Post(
       '/uploadImg',
       {
         name,
         filePath,

         // Additional data will be passed into formData of uni.uploadFile
         ...formData
       },
       {
         // Set the request method to upload, and the adapter will call uni.uploadFile
         requestType: 'upload',
         fileType: 'image',

         // Start upload progress
         enableUpload: true
       }
     );

   const { loading, data, uploading, send } = useRequest(uploadFile, {
     immediate: false
   });

   const handleImageChoose = () => {
     uni.chooseImage({
       success: chooseImageRes => {
         const tempFilePaths = chooseImageRes.tempFilePaths;
         send('fileName', tempFilePaths[0], {
           extra1: 'a',
           extra2: 'b'
         });
       }
     });
   };
</script>
```

### download

When `requestType: 'download'` is set in the _config_ of the method instance, it means to download the file, and the request adapter will call `uni.downloadFile`.

Similarly, it is fully compatible with `uni.downloadFile`, you can specify [all configuration items] supported by `uni.downloadFile` in _config_ of method instance creation (https://uniapp.dcloud.net.cn/api /request/network-file.html#downloadfile), if there are additional parameters to be set, please specify them in _config_ of the method instance.

```html
<tempate>
   <view v-if="loading">Downloading...</view>
   <view>Download progress: {{ downloading.loaded }}/{{ downloading.total }}</view>
   <button @click="handleImageDownload">Download image</button>
   <!-- ... -->
</template>

<script setup>
   const downloadFile = filePath =>
     alovaInst. Get('/bigImage. jpg', {
       // Set the request method to download, and the adapter will call uni.downloadFile
       requestType: 'download',
       filePath,

       // Start download progress
       enableDownload: true
     });

   const { loading, data, downloading, send } = useRequest(downloadFile, {
     immediate: false
   });

   const handleImageDownload = () => {
     send('file_save_path');
   };
</script>
```
