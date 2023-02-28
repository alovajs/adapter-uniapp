/// <reference path="../node_modules/@dcloudio/types/uni-app/uni/legacy/uni.d.ts" />
import { AlovaGlobalStorage, Method, ProgressUpdater, RequestElements } from 'alova';
import VueHook from 'alova/vue';

/**
 * uni.request请求额外参数
 */
export type UniappRequestConfig = Omit<
	UniNamespace.RequestOptions,
	'url' | 'data' | 'header' | 'method' | 'timeout' | 'success' | 'fail' | 'complete'
>;

/**
 * uni.uploadFile额外参数
 */
export type UniappUploadConfig = Omit<
	UniNamespace.UploadFileOption,
	'url' | 'name' | 'header' | 'formData' | 'timeout' | 'success' | 'fail' | 'complete'
>;

/**
 * uni.downloadFile额外参数
 */
export type UniappDownloadConfig = Omit<
	UniNamespace.DownloadFileOption,
	'url' | 'header' | 'timeout' | 'success' | 'fail' | 'complete'
>;

/**
 * 合并的请求配置参数
 */
export type UniappConfig = {
	/**
	 * 请求类型，upload表示上传，download表示下载，不填写表示正常请求
	 */
	requestType?: 'upload' | 'download';
} & UniappRequestConfig &
	UniappUploadConfig &
	UniappDownloadConfig;

/**
 * 请求适配器返回数据
 */
interface UniappRequestAdapterReturn {
	response: () => Promise<
		| UniNamespace.RequestSuccessCallbackResult
		| UniNamespace.UploadFileSuccessCallbackResult
		| UniNamespace.DownloadSuccessData
	>;
	headers: () => Promise<UniNamespace.RequestSuccessCallbackResult['header']>;
	abort: () => void;
	onDownload: (handler: ProgressUpdater) => void;
	onUpload: (handler: ProgressUpdater) => void;
}

/**
 * uniapp请求适配器
 */
export interface UniappRequestAdapter {
	(
		elements: RequestElements,
		method: Method<
			any,
			any,
			any,
			any,
			UniappConfig,
			| UniNamespace.RequestSuccessCallbackResult
			| UniNamespace.UploadFileSuccessCallbackResult
			| UniNamespace.DownloadSuccessData,
			UniNamespace.RequestSuccessCallbackResult['header']
		>
	): UniappRequestAdapterReturn;
}

declare function AdapterUniapp(): {
	statesHook: typeof VueHook;
	requestAdapter: UniappRequestAdapter;
	storageAdapter: AlovaGlobalStorage;
};
export default AdapterUniapp;
