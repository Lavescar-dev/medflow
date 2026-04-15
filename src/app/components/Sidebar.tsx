import React, { useEffect, useState } from 'react';
import { Activity, X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { MODULE_CATEGORIES, getCategoryByModule } from '../moduleRegistry';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeModule: string;
  setActiveModule: (module: string) => void;
}

export function Sidebar({ isOpen, setIsOpen, activeModule, setActiveModule }: SidebarProps) {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(
        MODULE_CATEGORIES.map((category, index) => [category.category, index < 2]),
      ),
  );

  useEffect(() => {
    const activeCategory = getCategoryByModule(activeModule);
    if (!activeCategory) {
      return;
    }

    setOpenCategories((previous) => ({
      ...previous,
      [activeCategory.category]: true,
    }));
  }, [activeModule]);

  const toggleCategory = (category: string) => {
    setOpenCategories((previous) => ({ ...previous, [category]: !previous[category] }));
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={twMerge(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out lg:static',
          !isOpen && '-translate-x-full lg:hidden',
        )}
      >
        <div className="border-b border-slate-100 bg-blue-50/50 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-600 p-2 text-white">
                <Activity size={20} className="stroke-[2.5]" />
              </div>
              <div>
                <h1 className="leading-tight font-bold text-lg text-slate-800">MedCore Plus</h1>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Kurumsal HBYS
                </p>
              </div>
            </div>
            <button
              className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
              onClick={() => setIsOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="mt-4 rounded-xl border border-blue-100 bg-white/90 px-3 py-2 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
              Aktif çalışma alanı
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-700">{activeModule}</p>
          </div>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto overflow-x-hidden p-4">
          {MODULE_CATEGORIES.map((category) => (
            <section key={category.category} className="space-y-1">
              <button
                onClick={() => toggleCategory(category.category)}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-slate-400 transition-colors hover:text-slate-600"
              >
                <span>{category.category}</span>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                    {category.items.length}
                  </span>
                  <svg
                    className={twMerge(
                      'h-4 w-4 transition-transform',
                      openCategories[category.category] ? 'rotate-180' : '',
                    )}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              <div className={twMerge('space-y-0.5', !openCategories[category.category] && 'hidden')}>
                {category.items.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setActiveModule(item.name)}
                    className={twMerge(
                      'group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all duration-200',
                      activeModule === item.name
                        ? 'bg-blue-50 font-semibold text-blue-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                    )}
                  >
                    {activeModule === item.name && (
                      <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-blue-600" />
                    )}
                    <item.icon
                      size={18}
                      className={twMerge(
                        'transition-colors',
                        activeModule === item.name
                          ? 'text-blue-600'
                          : 'text-slate-400 group-hover:text-slate-600',
                      )}
                    />
                    <div className="min-w-0">
                      <div className="truncate">{item.name}</div>
                      <div className="truncate text-[11px] text-slate-400 group-hover:text-slate-500">
                        {item.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="border-t border-slate-100 bg-slate-50/50 p-4">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-blue-100 font-bold text-blue-700 shadow-sm">
              MD
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">Dr. Mehmet Yılmaz</p>
              <p className="truncate text-xs text-slate-500">Başhekim / Yönetici</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
