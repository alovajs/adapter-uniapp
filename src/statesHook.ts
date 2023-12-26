import { onLoad } from '@dcloudio/uni-app';
import { EffectRequestParams } from 'alova';
import VueHook from 'alova/vue';
import { WatchSource } from 'vue';

export default {
	...VueHook,
	effectRequest(effectRequestParams: EffectRequestParams<WatchSource>) {
		const handler = effectRequestParams.handler;
		effectRequestParams.handler = () => {
			// 延迟10ms让页面中的onLoad先执行
			onLoad(() => {
				setTimeout(handler, 10);
			});
		};
		return VueHook.effectRequest(effectRequestParams);
	}
};
