import { AfterCreateFn, BuildOptions, DeepPartial, HookFn, OnBuildFn, OnCreateFn } from './types';
export declare class Factory<T, I = any, C = T> {
    private _build;
    private _onCreate?;
    private id;
    private _afterBuilds;
    private _afterCreates;
    private _associations;
    private _params;
    private _transient;
    constructor(_build: OnBuildFn<T, I>, _onCreate?: OnCreateFn<T, I, C> | undefined, afterBuild?: HookFn<T, I>, afterCreate?: AfterCreateFn<T, I, C>);
    /**
     * Define a factory.
     * @template T The object the factory builds
     * @template I The transient parameters that your factory supports
     * @template C The class of the factory object being created.
     * @param build - your factory build function
     * @param onCreate - (optional) your async factory create function
     * @param afterBuild - (optional) runs after build
     * @param afterCreate - (optional) runs after create
     */
    static define<T, I = any, C = T, F = Factory<T, I, C>>(this: new (build: OnBuildFn<T, I>, onCreate?: OnCreateFn<T, I, C>, afterBuild?: HookFn<T, I>, afterCreate?: AfterCreateFn<T, I, C>) => F, { build, onCreate, afterBuild, afterCreate, }: {
        build: OnBuildFn<T, I>;
        onCreate?: OnCreateFn<T, I, C>;
        afterBuild?: HookFn<T, I>;
        afterCreate?: AfterCreateFn<T, I, C>;
    }): F;
    private _getOptionsFromBuildOptions;
    /**
     * Build an object using your factory
     * @param params
     * @param buildOptions
     */
    build(params?: DeepPartial<T>, buildOptions?: BuildOptions<T, I>): T;
    buildList(number: number, params?: DeepPartial<T>, buildOptions?: BuildOptions<T, I>): T[];
    /**
     * Asynchronously create an object using your factory.
     * @param params
     * @param buildOptions
     */
    create(params?: DeepPartial<T>, buildOptions?: BuildOptions<T, I>): Promise<C>;
    createList(number: number, params?: DeepPartial<T>, buildOptions?: BuildOptions<T, I>): Promise<C[]>;
    /**
     * Extend the factory by adding a function to be called after an object is built.
     * @param afterBuildFn - the function to call. It accepts your object of type T. The value this function returns gets returned from "build"
     * @returns a new factory
     */
    afterBuild(afterBuildFn: HookFn<T, I>): this;
    /**
     * Define a transform that occurs when `create` is called on the factory. Specifying an `onCreate` overrides any previous `onCreate`s.
     * To return a different type from `build`, specify a third type argument when defining the factory.
     * @param onCreateFn - The function to call. IT accepts your object of type T.
     * The value this function returns gets returned from "create" after any
     * `afterCreate`s are run
     * @return a new factory
     */
    onCreate(onCreateFn: OnCreateFn<T, I, C>): this;
    /**
     * Extend the factory by adding a function to be called after creation. This is called after `onCreate` but before the object is returned from `create`.
     * If multiple are defined, they are chained.
     * @param afterCreateFn
     * @return a new factory
     */
    afterCreate(afterCreateFn: AfterCreateFn<T, I, C>): this;
    /**
     * Extend the factory by adding default associations to be passed to the factory when "build" is called
     * @param associations
     * @returns a new factory
     */
    associations(associations: Partial<T>): this;
    /**
     * Extend the factory by adding default parameters to be passed to the factory when "build" is called
     * @param params
     * @returns a new factory
     */
    params(params: DeepPartial<T>): this;
    /**
     * Extend the factory by adding default transient parameters to be passed to the factory when "build" is called
     * @param transient - transient params
     * @returns a new factory
     */
    transient(transient: Partial<I>): this;
    /**
     * Sets sequence back to its default value
     */
    rewindSequence(): void;
    protected clone<F extends Factory<T, I, C>>(this: F): F;
    protected sequence(): number;
}
