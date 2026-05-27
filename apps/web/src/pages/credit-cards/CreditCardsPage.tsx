import { PageShell } from '@/components/layout/PageShell'
import { CreditCardForm } from '@/features/credit-cards/components/CreditCardForm'
import { CreditCardItem } from '@/features/credit-cards/components/CreditCardItem'
import { useAuth } from '@/features/auth/context/useAuth'
import { useCreditCardMutations, useCreditCards } from '@/hooks/useCreditCards'

export function CreditCardsPage() {
  const { user } = useAuth()
  const { data: cards = [], isLoading } = useCreditCards()
  const { create, addBalance, remove } = useCreditCardMutations(user?.id)

  return (
    <PageShell width="wide" className="space-y-8">
      <header>
        <p className="label-caps">Crédito</p>
        <h1 className="font-display text-3xl font-semibold text-fg">Cartões</h1>
        <p className="mt-2 text-sm text-muted">
          Cadastre seus cartões, limite e acompanhe o valor da fatura atual.
        </p>
      </header>

      <CreditCardForm isSubmitting={create.isPending} onSubmit={(data) => create.mutate(data)} />

      {isLoading ? (
        <p className="text-center text-sm text-muted">Carregando cartões…</p>
      ) : cards.length === 0 ? (
        <div className="panel p-8 text-center">
          <p className="text-sm text-muted">Nenhum cartão cadastrado. Adicione o primeiro acima.</p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {cards.map((card) => (
            <CreditCardItem
              key={card.id}
              card={card}
              isDeleting={remove.isPending && remove.variables === card.id}
              isAdding={addBalance.isPending && addBalance.variables?.id === card.id}
              onAddBalance={(id, addCents) => addBalance.mutate({ id, addCents })}
              onDelete={(id) => remove.mutate(id)}
            />
          ))}
        </ul>
      )}
    </PageShell>
  )
}
