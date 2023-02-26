import { AlovaGlobalStorage } from 'alova';

export default {
	get(key) {
		return uni.getStorageSync(key);
	},
	set(key, value) {
		uni.setStorageSync(key, JSON.stringify(value));
	},
	remove(key) {
		uni.removeStorageSync(key);
	}
} as AlovaGlobalStorage;
