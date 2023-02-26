import { createAlova } from 'alova';
import VueHook from 'alova/vue';
import createAlovaMockAdapter from '../src/createAlovaMockAdapter';
import defineMock from '../src/defineMock';

describe('mock request', () => {
	test('response with plain body data', async () => {
		const mocks = defineMock({
			'[POST]/detail': () => {
				return {
					id: 1
				};
			}
		});

		// 模拟数据请求适配器
		const mockRequestAdapter = createAlovaMockAdapter([mocks], {
			delay: 10,
			onMockResponse: ({ status, statusText, body }) => {
				if (status >= 300) {
					const err = new Error(statusText);
					err.name = status.toString();
					throw err;
				}
				return body;
			},
			mockRequestLogger: false
		});

		const alovaInst = createAlova({
			baseURL: 'http://xxx',
			statesHook: VueHook,
			requestAdapter: mockRequestAdapter
		});
		const payload = await alovaInst.Post('/detail').send();
		expect(payload).toStrictEqual({ id: 1 });
	});

	test('should receive all request data', async () => {
		const mocks = defineMock({
			'[POST]/detail': () => {
				return {
					id: 1
				};
			}
		});

		const mockFn = jest.fn();
		// 模拟数据请求适配器
		const mockRequestAdapter = createAlovaMockAdapter([mocks], {
			delay: 10,
			onMockResponse: responseData => responseData.body,
			mockRequestLogger: (
				isMock: boolean,
				url: string,
				method: string,
				requestHeaders: any,
				queryStringParams: any,
				requestBody?: any,
				response?: any
			) => {
				mockFn();
				expect(isMock).toBeTruthy();
				expect(url).toBe('http://xxx/detail?aa=1&bb=2');
				expect(method).toBe('POST');
				expect(requestHeaders).toStrictEqual({
					customHeader: 1
				});
				expect(queryStringParams).toStrictEqual({
					aa: '1',
					bb: '2'
				});
				expect(requestBody).toStrictEqual({});
				expect(response).toStrictEqual({
					id: 1
				});
			}
		});

		const alovaInst = createAlova({
			baseURL: 'http://xxx',
			statesHook: VueHook,
			requestAdapter: mockRequestAdapter
		});
		const payload = await alovaInst
			.Post(
				'/detail?aa=1&bb=2',
				{},
				{
					headers: {
						customHeader: 1
					}
				}
			)
			.send();
		expect(payload).toStrictEqual({ id: 1 });
		expect(mockFn).toBeCalled();
	});

	test('response with status and statusText', async () => {
		const mocks = defineMock({
			'[POST]/detail': () => {
				return {
					status: 403,
					statusText: 'customer error'
				};
			}
		});

		// 模拟数据请求适配器
		const mockRequestAdapter = createAlovaMockAdapter([mocks], {
			delay: 10,
			onMockResponse: ({ status, statusText, body }) => {
				if (status >= 300) {
					const err = new Error(statusText);
					err.name = status.toString();
					throw err;
				}
				return body;
			},
			mockRequestLogger: false
		});

		const alovaInst = createAlova({
			baseURL: 'http://xxx',
			statesHook: VueHook,
			requestAdapter: mockRequestAdapter
		});

		const mockFn = jest.fn();
		try {
			await alovaInst.Post('/detail').send();
		} catch (err: any) {
			mockFn();
			expect(err.name).toBe('403');
			expect(err.message).toBe('customer error');
		}
		expect(mockFn).toBeCalledTimes(1);
	});
});
