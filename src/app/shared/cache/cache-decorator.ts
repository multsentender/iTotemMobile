import { Observable, shareReplay } from "rxjs";


/**
 * Декоратор кэширования запросов
 *
 * @param cacheFactory получение кэша
 */

export function cachedRequests(
	cacheFactory: (this: any) => { [key: string]: Observable<unknown> | undefined}
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
			if(!!observeble) return observeble

			// Создаём ответ
			observeble = origin.apply(this, args).pipe(shareReplay(1));
			storage[key] = observeble

			return observeble as Observable<any>
		}

		return descriptor
	}
}
