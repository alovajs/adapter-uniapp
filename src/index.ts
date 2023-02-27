import { Method, ProgressUpdater, RequestElements } from 'alova';
import VueHook from 'alova/vue';
import requestAdapter from './requestAdapter';
import storageAdapter from './storageAdapter';

type UniappRequestAdapter = (
	elements: RequestElements,
	method: Method<
		any,
		any,
		any,
		any,
		UniappRequestConfig,
		UniNamespace.UploadFileSuccessCallbackResult,
		UniNamespace.RequestSuccessCallbackResult['header']
	>
) => {
	response: () => Promise<UniNamespace.UploadFileSuccessCallbackResult>;
	headers: () => Promise<UniNamespace.RequestSuccessCallbackResult['header']>;
	abort: () => void;
	onDownload: (handler: ProgressUpdater) => void;
	onUpload: (handler: ProgressUpdater) => void;
};

export default function AdapterUniapp() {
	return {
		statesHook: VueHook,
		requestAdapter: requestAdapter as UniappRequestAdapter,
		storageAdapter
	};
}
