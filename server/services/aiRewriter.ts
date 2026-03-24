import { invokeLLM } from "../_core/llm";

/**
 * Reescrever título para ser mais atrativo e envolvente
 */
export async function rewriteTitle(originalTitle: string): Promise<string> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `Você é um especialista em jornalismo e copywriting. Sua tarefa é reescrever títulos de notícias para serem mais atraentes, envolventes e impactantes, mantendo a precisão factual. 
          
Regras:
- O título deve ser curto (máximo 80 caracteres)
- Deve despertar curiosidade e interesse
- Deve usar linguagem simples e impactante
- Pode usar números, perguntas ou afirmações fortes
- Deve ser diferente do título original, mas manter o mesmo tema
- Responda APENAS com o novo título, sem explicações`,
        },
        {
          role: "user",
          content: `Reescreva este título de forma mais atrativa:\n\n"${originalTitle}"`,
        },
      ],
    });

    const content = response.choices[0]?.message.content || originalTitle;
    return typeof content === "string" ? content.trim() : originalTitle;
  } catch (error) {
    console.error("Error rewriting title:", error);
    return originalTitle;
  }
}

/**
 * Reescrever descrição/conteúdo para ser mais envolvente
 */
export async function rewriteContent(
  originalContent: string,
  maxLength = 500
): Promise<string> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `Você é um especialista em jornalismo. Sua tarefa é reescrever conteúdo de notícias para ser mais claro, envolvente e impactante.

Regras:
- Mantenha a precisão factual
- Use linguagem simples e acessível
- Estruture em parágrafos curtos
- Destaque os pontos mais importantes no início
- Use exemplos práticos quando possível
- Torne o conteúdo mais pessoal e relevante para o leitor
- Máximo de ${maxLength} caracteres
- Responda APENAS com o conteúdo reescrito, sem explicações`,
        },
        {
          role: "user",
          content: `Reescreva este conteúdo de forma mais envolvente:\n\n"${originalContent}"`,
        },
      ],
    });

    const content = response.choices[0]?.message.content || originalContent;
    return typeof content === "string" ? content.trim() : originalContent;
  } catch (error) {
    console.error("Error rewriting content:", error);
    return originalContent;
  }
}

/**
 * Gerar resumo de notícia para descrição
 */
export async function generateSummary(
  content: string,
  maxLength = 200
): Promise<string> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `Você é um especialista em resumir notícias. Crie um resumo conciso e impactante que capture o essencial.

Regras:
- Máximo de ${maxLength} caracteres
- Deve ser claro e direto
- Deve despertar interesse
- Responda APENAS com o resumo, sem explicações`,
        },
        {
          role: "user",
          content: `Resuma esta notícia:\n\n"${content}"`,
        },
      ],
    });

    const summary = response.choices[0]?.message.content || content;
    return typeof summary === "string" ? summary.trim() : content;
  } catch (error) {
    console.error("Error generating summary:", error);
    return content;
  }
}

/**
 * Estimar tempo de leitura em minutos
 */
export function estimateReadingTime(content: string): number {
  // Média de 200 palavras por minuto
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / 200);
  return Math.max(1, minutes);
}
