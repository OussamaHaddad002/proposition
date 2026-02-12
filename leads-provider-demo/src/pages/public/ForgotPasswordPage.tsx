import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, KeyRound, CheckCircle, ShieldCheck } from 'lucide-react';

type Step = 'email' | 'code' | 'reset' | 'success';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [timer, setTimer] = useState(60);
  const [timerActive, setTimerActive] = useState(false);

  const startTimer = () => {
    setTimer(60);
    setTimerActive(true);
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendCode = () => {
    if (!email) return;
    setStep('code');
    startTimer();
  };

  const handleVerifyCode = () => {
    if (code.some(c => !c)) return;
    setStep('reset');
  };

  const handleResetPassword = () => {
    if (!password || password !== confirmPassword || password.length < 8) return;
    setStep('success');
  };

  const handleCodeInput = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) {
      const next = document.getElementById(`code-${index + 1}`);
      next?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prev = document.getElementById(`code-${index - 1}`);
      prev?.focus();
    }
  };

  const getPasswordStrength = () => {
    if (!password) return { width: '0%', color: 'bg-gray-200', label: '' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    const levels = [
      { width: '25%', color: 'bg-red-500', label: 'Faible' },
      { width: '50%', color: 'bg-orange-500', label: 'Moyen' },
      { width: '75%', color: 'bg-yellow-500', label: 'Bon' },
      { width: '100%', color: 'bg-green-500', label: 'Fort' },
    ];
    return levels[Math.max(0, score - 1)] || levels[0];
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-[#344a5e] to-[#1e2d3d] p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-40 h-40 border-2 border-white rounded-full" />
          <div className="absolute bottom-32 right-16 w-60 h-60 border-2 border-white rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-24 h-24 border-2 border-white rounded-full" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-[#fd7958] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="text-white font-bold text-xl">Leads Provider</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Récupérez votre accès</h1>
          <p className="text-white/70 text-lg">Pas de panique, nous allons vous guider pour réinitialiser votre mot de passe en toute sécurité.</p>
        </div>
        <div className="relative z-10 flex items-center gap-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center">
            <ShieldCheck className="text-[#fd7958] mx-auto mb-2" size={28} />
            <p className="text-white/80 text-sm">Processus sécurisé</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center">
            <Mail className="text-[#fd7958] mx-auto mb-2" size={28} />
            <p className="text-white/80 text-sm">Vérification par email</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center">
            <KeyRound className="text-[#fd7958] mx-auto mb-2" size={28} />
            <p className="text-white/80 text-sm">Nouveau mot de passe</p>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Progress bar */}
          <div className="flex items-center gap-2 mb-8">
            {(['email', 'code', 'reset', 'success'] as Step[]).map((s, i) => (
              <div key={s} className="flex-1 flex items-center gap-2">
                <div className={`h-1.5 flex-1 rounded-full transition-colors ${
                  (['email', 'code', 'reset', 'success'].indexOf(step) >= i) ? 'bg-[#fd7958]' : 'bg-gray-200'
                }`} />
              </div>
            ))}
          </div>

          {/* Step 1: Email */}
          {step === 'email' && (
            <div className="space-y-6">
              <div>
                <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4">
                  <ArrowLeft size={16} /> Retour à la connexion
                </Link>
                <h2 className="text-2xl font-bold text-gray-900">Mot de passe oublié ?</h2>
                <p className="text-gray-500 mt-2">Entrez votre adresse email et nous vous enverrons un code de vérification.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Adresse email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="vous@exemple.fr"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#fd7958] focus:bg-white transition-all"
                  />
                </div>
              </div>
              <button
                onClick={handleSendCode}
                disabled={!email}
                className="w-full py-3 bg-[#fd7958] text-white rounded-xl font-semibold hover:bg-[#e5684a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Envoyer le code
              </button>
            </div>
          )}

          {/* Step 2: Code */}
          {step === 'code' && (
            <div className="space-y-6">
              <div>
                <button onClick={() => setStep('email')} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4">
                  <ArrowLeft size={16} /> Modifier l'email
                </button>
                <h2 className="text-2xl font-bold text-gray-900">Vérification</h2>
                <p className="text-gray-500 mt-2">
                  Entrez le code à 6 chiffres envoyé à <span className="font-medium text-gray-700">{email}</span>
                </p>
              </div>
              <div className="flex justify-center gap-3">
                {code.map((digit, i) => (
                  <input
                    key={i}
                    id={`code-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleCodeInput(i, e.target.value)}
                    onKeyDown={e => handleCodeKeyDown(i, e)}
                    className="w-12 h-14 text-center text-xl font-bold bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fd7958] focus:border-[#fd7958] transition-all"
                  />
                ))}
              </div>
              <div className="text-center">
                {timerActive ? (
                  <p className="text-sm text-gray-500">Renvoyer dans <span className="font-medium text-[#fd7958]">{timer}s</span></p>
                ) : (
                  <button onClick={startTimer} className="text-sm text-[#fd7958] font-medium hover:underline">
                    Renvoyer le code
                  </button>
                )}
              </div>
              <button
                onClick={handleVerifyCode}
                disabled={code.some(c => !c)}
                className="w-full py-3 bg-[#fd7958] text-white rounded-xl font-semibold hover:bg-[#e5684a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Vérifier
              </button>
            </div>
          )}

          {/* Step 3: Reset */}
          {step === 'reset' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Nouveau mot de passe</h2>
                <p className="text-gray-500 mt-2">Choisissez un mot de passe fort et sécurisé.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nouveau mot de passe</label>
                  <div className="relative">
                    <KeyRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-20 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#fd7958] focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? 'Masquer' : 'Afficher'}
                    </button>
                  </div>
                  {password && (
                    <div className="mt-2">
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full ${strength.color} transition-all`} style={{ width: strength.width }} />
                      </div>
                      <p className={`text-xs mt-1 ${strength.color.replace('bg-', 'text-')}`}>{strength.label}</p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmer le mot de passe</label>
                  <div className="relative">
                    <KeyRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#fd7958] focus:bg-white transition-all"
                    />
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">Les mots de passe ne correspondent pas</p>
                  )}
                </div>
              </div>
              <button
                onClick={handleResetPassword}
                disabled={!password || password !== confirmPassword || password.length < 8}
                className="w-full py-3 bg-[#fd7958] text-white rounded-xl font-semibold hover:bg-[#e5684a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Réinitialiser le mot de passe
              </button>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 mx-auto rounded-full flex items-center justify-center">
                <CheckCircle className="text-green-600" size={40} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Mot de passe réinitialisé !</h2>
                <p className="text-gray-500 mt-2">Votre mot de passe a été modifié avec succès. Vous pouvez maintenant vous connecter.</p>
              </div>
              <Link
                to="/login"
                className="inline-flex items-center justify-center w-full py-3 bg-[#fd7958] text-white rounded-xl font-semibold hover:bg-[#e5684a] transition-colors"
              >
                Se connecter
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
