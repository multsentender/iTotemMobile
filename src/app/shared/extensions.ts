import { HttpErrorResponse } from "@angular/common/http";
import { mergeMap, Observable, retryWhen, of, filter, throwError, delay } from "rxjs";

export function delayRetryPipe<T> (
	delayMs = 2000,
	maxRetry = 3,
	filterFunc: (error: HttpErrorResponse) => boolean = () => true ) {
	let retries = maxRetry;
	let subErrors: any[] = []

	return (src: Observable<T>) : Observable<T> => {
		return src.pipe(
			retryWhen(errorObservable => errorObservable.pipe(
				filter(error => filterFunc(error)),
				delay(delayMs),
				mergeMap(error => {
					subErrors.push(error)
					return (--retries > 0) ?
						of(error) :
						throwError(error)
				})
			))
		)
	}
}




/**
 * Декоратор для повторных попыток при неудачных запросах
 *
 * @param [delayMs=1000] задержка между повторными попытками
 * @param [maxRetry=3] количество повторных попыток
 * @param [filter=(name: string) => true] фильтрация функций, которые обрабатываются
 * @return функция декоратор. Применяем @delayRetry()
 */
export function delayRetry(
	delayMs = 2000,
	maxRetry = 3,
	filter: (name: string) => boolean = (name: string) => true
){
	return (...args: any[]) =>
	{
		switch (args.length) {
		case 1:
			// Вариант работы с целым классом
			const target: Function = args[0];
			const ds = Object.getOwnPropertyDescriptors(target.prototype);

			for (const propertyName in ds){
				if (!filter(propertyName)) continue;
				const descriptor = ds[propertyName];
				const origin = descriptor.value;

				if (!(origin instanceof Function)) continue;
				descriptor.value = function (...args: any[])
				{
					const result = origin.apply(this, args);
					if (result instanceof Observable)
					return result.pipe(delayRetryPipe(delayMs, maxRetry));
					return result;
				}

				Object.defineProperty(target.prototype, propertyName, descriptor);
			}
			break;
		case 3:
			// Вариант работы с функцией
			const descriptor: PropertyDescriptor = args[2];
			const origin = descriptor.value;
			descriptor.value = function (...args: any[]){
				const result: Observable<any> = origin.apply(this, args);
				return result.pipe(delayRetryPipe(delayMs, maxRetry));
			}
			break;
		}
	};
}
