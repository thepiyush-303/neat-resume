import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Trophy, Star, Users, Gift, ArrowUpRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans relative overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* Soft background ambient gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] pointer-events-none overflow-hidden z-0">
        <div 
          className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full opacity-60 blur-[100px]"
          style={{ background: 'radial-gradient(circle, rgba(192, 186, 255, 0.45) 0%, rgba(235, 233, 254, 0.25) 50%, transparent 80%)' }}
        />
      </div>

      {/* ── Top Navigation Bar ── */}
      <header className="relative z-10 w-full border-b border-gray-100/80 bg-white/70 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-1.5 text-2xl font-black tracking-tight text-gray-950 hover:opacity-90 transition-opacity"
          >
            <span>artfolio</span>
            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white font-bold text-xs ml-0.5 shadow-sm shadow-indigo-400/40">
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-gray-950 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-gray-950 transition-colors">How It Works</a>
            <a href="#reviews" className="hover:text-gray-950 transition-colors">Reviews</a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/auth?mode=login')}
              className="text-sm font-semibold text-gray-700 hover:text-gray-950 px-3 py-2 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Create Portfolio <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* ── Hero Section ── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto px-6 pt-16 pb-24 text-center">
        
        {/* Top Badge Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-indigo-700 bg-indigo-50/80 border border-indigo-100 shadow-sm mb-8 animate-fade-in">
          <Trophy className="w-3.5 h-3.5 text-indigo-600" />
          <span>4700+ portfolios built and counting</span>
        </div>

        {/* Hero Main Heading */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-gray-950 leading-[1.08] mb-6">
          Your resume,<br />
          <span className="bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            as a live website
          </span><br />
          in minutes.
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
          Upload the resume you already have. Our AI builds you a portfolio site on one of 8 designs - live, shareable, and ready before your next application. No design skills, no blank canvas.
        </p>

        {/* Primary CTA Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center gap-2.5 px-8 py-4 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 group w-full sm:w-auto"
          >
            <span>Build my portfolio - free</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-medium text-gray-500">
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-gray-700 font-semibold">4.9/5</span> rating
          </div>
          <span className="text-gray-300">•</span>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-gray-700 font-semibold">5100+</span> users
          </div>
          <span className="text-gray-300">•</span>
          <div className="flex items-center gap-1.5">
            <Gift className="w-4 h-4 text-gray-400" />
            <span>Free to publish</span>
          </div>
        </div>

      </main>
    </div>
  );
};

export default LandingPage;
