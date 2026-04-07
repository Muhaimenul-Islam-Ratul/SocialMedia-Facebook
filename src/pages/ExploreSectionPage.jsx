import React from 'react';
import {
  Archive,
  Bookmark,
  ChartColumnBig,
  ChevronRight,
  Gamepad2,
  GraduationCap,
  Settings,
  Sparkles,
  UserPlus,
  Users,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { explorePages, explorePagesByPath } from '../data/explorePages';

const iconMap = {
  Archive,
  Bookmark,
  ChartColumnBig,
  Gamepad2,
  GraduationCap,
  Settings,
  UserPlus,
  Users,
};

function renderIcon(name) {
  const Icon = iconMap[name] || Sparkles;
  return <Icon size={20} />;
}

export default function ExploreSectionPage() {
  const location = useLocation();
  const currentPage = explorePagesByPath[location.pathname] || explorePages[0];

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white shadow-[0_25px_60px_rgba(148,163,184,0.16)]">
        <div className="bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.22),_transparent_24%),linear-gradient(135deg,_#0f172a_0%,_#1e293b_45%,_#0369a1_100%)] px-6 py-8 text-white sm:px-8 sm:py-10">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-2xl">
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.24em] text-sky-200">{currentPage.hero.eyebrow}</p>
              <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{currentPage.hero.title}</h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-200 sm:text-base">{currentPage.hero.description}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                  {currentPage.hero.ctaPrimary}
                </button>
                <button className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
                  {currentPage.hero.ctaSecondary}
                </button>
              </div>
            </div>

            <div className="grid min-w-[220px] gap-3">
              {currentPage.stats.map((stat) => (
                <div key={stat.label} className="rounded-[24px] border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.2em] text-sky-200">{stat.label}</p>
                  <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate-200">{stat.hint}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="space-y-6">
          <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_25px_60px_rgba(148,163,184,0.16)]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-sky-600">Featured</p>
                <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-900">What to explore next</h2>
              </div>
              <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                Social style
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
              {currentPage.highlights.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fbff_100%)] p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                    {renderIcon(currentPage.icon)}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">{item.meta}</span>
                    <button className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700">
                      Open
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_25px_60px_rgba(148,163,184,0.16)]">
            <div className="mb-5">
              <p className="text-sm font-medium text-sky-600">Explore menu</p>
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-900">Jump to another section</h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {explorePages.map((page) => {
                const active = page.path === currentPage.path;

                return (
                  <Link
                    key={page.path}
                    to={page.path}
                    className={`flex items-center justify-between rounded-[22px] border px-4 py-4 transition ${
                      active
                        ? 'border-sky-200 bg-sky-50 text-sky-800'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-sky-100 hover:bg-sky-50/50'
                    }`}
                  >
                    <span className="flex items-center gap-3 font-medium">
                      <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${active ? 'bg-white text-sky-700' : 'bg-white text-slate-500'}`}>
                        {renderIcon(page.icon)}
                      </span>
                      {page.label}
                    </span>
                    {page.badge ? (
                      <span className="rounded-full bg-sky-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-sky-700">
                        {page.badge}
                      </span>
                    ) : (
                      <ChevronRight size={18} />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_25px_60px_rgba(148,163,184,0.16)]">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                {renderIcon(currentPage.icon)}
              </div>
              <div>
                <p className="text-sm font-medium text-sky-600">Quick access</p>
                <h3 className="text-lg font-semibold text-slate-900">{currentPage.sidePanel.title}</h3>
              </div>
            </div>

            <div className="space-y-3">
              {currentPage.sidePanel.items.map((item) => (
                <div key={item} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <span>{item}</span>
                  <ChevronRight size={16} className="text-slate-400" />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_25px_60px_rgba(148,163,184,0.16)]">
            <p className="text-sm font-medium text-sky-600">Platform note</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">Built to feel familiar</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Each page is structured like a modern social product area, with focused actions, stats, and discovery blocks instead of placeholder text.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
