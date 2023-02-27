import { AlovaRequestAdapter, Arg, Method, ProgressUpdater, RequestElements } from 'alova';
import { isPlainObject, noop } from './helper';

type UniappRequestConfig = Omit<
	UniNamespace.RequestOptions,
	'url' | 'data' | 'header' | 'method' | 'timeout' | 'success' | 'fail' | 'complete'
>;
type UniappUploadConfig = Omit<
	UniNamespace.UploadFileOption,
	'url' | 'header' | 'formData' | 'timeout' | 'success' | 'fail' | 'complete'
>;
type UniappDownloadConfig = Omit<
	UniNamespace.DownloadFileOption,
	'url' | 'header' | 'timeout' | 'success' | 'fail' | 'complete'
>;
type UniappConfig = {
	fileName: string;
	requestType?: 'upload' | 'download';
} & (UniappRequestConfig | UniappUploadConfig | UniappDownloadConfig);

export default (
	elements: RequestElements,
	method: Method<
		any,
		any,
		any,
		any,
		UniappConfig,
		UniApp.RequestSuccessCallbackResult,
		UniApp.RequestSuccessCallbackResult['header']
	>
) => {
	const { url, data, type, headers: header } = elements;
	let taskInstance: UniApp.RequestTask | UniApp.UploadTask | UniApp.DownloadTask;
	let onDownload: ReturnType<AlovaRequestAdapter<any, any, any, any, any>>['onDownload'] = noop,
		onUpload: ReturnType<AlovaRequestAdapter<any, any, any, any, any>>['onUpload'] = noop;

	const responsePromise = new Promise<
		UniApp.UploadFileSuccessCallbackResult | UniApp.DownloadSuccessData | UniApp.RequestSuccessCallbackResult
	>((resolve, reject) => {
		const { config: adapterConfig } = method;
		const { requestType, timeout, fileName } = adapterConfig;
		if (requestType === 'upload') {
			const formData = {} as Arg;
			const fileData = {} as Arg;
			if (isPlainObject(data)) {
				Object.keys(data).forEach(key => {
					if (['files', 'file', 'filePath'].includes(key)) {
						fileData[key] = data[key as keyof typeof data];
					} else {
						formData[key] = data[key as keyof typeof data];
					}
				});
			}

			// 上传文件
			const uploadTask = (taskInstance = uni.uploadFile({
				...adapterConfig,
				...fileData,
				url,
				header,
				formData,
				name: fileName,
				timeout,
				success: res => resolve(res),
				fail: reason => reject(new Error(reason.errMsg)),
				complete: noop
			}));

			// 监听上传进度
			onUpload = (handler: ProgressUpdater) => {
				uploadTask.onProgressUpdate(({ totalBytesSent, totalBytesExpectedToSend }) => {
					handler(totalBytesSent, totalBytesExpectedToSend);
				});
			};
		} else if (requestType === 'download') {
			// 下载文件
			const downloadTask = (taskInstance = uni.downloadFile({
				...adapterConfig,
				url,
				header,
				timeout,
				success: res => resolve(res),
				fail: reason => reject(reason),
				complete: noop
			}));

			// 监听下载进度
			onDownload = (handler: ProgressUpdater) => {
				downloadTask.onProgressUpdate(({ totalBytesWritten, totalBytesExpectedToWrite }) => {
					handler(totalBytesWritten, totalBytesExpectedToWrite);
				});
			};
		} else {
			// 发送普通请求
			taskInstance = uni.request({
				...adapterConfig,
				url,
				data,
				header,
				method: type as any,
				timeout,
				success: res => resolve(res),
				fail: reason => reject(new Error(reason.errMsg))
			});
		}
	});

	return {
		response: () => responsePromise,
		headers: () => responsePromise.then(res => (res as UniApp.RequestSuccessCallbackResult).header),
		abort: () => taskInstance.abort(),
		onDownload,
		onUpload
	};
};
