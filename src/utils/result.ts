import type { Loading, Success, Failure } from "./types";

export class Result<
  V = undefined,
  E extends Error | undefined = undefined,
  M = undefined
> {
  protected constructor(public value?: V, public error?: E, public meta?: M) {}

  public static loading(): Loading;
  public static loading<M>(meta: M): Loading<M>;
  public static loading<M>(meta?: M): Loading<M | undefined> {
    return new LoadingResult(meta);
  }

  public static success(): Success;
  public static success<V>(value: V): Success<V>;
  public static success<V, M>(value: V, meta: M): Success<V, M>;
  public static success<V = undefined, M = undefined>(
    value?: V,
    meta?: M
  ): Success<V | undefined, M | undefined> {
    return new SuccessResult(value, meta);
  }

  public static failure(): Failure;
  public static failure<E extends Error>(error: E): Failure<E>;
  public static failure<E extends Error, M>(error: E, meta: M): Failure<E,M>;
  public static failure<E extends Error, M>(
    error?: E,
    meta?: M
  ): Failure<E | undefined, M | undefined> {
    return new FailureResult(error, meta);
  }

  public static isLoading<V, E extends Error, M>(
    result: Loading<M> | Success<V, M> | Failure<E, M>
  ): result is Loading<M> {
    return result instanceof LoadingResult;
  }

  public static isSuccess<V, E extends Error, M>(
    result: Loading<M> | Success<V, M> | Failure<E, M>
  ): result is Success<V, M> {
    return result instanceof SuccessResult;
  }

  public static isFailure<V, E extends Error, M>(
    result: Loading<M> | Success<V, M> | Failure<E, M>
  ): result is Failure<E, M> {
    return result instanceof FailureResult;
  }
}

class LoadingResult<M>
  extends Result<undefined, undefined, M>
  implements Loading<M>
{
  constructor(public meta: M) {
    super(undefined, undefined, meta);
  }
}

class SuccessResult<V, M>
  extends Result<V, undefined, M>
  implements Success<V, M>
{
  constructor(public value: V, public meta: M) {
    super(value, undefined, meta);
  }
}

class FailureResult<E extends Error | undefined, M>
  extends Result<undefined, E, M>
  implements Failure<E, M>
{
  constructor(public error: E, public meta: M) {
    super(undefined, error, meta);
  }
}
