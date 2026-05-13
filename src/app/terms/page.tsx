import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service — NextDoorChef',
}

export default function TermsPage() {
  return (
    <div className="pt-nav min-h-screen bg-cream">
      <div className="max-w-3xl mx-auto px-8 py-16">
        <h1 className="font-display text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-saffron max-w-none text-dark/80 space-y-6">
          <p>Last updated: May 2026</p>

          <section className="space-y-3 mt-8">
            <h2 className="text-2xl font-bold text-dark">1. Nature of the Platform</h2>
            <p>
              NextDoorChef is a community discovery platform designed to connect neighbours through food and culture in the UAE. 
              <strong> We are not a food delivery service, community directory, or commercial restaurant aggregator.</strong>
            </p>
            <p>
              The platform serves only as a directory for discovering local home cooks. Any interaction, communication, or sharing of food occurs entirely off-platform and is the sole responsibility of the individuals involved.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-dark">2. No Commercial Transactions</h2>
            <p>
              NextDoorChef does not facilitate, process, or guarantee any financial transactions. Users cannot "order" or "pay" for food through this website. 
              Connections are made via third-party communication tools (such as WhatsApp) for the purpose of community engagement and cultural exchange.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-dark">3. Health and Safety Disclaimer</h2>
            <p>
              Food shared by individuals listed on this platform is prepared in private home kitchens, which may not be inspected by the UAE Department of Economy and Tourism (DET) or municipal food safety authorities unless explicitly stated by the cook.
            </p>
            <p>
              <strong>NextDoorChef does not vet, inspect, or guarantee the safety, quality, or hygiene of any food shared by individuals found through this directory.</strong> 
              Users participate entirely at their own risk. It is the responsibility of the user to inquire about allergens, ingredients, and preparation methods directly with the cook.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-dark">4. User Responsibilities</h2>
            <p>
              By using NextDoorChef, you agree that NextDoorChef, its creators, and its affiliates are completely indemnified from any liability, illness, injury, or dispute arising from the consumption of food or interactions with individuals found through the platform.
            </p>
            <p>
              Cooks listing their profiles are solely responsible for ensuring they comply with all applicable UAE laws regarding the sharing or selling of food from home.
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-border">
            <Link href="/" className="text-saffron font-medium hover:underline">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
