import { useState } from 'react'
import { MOCK_CREDIT_CARDS } from '@/lib/mockData'
import { CreditCardList, type CreditCardType } from './CreditCardList'
import { AddCreditCardForm } from './AddCreditCardForm'

export function CreditCardsSection() {
  const [cards, setCards] = useState<CreditCardType[]>(MOCK_CREDIT_CARDS || [])

  const handleAddCard = (newCard: CreditCardType) => {
    setCards([...cards, newCard])
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <CreditCardList cards={cards} />
      </div>
      <div>
        <AddCreditCardForm onAdd={handleAddCard} />
      </div>
    </div>
  )
}
