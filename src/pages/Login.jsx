import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { auth } from '../firebase';

import loginIllustration from '../../Selection Task for Full Stack Engineer at Appifylab/assets/images/login.png';
import logo from '../../Selection Task for Full Stack Engineer at Appifylab/assets/images/logo.svg';
import googleIcon from '../../Selection Task for Full Stack Engineer at Appifylab/assets/images/google.svg';
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

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err?.code
        ? `${err.code}: ${err.message}`
        : err?.message || 'Failed to login. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err) {
      console.error('Google sign-in error:', err);
      const errorMessage = err?.code
        ? `${err.code}: ${err.message}`
        : err?.message || 'Google sign-in failed.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:flex items-center justify-center bg-white">
        <img
          src="https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=80"
          alt="Welcome"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex items-center justify-center p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-200 p-8"
        >
          <div className="mb-8 text-center">
            <p className="text-xs font-bold uppercase tracking-wide text-blue-500">BuddyScript</p>
            <h1 className="text-3xl font-black text-gray-900 mt-3">Get Started Now</h1>
            <p className="text-2xl font-bold text-slate-900 mt-2">Registration</p>
          </div>

          {error && (
            <div className="mb-5 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-slate-700 font-semibold py-3 rounded-xl transition"
          >
            <Globe size={16} />
            <span>Register with google</span>
          </button>

          <div className="flex items-center justify-center gap-3 text-xs text-gray-400 my-6">
            <span className="h-px flex-1 bg-gray-200" />
            <span>Or</span>
            <span className="h-px flex-1 bg-gray-200" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-2">Repeat Password</label>
              <input
                type="password"
                required
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none"
                placeholder="••••••••"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              I agree to terms & conditions
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login now'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">
              Create New Account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
