import { useMatch } from './useMatch'
import type { ThrowConstraint } from './useMatch'
import type { Accessor } from 'solid-js'
import type { AllParams, RouteById } from './routeInfo'
import type { AnyRouter, RegisteredRouter } from './router'
import type { StrictOrFrom } from './utils'
import type { Expand, ThrowOrOptional } from '@tanstack/router-core'

export interface UseParamsBaseOptions<
  TRouter extends AnyRouter,
  TFrom,
  TStrict extends boolean,
  TThrow extends boolean,
  TSelected,
> {
  select?: (params: ResolveParams<TRouter, TFrom, TStrict>) => TSelected
  shouldThrow?: TThrow
}

export type UseParamsOptions<
  TRouter extends AnyRouter,
  TFrom extends string | undefined,
  TStrict extends boolean,
  TThrow extends boolean,
  TSelected,
> = StrictOrFrom<TRouter, TFrom, TStrict> &
  UseParamsBaseOptions<TRouter, TFrom, TStrict, TThrow, TSelected>
export type ResolveParams<
  TRouter extends AnyRouter,
  TFrom,
  TStrict extends boolean,
> = TStrict extends false
  ? AllParams<TRouter['routeTree']>
  : Expand<RouteById<TRouter['routeTree'], TFrom>['types']['allParams']>

export type UseParamsResult<
  TRouter extends AnyRouter,
  TFrom,
  TStrict extends boolean,
  TSelected,
> = unknown extends TSelected
  ? ResolveParams<TRouter, TFrom, TStrict>
  : TSelected

export type UseParamsRoute<out TFrom> = <
  TRouter extends AnyRouter = RegisteredRouter,
  TSelected = unknown,
>(
  opts?: UseParamsBaseOptions<
    TRouter,
    TFrom,
    /* TStrict */ true,
    /* TThrow */ true,
    TSelected
  >,
) => Accessor<UseParamsResult<TRouter, TFrom, true, TSelected>>

export function useParams<
  TRouter extends AnyRouter = RegisteredRouter,
  const TFrom extends string | undefined = undefined,
  TStrict extends boolean = true,
  TThrow extends boolean = true,
  TSelected = unknown,
>(
  opts: UseParamsOptions<
    TRouter,
    TFrom,
    TStrict,
    ThrowConstraint<TStrict, TThrow>,
    TSelected
  >,
): Accessor<
  ThrowOrOptional<UseParamsResult<TRouter, TFrom, TStrict, TSelected>, TThrow>
> {
  return useMatch({
    from: opts.from!,
    strict: opts.strict,
    shouldThrow: opts.shouldThrow,
    select: (match: any) => {
      return opts.select ? opts.select(match.params) : match.params
    },
  } as any) as any
}
