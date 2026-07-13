import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  menuItems, categoryLabels, badgeLabels,
  Category, Language, Badge, MenuItem
} from './data';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const LANG_KEY = 'cheers_lang';
const INSTAGRAM_URL = 'https://www.instagram.com/cheers_o_bar/';
const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Cheers+O+Bar+Viseu';
const WAZE_URL = 'https://www.waze.com/live-map/directions/pt/viseu/viseu/cheers-o-bar?to=place.ChIJVXdIo6o3Iw0RmDDaVMSAd5E';

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const t = {
  pt: {
    search: 'Pesquisar bebidas, comida…',
    highlights: '⭐ Destaques',
    all: 'Tudo',
    close: 'Fechar',
    directions: 'Como chegar',
    noResults: 'Sem resultados para',
    available_false: 'Esgotado',
    price: 'Preço',
  },
  en: {
    search: 'Search drinks, food…',
    highlights: '⭐ Highlights',
    all: 'All',
    close: 'Close',
    directions: 'Get directions',
    noResults: 'No results for',
    available_false: 'Sold Out',
    price: 'Price',
  },
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S: Record<string, React.CSSProperties> = {
  app: {
    minHeight: '100dvh',
    background: 'var(--bg)',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 480,
    margin: '0 auto',
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'var(--bg)',
    borderBottom: '1px solid #1f1f1f',
    padding: '12px 16px 0',
  },
  headerTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  logo: {
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: '-0.5px',
    color: 'var(--accent)',
  },
  langBtn: {
    fontSize: 12,
    fontWeight: 700,
    padding: '5px 12px',
    borderRadius: 20,
    border: '1.5px solid var(--bg4)',
    color: 'var(--text2)',
    background: 'var(--bg2)',
    transition: 'all .15s',
  },
  searchWrap: {
    position: 'relative',
    marginBottom: 12,
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text3)',
    fontSize: 16,
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    background: 'var(--bg2)',
    border: '1px solid var(--bg4)',
    borderRadius: 10,
    padding: '10px 14px 10px 38px',
    color: 'var(--text)',
    fontSize: 15,
    outline: 'none',
    fontFamily: 'inherit',
  },
  tabs: {
    display: 'flex',
    gap: 6,
    overflowX: 'auto',
    paddingBottom: 10,
    scrollbarWidth: 'none',
  },
  tab: {
    flexShrink: 0,
    padding: '7px 14px',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text2)',
    background: 'var(--bg2)',
    border: '1.5px solid var(--bg3)',
    transition: 'all .15s',
    whiteSpace: 'nowrap',
  },
  tabActive: {
    color: '#000',
    background: 'var(--accent)',
    border: '1.5px solid var(--accent)',
  },
  main: {
    flex: 1,
    padding: '16px 12px',
  },
  section: {
    marginBottom: 28,
    animation: 'fadeIn .3s ease',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 800,
    color: 'var(--text)',
    marginBottom: 12,
    paddingLeft: 4,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 10,
  },
  card: {
    background: 'var(--bg2)',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
    cursor: 'pointer',
    border: '1px solid var(--bg3)',
    transition: 'transform .15s, border-color .15s',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  cardImg: {
    width: '100%',
    aspectRatio: '4/3',
    objectFit: 'cover',
    background: 'var(--bg3)',
    display: 'block',
  },
  cardImgPlaceholder: {
    width: '100%',
    aspectRatio: '4/3',
    background: 'linear-gradient(135deg, var(--bg3) 0%, var(--bg4) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 36,
  },
  cardBody: {
    padding: '10px 10px 12px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  cardName: {
    fontSize: 14,
    fontWeight: 700,
    color: 'var(--text)',
    lineHeight: 1.3,
  },
  cardPrice: {
    fontSize: 15,
    fontWeight: 800,
    color: 'var(--accent)',
    marginTop: 'auto',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    fontSize: 10,
    fontWeight: 800,
    padding: '3px 8px',
    borderRadius: 20,
    letterSpacing: '0.3px',
    textTransform: 'uppercase',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 200,
    background: 'rgba(0,0,0,0.88)',
    display: 'flex',
    alignItems: 'flex-end',
    animation: 'overlayIn .2s ease',
  },
  modal: {
    background: 'var(--bg2)',
    borderRadius: '20px 20px 0 0',
    width: '100%',
    maxWidth: 480,
    margin: '0 auto',
    animation: 'modalIn .25s ease',
    maxHeight: '90dvh',
    overflowY: 'auto',
    paddingBottom: 'env(safe-area-inset-bottom, 0px)',
  },
  modalImg: {
    width: '100%',
    aspectRatio: '16/9',
    objectFit: 'cover',
    display: 'block',
    borderRadius: '20px 20px 0 0',
  },
  modalImgPlaceholder: {
    width: '100%',
    aspectRatio: '16/9',
    background: 'linear-gradient(135deg, var(--bg3) 0%, var(--bg4) 100%)',
    borderRadius: '20px 20px 0 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 64,
  },
  modalBody: {
    padding: '20px 20px 32px',
  },
  modalName: {
    fontSize: 22,
    fontWeight: 800,
    color: 'var(--text)',
    marginBottom: 8,
    lineHeight: 1.2,
  },
  modalDesc: {
    fontSize: 15,
    color: 'var(--text2)',
    lineHeight: 1.6,
    marginBottom: 16,
  },
  modalPrice: {
    fontSize: 26,
    fontWeight: 900,
    color: 'var(--accent)',
    marginBottom: 20,
  },
  closeBtn: {
    width: '100%',
    padding: '14px',
    background: 'var(--bg3)',
    borderRadius: 12,
    color: 'var(--text2)',
    fontSize: 15,
    fontWeight: 700,
  },
  footer: {
    borderTop: '1px solid #1f1f1f',
    padding: '16px 16px calc(16px + env(safe-area-inset-bottom, 0px))',
    display: 'flex',
    gap: 10,
  },
  footerBtn: {
    flex: 1,
    padding: '13px',
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  igBtn: {
    background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
    color: '#fff',
  },
  mapsBtn: {
    background: 'var(--bg3)',
    color: 'var(--text)',
    border: '1.5px solid var(--bg4)',
  },
  noResults: {
    textAlign: 'center',
    color: 'var(--text3)',
    padding: '60px 20px',
    fontSize: 15,
  },
  soldoutOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.55)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--radius)',
  },
};

