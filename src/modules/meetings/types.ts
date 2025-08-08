import { inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "@/trpc/routers/_app";

<<<<<<< HEAD
export type MeetingGetOne = inferRouterOutputs<AppRouter>["meetings"]["getOne"];
export type MeetingGetMany = inferRouterOutputs<AppRouter>["meetings"]["getMany"]["items"];
=======
export type MeetingGetOne = inferRouterOutputs<AppRouter>["meetings"]["getOne"];
>>>>>>> main
