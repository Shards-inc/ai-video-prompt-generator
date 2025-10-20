import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Prompt templates router
  templates: router({
    list: publicProcedure.query(async () => {
      const { getPromptTemplates } = await import("./db");
      return getPromptTemplates();
    }),
    getById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
      const { getPromptTemplateById } = await import("./db");
      return getPromptTemplateById(input.id);
    }),
  }),

  // Generated prompts router
  prompts: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const { getUserPrompts } = await import("./db");
      return getUserPrompts(ctx.user.id);
    }),
    create: protectedProcedure
      .input(
        z.object({
          title: z.string(),
          topic: z.string(),
          category: z.string().optional(),
          youtubePrompt: z.string(),
          tiktokPrompt: z.string(),
          templateId: z.string().optional(),
          customizations: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { createGeneratedPrompt } = await import("./db");
        const id = `prompt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await createGeneratedPrompt({
          id,
          userId: ctx.user.id,
          ...input,
        });
        return { id };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const { deleteGeneratedPrompt } = await import("./db");
        await deleteGeneratedPrompt(input.id, ctx.user.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
