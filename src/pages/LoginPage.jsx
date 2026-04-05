import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../App';

import loginIllustration from '../../Selection Task for Full Stack Engineer at Appifylab/assets/images/login.png';
import logo from '../../Selection Task for Full Stack Engineer at Appifylab/assets/images/logo.svg';
import shapeOne from '../../Selection Task for Full Stack Engineer at Appifylab/assets/images/shape1.svg';
import shapeTwo from '../../Selection Task for Full Stack Engineer at Appifylab/assets/images/shape2.svg';
import shapeThree from '../../Selection Task for Full Stack Engineer at Appifylab/assets/images/shape3.svg';
import darkShape from '../../Selection Task for Full Stack Engineer at Appifylab/assets/images/dark_shape.svg';
import darkShapeOne from '../../Selection Task for Full Stack Engineer at Appifylab/assets/images/dark_shape1.svg';
import darkShapeTwo from '../../Selection Task for Full Stack Engineer at Appifylab/assets/images/dark_shape2.svg';

const floatingShapes = [
  {
    id: 'shape-one',
    wrapperClass: 'left-[-2rem] top-[-1rem] md:left-[2%] md:top-[10%]',
    primary: shapeOne,
    secondary: darkShape,
    secondaryClass: 'left-5 top-6 w-16 md:w-20',
    primaryClass: 'w-28 md:w-36',
  },
  {
    id: 'shape-two',
    wrapperClass: 'right-[-1rem] top-[5%] md:right-[10%] md:top-[12%]',
    primary: shapeTwo,
    secondary: darkShapeOne,
    secondaryClass: 'right-4 top-7 w-14 md:w-16 opacity-70',
    primaryClass: 'w-24 md:w-32',
  },
  {
    id: 'shape-three',
    wrapperClass: 'bottom-[8%] right-[2%] md:bottom-[12%] md:right-[4%]',
    primary: shapeThree,
    secondary: darkShapeTwo,
    secondaryClass: 'left-3 top-3 w-14 md:w-16 opacity-70',
    primaryClass: 'w-28 md:w-36',
  },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password, rememberMe });
      navigate('/');
    } catch (err) {
      setError(err?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#f4f7ff] px-4 py-8 sm:px-6 lg:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.16),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.14),_transparent_32%),linear-gradient(180deg,_#f8fbff_0%,_#eef4ff_100%)]" />

      {floatingShapes.map((shape) => (
        <div
          key={shape.id}
          className={`pointer-events-none absolute hidden md:block ${shape.wrapperClass}`}
        >
          <div className="relative">
            <img src={shape.primary} alt="" className={shape.primaryClass} />
            <img src={shape.secondary} alt="" className={`absolute ${shape.secondaryClass}`} />
          </div>
        </div>
      ))}

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(360px,460px)]">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden items-center justify-center lg:flex"
          >
            <img
              src={loginIllustration}
              alt="Buddy Script login illustration"
              className="max-h-[680px] w-full max-w-3xl object-contain"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="w-full"
          >
            <div className="rounded-[32px] border border-white/60 bg-white/92 p-6 shadow-[0_30px_80px_rgba(76,91,148,0.18)] backdrop-blur md:p-10">
              <div className="mb-7">
                <img src={logo} alt="Buddy Script" className="mb-7 h-11 w-auto" />
                <p className="mb-2 text-sm font-medium text-slate-500">Welcome back</p>
                <h1 className="text-3xl font-semibold tracking-[-0.03em] text-slate-900 md:text-4xl">
                  Login to your account
                </h1>
              </div>

              {error && (
                <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="mb-8 rounded-2xl border border-sky-100 bg-sky-50 px-5 py-4 text-sm text-sky-700">
                Email and password login is now handled by your Express and MongoDB backend.
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    placeholder="Enter your password"
                  />
                </div>

                <div className="flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    <span>Remember me</span>
                  </label>
                  <span className="text-left font-medium text-slate-500 sm:text-right">
                    JWT access token + refresh cookie
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading && <Loader2 size={18} className="animate-spin" />}
                  <span>{loading ? 'Logging in...' : 'Login now'}</span>
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-slate-500">
                Don&apos;t have an account?{' '}
                <Link to="/register" className="font-semibold text-sky-600 transition hover:text-sky-700">
                  Create New Account
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

