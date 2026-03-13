import { MOCK_ASSETS } from '@/lib/mockData'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function AssetList({ className }: { className?: string }) {
  const getBadgeVariant = (cat: string) => {
    if (cat === 'Renda Fixa') return 'default'
    if (cat === 'Tesouro Direto') return 'secondary'
    return 'outline'
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Meus Ativos</CardTitle>
        <Button size="sm" variant="outline" className="gap-1">
          <Plus className="w-4 h-4" /> Adicionar
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ativo</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Taxa/Rentabilidade</TableHead>
              <TableHead className="text-right">Valor Bruto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_ASSETS.map((asset) => (
              <TableRow key={asset.id} className="group transition-colors hover:bg-muted/50">
                <TableCell className="font-medium">{asset.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={getBadgeVariant(asset.category) as any}
                    className="font-normal text-[10px]"
                  >
                    {asset.category}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {asset.rate}
                </TableCell>
                <TableCell className="text-right font-mono font-medium">
                  R$ {asset.value.toLocaleString('pt-BR')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
