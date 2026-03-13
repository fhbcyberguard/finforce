export const MOCK_ALERTS = [
  {
    id: 1,
    title: 'Fatura Cartão Black',
    amount: 3450.0,
    dueDate: new Date(Date.now() + 86400000 * 2), // D-2 Alert
    type: 'urgent',
  },
  {
    id: 2,
    title: 'Conta de Luz',
    amount: 185.4,
    dueDate: new Date(Date.now() + 86400000 * 2), // D-2 Alert
    type: 'urgent',
  },
  {
    id: 3,
    title: 'Condomínio',
    amount: 850.0,
    dueDate: new Date(Date.now() + 86400000 * 5),
    type: 'normal',
  },
]

export const MOCK_ASSETS = [
  { id: '1', name: 'CDB Banco Inter', category: 'Renda Fixa', value: 45000, rate: '110% CDI' },
  {
    id: '2',
    name: 'Tesouro IPCA+ 2035',
    category: 'Tesouro Direto',
    value: 25000,
    rate: 'IPCA + 5.5%',
  },
  { id: '3', name: 'FII HGLG11', category: 'FIIs', value: 15000, rate: 'Div 0.8% a.m' },
  { id: '4', name: 'Ações WEGE3', category: 'Ações', value: 8500, rate: '-' },
]

export const MOCK_ACCOUNTS = [
  {
    id: '1',
    bank: 'Nubank',
    type: 'Conta Corrente',
    balance: 12450.0,
    connected: true,
    agency: '0001',
    account: '12345-6',
  },
  {
    id: '2',
    bank: 'Itaú',
    type: 'Conta Investimento',
    balance: 4500.0,
    connected: true,
    agency: '7890',
    account: '98765-4',
  },
  { id: '3', bank: 'XP Investimentos', type: 'Corretora', balance: 0.0, connected: false },
]

export const MOCK_CREDIT_CARDS = [
  {
    id: '1',
    bank: 'Itaú',
    brand: 'Mastercard Black',
    lastDigits: '4321',
    totalLimit: 25000,
    availableLimit: 12450.5,
    bestPurchaseDay: 5,
    dueDate: 15,
  },
  {
    id: '2',
    bank: 'Nubank',
    brand: 'Mastercard Platinum',
    lastDigits: '8765',
    totalLimit: 8500,
    availableLimit: 1200.0,
    bestPurchaseDay: 28,
    dueDate: 5,
  },
]

export const MOCK_PROFILES = [
  {
    id: '1',
    name: 'Carlos (Pai)',
    role: 'Admin',
    limit: 5000,
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=4',
  },
  {
    id: '2',
    name: 'Marina (Mãe)',
    role: 'Admin',
    limit: 5000,
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=2',
  },
  {
    id: '3',
    name: 'Lucas (Filho)',
    role: 'Dependente',
    limit: 800,
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=7',
  },
]

export const MOCK_TRANSACTIONS = [
  {
    id: '1',
    date: new Date().toISOString().split('T')[0],
    description: 'Supermercado Extra',
    amount: -450.2,
    category: 'Alimentação > Supermercado',
    type: 'Expense',
    account: 'Nubank',
    recurrence: 'none',
    expenseType: 'variable',
  },
  {
    id: '2',
    date: new Date().toISOString().split('T')[0],
    description: 'Salário Carlos',
    amount: 8500.0,
    category: 'Renda > Principal',
    type: 'Revenue',
    account: 'Itaú',
    recurrence: 'monthly',
  },
  {
    id: '3',
    date: new Date().toISOString().split('T')[0],
    description: 'Transferência Poupança',
    amount: -1500.0,
    category: 'Transferência > Interna',
    type: 'Transfer',
    account: 'Itaú',
    recurrence: 'none',
  },
  {
    id: '4',
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    description: 'Pix João - Churrasco',
    amount: -120.0,
    category: 'Lazer > Eventos',
    type: 'Pix',
    account: 'Nubank',
    recurrence: 'none',
    hasAttachment: true,
    expenseType: 'variable',
  },
  {
    id: '5',
    date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
    description: 'Fatura Itaú Black',
    amount: -3450.0,
    category: 'Outros > Cartão de Crédito',
    type: 'Expense',
    account: 'Itaú',
    cardId: '1',
    recurrence: 'none',
    expenseType: 'fixed',
  },
]

export const MOCK_CATEGORIES = {
  Alimentação: ['Supermercado', 'Delivery', 'Restaurante'],
  Moradia: ['Aluguel', 'Luz', 'Água', 'Internet'],
  Transporte: ['Combustível', 'Aplicativo', 'Manutenção'],
  Saúde: ['Farmácia', 'Plano de Saúde', 'Consultas'],
  Lazer: ['Eventos', 'Assinaturas', 'Viagens'],
  Renda: ['Principal', 'Extra', 'Dividendos'],
  Outros: ['Cartão de Crédito', 'Importado'],
}

export const MOCK_GOALS = [
  {
    id: '1',
    name: 'Reserva de Emergência',
    targetValue: 50000,
    currentValue: 32000,
    targetDate: '2025-12-01',
    monthlyDeposit: 1500,
  },
  {
    id: '2',
    name: 'Viagem para Europa',
    targetValue: 30000,
    currentValue: 5000,
    targetDate: '2026-07-15',
    monthlyDeposit: 1000,
  },
]

export const MOCK_ACCESS_LOGS = [
  {
    id: 1,
    device: 'MacBook Pro',
    location: 'São Paulo, BR',
    ip: '192.168.1.10',
    date: '2026-03-13 09:41',
  },
  {
    id: 2,
    device: 'iPhone 13',
    location: 'São Paulo, BR',
    ip: '172.20.10.2',
    date: '2026-03-12 18:20',
  },
  {
    id: 3,
    device: 'Windows Desktop',
    location: 'Rio de Janeiro, BR',
    ip: '200.150.40.1',
    date: '2026-03-10 14:05',
  },
]

export const MOCK_TICKETS = [
  {
    id: 'TK-1042',
    user: 'carlos@familia.com',
    subject: 'Dúvida sobre simulador',
    status: 'Aberto',
    date: '2026-03-12',
  },
  {
    id: 'TK-1041',
    user: 'marina.silva@email.com',
    subject: 'Problema na sincronização Nubank',
    status: 'Em Progresso',
    date: '2026-03-11',
  },
  {
    id: 'TK-1038',
    user: 'joao.pedro@teste.com',
    subject: 'Como mudar o e-mail?',
    status: 'Resolvido',
    date: '2026-03-09',
  },
]
