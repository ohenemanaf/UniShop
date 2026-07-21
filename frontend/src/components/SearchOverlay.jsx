/**
 * File: SearchOverlay.jsx
 * Description: Auto-generated documentation for SearchOverlay.jsx
 * Date: 2026-07-21
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IconSearch, IconX, IconArrowRight, IconStar, IconFlame, IconHistory, IconCategory } from "@tabler/icons-react";
import api from "../api";
import GHS from "../utils/currency";
const RECENT_KEY = "unishop_recent_searches";
const TRENDING = [{
  label: "Laptops",
  icon: "💻"
}, {
  label: "Sneakers",
  icon: "👟"
}, {
  label: "Headphones",
  icon: "🎧"
}, {
  label: "Backpacks",
  icon: "🎒"
}, {
  label: "Hoodies",
  icon: "👕"
}];
const CATEGORIES = [{
  label: "Tech",
  slug: "electronics",
  icon: "💻",
  color: "from-violet-500 to-indigo-600"
}, {
  label: "Fashion",
  slug: "fashion",
  icon: "👗",
  color: "from-pink-500 to-rose-500"
}, {
  label: "Dorm",
  slug: "home-living",
  icon: "🛋️",
  color: "from-amber-400 to-orange-500"
}, {
  label: "Books",
  slug: "books",
  icon: "📚",
  color: "from-emerald-400 to-teal-600"
}, {
  label: "Sports",
  slug: "sports",
  icon: "⚽",
  color: "from-sky-400 to-blue-600"
}];
export default /**
 * Function SearchOverlay
 * @param {any} props
 * @returns {any}
 */
