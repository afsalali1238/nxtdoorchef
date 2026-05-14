import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-62px)] flex flex-col items-center justify-center p-8 text-center bg-cream">
      <div className="text-6xl mb-6">🍽️</div>
      <h2 className="font-display text-4xl font-bold mb-4">Plate Not Found</h2>
      <p className="text-muted max-w-md mx-auto mb-8 leading-relaxed">
        We couldn't find the page you're looking for. It might have been moved or the chef might have taken it off the menu.
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link 
          href="/" 
          className="bg-dark text-white px-6 py-3 rounded-lg font-medium hover:bg-dark/90 transition-colors"
        >
          Return Home
        </Link>
        <Link 
          href="/feed" 
          className="bg-cream-dark text-dark px-6 py-3 rounded-lg font-medium hover:bg-black/5 transition-colors"
        >
          See Today's Kitchen
        </Link>
      </div>
    </div>
  )
}
