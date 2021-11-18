export declare type DeepPartial<T> = {
    [P in keyof T]?: unknown extends T[P] ? T[P] : T[P] extends Array<any> ? T[P] : DeepPartial<T[P]>;
};
export declare type FunctionOptions<T, I> = {
    sequence: number;
    associations: Partial<T>;
    transientParams: Partial<I>;
};
export declare type HookFn<T, I> = (object: T, options: FunctionOptions<T, I>) => any;
export declare type OnCreateFn<T, I, C = T> = (object: T, options: FunctionOptions<T, I>) => C | Promise<C>;
export declare type OnBuildFn<T, I> = (options: {
    params: DeepPartial<T>;
    sequence: number;
    associations: Partial<T>;
    transientParams: Partial<I>;
}) => T;
export declare type AfterCreateFn<T, I, C> = (object: C, options: FunctionOptions<T, I>) => C | Promise<C>;
export declare type BuildOptions<T, I> = {
    associations?: Partial<T>;
    transient?: Partial<I>;
};