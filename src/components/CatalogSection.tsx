import React, { useState, useMemo } from 'react';
import { ShoppingBag, MessageSquare, Search, Tag, ExternalLink } from 'lucide-react';
import type { Product, SiteContent } from '../types/index.ts';

interface CatalogSectionProps {
  products: Product[];
  content: SiteContent | null;
  onOpenAdmin: () => void;
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({ products, content, onOpenAdmin }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return ['all', ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCat = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = searchQuery === '' || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const handleWhatsAppOrder = (product: Product) => {
    const rawNumber = content?.whatsapp_number || '+919876543210';
    const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Hi MINDMESH, I would like to enquire about ordering: "${product.name}" (Price: ₹${product.price_inr}). Is this currently available?`);
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="catalog" className="py-20 bg-slate-950/70 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 text-left">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-blue-400 uppercase">
              <span>Live Database Powered Catalog</span>
              <span aria-hidden="true">·</span>
              <span>Direct WhatsApp Orders</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mt-2" style={{ textWrap: 'balance' }}>
              Sample Storefront: Browse products with live instant pricing.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              Every item below is served directly from the persistent database. When prices or inventory change in the admin dashboard, customers see updates here immediately.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAdmin}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>Test Price Edit in Admin</span>
              <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
            </button>
          </div>
        </div>

        {/* Filter Bar: Interactive segmented controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-1 p-1 bg-slate-900/80 border border-slate-800 rounded-xl overflow-x-auto max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat === 'all' ? 'All Categories' : cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-900/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-12 text-center text-slate-400 text-sm">
            No products found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const hasDiscount = product.original_price_inr && product.original_price_inr > product.price_inr;
              const discountPercent = hasDiscount 
                ? Math.round(((product.original_price_inr! - product.price_inr) / product.original_price_inr!) * 100) 
                : 0;

              return (
                <div
                  key={product.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden flex flex-col justify-between hover:border-slate-700/80 transition-all group"
                >
                  <div>
                    {/* Image Area with Scrim and Zero Broken Image fallback */}
                    <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          // Clean fallback
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-medium text-slate-300 border border-slate-800">
                          {product.category}
                        </span>
                        {hasDiscount && (
                          <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 px-2 py-0.5 rounded text-[11px] font-mono font-semibold">
                            {discountPercent}% OFF
                          </span>
                        )}
                      </div>

                      {!product.is_available && (
                        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center">
                          <span className="text-xs font-semibold text-rose-400 bg-rose-950/80 border border-rose-800/60 px-3 py-1 rounded-full">
                            Temporarily Out of Stock
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-4 sm:p-5 text-left">
                      <h3 className="text-sm sm:text-base font-semibold text-white mb-1.5 line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
                        {product.description}
                      </p>

                      <div className="flex items-baseline gap-2 pt-1">
                        <span className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
                          ₹{product.price_inr.toLocaleString('en-IN')}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs font-mono text-slate-400 line-through tabular-nums">
                            ₹{product.original_price_inr!.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 pt-0">
                    <button
                      onClick={() => handleWhatsAppOrder(product)}
                      disabled={!product.is_available}
                      className={`w-full py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        product.is_available
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-600/20'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{product.is_available ? 'Order on WhatsApp' : 'Out of Stock'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
