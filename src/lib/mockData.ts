export const MOCK_ALERTS = [
  {
    id: 1,
    title: 'Fatura Cartão Black',
    amount: 3450.0,
    dueDate: new Date(Date.now() + 86400000 * 1),
    type: 'urgent',
  },
  {
    id: 2,
    title: 'Conta de Luz',
    amount: 185.4,
    dueDate: new Date(Date.now() + 86400000 * 2),
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
  { id: '3', name: 'FII HGLG11', category: 'Variável', value: 15000, rate: 'Div 0.8% a.m' },
  { id: '4', name: 'Ações WEGE3', category: 'Variável', value: 8500, rate: '-' },
]

export const MOCK_ACCOUNTS = [
  { id: '1', bank: 'Nubank', type: 'Conta Corrente', balance: 12450.0, connected: true },
  { id: '2', bank: 'Itaú', type: 'Conta Investimento', balance: 4500.0, connected: true },
  { id: '3', bank: 'XP Investimentos', type: 'Corretora', balance: 0.0, connected: false },
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
    date: '2026-03-12',
    description: 'Supermercado Extra',
    amount: -450.2,
    category: 'Alimentação',
    type: 'Expense',
    account: 'Nubank',
  },
  {
    id: '2',
    date: '2026-03-10',
    description: 'Salário Carlos',
    amount: 8500.0,
    category: 'Renda Principal',
    type: 'Revenue',
    account: 'Itaú',
  },
  {
    id: '3',
    date: '2026-03-08',
    description: 'Transferência Poupança',
    amount: -1500.0,
    category: 'Investimento',
    type: 'Transfer',
    account: 'Itaú',
  },
  {
    id: '4',
    date: '2026-03-05',
    description: 'Pix João - Churrasco',
    amount: -120.0,
    category: 'Lazer',
    type: 'Pix',
    account: 'Nubank',
  },
]
