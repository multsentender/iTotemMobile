import { Observable, shareReplay } from "rxjs";
import { TimestampObservableCache } from "./timestamp-observable-cache.model";

/**
 * Декоратор кэширования запросов
 *
 * @param cacheFactory получение кэша
 */

export function cachedRequests(
	cacheFactory: (this: any) => { [key: string]: TimestampObservableCache/*Observable<unknown>*/ | undefined},
	expireTime?: number//in ms
) {
	return (target: any, method: string,  descriptor: PropertyDescriptor) : PropertyDescriptor => {

		// Получаем оригинальную функцию
		const origin = descriptor.value;
		// Генерируем префикс кеша
		const prefix = `${target.constructor.name}_${method}`;

		// Заменяем оригинальную функцию на функцию с кэшем
		descriptor.value = function(...args: any[]): Observable<any> {
			// Объект кэша
			const storage = cacheFactory.call(this)
			// Ключ кэша
			const key = `${prefix}+${JSON.stringify(args)}`
			// поиск кэшированного ответа
			let observeble = storage[key]

			if (!!observeble?.observable && (!observeble.expires || observeble?.expires === 0 || (!!observeble?.expires && observeble.expires > Date.now())))
			return observeble?.observable

			// Создаём ответ
			observeble = {
				observable: origin.apply(this, args).pipe(shareReplay(1)),
				expires: expireTime ?? Date.now() + expireTime!
			} as TimestampObservableCache
			storage[key] = observeble

			return observeble.observable //as Observable<any>
		}

		return descriptor
	}
}
