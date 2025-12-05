import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, Target, TrendingDown, Users, DollarSign, AlertTriangle, Plane, Eye, EyeOff,
  Settings, CreditCard, RefreshCw
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useGameSettings } from '@/hooks/useGameSettings';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { useAdminTransactions } from '@/hooks/useAdminTransactions';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, loading, isAdmin } = useAuth();
  const { settings, setCrashPoint, clearCrashPoint, loading: settingsLoading } = useGameSettings(isAdmin);
  const { users, loading: usersLoading, refreshUsers, updateUser } = useAdminUsers(isAdmin);
  const { transactions, loading: transactionsLoading, filter, setFilter, refreshTransactions, updateTransactionStatus } = useAdminTransactions(isAdmin);
  
  const [nextCrashPoint, setNextCrashPoint] = useState(2.5);
  const [showCrashPoint, setShowCrashPoint] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activePlayers: 0,
    totalBets: 0,
    totalPayout: 0,
    profit: 0,
  });
  const [recentRounds, setRecentRounds] = useState<any[]>([]);

  // Fetch statistics
  useEffect(() => {
    if (!isAdmin) return;

    const fetchStats = async () => {
      try {
        // Fetch total users
        const { count: userCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Fetch total bets and payouts
        const { data: betsData } = await supabase
          .from('bets')
          .select('amount, profit, status');

        const totalBets = betsData?.reduce((sum, bet) => sum + (bet.amount || 0), 0) || 0;
        const totalPayout = betsData?.filter(b => b.status === 'won').reduce((sum, bet) => sum + (bet.profit || 0), 0) || 0;

        // Fetch recent rounds
        const { data: roundsData } = await supabase
          .from('rounds')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        setRecentRounds(roundsData || []);

        setStats({
          totalUsers: userCount || 0,
          activePlayers: users.filter(u => !u.is_admin).length,
          totalBets,
          totalPayout,
          profit: totalBets - totalPayout,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [isAdmin, users]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!loading && user && !isAdmin) {
      toast({
        title: 'Access Denied',
        description: 'You do not have admin privileges.',
        variant: 'destructive',
      });
      navigate('/');
    }
  }, [loading, user, isAdmin, navigate, toast]);

  const handleSetCrashPoint = async () => {
    const success = await setCrashPoint(nextCrashPoint);
    if (success) {
      toast({
        title: 'Crash point set!',
        description: `Next round will crash at ${nextCrashPoint}x`,
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to set crash point',
        variant: 'destructive',
      });
    }
  };

  const handleClearCrashPoint = async () => {
    const success = await clearCrashPoint();
    if (success) {
      toast({
        title: 'Cleared',
        description: 'Crash point is now random',
      });
    }
  };

  const handleUpdateBalance = async (userId: string, newBalance: number) => {
    const success = await updateUser(userId, { balance: newBalance });
    if (success) {
      toast({
        title: 'Success',
        description: 'User balance updated',
      });
      refreshUsers();
    } else {
      toast({
        title: 'Error',
        description: 'Failed to update balance',
        variant: 'destructive',
      });
    }
  };

  const handleToggleAdmin = async (userId: string, currentAdminStatus: boolean) => {
    const success = await updateUser(userId, { is_admin: !currentAdminStatus });
    if (success) {
      toast({
        title: 'Success',
        description: `User admin status ${!currentAdminStatus ? 'granted' : 'revoked'}`,
      });
      refreshUsers();
    } else {
      toast({
        title: 'Error',
        description: 'Failed to update admin status',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 2 }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-warning" />
            <div>
              <h1 className="font-display text-xl font-bold text-warning">ADMIN PANEL</h1>
              <p className="text-sm text-muted-foreground">Aviator Game Control</p>
            </div>
          </div>
          <Link to="/">
            <Button variant="neon" className="gap-2">
              <Plane className="h-4 w-4" />
              Back to Game
            </Button>
          </Link>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold font-display">{stats.totalUsers.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-warning" />
                <div>
                  <p className="text-sm text-muted-foreground">Active Players</p>
                  <p className="text-2xl font-bold font-display">{stats.activePlayers.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-success" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Bets</p>
                  <p className="text-2xl font-bold font-display">{formatCurrency(stats.totalBets)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingDown className="h-8 w-8 text-destructive" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Payout</p>
                  <p className="text-2xl font-bold font-display">{formatCurrency(stats.totalPayout)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border bg-success/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-success" />
                <div>
                  <p className="text-sm text-muted-foreground">Profit</p>
                  <p className="text-2xl font-bold font-display text-success">{formatCurrency(stats.profit)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="game" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="game">
              <Settings className="h-4 w-4 mr-2" />
              Game Control
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Users ({users.length})
            </TabsTrigger>
            <TabsTrigger value="transactions">
              <CreditCard className="h-4 w-4 mr-2" />
              Transactions
            </TabsTrigger>
          </TabsList>

          {/* Game Control Tab */}
          <TabsContent value="game" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Crash Point Control */}
          <Card className="bg-card border-2 border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                SECRET CRASH CONTROL
              </CardTitle>
              <CardDescription>
                Set the crash point for upcoming rounds. This is hidden from players.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings?.is_active && (
                <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active crash point:</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowCrashPoint(!showCrashPoint)}
                      >
                        {showCrashPoint ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <span className="font-display font-bold text-destructive">
                        {showCrashPoint ? `${settings.next_crash_point}x` : '****'}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={handleClearCrashPoint}
                  >
                    Clear (Return to Random)
                  </Button>
                </div>
              )}

              <div className="space-y-2">
                <Label>Set Next Crash Point</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    min="1.01"
                    max="100"
                    value={nextCrashPoint}
                    onChange={(e) => setNextCrashPoint(parseFloat(e.target.value) || 1.01)}
                    className="bg-secondary border-border text-2xl font-display"
                  />
                  <span className="flex items-center text-2xl font-display text-muted-foreground">x</span>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                {[1.02, 1.2, 1.5, 2.0, 3.0, 5.0, 10.0].map((point) => (
                  <Button
                    key={point}
                    variant="game"
                    size="sm"
                    onClick={() => setNextCrashPoint(point)}
                  >
                    {point}x
                  </Button>
                ))}
              </div>

              <Button
                variant="destructive"
                className="w-full"
                size="lg"
                onClick={handleSetCrashPoint}
                disabled={settingsLoading}
              >
                {settingsLoading ? 'SETTING...' : `SET CRASH AT ${nextCrashPoint}x`}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                ⚠️ This setting applies to the next round only and is completely hidden from players.
              </p>
            </CardContent>
          </Card>

          {/* Recent Rounds */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Recent Rounds</CardTitle>
              <CardDescription>Last 5 game rounds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="grid grid-cols-4 text-sm font-medium text-muted-foreground pb-2 border-b border-border">
                  <span>Round ID</span>
                  <span>Crash Point</span>
                      <span>Total Bets</span>
                  <span>Payout</span>
                </div>
                    {recentRounds.length > 0 ? (
                      recentRounds.map((round) => (
                  <div key={round.id} className="grid grid-cols-4 text-sm py-2 border-b border-border/50">
                          <span className="font-mono text-muted-foreground">{round.round_number || 'N/A'}</span>
                    <span className={`font-display font-bold ${
                            round.crash_point < 2 ? 'text-destructive' : round.crash_point < 5 ? 'text-warning' : 'text-success'
                    }`}>
                            {round.crash_point}x
                    </span>
                          <span>{formatCurrency(round.total_bets || 0)}</span>
                          <span className="text-muted-foreground">{formatCurrency(round.total_payout || 0)}</span>
                  </div>
                      ))
                    ) : (
                      <div className="text-center text-muted-foreground py-4">No rounds yet</div>
                    )}
              </div>
            </CardContent>
          </Card>
        </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage users, balances, and admin privileges</CardDescription>
                  </div>
                  <Button onClick={refreshUsers} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Balance</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name || 'N/A'}</TableCell>
                            <TableCell>{user.phone_number || 'N/A'}</TableCell>
                            <TableCell>{formatCurrency(user.balance || 0)}</TableCell>
                            <TableCell>
                              <Badge variant={user.is_admin ? 'destructive' : 'default'}>
                                {user.is_admin ? 'Admin' : 'User'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {formatDate(user.created_at)}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newBalance = prompt('Enter new balance:', user.balance?.toString() || '0');
                                    if (newBalance !== null) {
                                      handleUpdateBalance(user.user_id, parseFloat(newBalance) || 0);
                                    }
                                  }}
                                >
                                  Edit Balance
                                </Button>
                                {!user.is_admin && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleToggleAdmin(user.user_id, user.is_admin || false)}
                                  >
                                    Make Admin
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>View and manage all transactions</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={filter.type || 'all'}
                      onValueChange={(value) => setFilter({ ...filter, type: value === 'all' ? undefined : value })}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="deposit">Deposit</SelectItem>
                        <SelectItem value="withdrawal">Withdrawal</SelectItem>
                        <SelectItem value="bet">Bet</SelectItem>
                        <SelectItem value="win">Win</SelectItem>
                        <SelectItem value="bonus">Bonus</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={filter.status || 'all'}
                      onValueChange={(value) => setFilter({ ...filter, status: value === 'all' ? undefined : value })}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={refreshTransactions} variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {transactionsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Reference</TableHead>
                          <TableHead>Description</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.length > 0 ? (
                          transactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                              <TableCell className="text-muted-foreground">
                                {formatDate(transaction.created_at)}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{transaction.type}</Badge>
                              </TableCell>
                              <TableCell className="font-medium">
                                {formatCurrency(transaction.amount)}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    transaction.status === 'completed'
                                      ? 'default'
                                      : transaction.status === 'pending'
                                      ? 'secondary'
                                      : 'destructive'
                                  }
                                >
                                  {transaction.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-mono text-xs text-muted-foreground">
                                {transaction.reference || 'N/A'}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {transaction.description || 'N/A'}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                              No transactions found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
