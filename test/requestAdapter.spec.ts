import { createAlova, useRequest } from 'alova';
import AdapterUniapp from '../src/index';

describe('request adapter', () => {
	test('response with plain body data', async () => {
		const alovaInst = createAlova({
			baseURL: 'http://xxx',
			...AdapterUniapp(),
			beforeRequest(method) {
				method.config.;
			},
			responsed(data, m) {
				data
			}
		});
		const detailPost = alovaInst.Post<{ id: number }>('/detail', {}, {});
		const { loading, data, onSuccess } = useRequest(detailPost);
	});
});
