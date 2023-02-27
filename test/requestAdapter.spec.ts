import { createAlova, useRequest } from 'alova';
import AdapterUniapp from '../src/index';

describe('request adapter', () => {
	test('response with plain body data', async () => {
		const options = AdapterUniapp({
			baseURL: 'http://xxx',
			beforeRequest(method) {
				// method.config.;
			},
			responsed(data) {
				data;
			}
		});
		const alovaInst = createAlova(options);
		const detailPost = alovaInst.Post<{ id: number }>(
			'/detail',
			{},
			{
				enableHttp2
			}
		);
		const { loading, data, onSuccess } = useRequest(detailPost);
	});
});