// ─── BADGE COLORS ─────────────────────────────────────────────────────────────
const badgeColors: Record<NonNullable<Badge>, { bg: string; color: string }> = {
  bestseller:  { bg: '#f5c842', color: '#000' },
  new:         { bg: '#22c55e', color: '#fff' },
  recommended: { bg: '#3b82f6', color: '#fff' },
  soldout:     { bg: '#ef4444', color: '#fff' },
};

// ─── CATEGORY ICONS ────────────────────────────────────────────────────────────
const catIcon: Record<Category, string> = {
  [Category.Highlights]: '⭐',
  [Category.Packs]: '🍻',
  [Category.Cocktails]: '🍹',
  [Category.Mocktails]: '🥤',
  [Category.Gins]: '🍸',
  [Category.Whiskeys]: '🥃',
  [Category.Vodkas]: '🫙',
  [Category.Food]: '🍔',
  [Category.Wine]: '🍷',
  [Category.Beers]: '🍺',
  [Category.Sangrias]: '🍊',
  [Category.Shots]: '🥊',
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function formatPrice(p: number) {
  return p.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' });
}

function getCategoryOrder(): Category[] {
  return [
    Category.Packs,
    Category.Cocktails,
    Category.Mocktails,
    Category.Gins,
    Category.Whiskeys,
    Category.Vodkas,
    Category.Food,
    Category.Wine,
    Category.Beers,
    Category.Sangrias,
    Category.Shots,
  ];
}

// ─── CARD COMPONENT ───────────────────────────────────────────────────────────
const Card = React.memo(function Card({
  item, lang, onClick
}: { item: MenuItem; lang: Language; onClick: () => void }) {
  const isSoldOut = item.badge === 'soldout';
  const displayBadge = item.badge && badgeColors[item.badge];
  return (
    <div
      role="button"
      tabIndex={0}
      style={S.card}
      onClick={onClick}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      {item.image
        ? <img src={item.image} alt={item.name[lang]} style={S.cardImg} loading="lazy" />
        : (
          <div style={S.cardImgPlaceholder}>
            <span>{catIcon[item.category]}</span>
          </div>
        )
      }
      {displayBadge && (
        <span style={{
          ...S.badge,
          background: badgeColors[item.badge!].bg,
          color: badgeColors[item.badge!].color,
        }}>
          {badgeLabels[item.badge!][lang]}
        </span>
      )}
      {isSoldOut && (
        <div style={S.soldoutOverlay}>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 13, letterSpacing: 1 }}>
            {badgeLabels.soldout[lang].toUpperCase()}
          </span>
        </div>
      )}
      <div style={S.cardBody}>
        <div style={S.cardName}>{item.name[lang]}</div>
        <div style={S.cardPrice}>{formatPrice(item.price)}</div>
      </div>
    </div>
  );
});

