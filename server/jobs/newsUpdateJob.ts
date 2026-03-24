import { updateAllNews } from "../services/articleManager";

/**
 * Job para atualizar notícias automaticamente
 * Executado em intervalos regulares
 */
export async function startNewsUpdateJob(intervalMinutes = 30): Promise<void> {
  // Executar atualização imediatamente ao iniciar
  console.log("[News Update Job] Iniciando atualização de notícias...");
  try {
    await updateAllNews();
    console.log("[News Update Job] Atualização de notícias concluída com sucesso");
  } catch (error) {
    console.error("[News Update Job] Erro ao atualizar notícias:", error);
  }

  // Agendar atualização periódica
  const intervalMs = intervalMinutes * 60 * 1000;
  setInterval(async () => {
    console.log("[News Update Job] Iniciando atualização periódica de notícias...");
    try {
      await updateAllNews();
      console.log(
        "[News Update Job] Atualização periódica de notícias concluída"
      );
    } catch (error) {
      console.error("[News Update Job] Erro na atualização periódica:", error);
    }
  }, intervalMs);

  console.log(
    `[News Update Job] Job agendado para executar a cada ${intervalMinutes} minutos`
  );
}
