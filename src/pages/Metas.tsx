import { useState, useMemo } from 'react'
import useAppStore from '@/stores/useAppStore'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { ImpulseControlDialog } from '@/components/ImpulseControlDialog'
import { differenceInYears } from 'date-fns'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { GOAL_DELETION_PHRASES, getRandomPhrase } from '@/lib/reflections'
import { GoalEditDialog } from '@/components/metas/GoalEditDialog'
import { GoalCard } from '@/components/metas/GoalCard'

export default function Metas() {
  const { profile } = useAuth()
  const { goals, setGoals, isSyncing } = useAppStore()
  const [open, setOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<any>(null)
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null)
  const [deleteReflection, setDeleteReflection] = useState('')
  const [successAction, setSuccessAction] = useState<any>(null)
  const { toast } = useToast()

  const currentAge = useMemo(
    () => (profile?.birth_date ? differenceInYears(new Date(), new Date(profile.birth_date)) : 35),
    [profile],
  )

  const generalGoals = useMemo(
    () =>
      goals.filter(
        (g) =>
          !g.name
            .toLowerCase()
            .match(/(aposentadoria|independência|independencia|liberdade|longo prazo)/),
      ),
    [goals],
  )

  const confirmDelete = async () => {
    if (!goalToDelete) return
    const { error } = await supabase.from('goals').delete().eq('id', goalToDelete)
    if (!error) {
      setGoals(goals.filter((g) => g.id !== goalToDelete))
      toast({ title: 'Meta Removida' })
    } else toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    setGoalToDelete(null)
  }

  if (isSyncing)
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[250px]" />
          <Skeleton className="h-[250px]" />
        </div>
      </div>
    )

  return (
    <div className="space-y-6 animate-slide-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
            Metas e Sonhos
          </h1>
          <p className="text-muted-foreground">Planeje e calcule o tempo para suas conquistas.</p>
        </div>
        <Button
          className="gap-2"
          onClick={() => {
            setEditingGoal(null)
            setOpen(true)
          }}
        >
          <Plus className="w-4 h-4" /> Nova Meta
        </Button>
      </div>

      <GoalEditDialog
        editingGoal={editingGoal}
        open={open}
        onOpenChange={(o) => {
          setOpen(o)
          if (!o) setEditingGoal(null)
        }}
        onSuccess={setSuccessAction}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {generalGoals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            currentAge={currentAge}
            onEdit={() => {
              setEditingGoal(goal)
              setOpen(true)
            }}
            onDelete={() => {
              setGoalToDelete(goal.id)
              setDeleteReflection(getRandomPhrase(GOAL_DELETION_PHRASES))
            }}
          />
        ))}
        {generalGoals.length === 0 && (
          <div className="col-span-full p-12 text-center border border-dashed rounded-lg bg-muted/10">
            Você ainda não possui metas registradas.
          </div>
        )}
      </div>

      <ImpulseControlDialog
        open={!!goalToDelete}
        onOpenChange={(o) => !o && setGoalToDelete(null)}
        onConfirm={confirmDelete}
        title="Desistir da Meta?"
        description="Você está prestes a excluir este planejamento."
        reflectionText={deleteReflection}
        confirmText="Sim, Excluir"
      />
      <ImpulseControlDialog
        open={!!successAction}
        onOpenChange={(o) => !o && setSuccessAction(null)}
        onConfirm={() => setSuccessAction(null)}
        title={successAction?.title || ''}
        description={successAction?.description || ''}
        reflectionText={successAction?.reflection || ''}
        confirmText="Continuar"
        mode="success"
      />
    </div>
  )
}
