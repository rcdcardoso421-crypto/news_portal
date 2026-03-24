import { updateAllNews } from "../services/articleManager.ts";

console.log("[Seed News] Iniciando população de notícias...");

try {
  await updateAllNews();
  console.log("[Seed News] ✅ Notícias populadas com sucesso!");
  process.exit(0);
} catch (error) {
  console.error("[Seed News] ❌ Erro ao popular notícias:", error);
  process.exit(1);
}
