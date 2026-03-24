import { fetchNewsByCategory } from "../services/newsApi.ts";

console.log("[Debug] Testando fetchNewsByCategory...");

async function test() {
  try {
    const articles = await fetchNewsByCategory("technology", 5);
    console.log(`[Debug] Fetched ${articles.length} articles`);
    
    if (articles.length > 0) {
      console.log("[Debug] First article:", JSON.stringify(articles[0], null, 2));
    } else {
      console.log("[Debug] ❌ No articles returned!");
    }
  } catch (error) {
    console.error("[Debug] Error:", error);
  }
}

test();
