// import { UniNamespace } from '@dcloudio/types/uni-app/uni/legacy/uni';
import VueHook from 'alova/vue';
import requestAdapter from './requestAdapter';
import storageAdapter from './storageAdapter';

export default function AdapterUniapp() {
	return {
		statesHook: VueHook,
		requestAdapter: requestAdapter,
		storageAdapter
	};
}
