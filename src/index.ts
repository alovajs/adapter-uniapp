import VueHook from 'alova/vue';
import { AdapterUniappOptions } from '../typings';
import requestAdapter from './requestAdapter';
import storageAdapter from './storageAdapter';
export { default as uniappMockResponse } from './mockResponse';
export { default as uniappRequestAdapter } from './requestAdapter';
export { default as uniappStorageAdapter } from './storageAdapter';

export default function AdapterUniapp({ mockRequest }: AdapterUniappOptions = {}) {
	return {
		statesHook: VueHook,
		requestAdapter: mockRequest || requestAdapter,
		storageAdapter
	};
}
