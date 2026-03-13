import { useState, useEffect, useMemo } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Search, ArrowUpDown, Loader2, ShieldCheck } from 'lucide-react'

export default function Clients() {
  const { isMasterAdmin, loading } = useAuth()
  const [profiles, setProfiles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<'name' | 'date'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    if (!isMasterAdmin) return

    const fetchProfiles = async () => {
      setIsLoading(true)
      const { data } = await supabase.from('profiles').select('*')
      if (data) setProfiles(data)
      setIsLoading(false)
    }

    fetchProfiles()
  }, [isMasterAdmin])

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#126eda]" />
      </div>
    )
  }

  if (!isMasterAdmin) return <Navigate to="/dashboard" replace />

  const sortedProfiles = useMemo(() => {
    return [...profiles]
      .filter((p) => {
        const term = searchQuery.toLowerCase()
        return (
          (p.full_name || '').toLowerCase().includes(term) ||
          (p.email || '').toLowerCase().includes(term)
        )
      })
      .sort((a, b) => {
        if (sortField === 'name') {
          const nameA = a.full_name || ''
          const nameB = b.full_name || ''
          return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA)
        } else {
          // Using updated_at or fallback to 0 to sort nulls gracefully
          const dateA = new Date(a.updated_at || 0).getTime()
          const dateB = new Date(b.updated_at || 0).getTime()
          return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
        }
      })
  }, [profiles, searchQuery, sortField, sortOrder])

  const toggleSort = (field: 'name' | 'date') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  return (
    <div className="space-y-6 animate-slide-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#126eda] flex items-center gap-2">
            <ShieldCheck className="w-8 h-8" />
            Gestão de Clientes
          </h1>
          <p className="text-muted-foreground mt-1">
            Visão administrativa de todos os usuários e planos registrados.
          </p>
        </div>
        <div className="relative w-full sm:w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou e-mail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 focus-visible:ring-[#126eda]"
          />
        </div>
      </div>

      <Card className="border-[#126eda]/20 bg-background/50 backdrop-blur-sm">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="w-6 h-6 animate-spin text-[#126eda]" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead
                    className="cursor-pointer hover:text-[#126eda] transition-colors"
                    onClick={() => toggleSort('name')}
                  >
                    Nome Completo
                    {sortField === 'name' && <ArrowUpDown className="w-3 h-3 inline ml-1" />}
                  </TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead
                    className="cursor-pointer hover:text-[#126eda] transition-colors text-right"
                    onClick={() => toggleSort('date')}
                  >
                    Data de Atualização
                    {sortField === 'date' && <ArrowUpDown className="w-3 h-3 inline ml-1" />}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedProfiles.map((p) => (
                  <TableRow key={p.id} className="group">
                    <TableCell className="font-medium text-foreground">
                      {p.full_name || 'Usuário Sem Nome'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{p.email || '—'}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="text-[#126eda] border-[#126eda]/30 bg-[#126eda]/5 uppercase text-[10px] font-bold tracking-wider"
                      >
                        {p.plan || 'basic'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground text-xs">
                      {p.updated_at ? new Date(p.updated_at).toLocaleDateString('pt-BR') : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
                {sortedProfiles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center p-8 text-muted-foreground">
                      Nenhum cliente encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
