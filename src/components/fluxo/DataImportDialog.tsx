import { useState, useEffect } from 'react'
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
import { useToast } from '@/hooks/use-toast'

export function DataImportDialog({
  open,
  onOpenChange,
  importType,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  importType: 'csv' | 'ofx' | null
}) {
  const { transactions, setTransactions, profiles } = useAppStore()
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<any[]>([])

  useEffect(() => {
    if (!open) {
      setFile(null)
      setPreview([])
    }
  }, [open])

  const parseCSV = (text: string) => {
    const lines = text.split('\n').filter((l) => l.trim().length > 0)
    return lines.slice(1).map((line, idx) => {
      const parts = line.split(/[,;]/)
      const date = parts[0]?.trim() || new Date().toISOString().split('T')[0]
      const desc = parts[1]?.trim() || 'Importado CSV'
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
  }

  const parseOFX = (text: string) => {
    const stmts = text.split('<STMTTRN>').slice(1)
    return stmts.map((stmt, idx) => {
      const trnamtMatch = stmt.match(/<TRNAMT>([\d.-]+)/)
      const dtpostedMatch = stmt.match(/<DTPOSTED>(\d{8})/)
      const memoMatch = stmt.match(/<MEMO>([^<]+)/)

      const amount = trnamtMatch ? parseFloat(trnamtMatch[1]) : 0
      const rawDate = dtpostedMatch ? dtpostedMatch[1] : ''
      const date = rawDate
        ? `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`
        : new Date().toISOString().split('T')[0]
      const desc = memoMatch ? memoMatch[1].trim() : 'Transação OFX'

      return {
        id: `imp-ofx-${Date.now()}-${idx}`,
        date,
        description: desc,
        amount,
        category: 'Outros > Importado',
        type: amount < 0 ? 'Expense' : 'Revenue',
        account: 'Importada OFX',
        recurrence: 'none',
        profile: profiles[0]?.name || 'Admin',
        hasAttachment: false,
      }
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      try {
        let parsed = []
        if (importType === 'csv' || f.name.endsWith('.csv')) {
          parsed = parseCSV(text)
        } else if (importType === 'ofx' || f.name.endsWith('.ofx')) {
          parsed = parseOFX(text)
        }
        setPreview(parsed)
      } catch (err) {
        toast({
          title: 'Erro na leitura do arquivo',
          description: 'Verifique se o formato selecionado corresponde ao conteúdo.',
          variant: 'destructive',
        })
      }
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
    toast({
      title: 'Importação Concluída',
      description: `${preview.length} transações foram adicionadas ao fluxo de caixa.`,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Importar Transações ({importType?.toUpperCase()})</DialogTitle>
        </DialogHeader>
        {!preview.length ? (
          <div className="space-y-4">
            <Input
              type="file"
              accept={importType === 'csv' ? '.csv' : importType === 'ofx' ? '.ofx' : '.csv,.ofx'}
              onChange={handleFileChange}
            />
            {importType === 'csv' && (
              <p className="text-xs text-muted-foreground">
                Formato CSV esperado: Data, Descrição, Valor. Ex: 2026-03-12, Supermercado, -150.00
              </p>
            )}
            {importType === 'ofx' && (
              <p className="text-xs text-muted-foreground">
                Selecione o arquivo OFX exportado pelo seu banco (ex: Itaú, Nubank, Bradesco).
              </p>
            )}
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
                      <TableCell
                        className={`p-2 whitespace-nowrap font-medium ${row.amount > 0 ? 'text-emerald-500' : ''}`}
                      >
                        R$ {Math.abs(row.amount).toFixed(2)}
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
