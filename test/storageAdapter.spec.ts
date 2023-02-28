/// <reference path="../node_modules/@dcloudio/types/index.d.ts" />
import { createAlova, invalidateCache, useRequest } from 'alova';
import AdapterUniapp from '../src/index';
import { generateMethodKey, mockStorageContainer, untilCbCalled } from './utils';

const alovaInst = createAlova({
	baseURL: 'http://xxx',
	responsed(data) {
		const { data: subData } = data as UniNamespace.RequestSuccessCallbackResult;
		if (subData) {
			return subData;
		}
		return null;
	},
	...AdapterUniapp()
});
interface ResponseData {
	url: string;
	method: string;
	data: any;
	header: Record<string, any>;
}

// 每个用例运行前清除缓存，避免相互影响
beforeEach(() => invalidateCache());

describe('storage adapter', () => {
	test('set storage', async () => {
		const Get = alovaInst.Get<ResponseData>('/unit-test', {
			localCache: {
				mode: 'placeholder',
				expire: 100 * 1000
			}
		});

		const { onSuccess } = useRequest(Get);
		await untilCbCalled(onSuccess);

		/**
		 * 缓存数据如下：
		 * [{"url":"http://xxx/unit-test","method":"GET","header":{}},1677564705831,null]
		 */
		const storagedData = JSON.parse(mockStorageContainer[`alova.${alovaInst.id}${generateMethodKey(Get)}`] || '{}');
		expect(storagedData[0]?.url).toBe('http://xxx/unit-test');
		expect(storagedData[0]?.method).toBe('GET');
		expect(storagedData[0]?.header).toStrictEqual({});
		expect(storagedData[2]).toBeNull();
	});

	test('remove storage', async () => {
		const Get = alovaInst.Get<ResponseData>('/unit-test', {
			localCache: {
				mode: 'placeholder',
				expire: 100 * 1000
			}
		});

		await Get.send();

		/**
		 * 缓存数据如下：
		 * [{"url":"http://xxx/unit-test","method":"GET","header":{}},1677564705831,null]
		 */
		const getStoragedData = () => mockStorageContainer[`alova.${alovaInst.id}${generateMethodKey(Get)}`];
		expect(!!getStoragedData()).toBeTruthy();

		invalidateCache(Get);
		expect(!!getStoragedData()).toBeFalsy();
	});
});
