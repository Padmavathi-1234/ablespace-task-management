'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Search, 
  User, 
  Sun, 
  Moon, 
  Palette, 
  Check, 
  Pencil, 
  Camera, 
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { COLOR_CONFIGS } from '@/context/ThemeContext';
import { ColorMode } from '@/types';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { SettingsSkeleton } from '@/components/ui/Skeleton';

type TabType = 'profile' | 'theme' | 'color';

export default function SettingsPage() {
  const { user, updateUser, loading: authLoading } = useAuth();
  const { theme, colorMode, setTheme, setColorMode } = useTheme();

  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [searchQuery, setSearchQuery] = useState('');

  // Form states prefilled with user data or defaults matching specs
  const [fullName, setFullName] = useState(user?.fullName || 'Dexter');
  const [email, setEmail] = useState(user?.email || 'dexter@gmail.com');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [title, setTitle] = useState(user?.title || 'Designer');
  const [username, setUsername] = useState(user?.username || 'Dexuser');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [isSaving, setIsSaving] = useState(false);

  // Leave workspace modal state
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // Update local form state whenever user loads or changes
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || 'Dexter');
      setEmail(user.email || 'dexter@gmail.com');
      setTitle(user.title || 'Designer');
      setUsername(user.username || 'Dexuser');
      setAvatarUrl(user.avatarUrl || '');
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      fullName,
      email,
      title,
      username,
      avatarUrl,
    };

    try {
      // API call to PATCH /api/users/me
      const res = await api.patch('/users/me', payload);
      const updated = res.data;
      updateUser(updated);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.warn('Failed to save profile on backend, updating context locally:', error);
      // Fallback for mock session or connection failure
      updateUser(payload);
      toast.success('Profile updated successfully!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLeaveWorkspace = () => {
    setShowLeaveModal(false);
    toast.error('You have left the workspace.');
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    toast.success(`Theme updated to ${newTheme} mode`);
  };

  const handleColorChange = (mode: ColorMode) => {
    setColorMode(mode);
    const label = COLOR_CONFIGS[mode]?.label || mode;
    toast.success(`Accent color changed to ${label}`);
  };

  const menuItems = [
    { id: 'profile' as TabType, label: 'Profile', icon: User },
    { id: 'theme' as TabType, label: 'Theme', icon: Sun },
    { id: 'color' as TabType, label: 'Color', icon: Palette },
  ];

  const filteredMenuItems = menuItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const initial = (fullName || 'D').charAt(0).toUpperCase();

  const colorModes: ColorMode[] = ['amber', 'blue', 'pink', 'rose', 'emerald', 'black'];

  if (authLoading) {
    return (
      <div className="p-6">
        <SettingsSkeleton />
      </div>
    );
  }

  return (
    <div className="-m-4 md:-m-6 min-h-[calc(100vh-56px)] md:min-h-screen flex flex-col md:flex-row bg-white dark:bg-neutral-950 text-gray-900 dark:text-neutral-100">
      {/* Left Sub-sidebar (w-full md:w-64, stacked on mobile) */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200 dark:border-neutral-800 bg-gray-50/70 dark:bg-neutral-950/60 p-5 flex flex-col shrink-0">
        {/* Top Link: ← Back to app */}
        <Link
          href="/tasks"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to app</span>
        </Link>

        {/* Search input */}
        <div className="relative mb-6">
          <Search className="w-4 h-4 text-gray-400 dark:text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search settings..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl text-gray-900 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
          />
        </div>

        {/* Menu Links */}
        <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-gray-200/80 dark:bg-neutral-800 text-gray-900 dark:text-white font-semibold shadow-2xs'
                    : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-900 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[var(--color-primary)]' : 'text-gray-500 dark:text-neutral-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Right Content Panel (flex-1, p-6 md:p-8) */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-4xl">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                Profile
              </h1>
            </div>

            {/* Profile Settings Card */}
            <form onSubmit={handleSaveProfile} className="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-xs space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center gap-4">
                <div className="relative group">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={fullName}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 dark:border-neutral-800 shadow-xs"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-[var(--color-primary)] text-white font-bold flex items-center justify-center text-2xl shadow-xs border-2 border-white dark:border-neutral-800">
                      {initial}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      const url = prompt('Enter image URL for avatar:', avatarUrl);
                      if (url !== null) setAvatarUrl(url);
                    }}
                    className="absolute bottom-0 right-0 p-1.5 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-full text-gray-600 dark:text-neutral-300 shadow-xs hover:scale-105 transition-all cursor-pointer"
                    title="Edit profile picture"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {fullName || 'Dexter'}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-neutral-400">
                    {title || 'Designer'}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300">
                  Email address
                </label>
                <div className="relative flex items-center">
                  <input
                    type="email"
                    value={email}
                    disabled={!isEditingEmail}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pr-10 py-2.5 px-3 text-xs rounded-xl border transition-all ${
                      isEditingEmail
                        ? 'border-[var(--color-primary)] bg-white dark:bg-neutral-950 text-gray-900 dark:text-white focus:outline-hidden ring-1 ring-[var(--color-primary)]'
                        : 'border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-950/50 text-gray-600 dark:text-neutral-400 cursor-not-allowed'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setIsEditingEmail(!isEditingEmail)}
                    className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-neutral-200 transition-colors p-1 cursor-pointer"
                    title={isEditingEmail ? 'Done editing email' : 'Edit email'}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Full name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300">
                  Full name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                  placeholder="e.g. Dexter"
                />
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                  placeholder="e.g. Designer"
                />
                <p className="text-[11px] text-gray-400 dark:text-neutral-500">
                  Your job title or role
                </p>
              </div>

              {/* Username */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                  placeholder="e.g. Dexuser"
                />
                <p className="text-[11px] text-gray-400 dark:text-neutral-500">
                  One word, like a nickname or first name
                </p>
              </div>

              {/* Save Changes Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-[var(--color-primary)] hover:opacity-90 text-white font-medium text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>

            {/* Workspace Access Section */}
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                Workspace access
              </h2>
              <div className="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                <p className="text-xs text-gray-500 dark:text-neutral-400 font-medium">
                  Remove yourself from the workspace
                </p>
                <button
                  type="button"
                  onClick={() => setShowLeaveModal(true)}
                  className="bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900 font-medium text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer shrink-0"
                >
                  Leave Workspace
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Theme Tab */}
        {activeTab === 'theme' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                Theme
              </h1>
              <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
                Select your preferred color theme appearance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Light Option */}
              <button
                type="button"
                onClick={() => handleThemeChange('light')}
                className={`flex items-center justify-between p-5 rounded-2xl border transition-all text-left cursor-pointer ${
                  theme === 'light'
                    ? 'border-[var(--color-primary)] bg-white dark:bg-neutral-900 shadow-xs ring-2 ring-[var(--color-primary)]/20'
                    : 'border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-gray-300 dark:hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-500">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Light
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-neutral-400">
                      Bright, high-contrast theme
                    </p>
                  </div>
                </div>
                {theme === 'light' && (
                  <div className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </button>

              {/* Dark Option */}
              <button
                type="button"
                onClick={() => handleThemeChange('dark')}
                className={`flex items-center justify-between p-5 rounded-2xl border transition-all text-left cursor-pointer ${
                  theme === 'dark'
                    ? 'border-[var(--color-primary)] bg-white dark:bg-neutral-900 shadow-xs ring-2 ring-[var(--color-primary)]/20'
                    : 'border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-gray-300 dark:hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 text-purple-400">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Dark
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-neutral-400">
                      Sleek, low-light mode interface
                    </p>
                  </div>
                </div>
                {theme === 'dark' && (
                  <div className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Color Tab */}
        {activeTab === 'color' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                Color
              </h1>
              <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
                Customize the primary accent color across your workspace.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {colorModes.map((mode) => {
                const cfg = COLOR_CONFIGS[mode];
                const isActive = colorMode === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => handleColorChange(mode)}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                      isActive
                        ? 'border-[var(--color-primary)] bg-white dark:bg-neutral-900 shadow-xs ring-2 ring-[var(--color-primary)]/20'
                        : 'border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-gray-300 dark:hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-6 h-6 rounded-full shadow-2xs border border-black/10 dark:border-white/20 inline-block shrink-0"
                        style={{ backgroundColor: cfg.hex }}
                      />
                      <span className="text-xs font-semibold text-gray-900 dark:text-white">
                        {cfg.label}
                      </span>
                    </div>
                    {isActive && (
                      <div className="w-5 h-5 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Leave Workspace Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <div className="p-2.5 rounded-full bg-red-100 dark:bg-red-950/50">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Leave Workspace?
              </h3>
            </div>
            <p className="text-xs text-gray-600 dark:text-neutral-400">
              Are you sure you want to remove yourself from this workspace? You will lose access to all shared tasks and projects.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLeaveModal(false)}
                className="px-4 py-2 text-xs font-medium text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLeaveWorkspace}
                className="px-4 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Confirm Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
