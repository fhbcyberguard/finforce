import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { MOCK_ASSETS } from '@/lib/mockData'

export default function AssetList({ className }: { className?: string }) {
  const assets = MOCK_ASSETS || []

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Meus Ativos</CardTitle>
      </CardHeader>
      <CardContent>
        {assets.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground p-4">
            Nenhum ativo cadastrado.
          </div>
        ) : (
          <div className="space-y-4">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="flex justify-between items-center p-3 bg-muted/50 rounded-lg border border-border/50"
              >
                <div>
                  <p className="font-medium">{asset.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {asset.category} • {asset.rate}
                  </p>
                </div>
                <div className="font-mono font-medium">
                  R$ {asset.value.toLocaleString('pt-BR')}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
