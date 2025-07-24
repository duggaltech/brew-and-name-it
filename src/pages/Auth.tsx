import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { 
  sanitizeText, 
  isValidEmail, 
  validatePasswordStrength, 
  authRateLimiter, 
  formatSecureErrorMessage,
  type PasswordStrength 
} from '@/lib/security';
import { toast } from 'sonner';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({ isStrong: false, score: 0, feedback: [] });
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);
  const [rateLimitError, setRateLimitError] = useState<string>('');
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setRateLimitError('');
    
    // Rate limiting check
    if (!authRateLimiter.isAllowed('signin')) {
      const remainingTime = authRateLimiter.getRemainingTime('signin');
      setRateLimitError(`Too many sign-in attempts. Please try again in ${Math.ceil(remainingTime / 60)} minutes.`);
      setIsLoading(false);
      return;
    }
    
    // Input validation
    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address');
      setIsLoading(false);
      return;
    }
    
    const { error } = await signIn(email, password);
    
    if (!error) {
      navigate('/');
    } else {
      toast.error(formatSecureErrorMessage(error));
    }
    
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setRateLimitError('');
    
    // Rate limiting check
    if (!authRateLimiter.isAllowed('signup')) {
      const remainingTime = authRateLimiter.getRemainingTime('signup');
      setRateLimitError(`Too many sign-up attempts. Please try again in ${Math.ceil(remainingTime / 60)} minutes.`);
      setIsLoading(false);
      return;
    }
    
    // Input validation
    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address');
      setIsLoading(false);
      return;
    }
    
    if (!passwordStrength.isStrong) {
      toast.error('Please create a stronger password');
      setIsLoading(false);
      return;
    }
    
    const sanitizedDisplayName = sanitizeText(displayName, 50);
    const { error } = await signUp(email, password, sanitizedDisplayName);
    
    if (error) {
      toast.error(formatSecureErrorMessage(error));
    }
    
    setIsLoading(false);
  };

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
    const strength = validatePasswordStrength(newPassword);
    setPasswordStrength(strength);
    setShowPasswordStrength(newPassword.length > 0);
  };

  const getPasswordStrengthColor = (score: number) => {
    if (score <= 1) return 'bg-red-500';
    if (score <= 2) return 'bg-orange-500';
    if (score <= 3) return 'bg-yellow-500';
    if (score <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = (score: number) => {
    if (score <= 1) return 'Very Weak';
    if (score <= 2) return 'Weak';
    if (score <= 3) return 'Fair';
    if (score <= 4) return 'Good';
    return 'Strong';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            DrinkCraft
          </h1>
          <p className="text-muted-foreground mt-2">
            Design your perfect drink experience
          </p>
        </div>

        <Card className="border-0 shadow-elegant bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            {rateLimitError && (
              <Alert className="mb-4 border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-orange-800">
                  {rateLimitError}
                </AlertDescription>
              </Alert>
            )}
            <Tabs defaultValue="signin" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                    variant="premium"
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Display Name</Label>
                     <Input
                       id="signup-name"
                       type="text"
                       placeholder="Enter your display name"
                       value={displayName}
                       onChange={(e) => setDisplayName(sanitizeText(e.target.value, 50))}
                       maxLength={50}
                     />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                   <div className="space-y-2">
                     <Label htmlFor="signup-password">Password</Label>
                     <Input
                       id="signup-password"
                       type="password"
                       placeholder="Create a strong password"
                       value={password}
                       onChange={(e) => handlePasswordChange(e.target.value)}
                       required
                       minLength={8}
                     />
                     {showPasswordStrength && (
                       <div className="space-y-2">
                         <div className="flex items-center gap-2">
                           <div className="flex-1">
                             <div className="flex justify-between text-xs mb-1">
                               <span className="text-muted-foreground">Password Strength</span>
                               <span className={`font-medium ${passwordStrength.isStrong ? 'text-green-600' : 'text-orange-600'}`}>
                                 {getPasswordStrengthText(passwordStrength.score)}
                               </span>
                             </div>
                             <Progress 
                               value={(passwordStrength.score / 5) * 100} 
                               className="h-2"
                             />
                           </div>
                           {passwordStrength.isStrong ? (
                             <CheckCircle className="w-4 h-4 text-green-500" />
                           ) : (
                             <Shield className="w-4 h-4 text-orange-500" />
                           )}
                         </div>
                         {passwordStrength.feedback.length > 0 && (
                           <div className="text-xs text-muted-foreground">
                             <ul className="list-disc list-inside space-y-1">
                               {passwordStrength.feedback.map((tip, index) => (
                                 <li key={index}>{tip}</li>
                               ))}
                             </ul>
                           </div>
                         )}
                       </div>
                     )}
                   </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                    variant="premium"
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;