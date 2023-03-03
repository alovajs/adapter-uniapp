/// <reference path="../node_modules/@dcloudio/types/uni-app/uni/legacy/uni.d.ts" />
import { MockResponse } from '@alova/mock';
import { UniappConfig } from '../typings';

type UniResponse =
	| UniNamespace.RequestSuccessCallbackResult
	| UniNamespace.UploadFileSuccessCallbackResult
	| UniNamespace.DownloadSuccessData;
const mockResponseHandler: MockResponse<
	UniappConfig,
	UniResponse,
	UniNamespace.RequestSuccessCallbackResult['header']
> = ({ status, body }, _, currentMethod) => {
	const { requestType } = currentMethod.config;
	const responseHeaders = {};
	if (requestType === 'upload') {
		return {
			response: {
				data: body,
				statusCode: status
			},
			headers: responseHeaders
		};
	} else if (requestType === 'download') {
		const isSuccess = status === 200;
		return {
			response: {
				tempFilePath: isSuccess ? (body as any) : '',
				statusCode: status
			},
			headers: responseHeaders
		};
	}

	return {
		response: {
			data: body,
			statusCode: status,
			header: {},
			cookies: []
		},
		headers: responseHeaders
	};
};
export default mockResponseHandler;
