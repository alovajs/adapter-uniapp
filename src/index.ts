import { onLoad } from '@dcloudio/uni-app';
import { EffectRequestParams } from 'alova';
import VueHook from 'alova/vue';
import { WatchSource } from 'vue';
import { AdapterUniappOptions } from '../typings';
import requestAdapter from './requestAdapter';
import storageAdapter from './storageAdapter';
export { default as uniappMockResponse } from './mockResponse';
export { default as uniappRequestAdapter } from './requestAdapter';
export { default as uniappStorageAdapter } from './storageAdapter';

export default function AdapterUniapp({ mockRequest }: AdapterUniappOptions = {}) {
	return {
		statesHook: {
			...VueHook,
			effectRequest(effectRequestParams: EffectRequestParams<WatchSource>) {
				const handler = effectRequestParams.handler;
				effectRequestParams.handler = () => {
					// 延迟10ms让页面中的onLoad先执行
					onLoad(() => {
						setTimeout(handler, 10);
					});
				};
				return VueHook.effectRequest(effectRequestParams);
			}
		},
		requestAdapter: mockRequest || requestAdapter,
		storageAdapter
	};
}
