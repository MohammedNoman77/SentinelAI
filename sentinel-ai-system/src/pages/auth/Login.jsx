import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield, Activity, Users, Database } from 'lucide-react';
import heroImage from '../../assets/hero.png';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('analyst@sentinel.ai');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password, remember);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'فشل تسجيل الدخول. تحقق من البيانات.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Activity, title: 'Live monitoring', text: 'Continuous visibility' },
    { icon: Users, title: 'Behavior analysis', text: 'Adaptive detection' },
    { icon: Shield, title: 'Threat defense', text: 'AI-assisted response' },
  ];

  return (
    <div className="min-h-screen bg-sentinel-bg text-white lg:grid lg:grid-cols-[minmax(420px,1.08fr)_minmax(420px,.92fr)]">
      <section className="relative hidden min-h-screen overflow-hidden border-r border-sentinel-border/70 lg:flex lg:flex-col lg:justify-between p-10 xl:p-14">
        <div className="absolute inset-0 sentinel-grid opacity-70" />
        <div className="absolute left-[12%] top-[28%] h-72 w-72 rounded-full bg-violet-500/10 blur-[100px]" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-400/10 shadow-[0_0_30px_rgba(34,211,238,.12)]">
            <Shield className="h-6 w-6 text-cyan-300" />
          </div>
          <div>
            <p className="text-xl font-black tracking-[.18em]">SENTINEL<span className="text-cyan-400">AI</span></p>
            <p className="mt-1 text-[9px] font-semibold tracking-[.28em] text-sentinel-text-dim">INTELLIGENCE IN EVERY BEHAVIOR</p>
          </div>
        </div>

        <div className="relative z-10 grid items-center gap-8 xl:grid-cols-[1fr_260px]">
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[.32em] text-cyan-400">Unified security operations</p>
            <h1 className="max-w-xl text-5xl font-light leading-[1.08] tracking-tight xl:text-6xl">
              Security that sees <span className="block font-bold text-cyan-400">what others miss.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-sentinel-text-dim">Monitor people, devices, data, and behavior through one intelligent security workspace.</p>
            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="rounded-xl border border-sentinel-border/80 bg-sentinel-panel/55 p-4 backdrop-blur">
                    <Icon className="mb-3 h-5 w-5 text-cyan-400" />
                    <p className="text-sm font-semibold text-white">{feature.title}</p>
                    <p className="mt-1 text-[11px] text-sentinel-text-dim">{feature.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="relative hidden xl:block">
            <div className="absolute inset-10 rounded-full bg-violet-500/20 blur-3xl" />
            <img src={heroImage} alt="SentinelAI security layers" className="relative z-10 w-full rotate-[-4deg] opacity-95 drop-shadow-[0_20px_35px_rgba(111,62,255,.24)]" />
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-5 text-[10px] font-semibold tracking-[.22em] text-sentinel-text-dim">
          <span>PEOPLE</span><i className="h-1 w-1 rounded-full bg-cyan-400" /><span>DEVICES</span><i className="h-1 w-1 rounded-full bg-cyan-400" /><span>DATA</span><i className="h-1 w-1 rounded-full bg-cyan-400" /><span>BEHAVIOR</span>
        </div>
      </section>

      <main className="relative flex min-h-screen items-center justify-center px-5 py-10 sm:px-10 lg:px-12">
        <div className="absolute inset-0 sentinel-grid opacity-30 lg:hidden" />
        <div className="relative z-10 w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-400/10"><Shield className="h-6 w-6 text-cyan-300" /></div>
            <p className="text-xl font-black tracking-[.18em]">SENTINEL<span className="text-cyan-400">AI</span></p>
          </div>

          <div className="mb-8">
            <p className="mb-2 text-xs font-bold uppercase tracking-[.24em] text-cyan-400">Secure workspace</p>
            <h2 className="text-3xl font-bold tracking-tight">Sign in to SentinelAI</h2>
            <p className="mt-2 text-sm text-sentinel-text-dim">Enter your credentials to continue.</p>
          </div>

          {error && <div className="mb-5 rounded-xl border border-rose-400/25 bg-rose-400/[0.08] px-4 py-3 text-sm text-rose-300">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Email address</label>
              <div className="relative"><Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sentinel-text-dim" /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-sentinel-border bg-sentinel-panel/75 py-3.5 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/70 focus:ring-4 focus:ring-cyan-400/[0.07]" placeholder="you@company.com" required /></div>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between"><label className="text-sm font-medium text-slate-300">Password</label><button type="button" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300">Forgot password?</button></div>
              <div className="relative"><Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sentinel-text-dim" /><input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-sentinel-border bg-sentinel-panel/75 py-3.5 pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/70 focus:ring-4 focus:ring-cyan-400/[0.07]" placeholder="Enter your password" required /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-sentinel-text-dim hover:text-white">{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button></div>
            </div>
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-sentinel-text-dim"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="h-4 w-4 rounded border-sentinel-border accent-cyan-500" />Keep me signed in</label>
            <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 text-sm font-bold text-white shadow-[0_12px_35px_rgba(34,211,238,.16)] transition hover:-translate-y-0.5 hover:from-cyan-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? <><span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />Signing in...</> : <>Sign in<ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-3"><div className="h-px flex-1 bg-sentinel-border" /><span className="text-[10px] font-bold tracking-[.2em] text-sentinel-text-dim">DEMO WORKSPACE</span><div className="h-px flex-1 bg-sentinel-border" /></div>
          <button type="button" onClick={() => { setEmail('admin@sentinel.ai'); setPassword('admin123'); }} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-sentinel-border bg-sentinel-panel/60 py-3 text-sm font-medium text-slate-300 transition hover:border-cyan-400/40 hover:text-white"><Database className="h-4 w-4 text-cyan-400" />Use administrator demo account</button>
          <p className="mt-6 text-center text-xs text-sentinel-text-dim">Protected access · SentinelAI Security Operations</p>
        </div>
      </main>
    </div>
  );
};

export default Login;
