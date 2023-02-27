import { AlovaOptions } from 'alova';
import VueHook from 'alova/vue';
import requestAdapter from './requestAdapter';
import storageAdapter from './storageAdapter';

type UniappAdapterOptions<S, E, RC, RE, RH> = Omit<
	AlovaOptions<S, E, RC, RE, RH>,
	'statesHook' | 'requestAdapter' | 'storageAdapter'
>;
export default function AdapterUniapp<S, E, RC, RE, RH>(adapterOptions: UniappAdapterOptions<S, E, RC, RE, RH>) {
	return {
		...adapterOptions,
		statesHook: VueHook,
		requestAdapter,
		storageAdapter
	};
}
