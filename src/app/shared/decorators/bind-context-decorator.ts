export function bindContext<T extends Function>
	(target: any, method: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void {
		if(typeof descriptor.value !== 'function') {
			throw new TypeError(`${method} is not a method!`);
		}

		return {
			configurable: true,
			get(this: T): T {
				const bound: T = descriptor.value!.bind(this);
				Object.defineProperty(this, method, {
					value: bound,
					configurable: true,
					writable: true
				});
            return bound;
        }
	}
}