function SearchOverlay({
  isOpen,
  onClose
}) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState(-1);
  const [recent, setRecent] = useState([]);
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults([]);
      setCursor(-1);
      try {
        setRecent(JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"));
      } catch {
        setRecent([]);
      }
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [isOpen]);
  useEffect(() => {
    /**
 * Arrow Function h
 * @param {any} e
 * @returns {any}
 */
    const h = e => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [isOpen, onClose]);
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const id = setTimeout(async () => {
      try {
        const res = await api.get("/products", {
          params: {
            search: query.trim(),
            limit: 5,
            sort: "popular"
          }
        });
        setResults(res.data.products || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 260);
    return () => clearTimeout(id);
  }, [query]);
  const saveRecent = useCallback(term => {
    if (!term.trim()) return;
    const upd = [term, ...recent.filter(r => r !== term)].slice(0, 5);
    setRecent(upd);
    localStorage.setItem(RECENT_KEY, JSON.stringify(upd));
  }, [recent]);
  const goSearch = useCallback(term => {
    const t = (term || query).trim();
    if (!t) return;
    saveRecent(t);
    onClose();
    navigate("/products?search=" + encodeURIComponent(t));
  }, [query, navigate, onClose, saveRecent]);
  const goProduct = useCallback(id => {
    onClose();
    navigate("/products/" + id);
  }, [navigate, onClose]);
  const goCategory = useCallback(slug => {
    onClose();
    navigate("/products?category=" + slug);
  }, [navigate, onClose]);
  /**
 * Arrow Function handleKeyDown
 * @param {any} e
 * @returns {any}
 */
  const handleKeyDown = e => {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor(c => Math.min(c + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor(c => Math.max(c - 1, -1));
    } else if (e.key === "Enter") {
      cursor >= 0 && results[cursor] ? goProduct(results[cursor].id) : goSearch(query);
    }
  };
  return <AnimatePresence>
      {isOpen && <>
          {/* Backdrop */}
          <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} transition={{
        duration: 0.2
      }} onClick={onClose} className="fixed inset-0 z-[200]" style={{
        background: "rgba(15, 23, 42, 0.4)",
        backdropFilter: "blur(4px)"
      }} />

          {/* Modal */}
          <motion.div initial={{
        opacity: 0,
        y: -32,
        scale: 0.95
      }} animate={{
        opacity: 1,
        y: 0,
        scale: 1
      }} exit={{
        opacity: 0,
        y: -20,
        scale: 0.96
      }} transition={{
        type: "spring",
        damping: 24,
        stiffness: 280
      }} className="fixed top-0 left-0 right-0 z-[201] flex justify-center pt-10 px-4 pointer-events-none">
            <div className="w-full max-w-3xl pointer-events-auto overflow-hidden bg-white" style={{
          borderRadius: "20px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)"
        }}>
              {/* Input Row */}
              <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-100">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              boxShadow: "0 4px 12px rgba(99,102,241,0.2)"
            }}>
                  <IconSearch size={18} color="white" stroke={2.5} />
                </div>
                <input ref={inputRef} value={query} onChange={e => {
              setQuery(e.target.value);
              setCursor(-1);
            }} onKeyDown={handleKeyDown} placeholder="Search products, brands, categories..." className="flex-1 text-lg font-semibold outline-none bg-transparent" style={{
              color: "#0f172a",
              caretColor: "#6366f1"
            }} />
                <div className="flex items-center gap-2 flex-shrink-0">
                  {query && <motion.button initial={{
                scale: 0
              }} animate={{
                scale: 1
              }} onClick={() => {
                setQuery("");
                setResults([]);
                inputRef.current?.focus();
              }} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-100" style={{
                color: "#64748b"
              }}>
                      <IconX size={16} stroke={2.5} />
                    </motion.button>}
                  <kbd className="hidden sm:flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-gray-50 border border-gray-200" style={{
                color: "#64748b"
              }}>
                    ESC
                  </kbd>
                </div>
              </div>

              {/* Body */}
              <div style={{
            maxHeight: "68vh",
            overflowY: "auto"
          }}>

                {/* ACTIVE SEARCH */}
                {query.trim() ? loading ? <div className="flex items-center justify-center gap-3 py-12">
                      <motion.div animate={{
                rotate: 360
              }} transition={{
                repeat: Infinity,
                duration: 0.65,
                ease: "linear"
              }} className="w-6 h-6 rounded-full border-2 border-t-transparent" style={{
                borderColor: "#6366f1 transparent #6366f1 #6366f1"
              }} />
                      <span className="text-sm font-medium" style={{
                color: "#64748b"
              }}>Searching...</span>
                    </div> : results.length === 0 ? <div className="py-14 text-center px-8">
                      <div className="text-4xl mb-4">🔍</div>
                      <p className="text-base font-semibold mb-1" style={{
                color: "#0f172a"
              }}>
                        No results for <span style={{
                  color: "#4f46e5"
                }}>"{query}"</span>
                      </p>
                      <p className="text-sm" style={{
                color: "#64748b"
              }}>Try a different keyword or browse categories below</p>
                    </div> : <>
                      {/* Header */}
                      <div className="flex items-center justify-between px-6 pt-5 pb-3">
                        <span className="text-xs font-bold uppercase tracking-widest" style={{
                  color: "#64748b"
                }}>
                          Products
                        </span>
                        <button onClick={() => goSearch(query)} className="flex items-center gap-1 text-xs font-bold transition-colors hover:opacity-80" style={{
                  color: "#4f46e5"
                }}>
                          See all <IconArrowRight size={12} stroke={2.5} />
                        </button>
                      </div>

                      {/* Results list */}
                      <div ref={listRef}>
                        {results.map((p, i) => <motion.button key={p.id} initial={{
                  opacity: 0,
                  x: -12
                }} animate={{
                  opacity: 1,
                  x: 0
                }} transition={{
                  delay: i * 0.05
                }} onClick={() => goProduct(p.id)} className="w-full flex items-center gap-5 px-6 py-4 text-left transition-all" style={{
                  background: cursor === i ? "#f8fafc" : "transparent",
                  borderLeft: cursor === i ? "3px solid #6366f1" : "3px solid transparent"
                }} onMouseEnter={() => setCursor(i)}>
                            <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100">
                              <img src={p.image_url || "https://placehold.co/100x100/f8fafc/64748b?text=?"} alt={p.name} className="w-full h-full object-cover mix-blend-multiply" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold truncate" style={{
                      color: "#0f172a"
                    }}>{p.name}</p>
                              <p className="text-xs mt-0.5 font-medium" style={{
                      color: "#64748b"
                    }}>
                                {p.category_name || "Product"}
                              </p>
                              {p.avg_rating > 0 && <div className="flex items-center gap-0.5 mt-1.5">
                                  {[...Array(5)].map((_, si) => <IconStar key={si} size={12} className={si < Math.round(p.avg_rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />)}
                                  <span className="text-[10px] font-bold ml-1" style={{
                        color: "#64748b"
                      }}>
                                    {parseFloat(p.avg_rating).toFixed(1)}
                                  </span>
                                </div>}
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-base font-black" style={{
                      color: "#4f46e5"
                    }}>
                                {GHS(p.min_price ?? p.price)}
                              </p>
                              <div className="flex items-center justify-end gap-1 mt-1">
                                <span className="text-[10px] font-bold" style={{
                        color: "#059669"
                      }}>In Stock</span>
                              </div>
                            </div>
                          </motion.button>)}
                      </div>

                      {/* Full search CTA */}
                      <motion.button whileHover={{
                scale: 1.01
              }} onClick={() => goSearch(query)} className="w-full flex items-center justify-center gap-2.5 py-5 text-sm font-bold transition-all group border-t border-gray-100 bg-indigo-50/50" style={{
                color: "#4f46e5"
              }}>
                        <IconSearch size={15} stroke={2} />
                        Search for <em className="not-italic font-black">" {query} "</em>
                        <IconArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                    </> : (/* EMPTY / DEFAULT STATE */
            <div className="px-6 py-6 space-y-8">

                    {/* Recent */}
                    {recent.length > 0 && <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <IconHistory size={14} stroke={2} style={{
                      color: "#64748b"
                    }} />
                            <span className="text-xs font-bold uppercase tracking-widest" style={{
                      color: "#64748b"
                    }}>
                              Recent
                            </span>
                          </div>
                          <button onClick={() => {
                    setRecent([]);
                    localStorage.removeItem(RECENT_KEY);
                  }} className="text-xs font-medium transition-colors hover:text-gray-900" style={{
                    color: "#64748b"
                  }}>
                            Clear
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {recent.map(r => <motion.button key={r} whileHover={{
                    scale: 1.04
                  }} whileTap={{
                    scale: 0.97
                  }} onClick={() => goSearch(r)} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all bg-gray-50 border border-gray-200 hover:border-gray-300 hover:bg-gray-100" style={{
                    color: "#334155"
                  }}>
                              <IconHistory size={12} stroke={1.5} className="text-gray-400" />
                              {r}
                            </motion.button>)}
                        </div>
                      </div>}

                    {/* Trending */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <IconFlame size={14} stroke={2} style={{
                    color: "#ea580c"
                  }} />
                        <span className="text-xs font-bold uppercase tracking-widest" style={{
                    color: "#64748b"
                  }}>
                          Trending Now
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2.5">
                        {TRENDING.map((t, i) => <motion.button key={t.label} initial={{
                    opacity: 0,
                    y: 6
                  }} animate={{
                    opacity: 1,
                    y: 0
                  }} transition={{
                    delay: i * 0.06
                  }} whileHover={{
                    scale: 1.05,
                    y: -1
                  }} whileTap={{
                    scale: 0.97
                  }} onClick={() => goSearch(t.label)} className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all bg-indigo-50 border border-indigo-100 hover:bg-indigo-100" style={{
                    color: "#4338ca"
                  }}>
                            <span className="text-base">{t.icon}</span>
                            {t.label}
                            <span className="text-[10px] font-black opacity-40">#{i + 1}</span>
                          </motion.button>)}
                      </div>
                    </div>

                    {/* Categories */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <IconCategory size={14} stroke={2} style={{
                    color: "#64748b"
                  }} />
                        <span className="text-xs font-bold uppercase tracking-widest" style={{
                    color: "#64748b"
                  }}>
                          Shop by Category
                        </span>
                      </div>
                      <div className="grid grid-cols-5 gap-3">
                        {CATEGORIES.map((cat, i) => <motion.button key={cat.slug} initial={{
                    opacity: 0,
                    y: 12
                  }} animate={{
                    opacity: 1,
                    y: 0
                  }} transition={{
                    delay: i * 0.07
                  }} whileHover={{
                    scale: 1.06,
                    y: -3
                  }} whileTap={{
                    scale: 0.95
                  }} onClick={() => goCategory(cat.slug)} className="flex flex-col items-center justify-center py-5 rounded-2xl gap-2.5 transition-all bg-gray-50 border border-gray-100 hover:border-gray-300 hover:shadow-sm">
                            <span className="text-2xl">{cat.icon}</span>
                            <span className="text-xs font-bold" style={{
                      color: "#334155"
                    }}>{cat.label}</span>
                          </motion.button>)}
                      </div>
                    </div>

                  </div>)}

              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  {[["↑↓", "navigate"], ["↵", "select"], ["esc", "close"]].map(([key, action]) => <div key={key} className="flex items-center gap-1.5">
                      <kbd className="px-2 py-0.5 rounded text-[10px] font-bold bg-white border border-gray-200 shadow-sm" style={{
                  color: "#64748b"
                }}>
                        {key}
                      </kbd>
                      <span className="text-[10px] font-semibold" style={{
                  color: "#94a3b8"
                }}>{action}</span>
                    </div>)}
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded" style={{
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)"
              }} />
                  <span className="text-[10px] font-bold" style={{
                color: "#94a3b8"
              }}>UniShop Search</span>
                </div>
              </div>

            </div>
          </motion.div>
        </>}
    </AnimatePresence>;
}