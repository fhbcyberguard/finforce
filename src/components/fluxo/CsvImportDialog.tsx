import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import useAppStore from '@/stores/useAppStore'

export function CsvImportDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
}) {
  const { transactions, setTransactions, profiles } = useAppStore()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<any[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      const lines = text.split('\n').filter((l) => l.trim().length > 0)
      const parsed = lines.slice(1).map((line, idx) => {
        const parts = line.split(/[,;]/)
        const date = parts[0]?.trim() || new Date().toISOString().split('T')[0]
        const desc = parts[1]?.trim() || 'Importado'
        const amountStr = parts[2]?.trim() || '0'
        const amount = parseFloat(amountStr.replace(',', '.')) || 0
        return {
          id: `imp-${Date.now()}-${idx}`,
          date,
          description: desc,
          amount,
          category: 'Outros > Importado',
          type: amount < 0 ? 'Expense' : 'Revenue',
          account: 'Importada',
          recurrence: 'none',
          profile: profiles[0]?.name || 'Admin',
          hasAttachment: false,
        }
      })
      setPreview(parsed)
    }
    reader.readAsText(f)
  }

  const updateField = (idx: number, field: string, val: any) => {
    const next = [...preview]
    next[idx] = { ...next[idx], [field]: val }
    setPreview(next)
  }

  const handleImport = () => {
    setTransactions([...preview, ...transactions])
    setPreview([])
    setFile(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Importar Transações (CSV)</DialogTitle>
        </DialogHeader>
        {!preview.length ? (
          <div className="space-y-4">
            <Input type="file" accept=".csv" onChange={handleFileChange} />
            <p className="text-xs text-muted-foreground">
              Formato esperado de colunas: Data, Descrição, Valor
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="max-h-[400px] overflow-auto border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {preview.map((row, idx) => (
                    <TableRow key={row.id}>
                      <TableCell className="p-2">
                        <Input
                          value={row.date}
                          onChange={(e) => updateField(idx, 'date', e.target.value)}
                        />
                      </TableCell>
                      <TableCell className="p-2">
                        <Input
                          value={row.description}
                          onChange={(e) => updateField(idx, 'description', e.target.value)}
                        />
                      </TableCell>
                      <TableCell className="p-2">
                        <Input
                          value={row.category}
                          onChange={(e) => updateField(idx, 'category', e.target.value)}
                        />
                      </TableCell>
                      <TableCell className="p-2 whitespace-nowrap">
                        R$ {row.amount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setPreview([])
                  setFile(null)
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleImport}>Importar {preview.length} Registros</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
