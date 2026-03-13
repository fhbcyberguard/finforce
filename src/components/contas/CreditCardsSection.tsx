import { CreditCardList } from './CreditCardList'
import { AddCreditCardForm } from './AddCreditCardForm'

export function CreditCardsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <CreditCardList />
      </div>
      <div>
        <AddCreditCardForm />
      </div>
    </div>
  )
}
