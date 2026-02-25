/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth_config from "../auth/config.js";
import type * as games_mutations from "../games/mutations.js";
import type * as games_queries from "../games/queries.js";
import type * as players_mutations from "../players/mutations.js";
import type * as players_queries from "../players/queries.js";
import type * as rooms_mutations from "../rooms/mutations.js";
import type * as rooms_queries from "../rooms/queries.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "auth/config": typeof auth_config;
  "games/mutations": typeof games_mutations;
  "games/queries": typeof games_queries;
  "players/mutations": typeof players_mutations;
  "players/queries": typeof players_queries;
  "rooms/mutations": typeof rooms_mutations;
  "rooms/queries": typeof rooms_queries;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
