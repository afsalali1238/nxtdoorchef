// src/components/Footer.tsx
// ADAPTED FROM cr8: same structure, NextDoorChef brand

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-dark text-white/40 text-sm">
      <div className="max-w-6xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <p className="font-display text-white font-bold text-lg mb-2">
            NextDoor<span className="text-saffron">Chef</span>
          </p>
          <p className="leading-relaxed text-white/50 mb-4">
            A hyperlocal community directory for discovering home cultures through food.
          </p>
          <p className="text-xs text-white/30 border-l-2 border-white/10 pl-3">
            Not a commercial food marketplace. Connections are made directly with neighbours off-platform.
          </p>
        </div>

        {/* Links */}
        <div>
          <p className="text-white/70 font-medium mb-3">Explore</p>
          <div className="flex flex-col gap-2">
            <Link href="/feed" className="hover:text-white transition-colors">Live feed</Link>
            <Link href="/chefs"  className="hover:text-white transition-colors">Our cooks</Link>
            <Link href="/map"    className="hover:text-white transition-colors">Map view</Link>
            <Link href="/join"   className="hover:text-white transition-colors">Join community</Link>
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="text-white/70 font-medium mb-3">About</p>
          <div className="flex flex-col gap-2">
            <span>Dubai, UAE 🇦🇪</span>
            <span>Serving all of Dubai</span>
            <Link href="/terms" className="hover:text-white transition-colors mb-2">Terms of Service</Link>
            <span className="text-white/30 text-xs mt-2">
              © {new Date().getFullYear()} NextDoorChef.
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
