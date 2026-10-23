import React, { useState, useRef } from 'react';
import { MatchedProduct } from '../types';
import {
  Star,
  ExternalLink,
  CheckCircle,
  Eye,
  Scale,
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { generateShoppingPlatforms } from '../utils/shoppingPlatforms';

interface CatalogProductCardProps {
  product: MatchedProduct;
  formatPrice: (price: number) => string;
  onPreview3D: (product: MatchedProduct) => void;
  onCompareStores: (product: MatchedProduct) => void;
  onAddToCompare: (product: MatchedProduct) => void;
}

export const CatalogProductCard: React.FC<CatalogProductCardProps> = ({
  product,
  formatPrice,
  onPreview3D,
  onCompareStores,
  onAddToCompare
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [transformStyle, setTransformStyle] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateY(0px)');
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Smooth, subtle 3D rotational tilt (-7deg to +7deg)
    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;

    setTransformStyle(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025) translateY(-6px)`
    );

    // Realistic lighting glare point following cursor
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.22
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateY(0px)');
    setGlarePos(prev => ({ ...prev, opacity: 0 }));
  };

  const shoppingPlatforms = generateShoppingPlatforms(product);

  return (
    <div className="perspective-1000 w-full">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: transformStyle,
          transition: isHovered
            ? 'transform 0.1s ease-out, box-shadow 0.2s ease-out'
            : 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
        }}
        className={`relative glass-panel rounded-3xl p-4 flex flex-col justify-between preserve-3d transition-colors duration-300 ${
          isHovered
            ? 'border-white/30 shadow-[0_22px_45px_-12px_rgba(0,0,0,0.7),0_0_30px_rgba(244,63,94,0.15)] bg-white/10'
            : 'border-white/10 shadow-lg bg-white/5'
        }`}
      >
        {/* Dynamic Specular Light Glare Overlay */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-300 z-30"
          style={{
            opacity: glarePos.opacity,
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.06) 40%, transparent 75%)`
          }}
        />

        {/* Top Section */}
        <div className="preserve-3d">
          {/* Image Container with 3D Z-Elevation */}
          <div className="relative h-48 rounded-2xl overflow-hidden bg-slate-950 mb-3 border border-white/15 preserve-3d translate-z-16 shadow-md">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 ease-out"
              style={{
                transform: isHovered ? 'scale(1.08)' : 'scale(1)'
              }}
            />

            {/* Subtle Gradient Shadow Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

            {/* Festival / Occasion Badge or Affordable Badge */}
            <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start translate-z-24">
              {product.price <= 500 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black shadow-md border border-emerald-400/40 flex items-center gap-1">
                  💰 Under ₹500
                </span>
              )}
              {product.price > 500 && product.price <= 1500 && (
                <span className="px-2 py-0.5 rounded-full bg-teal-500/90 text-white text-[10px] font-bold shadow-md border border-teal-400/40 flex items-center gap-1">
                  ✨ Affordable Pick
                </span>
              )}
              {product.festivalTag && (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold shadow-md border border-rose-400/40 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  {product.festivalTag}
                </span>
              )}
            </div>

            {/* Interactive Real View Button floating forward */}
            <button
              onClick={() => onPreview3D(product)}
              className="absolute bottom-2.5 right-2.5 px-2.5 py-1.5 rounded-xl bg-black/70 hover:bg-rose-600 backdrop-blur-md text-white border border-white/20 transition-all duration-200 cursor-pointer translate-z-24 flex items-center gap-1.5 text-[11px] font-bold shadow-lg group/btn hover:scale-105"
              title="Inspect Real Product Photography, Micro-Textures & Scale"
            >
              <Eye className="w-3.5 h-3.5 text-amber-300 group-hover/btn:scale-110 transition-transform" />
              <span>Real View</span>
            </button>
          </div>

          {/* Category & Rating Row */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1 translate-z-10">
            <span className="text-slate-300">{product.category}</span>
            <div className="flex items-center text-amber-400 font-bold">
              <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
              <span>{product.rating}</span>
              <span className="text-[10px] text-slate-400 ml-1">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="text-xs font-bold text-white line-clamp-2 mb-2 group-hover:text-rose-300 transition-colors translate-z-10">
            {product.name}
          </h3>

          {/* Product Description */}
          <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed mb-3 translate-z-10">
            {product.description}
          </p>
        </div>

        {/* Bottom Section */}
        <div className="preserve-3d translate-z-16">
          {/* Price & Stock Status */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10 mb-2">
            <div>
              <span className="text-[10px] text-slate-400 font-medium block">Verified Price</span>
              <span className="text-base font-extrabold text-white font-['Outfit']">
                {formatPrice(product.price)}
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
              <CheckCircle className="w-2.5 h-2.5 text-emerald-400" /> In Stock
            </span>
          </div>

          {/* Lowest Price Website Banner */}
          {(() => {
            const lowestPlatform = shoppingPlatforms.reduce((min, p) => p.price < min.price ? p : min, shoppingPlatforms[0]);
            return (
              <div className="mb-2.5 p-2 rounded-xl bg-emerald-950/30 border border-emerald-400/30 flex items-center justify-between gap-1 text-[11px]">
                <div className="min-w-0">
                  <span className="text-[9px] font-extrabold uppercase px-1 rounded bg-emerald-500 text-slate-950 mr-1">
                    Cheapest Site
                  </span>
                  <span className="text-white font-bold">{lowestPlatform.platform}</span>
                  <span className="text-emerald-400 font-extrabold ml-1">{formatPrice(lowestPlatform.price)}</span>
                </div>
                <a
                  href={lowestPlatform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-0.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-extrabold transition flex items-center gap-0.5 shrink-0"
                >
                  Buy <ExternalLink className="w-2 h-2" />
                </a>
              </div>
            );
          })()}

          {/* Quick Direct 1-Click Platform Access for Amazon & Flipkart */}
          {(() => {
            const amazonDeal = shoppingPlatforms.find(p => p.platform === 'Amazon') || shoppingPlatforms[0];
            const flipkartDeal = shoppingPlatforms.find(p => p.platform === 'Flipkart') || shoppingPlatforms[0];

            return (
              <div className="grid grid-cols-2 gap-2 mb-2.5">
                <a
                  href={amazonDeal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1.5 px-2.5 rounded-xl text-[11px] font-black text-white bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 transition flex items-center justify-between group/amz shadow-xs cursor-pointer hover:scale-[1.02]"
                  title="Direct 1-click access to Amazon"
                >
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#FF9900]" />
                    <span>Amazon</span>
                  </span>
                  <span className="text-[10px] text-amber-300 font-bold flex items-center gap-0.5">
                    {formatPrice(amazonDeal.price)}
                    <ExternalLink className="w-2.5 h-2.5 opacity-70 group-hover/amz:opacity-100" />
                  </span>
                </a>

                <a
                  href={flipkartDeal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1.5 px-2.5 rounded-xl text-[11px] font-black text-white bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/40 transition flex items-center justify-between group/fk shadow-xs cursor-pointer hover:scale-[1.02]"
                  title="Direct 1-click access to Flipkart"
                >
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#2874F0]" />
                    <span>Flipkart</span>
                  </span>
                  <span className="text-[10px] text-blue-300 font-bold flex items-center gap-0.5">
                    {formatPrice(flipkartDeal.price)}
                    <ExternalLink className="w-2.5 h-2.5 opacity-70 group-hover/fk:opacity-100" />
                  </span>
                </a>
              </div>
            );
          })()}

          {/* Multi-Platform Fast Shopping Strip */}
          <div className="mb-3 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
              <span>All Stores ({shoppingPlatforms.length}):</span>
              <button
                onClick={() => onCompareStores(product)}
                className="text-rose-300 hover:text-rose-200 font-bold hover:underline cursor-pointer flex items-center gap-0.5"
              >
                Compare Pricing <ExternalLink className="w-2.5 h-2.5" />
              </button>
            </div>
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
              {shoppingPlatforms.map(p => (
                <a
                  key={p.id}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-1.5 py-0.5 rounded text-[9px] font-bold border transition shrink-0 hover:scale-105"
                  style={{
                    backgroundColor: p.bgColor,
                    borderColor: p.textColor + '40',
                    color: p.textColor
                  }}
                  title={`Direct link to ${p.platform} (${formatPrice(p.price)})`}
                >
                  {p.platform}: {formatPrice(p.price)}
                </a>
              ))}
            </div>
          </div>

          {/* Card Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onAddToCompare(product)}
              className="py-2 px-2.5 rounded-xl glass-card hover:bg-white/20 text-slate-200 text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer border border-white/10"
            >
              <Scale className="w-3 h-3" />
              <span>Compare</span>
            </button>

            <button
              onClick={() => onCompareStores(product)}
              className="py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:brightness-110 text-white text-[11px] font-extrabold transition flex items-center justify-center gap-1 shadow-md cursor-pointer hover:shadow-rose-500/20"
            >
              <ShoppingBag className="w-3 h-3" />
              <span>All Stores ({shoppingPlatforms.length})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
