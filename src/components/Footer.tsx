// src/components/Footer.tsx
// ADAPTED FROM cr8: same structure, NextDoorChef brand

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#1A0A00] py-6 px-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
        <span className="font-bold text-white">
          NxtDoor<span className="text-[#D4780A]">Chef</span>
        </span>
        <span className="text-sm text-white/50">
          © 2026 · Made with warmth in Dubai
        </span>
      </div>
    </footer>
  )
}
