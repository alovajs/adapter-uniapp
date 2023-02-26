import { AlovaRequestAdapter } from 'alova';

interface MockRequestLoggerAdapter {
	(
		isMock: boolean,
		url: string,
		method: string,
		requestHeaders: Record<string, any>,
		queryStringParams: Record<string, any>,
		requestBody?: any,
		response?: any
	): void;
}
interface MockResponse {
	status?: number;
	statusText?: string;
	body?: any;
}
interface MockRequestInit<R, T, RC, RE, RH> {
	enable?: boolean;
	delay?: number;
	httpAdapter?: AlovaRequestAdapter<R, T, RC, RE, RH>;
	mockRequestLogger?: boolean | MockRequestLoggerAdapter; // 是否打印模拟请求信息，便于调试
	onMockResponse?: (response: Required<MockResponse>) => RE;
}

interface MockServerRequest {
	query: Record<string, string>;
	params: Record<string, string>;
	data: Record<string, string>;
}
type MockFunction = (request: MockServerRequest) => any;
type Mock = Record<string, MockFunction | string | number | Record<string, any> | any[]>;

interface MockWrapper {
	enable: boolean;
	data: Mock;
}

export declare function createAlovaMockAdapter<RC, RE, RH>(
	mockWrapper: MockWrapper[],
	options?: MockRequestInit<any, any, RC, RE, RH>
): AlovaRequestAdapter<any, any, RC, RE, RH>;
export declare function defineMock(mock: Mock, enable?: boolean): MockWrapper;
