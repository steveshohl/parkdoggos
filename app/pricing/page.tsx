import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing | ParkDoggos',
  description: 'Dog portrait photography pricing in Brooklyn and NYC',
}

export default function PricingPage() {
  return (
    <div className="py-16 md:py-24 px-page">
      <div className="max-w-3xl mx-auto">
        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-6">
          Pricing
        </h1>

        {/* Intro */}
        <p className="text-lg text-muted-foreground mb-12">
          ParkDoggos offers softbox-lit, outdoor dog portrait sessions in Brooklyn and NYC.
          Sessions are designed to be calm, efficient, and tailored to your dog’s personality.
        </p>

        {/* Pricing blocks */}
        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-medium mb-2">
              Doggo Portrait Session
            </h2>
            <p className="text-muted-foreground">
              40-minute outdoor session | 8 processed, hi-res images | additional images $20 each
                         </p>
            <p className="mt-2 font-medium">
              $350
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-2">
              Deluxe Doggo Portrait Session
            </h2>
            <p className="text-muted-foreground">
              60-minute outdoor session | 12 processed, hi-res images | portraits with your doggo | additional images $20 each
            </p>
            <p className="mt-2 font-medium">
              $450
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-2">
              Commercial / Editorial Work
            </h2>
            <p className="text-muted-foreground">
              Custom pricing for brands, publications, and campaigns.
            </p>
            <p className="mt-2 font-medium">
              Please inquire
            </p>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-16">
          <a
            href="/contact"
            className="inline-block px-6 py-3 bg-accent text-accent-foreground rounded font-medium hover:opacity-90 transition-opacity"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </div>
  )
}