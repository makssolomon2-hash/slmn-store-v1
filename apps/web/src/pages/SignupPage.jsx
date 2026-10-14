
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Zap } from 'lucide-react';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !password || !passwordConfirm) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== passwordConfirm) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await signup(email, password, passwordConfirm, name);
      toast.success('Account created successfully');
      navigate('/account');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign Up - EDM Store</title>
        <meta name="description" content="Create your EDM Store account" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1 flex items-center justify-center py-16 relative">
           {/* Subtle neon background glow */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="max-w-md w-full px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-accent/30">
                  <Zap className="w-8 h-8 text-accent drop-shadow-[0_0_8px_hsl(var(--accent)/0.5)]" />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight">Join the Network</h1>
                <p className="text-muted-foreground mt-2">Create an account to get started</p>
              </div>

              <Card className="bg-card border-border shadow-[0_0_40px_-15px_rgba(0,0,0,0.5)]">
                <CardContent className="pt-8">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Producer Name</Label>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alias"
                        className="h-12 bg-background border-border focus-visible:ring-accent text-foreground placeholder:text-muted-foreground/50 transition-all"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="producer@studio.com"
                        className="h-12 bg-background border-border focus-visible:ring-accent text-foreground placeholder:text-muted-foreground/50 transition-all"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="h-12 bg-background border-border focus-visible:ring-accent text-foreground placeholder:text-muted-foreground/50 transition-all"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="passwordConfirm" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Confirm Password</Label>
                      <Input
                        id="passwordConfirm"
                        type="password"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        placeholder="••••••••"
                        className="h-12 bg-background border-border focus-visible:ring-accent text-foreground placeholder:text-muted-foreground/50 transition-all"
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 mt-2 text-base font-bold bg-accent text-accent-foreground hover:bg-accent/90 shadow-[0_0_15px_hsl(var(--accent)/0.3)] hover:shadow-[0_0_25px_hsl(var(--accent)/0.5)] transition-all duration-300"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin mr-3"></div>
                          Registering...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  </form>

                  <div className="mt-8 pt-6 border-t border-border/50 text-center">
                    <p className="text-sm text-muted-foreground">
                      Already have an account?{' '}
                      <Link to="/login" className="text-accent hover:text-accent/80 font-bold hover:underline transition-colors">
                        Login here
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default SignupPage;
