import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { updateAllNews } from "../services/articleManager";

export const adminRouter = router({
  /**
   * Executar atualização manual de notícias
   * Endpoint público para testes (em produção, adicionar autenticação)
   */
  updateNews: publicProcedure.mutation(async () => {
    try {
      console.log("[Admin] Iniciando atualização manual de notícias...");
      await updateAllNews();
      console.log("[Admin] ✅ Atualização de notícias concluída com sucesso!");
      return {
        success: true,
        message: "Notícias atualizadas com sucesso!",
      };
    } catch (error) {
      console.error("[Admin] ❌ Erro ao atualizar notícias:", error);
      return {
        success: false,
        message: "Erro ao atualizar notícias",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      };
    }
  }),
});
