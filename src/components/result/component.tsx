import { Fragment, isValidElement } from "react";
import type { PropsWithChildren, ReactElement, ReactNode } from "react";

import { Result } from "utils";
import type { Failure, Success, Loading } from "utils";

export type Props<T, U extends Error, V> = PropsWithChildren<{
  result: Loading<V> | Success<T, V> | Failure<U, V>;
  failure?: ((result: Failure<U, V>) => ReactElement) | ReactNode;
  loading?: ((result: Loading<V>) => ReactElement) | ReactNode;
  children: (result: Success<T, V>) => ReactElement;
}>;

export function Component<T, U extends Error, V>({
  result,
  loading,
  failure,
  children,
}: Props<T, U, V>) {
  if (Result.isLoading(result)) {
    if (typeof loading === "function") {
      return loading(result);
    }

    if (isValidElement(loading)) {
      return loading;
    }

    return <Fragment>{loading}</Fragment>;
  }

  if (Result.isFailure(result)) {
    if (typeof failure === "function") {
      return failure(result);
    }

    if (isValidElement(failure)) {
      return failure;
    }

    return <Fragment>{failure || result.error.message}</Fragment>;
  }

  if (Result.isSuccess(result)) {
    return children(result);
  }

  return null;
}
