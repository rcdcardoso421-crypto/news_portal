# Portal de Notícias Automatizado - TODO

## Fase 1: Setup e Configuração
- [x] Configurar secrets: NewsAPI key, OpenAI API key
- [x] Criar schema de banco de dados (notícias, categorias, leitura, recomendações)
- [x] Implementar migrations SQL

## Fase 2: Backend - Integração de APIs
- [x] Implementar busca de notícias via NewsAPI (por categoria)
- [x] Criar sistema de reescrita de títulos com IA
- [x] Criar sistema de reescrita de conteúdo com IA
- [x] Implementar cache de notícias para performance
- [x] Criar job de atualização automática de notícias (intervalo configurável)
- [x] Implementar endpoints tRPC para listar notícias por categoria
- [x] Implementar endpoint para obter notícia individual com conteúdo reescrito
- [x] Implementar sistema de trending (mais lidas)
- [x] Implementar sistema de recomendações (baseado em categoria)

## Fase 3: Frontend - Componentes Principais
- [x] Criar Header com logo, navegação por categorias e busca
- [x] Criar Carrossel de notícias em destaque
- [x] Criar Grid de notícias com cards responsivos
- [x] Criar componente de Categorias
- [x] Criar seção "Trending Agora" (mais lidas)
- [x] Criar seção "Mais Lidas"
- [x] Implementar lazy loading de imagens
- [x] Criar Footer com links e informações

## Fase 4: Página de Artigo
- [x] Criar layout de página de artigo
- [x] Exibir título otimizado por IA
- [x] Exibir imagem destacada
- [x] Exibir conteúdo reescrito
- [x] Calcular e exibir tempo de leitura
- [x] Implementar botões de compartilhamento (Twitter, Facebook, WhatsApp, LinkedIn)
- [x] Criar seção "Você também pode gostar" com recomendações
- [x] Implementar breadcrumb de navegação

## Fase 5: SEO e Performance
- [x] Implementar meta tags dinâmicas (title, description, og:image, etc)
- [x] Implementar schema.org markup (NewsArticle, BreadcrumbList)
- [ ] Criar sitemap.xml dinâmico
- [ ] Criar robots.txt otimizado
- [ ] Implementar canonical URLs
- [x] Otimizar imagens (compressão, formatos modernos com lazy loading)
- [x] Implementar code splitting e lazy loading de componentes
- [ ] Validar performance (< 2s)

## Fase 6: Monetização
- [x] Adicionar espaço para Google AdSense no header
- [x] Adicionar espaço para Google AdSense no meio do conteúdo
- [x] Adicionar espaço para Google AdSense no sidebar/recomendações
- [x] Garantir que anúncios não prejudiquem experiência de leitura

## Fase 7: Design e UX
- [x] Aplicar design profissional inspirado em CNN Brasil e G1
- [x] Garantir responsividade em mobile, tablet e desktop
- [ ] Implementar tema claro/escuro (opcional)
- [x] Adicionar animações e transições suaves
- [ ] Testar acessibilidade (WCAG)

## Fase 8: Testes e Entrega
- [ ] Testar busca de notícias
- [ ] Testar reescrita de conteúdo
- [ ] Testar navegação entre páginas
- [ ] Testar compartilhamento em redes sociais
- [ ] Testar performance (< 2s)
- [ ] Testar SEO (meta tags, schema.org)
- [ ] Testar responsividade
- [ ] Corrigir bugs e ajustes finais


## Bugs Encontrados
- [x] Rota /categoria/:slug retornando 404 - criar página de categoria
