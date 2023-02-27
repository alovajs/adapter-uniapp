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
	requestType?: 'upload' | 'download';
} & UniappRequestConfig;

type UniappResponse =
	| UniNamespace.UploadFileSuccessCallbackResult
	| UniNamespace.DownloadSuccessData
	| UniNamespace.RequestSuccessCallbackResult;
