import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { getSiteSettings } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/sanity.images'

export default async function AboutPage() {
  const settings = await getSiteSettings()

  const title = settings?.aboutTitle || 'About'
  const body = settings?.aboutContent || null

  // ✅ Defensive: filter out any invalid Portable Text blocks (prevents "unknown block type undefined" warnings)
  const safeBody = Array.isArray(body)
    ? body.filter((b: any) => b && typeof b === 'object' && b._type)
    : null

  const portraitUrl = settings?.aboutPortrait?.asset
    ? urlFor(settings.aboutPortrait).width(900).url()
    : null

  return (
    <div className="px-page py-16 md:py-24">
      <div className="max-w-page mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-7">
            <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-6">
              {title}
            </h1>

            <div className="prose prose-neutral max-w-none">
              {safeBody && safeBody.length > 0 ? (
                <div className="text-muted-foreground text-lg leading-relaxed">
                  <PortableText
                    value={safeBody}
                    components={{
                      block: {
                        normal: ({ children }) => (
                          <p className="whitespace-pre-wrap mb-6">{children}</p>
                        ),
                      },
                      marks: {
                        link: ({ children, value }) => {
                          const href = value?.href
                          const blank = value?.blank

                          return (
                            <a
                              href={href}
                              className="underline underline-offset-4 hover:opacity-70"
                              target={blank ? '_blank' : undefined}
                              rel={blank ? 'noopener noreferrer' : undefined}
                            >
                              {children}
                            </a>
                          )
                        },
                      },
                    }}
                  />
                </div>
              ) : (
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Add your About content in Studio → <strong>Site Settings</strong> →{' '}
                  <strong>About Content</strong>.
                </p>
              )}
            </div>
          </div>

          <div className="md:col-span-5">
            {portraitUrl ? (
              <div className="relative aspect-[3.2/5] overflow-hidden rounded bg-muted">
                <Image
                  src={portraitUrl}
                  alt="About portrait"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
            ) : (
              <div className="rounded bg-muted/30 p-6 text-sm text-muted-foreground">
                Optional: add an <strong>About Portrait</strong> in Studio →{' '}
                <strong>Site Settings</strong>.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}