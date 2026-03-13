# Configuração do Webhook da Hotmart

Para integrar a Hotmart com o sistema e automatizar a liberação de planos, siga as instruções abaixo:

## 1. Configurando a URL do Webhook

Acesse a plataforma da Hotmart e navegue até **Ferramentas** > **Webhook (API e Notificações)**. Adicione uma nova configuração utilizando a seguinte URL:
`https://weyvslnwezjzignzjvok.supabase.co/functions/v1/hotmart-webhook`

## 2. Autenticação

O sistema foi projetado para operar sem a necessidade inicial de API Key/JWT.
Opcionalmente, caso queira maior segurança, você pode definir a variável de ambiente `HOTMART_TOKEN` no seu backend Supabase correspondendo ao token configurado na Hotmart (hottok).

## 3. Eventos Necessários

Selecione os seguintes eventos de notificação para serem enviados ao Webhook:

- **Venda Aprovada** (Ativa a conta do usuário ou atualiza o plano)
- **Venda Cancelada** (Revoga o acesso ou marca o plano como cancelado)
- **Venda Reembolsada** (Revoga o acesso ou marca o plano como cancelado)

## 4. Nomenclatura de Produtos e Regras de Plano

O Edge Function de webhook identifica automaticamente qual plano liberar para o usuário baseando-se no nome do produto ou chave da oferta vindo da Hotmart.

Certifique-se que o nome do seu produto na Hotmart contenha as seguintes palavras-chave (case-insensitive) para garantir o mapeamento correto dos planos:

- **solo**: (Ex: "FinFlow Solo", "Plano Solo Anual") - Custo referência: R$39/mês
- **duo**: (Ex: "FinFlow Duo", "Plano Plus") - Custo referência: R$59/mês
- **pro**: (Ex: "FinFlow Pro", "Plano Pro") - Custo referência: R$79/mês
- **business**: (Ex: "FinFlow Business", "Max") - Custo referência: R$99/mês

Caso o sistema receba um pagamento e a nomenclatura não dê um "match" explícito, será definido o plano `solo` como fallback.
