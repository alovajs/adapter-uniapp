import { onLoad } from '@dcloudio/uni-app';
import { EffectRequestParams } from 'alova';
import VueHook from 'alova/vue';
import { WatchSource } from 'vue';
import { len } from './helper';

export default {
	...VueHook,
	effectRequest(effectRequestParams: EffectRequestParams<WatchSource>) {
		const handler = effectRequestParams.handler;
		effectRequestParams.handler = (...args: any[]) => {
			// 当没有参数时，表示为立即发送请求，此时延迟10ms让页面中的onLoad先执行
			// 当有参数时，表示通过useWatcher状态改变时发送请求，此时直接调用handler即可
			len(args) > 0
				? handler(...args)
				: onLoad(() => {
						setTimeout(() => handler(...args), 10);
				  });
		};
		return VueHook.effectRequest(effectRequestParams);
	}
};
