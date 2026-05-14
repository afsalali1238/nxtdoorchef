// src/components/Footer.tsx
// ADAPTED FROM cr8: same structure, NextDoorChef brand

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="text-white/50 text-sm" style={{ background: 'linear-gradient(160deg, #1A0A00 0%, #2D1200 100%)' }}>
      <div className="max-w-6xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div>
          <p className="font-display text-white font-bold text-xl mb-3">
            NextDoor<span className="text-saffron">Chef</span>
          </p>
          <p className="leading-relaxed text-white/60 mb-5">
            A hyperlocal community directory for discovering home cultures through food.
          </p>
          <p className="text-xs text-white/30 border-l-2 border-saffron/30 pl-3">
            Not a commercial food platform. Connections are made directly with neighbours off-platform.
          </p>
        </div>

        {/* Links */}
        <div>
          <p className="text-saffron font-bold text-xs uppercase tracking-widest mb-4">Explore</p>
          <div className="flex flex-col gap-3">
            <Link href="/feed" className="hover:text-saffron transition-colors">Today&apos;s kitchen</Link>
            <Link href="/chefs"  className="hover:text-saffron transition-colors">Our cooks</Link>
            <Link href="/map"    className="hover:text-saffron transition-colors">Map view</Link>
            <Link href="/join"   className="hover:text-saffron transition-colors">Join community</Link>
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="text-saffron font-bold text-xs uppercase tracking-widest mb-4">About</p>
          <div className="flex flex-col gap-3">
            <span>Dubai, UAE 🇦🇪</span>
            <span>Serving all of Dubai</span>
            <Link href="/terms" className="hover:text-saffron transition-colors">Terms of Service</Link>
          </div>
          <div className="mt-8 pt-4 border-t border-white/10">
            <span className="text-white/25 text-xs">
              © {new Date().getFullYear()} NextDoorChef. Built with ❤️ in Dubai.
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