// ─── MODAL COMPONENT ─────────────────────────────────────────────────────────
function ItemModal({
  item, lang, onClose
}: { item: MenuItem; lang: Language; onClose: () => void }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={e => e.stopPropagation()}>
        {item.image
          ? <img src={item.image} alt={item.name[lang]} style={S.modalImg} />
          : (
            <div style={S.modalImgPlaceholder}>
              <span>{catIcon[item.category]}</span>
            </div>
          )
        }
        <div style={S.modalBody}>
          {item.badge && (
            <span style={{
              ...S.badge,
              position: 'relative',
              top: 'auto', left: 'auto',
              display: 'inline-block',
              marginBottom: 10,
              background: badgeColors[item.badge].bg,
              color: badgeColors[item.badge].color,
            }}>
              {badgeLabels[item.badge][lang]}
            </span>
          )}
          <div style={S.modalName}>{item.name[lang]}</div>
          <div style={S.modalDesc}>{item.description[lang]}</div>
          <div style={S.modalPrice}>{formatPrice(item.price)}</div>
          <button style={S.closeBtn} onClick={onClose}>
            {t[lang].close}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem(LANG_KEY) as Language) || 'pt';
  });
  const [activeCategory, setActiveCategory] = useState<Category | 'all' | 'highlights'>('highlights');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<MenuItem | null>(null);

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
  }, [lang]);

  const toggleLang = useCallback(() => {
    setLang(l => l === 'pt' ? 'en' : 'pt');
  }, []);

  // available items only
  const available = useMemo(() =>
    menuItems.filter(i => i.available !== false),
    []
  );

  // highlighted items
  const highlights = useMemo(() =>
    available.filter(i => i.featured),
    [available]
  );

  // search filter
  const searchLower = search.toLowerCase();
  const filtered = useMemo(() => {
    if (!searchLower) return available;
    return available.filter(i =>
      i.name[lang].toLowerCase().includes(searchLower) ||
      i.description[lang].toLowerCase().includes(searchLower) ||
      categoryLabels[i.category][lang].toLowerCase().includes(searchLower)
    );
  }, [available, searchLower, lang]);

  // categories that have items
  const activeCategories = useMemo(() => {
    const cats = new Set(available.map(i => i.category));
    return getCategoryOrder().filter(c => cats.has(c));
  }, [available]);

  // items to show
  const displayItems = useMemo(() => {
    if (search) return filtered;
    if (activeCategory === 'highlights') return highlights;
    if (activeCategory === 'all') return available;
    return available.filter(i => i.category === activeCategory);
  }, [search, filtered, activeCategory, highlights, available]);

  // sections to render
  const sections = useMemo(() => {
    if (search) {
      // group by category when searching
      const groups = new Map<Category, MenuItem[]>();
      for (const item of filtered) {
        if (!groups.has(item.category)) groups.set(item.category, []);
        groups.get(item.category)!.push(item);
      }
      return Array.from(groups.entries()).map(([cat, items]) => ({ cat, items }));
    }
    if (activeCategory === 'highlights') {
      return [{ cat: 'highlights' as const, items: highlights }];
    }
    if (activeCategory === 'all') {
      return activeCategories.map(cat => ({
        cat,
        items: available.filter(i => i.category === cat),
      }));
    }
    return [{ cat: activeCategory, items: displayItems }];
  }, [search, filtered, activeCategory, highlights, available, activeCategories, displayItems]);

  return (
    <div style={S.app}>
      {/* HEADER */}
      <header style={S.header}>
        <div style={S.headerTop}>
          <span style={S.logo}>CHEERS O BAR</span>
          <button style={S.langBtn} onClick={toggleLang}>
            {lang === 'pt' ? '🇬🇧 EN' : '🇵🇹 PT'}
          </button>
        </div>

        {/* SEARCH */}
        <div style={S.searchWrap}>
          <span style={S.searchIcon}>🔍</span>
          <input
            style={S.searchInput}
            placeholder={t[lang].search}
            value={search}
            onChange={e => { setSearch(e.target.value); }}
          />
        </div>

        {/* CATEGORY TABS */}
        {!search && (
          <div style={S.tabs}>
            <button
              style={{ ...S.tab, ...(activeCategory === 'highlights' ? S.tabActive : {}) }}
              onClick={() => setActiveCategory('highlights')}
            >
              {t[lang].highlights}
            </button>
            <button
              style={{ ...S.tab, ...(activeCategory === 'all' ? S.tabActive : {}) }}
              onClick={() => setActiveCategory('all')}
            >
              {t[lang].all}
            </button>
            {activeCategories.map(cat => (
              <button
                key={cat}
                style={{ ...S.tab, ...(activeCategory === cat ? S.tabActive : {}) }}
                onClick={() => setActiveCategory(cat)}
              >
                {categoryLabels[cat][lang]}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* MAIN */}
      <main style={S.main}>
        {sections.length === 0 || (sections[0]?.items.length === 0) ? (
          <div style={S.noResults}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div>{t[lang].noResults} "<strong>{search}</strong>"</div>
          </div>
        ) : (
          sections.map(({ cat, items }) => (
            <section key={cat} style={S.section}>
              {(search || activeCategory === 'all' || activeCategory === 'highlights') && (
                <div style={S.sectionTitle}>
                  {cat === 'highlights'
                    ? t[lang].highlights
                    : categoryLabels[cat as Category][lang]
                  }
                </div>
              )}
              <div style={S.grid}>
                {items.map(item => (
                  <Card
                    key={item.id}
                    item={item}
                    lang={lang}
                    onClick={() => setSelected(item)}
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </main>

      {/* FOOTER */}
      <footer style={S.footer}>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...S.footerBtn, ...S.igBtn, textDecoration: 'none' }}
        >
          <span>📸</span>
          <span>@cheers_o_bar</span>
        </a>
        <a
          href={WAZE_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...S.footerBtn, ...S.mapsBtn, textDecoration: 'none' }}
        >
          <span>📍</span>
          <span>{t[lang].directions}</span>
        </a>
      </footer>

      {/* MODAL */}
      {selected && (
        <ItemModal
          item={selected}
          lang={lang}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
