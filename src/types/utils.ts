export type PropsWithoutFunctions<T extends object> = {
	[K in keyof T]: T[K] extends Function ? never : T[K];
};

export type KeysWithoutFunctions<T extends object> = {
	[K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
