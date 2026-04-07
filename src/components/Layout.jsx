import React, { useMemo, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Bell,
  ChevronDown,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  Moon,
  Search,
  Settings,
  Sun,
  UserRound,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '../App';
import { explorePages } from '../data/explorePages';

import logo from '../../Selection Task for Full Stack Engineer at Appifylab/assets/images/logo.svg';
import avatarImg from '../../Selection Task for Full Stack Engineer at Appifylab/assets/images/Avatar.png';
import people1 from '../../Selection Task for Full Stack Engineer at Appifylab/assets/images/people1.png';
import people2 from '../../Selection Task for Full Stack Engineer at Appifylab/assets/images/people2.png';
import people3 from '../../Selection Task for Full Stack Engineer at Appifylab/assets/images/people3.png';
import eventImg from '../../Selection Task for Full Stack Engineer at Appifylab/assets/images/feed_event1.png';

const suggestedPeople = [
  { name: 'Steve Jobs', role: 'CEO of Apple', image: people1 },
  { name: 'Ryan Roslansky', role: 'CEO of Linkedin', image: people2 },
  { name: 'Dylan Field', role: 'CEO of Figma', image: people3 },
];

const friends = [
  { name: 'Steve Jobs', role: 'CEO of Apple', image: people1, active: false, meta: '5 minute ago' },
  { name: 'Ryan Roslansky', role: 'CEO of Linkedin', image: people2, active: true },
  { name: 'Dylan Field', role: 'CEO of Figma', image: people3, active: true },
  { name: 'Steve Jobs', role: 'CEO of Apple', image: people1, active: false, meta: '5 minute ago' },
  { name: 'Ryan Roslansky', role: 'CEO of Linkedin', image: people2, active: true },
  { name: 'Dylan Field', role: 'CEO of Figma', image: people3, active: true },
];

const notifications = [
  { id: 1, actor: 'Steve Jobs', text: 'posted a link in your timeline.', image: people1, time: '42 minutes ago' },
  { id: 2, actor: 'Admin', text: 'changed the name of the group Freelancer USA.', image: people2, time: '42 minutes ago' },
  { id: 3, actor: 'Dylan Field', text: 'commented on your latest post.', image: people3, time: '1 hour ago' },
];

const events = [
  { id: 1, title: 'No more terrorism no more cry', image: eventImg },
  { id: 2, title: 'No more terrorism no more cry', image: eventImg },
];

function ProfileAvatar({ profile, className = 'h-10 w-10' }) {
  if (profile?.photoURL) {
    return <img src={profile.photoURL} alt="Profile" className={`${className} rounded-full object-cover`} />;
  }

  const initial = profile?.firstName?.[0] || profile?.email?.[0] || 'U';

  return (
    <div className={`${className} flex items-center justify-center rounded-full bg-sky-100 font-semibold text-sky-700`}>
      {initial.toUpperCase()}
    </div>
  );
}

export default function Layout({ children }) {
  const { profile, logout } = useAuth();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [friendSearch, setFriendSearch] = useState('');

  const filteredFriends = useMemo(() => {
    const term = friendSearch.trim().toLowerCase();
    if (!term) return friends;
    return friends.filter((friend) => `${friend.name} ${friend.role}`.toLowerCase().includes(term));
  }, [friendSearch]);

  const handleLogout = async () => {
    await logout();
  };

  const shellClass = darkMode
    ? 'bg-[#0f172a] text-slate-100'
    : 'bg-[#f5f8ff] text-slate-900';
  const cardClass = darkMode
    ? 'border border-slate-800 bg-slate-900/95 text-slate-100 shadow-[0_25px_65px_rgba(2,6,23,0.38)]'
    : 'border border-slate-200/80 bg-white text-slate-900 shadow-[0_25px_60px_rgba(148,163,184,0.16)]';
  const mutedClass = darkMode ? 'text-slate-400' : 'text-slate-500';
  const navClass = darkMode
    ? 'border-slate-800 bg-slate-950/90'
    : 'border-slate-200/80 bg-white/90';
  const inputClass = darkMode
    ? 'border-slate-800 bg-slate-900 text-slate-100 placeholder:text-slate-500'
    : 'border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400';

  const isHomePage = location.pathname === '/';
  const navButtonClass = (active) =>
    `flex h-12 w-12 items-center justify-center rounded-2xl transition ${
      active
        ? darkMode
          ? 'bg-sky-500/15 text-sky-300'
          : 'bg-sky-50 text-sky-600'
        : darkMode
          ? 'text-slate-300 hover:bg-slate-800'
          : 'text-slate-600 hover:bg-slate-100'
    }`;

  return (
    <div className={`min-h-screen transition-colors ${shellClass}`}>
      <div className={darkMode ? 'bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.14),_transparent_30%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)]' : 'bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_28%),linear-gradient(180deg,_#f8fbff_0%,_#eef4ff_100%)]'}>
        <nav className={`sticky top-0 z-50 border-b backdrop-blur ${navClass}`}>
          <div className="mx-auto flex max-w-[1440px] items-center gap-4 px-4 py-4 lg:px-6">
            <Link to="/" className="shrink-0">
              <img src={logo} alt="Buddy Script" className="h-10 w-auto" />
            </Link>

            <div className="hidden flex-1 md:block">
              <div className={`flex max-w-md items-center gap-3 rounded-full border px-4 py-3 ${inputClass}`}>
                <Search size={18} className={mutedClass} />
                <input
                  type="search"
                  placeholder="input search text"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            <div className="ml-auto hidden items-center gap-2 md:flex">
              <Link to="/" className={navButtonClass(isHomePage)}>
                <Home size={20} />
              </Link>
              <Link to="/find-friends" className={navButtonClass(location.pathname === '/find-friends')}>
                <Users size={20} />
              </Link>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowNotifications((current) => !current);
                    setShowProfileMenu(false);
                  }}
                  className={`relative flex h-12 w-12 items-center justify-center rounded-2xl transition ${darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  <Bell size={20} />
                  <span className="absolute right-2 top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-500 px-1 text-[10px] font-semibold text-white">
                    6
                  </span>
                </button>

                {showNotifications && (
                  <div className={`absolute right-0 top-16 z-30 w-[360px] rounded-[28px] p-4 ${cardClass}`}>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Notifications</h3>
                      <div className="flex gap-2">
                        <button className={`rounded-full px-3 py-1 text-xs font-medium ${darkMode ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'}`}>All</button>
                        <button className={`rounded-full px-3 py-1 text-xs font-medium ${darkMode ? 'bg-slate-950 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>Unread</button>
                      </div>
                    </div>
                    <div className="max-h-96 space-y-3 overflow-y-auto pr-1">
                      {notifications.map((notification) => (
                        <div key={notification.id} className={`flex gap-3 rounded-2xl p-3 ${darkMode ? 'bg-slate-950/70' : 'bg-slate-50'}`}>
                          <img src={notification.image} alt="" className="h-11 w-11 rounded-full object-cover" />
                          <div className="min-w-0">
                            <p className="text-sm leading-6">
                              <span className="font-semibold">{notification.actor}</span> {notification.text}
                            </p>
                            <p className={`text-xs ${mutedClass}`}>{notification.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button className={`relative flex h-12 w-12 items-center justify-center rounded-2xl transition ${darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`}>
                <MessageCircle size={20} />
                <span className="absolute right-2 top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-500 px-1 text-[10px] font-semibold text-white">
                  2
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDarkMode((current) => !current)}
                className={`flex h-12 w-12 items-center justify-center rounded-2xl transition ${darkMode ? 'bg-slate-800 text-amber-300' : 'bg-slate-100 text-slate-700'}`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu((current) => !current);
                    setShowNotifications(false);
                  }}
                  className={`flex items-center gap-3 rounded-2xl border px-3 py-2 ${darkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}
                >
                  <ProfileAvatar profile={profile} className="h-10 w-10" />
                  <div className="text-left">
                    <p className="text-sm font-semibold leading-none">{[profile?.firstName, profile?.lastName].filter(Boolean).join(' ') || 'User'}</p>
                    <p className={`mt-1 text-xs ${mutedClass}`}>View profile</p>
                  </div>
                  <ChevronDown size={16} className={mutedClass} />
                </button>

                {showProfileMenu && (
                  <div className={`absolute right-0 top-16 z-30 w-72 rounded-[28px] p-4 ${cardClass}`}>
                    <div className={`mb-4 flex items-center gap-3 rounded-2xl p-3 ${darkMode ? 'bg-slate-950/70' : 'bg-slate-50'}`}>
                      <ProfileAvatar profile={profile} className="h-14 w-14" />
                      <div>
                        <p className="font-semibold">{[profile?.firstName, profile?.lastName].filter(Boolean).join(' ') || 'User'}</p>
                        <p className={`text-sm ${mutedClass}`}>{profile?.email}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <NavLink to="/settings" className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}>
                        <span className="flex items-center gap-3"><Settings size={18} /> Settings</span>
                        <ChevronDown size={16} className="-rotate-90" />
                      </NavLink>
                      <button className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}>
                        <span className="flex items-center gap-3"><UserRound size={18} /> Help & Support</span>
                        <ChevronDown size={16} className="-rotate-90" />
                      </button>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}
                      >
                        <span className="flex items-center gap-3"><LogOut size={18} /> Log Out</span>
                        <ChevronDown size={16} className="-rotate-90" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2 md:hidden">
              <button
                type="button"
                onClick={() => setDarkMode((current) => !current)}
                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${darkMode ? 'bg-slate-800 text-amber-300' : 'bg-slate-100 text-slate-700'}`}
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen((current) => !current)}
                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${darkMode ? 'bg-slate-800 text-slate-100' : 'bg-slate-100 text-slate-900'}`}
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className={`border-t px-4 py-4 md:hidden ${darkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'}`}>
              <div className={`mb-4 flex items-center gap-3 rounded-2xl border px-4 py-3 ${inputClass}`}>
                <Search size={18} className={mutedClass} />
                <input type="search" placeholder="input search text" className="w-full bg-transparent text-sm outline-none" />
              </div>
              <div className="space-y-2">
                <Link to="/" className="flex items-center gap-3 rounded-2xl px-4 py-3"><Home size={18} /> Home</Link>
                <Link to="/find-friends" className="flex items-center gap-3 rounded-2xl px-4 py-3"><Users size={18} /> Find Friends</Link>
                <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left"><Bell size={18} /> Notifications</button>
                <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left"><MessageCircle size={18} /> Messages</button>
                <Link to="/settings" className="flex items-center gap-3 rounded-2xl px-4 py-3"><Settings size={18} /> Settings</Link>
                <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left"><LogOut size={18} /> Log Out</button>
              </div>
            </div>
          )}
        </nav>

        <main className="mx-auto max-w-[1440px] px-4 pb-28 pt-6 lg:px-6 lg:pb-10">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
            <aside className="hidden xl:block">
              <div className="sticky top-28 space-y-6">
                <section className={`rounded-[28px] p-6 ${cardClass}`}>
                  <h3 className="mb-5 text-lg font-semibold">Explore</h3>
                  <div className="space-y-2">
                    {explorePages.map((item) => {
                      const active = location.pathname === item.path;

                      return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition ${
                          active
                            ? darkMode
                              ? 'bg-slate-800 text-white'
                              : 'bg-sky-50 text-sky-700'
                            : darkMode
                              ? 'hover:bg-slate-800'
                              : 'hover:bg-slate-50'
                        }`}
                      >
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="rounded-full bg-sky-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-sky-700">
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    )})}
                  </div>
                </section>

                <section className={`rounded-[28px] p-6 ${cardClass}`}>
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Suggested People</h3>
                    <button className={`text-sm ${mutedClass}`}>See All</button>
                  </div>
                  <div className="space-y-4">
                    {suggestedPeople.map((person) => (
                      <div key={person.name} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img src={person.image} alt={person.name} className="h-12 w-12 rounded-full object-cover" />
                          <div>
                            <p className="font-semibold">{person.name}</p>
                            <p className={`text-xs ${mutedClass}`}>{person.role}</p>
                          </div>
                        </div>
                        <button className="rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white">
                          Connect
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                <section className={`rounded-[28px] p-6 ${cardClass}`}>
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Events</h3>
                    <button className={`text-sm ${mutedClass}`}>See all</button>
                  </div>
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div key={event.id} className={`overflow-hidden rounded-[24px] ${darkMode ? 'bg-slate-950/70' : 'bg-slate-50'}`}>
                        <img src={event.image} alt={event.title} className="h-36 w-full object-cover" />
                        <div className="p-4">
                          <div className="mb-3 flex items-center gap-3">
                            <div className="rounded-2xl bg-sky-600 px-3 py-2 text-center text-white">
                              <p className="text-sm font-bold leading-none">10</p>
                              <p className="text-xs">Jul</p>
                            </div>
                            <p className="font-semibold">{event.title}</p>
                          </div>
                          <div className="flex items-center justify-between border-t border-slate-200/60 pt-3 text-sm">
                            <span className={mutedClass}>17 People Going</span>
                            <button className="rounded-full bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white">Going</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </aside>

            <div>{children}</div>

            <aside className="hidden xl:block">
              <div className="sticky top-28 space-y-6">
                <section className={`rounded-[28px] p-6 ${cardClass}`}>
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">You Might Like</h3>
                    <button className={`text-sm ${mutedClass}`}>See All</button>
                  </div>
                  <div className="rounded-[24px] border border-slate-200/60 p-4">
                    <div className="mb-4 flex items-center gap-3">
                      <img src={avatarImg} alt="Radovan SkillArena" className="h-14 w-14 rounded-full object-cover" />
                      <div>
                        <p className="font-semibold">Radovan SkillArena</p>
                        <p className={`text-sm ${mutedClass}`}>Founder & CEO at Trophy</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold ${darkMode ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'}`}>Ignore</button>
                      <button className="flex-1 rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white">Follow</button>
                    </div>
                  </div>
                </section>

                <section className={`rounded-[28px] p-6 ${cardClass}`}>
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Your Friends</h3>
                    <button className={`text-sm ${mutedClass}`}>See All</button>
                  </div>

                  <div className={`mb-4 flex items-center gap-3 rounded-full border px-4 py-3 ${inputClass}`}>
                    <Search size={16} className={mutedClass} />
                    <input
                      type="search"
                      placeholder="input search text"
                      value={friendSearch}
                      onChange={(e) => setFriendSearch(e.target.value)}
                      className="w-full bg-transparent text-sm outline-none"
                    />
                  </div>

                  <div className="max-h-[640px] space-y-3 overflow-y-auto pr-1">
                    {filteredFriends.map((friend, index) => (
                      <div key={`${friend.name}-${index}`} className={`flex items-center justify-between rounded-2xl p-3 ${darkMode ? 'bg-slate-950/70' : 'bg-slate-50'}`}>
                        <div className="flex items-center gap-3">
                          <img src={friend.image} alt={friend.name} className="h-12 w-12 rounded-full object-cover" />
                          <div>
                            <p className="font-semibold">{friend.name}</p>
                            <p className={`text-xs ${mutedClass}`}>{friend.role}</p>
                          </div>
                        </div>
                        {friend.active ? (
                          <span className="h-3 w-3 rounded-full bg-emerald-500" />
                        ) : (
                          <span className={`text-xs ${mutedClass}`}>{friend.meta}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </aside>
          </div>
        </main>

        <div className={`fixed inset-x-0 bottom-0 z-40 border-t px-4 py-3 md:hidden ${navClass}`}>
          <div className="mx-auto flex max-w-md items-center justify-between">
            <Link to="/" className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
              <Home size={20} />
            </Link>
            <Link to="/find-friends" className={`relative flex h-12 w-12 items-center justify-center rounded-2xl ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              <Users size={20} />
            </Link>
            <button className={`relative flex h-12 w-12 items-center justify-center rounded-2xl ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              <Bell size={20} />
              <span className="absolute right-2 top-2 h-5 min-w-5 rounded-full bg-sky-500 px-1 text-[10px] font-semibold leading-5 text-white">6</span>
            </button>
            <button className={`relative flex h-12 w-12 items-center justify-center rounded-2xl ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              <MessageCircle size={20} />
              <span className="absolute right-2 top-2 h-5 min-w-5 rounded-full bg-sky-500 px-1 text-[10px] font-semibold leading-5 text-white">2</span>
            </button>
            <Link to="/settings" className={`flex h-12 w-12 items-center justify-center rounded-2xl ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              <Settings size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
