import { AlovaOptions } from 'alova';
import VueHook from 'alova/vue';
import requestAdapter from './requestAdapter';
import storageAdapter from './storageAdapter';

type UniappAdapterOptions<R, T, RC, RE, RH> = Omit<
	AlovaOptions<R, T, RC, RE, RH>,
	'statesHook' | 'requestAdapter' | 'storageAdapter'
>;
export default function AdapterUniapp<RC, RE, RH>(adapterOptions: UniappAdapterOptions<any, any, RC, RE, RH>) {
	return {
		...adapterOptions,
		statesHook: VueHook,
		requestAdapter,
		storageAdapter
	} as AlovaOptions<any, any, RC, RE, RH>;
}
