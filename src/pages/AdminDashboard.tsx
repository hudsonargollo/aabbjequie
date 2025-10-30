import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Printer, Trash2, LogOut, Loader2, Edit } from 'lucide-react';
import { generateApplicationPDF } from '@/lib/pdfGenerator';
import aabbLogo from '@/assets/aabb-logo.png';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EditApplicationDialog } from '@/components/EditApplicationDialog';

const AdminDashboard = () => {
  const { user, loading: authLoading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editApplication, setEditApplication] = useState<any | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Removed authentication checks - admin panel is now publicly accessible

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (startDate) {
        query = query.gte('created_at', new Date(startDate).toISOString());
      }
      if (endDate) {
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        query = query.lte('created_at', endDateTime.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;
      setApplications(data || []);
    } catch (error: any) {
      toast.error('Erro ao carregar inscrições');
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Inscrição excluída com sucesso');
      fetchApplications();
    } catch (error: any) {
      toast.error('Erro ao excluir inscrição');
      console.error('Error deleting application:', error);
    } finally {
      setDeleteId(null);
    }
  };

  const handlePrint = (application: any) => {
    generateApplicationPDF(application);
    toast.success('PDF gerado com sucesso');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={aabbLogo} alt="AABB" className="h-12 w-auto" />
              <div>
                <h1 className="text-2xl font-bold text-primary">Painel Administrativo</h1>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Inscrições Recebidas</h2>
            <Button onClick={fetchApplications} variant="outline">
              Atualizar
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="startDate">Data Inicial</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endDate">Data Final</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={fetchApplications} className="w-full">
                Filtrar
              </Button>
            </div>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Nenhuma inscrição encontrada
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow 
                      key={app.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setEditApplication(app)}
                    >
                      <TableCell className="font-medium">{app.full_name}</TableCell>
                      <TableCell>{app.cpf}</TableCell>
                      <TableCell>{app.email}</TableCell>
                      <TableCell>{app.residential_whatsapp}</TableCell>
                      <TableCell>
                        {new Date(app.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditApplication(app)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePrint(app)}
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setDeleteId(app.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta inscrição? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {editApplication && (
        <EditApplicationDialog
          application={editApplication}
          open={!!editApplication}
          onOpenChange={(open) => !open && setEditApplication(null)}
          onSuccess={fetchApplications}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
