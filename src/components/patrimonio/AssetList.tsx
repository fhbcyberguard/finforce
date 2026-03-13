import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { MOCK_ASSETS } from '@/lib/mockData'
import { Badge } from '@/components/ui/badge'

export default function AssetList({ className }: { className?: string }) {
  const assets = MOCK_ASSETS || []

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Meus Ativos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
            >
              <div>
                <p className="font-medium">{asset.name}</p>
                <div className="flex gap-2 mt-1">
                  <Badge variant="secondary" className="text-[10px]">
                    {asset.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{asset.rate}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono font-medium">R$ {asset.value.toLocaleString('pt-BR')}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
