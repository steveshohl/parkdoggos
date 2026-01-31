'use client'

import { useState } from 'react'

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xeeknzoo'

export default function ContactPage() {
  const [status, setStatus] = useState<
    'idle' | 'sending' | 'success' | 'error'
  >('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg(null)

    const form = e.currentTarget
    const data = new FormData(form)

    // Honeypot
    const trap = String(data.get('website') || '').trim()
    if (trap) {
      setStatus('success')
      form.reset()
      return
    }

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })

      if (res.ok) {
        setStatus('success')
        form.reset()
        return
      }

      const json = await res.json().catch(() => null)
      setStatus('error')
      setErrorMsg(
        json?.errors?.[0]?.message ||
          'Something went wrong. Please try again.'
      )
    } catch {
      setStatus('error')
      setErrorMsg('Network error. Please try again.')
    }
  }

  return (
    <div className="py-12 md:py-16 px-page">
      <div className="max-w-[900px] mx-auto">
        <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-4">
          Contact
        </h1>
        <p className="text-muted-foreground text-lg mb-10">
          Please tell me about your dog, your idea, or what you’d like to commission.
        </p>

        {/* CARD */}
        <div className="rounded border border-border/80 bg-muted/90 p-6 md:p-8">
          {status === 'success' ? (
            <div className="space-y-3">
              <h2 className="text-xl font-medium">Message sent</h2>
              <p className="text-muted-foreground">
                I’ll get back to you soon.
              </p>
              <button
                className="underline underline-offset-4"
                onClick={() => setStatus('idle')}
                type="button"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              {/* Honeypot */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="name"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full rounded border border-border bg-white px-3 py-2"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full rounded border border-border bg-white px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="subject"
                >
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="Portrait session, commission, collaboration…"
                  className="w-full rounded border border-border bg-white px-3 py-2"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="message"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={7}
                  className="w-full rounded border border-border bg-white px-3 py-2"
                  placeholder="Please tell me a bit about your dog (breed, temperament), location, timing, etc."
                />
              </div>

              <input
                type="hidden"
                name="_subject"
                value="New ParkDoggos inquiry"
              />

              {status === 'error' && (
                <p className="text-sm text-red-600">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="inline-flex items-center justify-center rounded bg-black px-5 py-2.5 text-white disabled:opacity-60"
              >
                {status === 'sending' ? 'Sending…' : 'Send message'}
              </button>

              <p className="text-xs text-muted-foreground">
                This form is protected by a spam honeypot.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}