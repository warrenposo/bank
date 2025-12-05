import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Plane, Phone, Mail, Lock, User } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  
  // Signup form state
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && event === 'SIGNED_IN') {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Validate inputs
      if (!loginData.email || !loginData.email.includes('@')) {
        setErrors({ email: 'Please enter a valid email address' });
        setLoading(false);
        return;
      }

      if (!loginData.password || loginData.password.length < 6) {
        setErrors({ password: 'Password must be at least 6 characters' });
        setLoading(false);
        return;
      }

      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email.trim(),
        password: loginData.password,
      });

      if (error) {
        console.error('Login error:', error);
        toast({
          title: 'Login failed',
          description: error.message || 'Invalid email or password',
          variant: 'destructive',
        });
        return;
      }

      if (data?.user) {
        toast({
          title: 'Welcome back!',
          description: 'Good luck playing Aviator!',
        });
        navigate('/');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: 'Login failed',
        description: error?.message || 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Validate inputs
      if (!signupData.name || signupData.name.length < 2) {
        setErrors({ name: 'Name must be at least 2 characters' });
        setLoading(false);
        return;
      }

      if (!signupData.phone || signupData.phone.length < 9) {
        setErrors({ phone: 'Please enter a valid phone number' });
        setLoading(false);
        return;
      }

      if (!signupData.email || !signupData.email.includes('@')) {
        setErrors({ email: 'Please enter a valid email address' });
        setLoading(false);
        return;
      }

      if (!signupData.password || signupData.password.length < 6) {
        setErrors({ password: 'Password must be at least 6 characters' });
        setLoading(false);
        return;
      }
      
      // Format phone number (Kenyan format)
      let phoneNumber = signupData.phone.trim();
      if (phoneNumber.startsWith('0')) {
        phoneNumber = '+254' + phoneNumber.slice(1);
      } else if (!phoneNumber.startsWith('+')) {
        phoneNumber = '+254' + phoneNumber;
      }

      // Sign up with Supabase
      // The trigger function handle_new_user() will automatically:
      // 1. Create profile in profiles table
      // 2. Set balance to 100.00 (welcome bonus)
      // 3. Create welcome bonus transaction
      const { data, error } = await supabase.auth.signUp({
        email: signupData.email.trim(),
        password: signupData.password,
        options: {
          data: {
            name: signupData.name.trim(),
            phone_number: phoneNumber,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        console.error('Signup error:', error);
        toast({
          title: 'Signup failed',
          description: error.message || 'Failed to create account. Please try again.',
          variant: 'destructive',
        });
        return;
    }

      if (data?.user) {
        toast({
          title: 'Account created!',
          description: 'Welcome to Aviator! You have KES 100 bonus to start playing!',
      });

        // Wait a moment for the trigger to create the profile
        await new Promise(resolve => setTimeout(resolve, 1500));
      
      navigate('/');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
        toast({
        title: 'Signup failed',
        description: error?.message || 'An error occurred. Please try again.',
          variant: 'destructive',
        });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <Card className="w-full max-w-md bg-card border-border relative z-10">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Plane className="h-10 w-10 text-game-plane" style={{ filter: 'drop-shadow(0 0 10px hsl(0, 85%, 55%))' }} />
            <span className="font-display text-3xl font-bold text-primary" style={{ textShadow: '0 0 20px hsl(187, 100%, 50%)' }}>
              AVIATOR
            </span>
          </div>
          <CardTitle className="font-display text-xl">Welcome</CardTitle>
          <CardDescription>Sign in or create an account to start playing</CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-secondary">
              <TabsTrigger value="login" className="font-display">LOGIN</TabsTrigger>
              <TabsTrigger value="signup" className="font-display">SIGN UP</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      className="pl-10 bg-secondary border-border"
                      disabled={loading}
                      required
                    />
                  </div>
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      className="pl-10 bg-secondary border-border"
                      disabled={loading}
                      required
                    />
                  </div>
                  {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                </div>

                <Button type="submit" variant="bet" className="w-full" disabled={loading}>
                  {loading ? 'SIGNING IN...' : 'LOGIN'}
                </Button>
              </form>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={signupData.name}
                      onChange={handleSignupChange}
                      className="pl-10 bg-secondary border-border"
                      disabled={loading}
                      required
                    />
                  </div>
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-phone">Phone Number (M-Pesa)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-phone"
                      name="phone"
                      type="tel"
                      placeholder="0712345678"
                      value={signupData.phone}
                      onChange={handleSignupChange}
                      className="pl-10 bg-secondary border-border"
                      disabled={loading}
                      required
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                  <p className="text-xs text-muted-foreground">Used for M-Pesa deposits & withdrawals</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={signupData.email}
                      onChange={handleSignupChange}
                      className="pl-10 bg-secondary border-border"
                      disabled={loading}
                      required
                    />
                  </div>
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="Min 6 characters"
                      value={signupData.password}
                      onChange={handleSignupChange}
                      className="pl-10 bg-secondary border-border"
                      disabled={loading}
                      required
                      minLength={6}
                    />
                  </div>
                  {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                </div>

                <div className="bg-success/10 border border-success/20 rounded-lg p-3 text-center">
                  <p className="text-sm text-success font-medium">🎁 Get KES 100 Welcome Bonus!</p>
                </div>

                <Button type="submit" variant="bet" className="w-full" disabled={loading}>
                  {loading ? 'CREATING ACCOUNT...' : 'SIGN UP & PLAY'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
