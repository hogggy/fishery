import { merge, mergeCustomizer } from './merge';
import toInteger from 'lodash.tointeger';
import {
  AfterCreateFn,
  BuildOptions,
  DeepPartial,
  FunctionOptions,
  HookFn,
  OnBuildFn,
  OnCreateFn,
} from './types';

const SEQUENCE_START_VALUE = 1;

export class Factory<T, I = any, C = T> {
  // id is an object so it is shared between extended factories
  private id: { value: number } = { value: SEQUENCE_START_VALUE };
  private _afterBuilds: HookFn<T, I>[] = [];
  private _afterCreates: AfterCreateFn<T, I, C>[] = [];
  private _associations: Partial<T> = {};
  private _params: DeepPartial<T> = {};
  private _transient: Partial<I> = {};

  constructor(
    private _build: OnBuildFn<T, I>,
    private _onCreate?: OnCreateFn<T, I, C>,
    afterBuild?: HookFn<T, I>,
    afterCreate?: AfterCreateFn<T, I, C>,
  ) {
    if (afterBuild) {
      this._afterBuilds.push(afterBuild);
    }
    if (afterCreate) {
      this._afterCreates.push(afterCreate);
    }
  }

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
  static define<T, I = any, C = T, F = Factory<T, I, C>>(
    this: new (
      build: OnBuildFn<T, I>,
      onCreate?: OnCreateFn<T, I, C>,
      afterBuild?: HookFn<T, I>,
      afterCreate?: AfterCreateFn<T, I, C>,
    ) => F,
    {
      build,
      onCreate,
      afterBuild,
      afterCreate,
    }: {
      build: OnBuildFn<T, I>;
      onCreate?: OnCreateFn<T, I, C>;
      afterBuild?: HookFn<T, I>;
      afterCreate?: AfterCreateFn<T, I, C>;
    },
  ): F {
    return new this(build, onCreate, afterBuild, afterCreate);
  }

  private _getOptionsFromBuildOptions(buildOptions: BuildOptions<T, I> = {}) {
    const { transient = {}, associations = {} } = buildOptions;
    const options: FunctionOptions<T, I> = {
      sequence: this.sequence(),
      associations: merge(this._associations, associations, mergeCustomizer),
      transientParams: merge(this._transient, transient, mergeCustomizer),
    };
    return options;
  }

  /**
   * Build an object using your factory
   * @param params
   * @param buildOptions
   */
  build(params?: DeepPartial<T>, buildOptions: BuildOptions<T, I> = {}): T {
    const options = this._getOptionsFromBuildOptions(buildOptions);
    const mergedParams = merge(params, this._params, mergeCustomizer);
    const built = this._build({ params: mergedParams, ...options });
    const merged = merge(
      built,
      mergedParams,
      buildOptions.associations,
      mergeCustomizer,
    );
    this._afterBuilds.forEach(afterBuild => {
      if (typeof afterBuild === 'function') {
        afterBuild(merged, options);
      } else {
        throw new Error('"afterBuild" must be a function');
      }
    });
    return merged;
  }

  buildList(
    number: number,
    params: DeepPartial<T> = {},
    buildOptions: BuildOptions<T, I> = {},
  ): T[] {
    let list: T[] = [];
    for (let i = 0; i < number; i++) {
      list.push(this.build(params, buildOptions));
    }

    return list;
  }

  /**
   * Asynchronously create an object using your factory.
   * @param params
   * @param buildOptions
   */
  async create(
    params: DeepPartial<T> = {},
    buildOptions: BuildOptions<T, I> = {},
  ): Promise<C> {
    const options = this._getOptionsFromBuildOptions(buildOptions);
    const built = this.build(params, options);
    if (!this._onCreate) {
      throw new Error('Attempted to call `create`, but no onCreate defined');
    }
    const created = await this._onCreate(built, options);
    await Promise.all(
      this._afterCreates.map(async afterCreate => {
        if (typeof afterCreate === 'function') {
          await afterCreate(created, options);
        } else {
          throw new Error('"afterBuild" must be a function');
        }
      }),
    );
    return created;
  }

  async createList(
    number: number,
    params: DeepPartial<T> = {},
    buildOptions: BuildOptions<T, I> = {},
  ): Promise<C[]> {
    const options = this._getOptionsFromBuildOptions(buildOptions);
    let list: Promise<C>[] = [];
    for (let i = 0; i < number; i++) {
      list.push(this.create(params, options));
    }

    return Promise.all(list);
  }

  /**
   * Extend the factory by adding a function to be called after an object is built.
   * @param afterBuildFn - the function to call. It accepts your object of type T. The value this function returns gets returned from "build"
   * @returns a new factory
   */
  afterBuild(afterBuildFn: HookFn<T, I>): this {
    const factory = this.clone();
    factory._afterBuilds.push(afterBuildFn);
    return factory;
  }

  /**
   * Define a transform that occurs when `create` is called on the factory. Specifying an `onCreate` overrides any previous `onCreate`s.
   * To return a different type from `build`, specify a third type argument when defining the factory.
   * @param onCreateFn - The function to call. IT accepts your object of type T.
   * The value this function returns gets returned from "create" after any
   * `afterCreate`s are run
   * @return a new factory
   */
  onCreate(onCreateFn: OnCreateFn<T, I, C>): this {
    const factory = this.clone();
    factory._onCreate = onCreateFn;
    return factory;
  }

  /**
   * Extend the factory by adding a function to be called after creation. This is called after `onCreate` but before the object is returned from `create`.
   * If multiple are defined, they are chained.
   * @param afterCreateFn
   * @return a new factory
   */
  afterCreate(afterCreateFn: AfterCreateFn<T, I, C>): this {
    const factory = this.clone();
    factory._afterCreates.push(afterCreateFn);
    return factory;
  }

  /**
   * Extend the factory by adding default associations to be passed to the factory when "build" is called
   * @param associations
   * @returns a new factory
   */
  associations(associations: Partial<T>): this {
    const factory = this.clone();
    factory._associations = { ...this._associations, ...associations };
    return factory;
  }

  /**
   * Extend the factory by adding default parameters to be passed to the factory when "build" is called
   * @param params
   * @returns a new factory
   */
  params(params: DeepPartial<T>): this {
    const factory = this.clone();
    factory._params = merge({}, this._params, params, mergeCustomizer);
    return factory;
  }

  /**
   * Extend the factory by adding default transient parameters to be passed to the factory when "build" is called
   * @param transient - transient params
   * @returns a new factory
   */
  transient(transient: Partial<I>): this {
    const factory = this.clone();
    factory._transient = { ...this._transient, ...transient };
    return factory;
  }

  /**
   * Sets sequence back to its default value
   */
  rewindSequence() {
    this.id.value = SEQUENCE_START_VALUE;
  }

  protected clone<F extends Factory<T, I, C>>(this: F): F {
    const copy = new (this.constructor as {
      new (
        build: OnBuildFn<T, I>,
        onCreate?: OnCreateFn<T, I, C>,
        afterBuild?: HookFn<T, I>,
        afterCreate?: AfterCreateFn<T, I, C>,
      ): F;
    })(this._build, this._onCreate);
    Object.assign(copy, this);
    copy._afterCreates = [...this._afterCreates];
    copy._afterBuilds = [...this._afterBuilds];

    return copy;
  }

  protected sequence() {
    return this.id.value++;
  }
}
