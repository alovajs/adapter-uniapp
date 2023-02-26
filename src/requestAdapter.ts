import { Method, ProgressUpdater, RequestElements } from 'alova';

export default <RC, RE, RH>(elements: RequestElements, method: Method<any, any, any, any, RC, RE, RH>) => {
	const { url, data, type, headers: header } = elements;

	let requestTask: UniApp.RequestTask;
	const responsePromise = new Promise<UniApp.RequestSuccessCallbackResult>((resolve, reject) => {
		requestTask = uni.request({
			url,
			data,
			header,
			method: type as any,
			timeout: method.config.timeout,
			success: res => resolve(res),
			fail: reason => reject(reason.errMsg)
		});
	});

	return {
		response: () => responsePromise,
		headers: () => responsePromise.then(res => res.header),
		abort: () => requestTask.abort(),
		onDownload: (handler: ProgressUpdater) => {},
		onUpload: (handler: ProgressUpdater) => {}
	};
};
