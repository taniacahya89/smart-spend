import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ReceiptText, Sparkles, User, Wallet, Settings } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const activeClass = "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold bg-primary text-text-primary shadow-lg shadow-primary/20 transition-all scale-[1.02]";
  const inactiveClass = "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface border border-transparent hover:border-border transition-all hover:translate-x-1 active:scale-[0.97]";

  return (
    <aside className="hidden md:flex flex-col w-60 bg-surface border-r border-border h-screen p-6 justify-between select-none">
      <div className="flex flex-col gap-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-2">
          <div className="bg-primary p-2.5 rounded-xl text-text-primary shadow-lg shadow-primary/25">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-text-primary leading-tight">SmartSpend</h2>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/expenses"
            className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
          >
            <ReceiptText className="w-5 h-5" />
            <span>Pengeluaran</span>
          </NavLink>

          <NavLink
            to="/advisor"
            className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
          >
            <Sparkles className="w-5 h-5" />
            <span>AI Advisor</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
          >
            <User className="w-5 h-5" />
            <span>Profil Saya</span>
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
          >
            <Settings className="w-5 h-5" />
            <span>Pengaturan</span>
          </NavLink>
        </nav>
      </div>

      {/* Footer Branding */}
      <div className="px-2 py-4 border-t border-border/50">
        <p className="text-text-secondary text-xs">SmartSpend</p>
      </div>
    </aside>
  );
};
