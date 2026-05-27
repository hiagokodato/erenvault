import { PageShell } from '@/components/layout/PageShell'
import { GoalCard } from '@/features/goals/components/GoalCard'
import { GoalForm } from '@/features/goals/components/GoalForm'
import { useAuth } from '@/features/auth/context/AuthProvider'
import { useGoalMutations, useGoals } from '@/hooks/useGoals'

export function GoalsPage() {
  const { user } = useAuth()
  const { data: goals = [], isLoading } = useGoals()
  const { create, addSaved, remove } = useGoalMutations(user?.id)

  return (
    <PageShell width="wide" className="space-y-8">
      <header>
        <p className="label-caps">Objetivos</p>
        <h1 className="font-display text-3xl font-semibold text-fg">Metas</h1>
        <p className="mt-2 text-sm text-muted">
          Defina objetivos e acompanhe quanto já guardou — viagem, reserva, presentes…
        </p>
      </header>

      <GoalForm isSubmitting={create.isPending} onSubmit={(data) => create.mutate(data)} />

      {isLoading ? (
        <p className="text-center text-sm text-muted">Carregando metas…</p>
      ) : goals.length === 0 ? (
        <div className="panel p-8 text-center">
          <p className="text-sm text-muted">Você ainda não tem metas. Crie a primeira acima.</p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              isDeleting={remove.isPending && remove.variables === goal.id}
              isAdding={addSaved.isPending && addSaved.variables?.id === goal.id}
              onAddSaved={(id, addCents) => addSaved.mutate({ id, addCents })}
              onDelete={(id) => remove.mutate(id)}
            />
          ))}
        </ul>
      )}
    </PageShell>
  )
}
