import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function Admin() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  const updateNewsMutation = trpc.admin.updateNews.useMutation({
    onSuccess: (data) => {
      setStatus("success");
      setMessage(data.message);
    },
    onError: (error) => {
      setStatus("error");
      setMessage(error.message || "Erro ao atualizar notícias");
    },
  });

  const handleUpdateNews = async () => {
    setStatus("loading");
    setMessage("");
    await updateNewsMutation.mutateAsync();
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Painel de Administração
        </h1>
        <p className="text-muted-foreground mb-8">
          Ferramentas de gerenciamento do portal de notícias
        </p>

        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Atualizar Notícias
          </h2>
          <p className="text-muted-foreground mb-6">
            Clique no botão abaixo para buscar e atualizar notícias de todas as
            categorias via NewsAPI. Este processo pode levar alguns minutos.
          </p>

          <div className="space-y-4">
            <Button
              onClick={handleUpdateNews}
              disabled={status === "loading"}
              className="w-full gap-2"
              size="lg"
            >
              {status === "loading" && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              {status === "loading"
                ? "Atualizando notícias..."
                : "Atualizar Notícias Agora"}
            </Button>

            {status === "success" && (
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">{message}</p>
                  <p className="text-sm text-green-700">
                    Recarregue a página para ver as novas notícias
                  </p>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-900">{message}</p>
                  <p className="text-sm text-red-700">
                    Verifique os logs do servidor para mais detalhes
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-2">ℹ️ Informações</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>
              • O job automático de atualização é executado a cada 30 minutos
            </li>
            <li>• Use este botão para forçar uma atualização imediata</li>
            <li>
              • Notícias duplicadas são automaticamente ignoradas pelo sistema
            </li>
            <li>• Cada notícia é reescrita com IA para maior engajamento</li>
          </ul>
        </div>

        <div className="mt-8">
          <a
            href="/"
            className="text-primary hover:underline font-medium flex items-center gap-2"
          >
            ← Voltar para o portal
          </a>
        </div>
      </div>
    </div>
  );
}
