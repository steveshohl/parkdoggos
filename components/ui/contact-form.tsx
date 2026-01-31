'use client'

import { useState } from 'react'
import { Send, CheckCircle } from 'lucide-react'

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // UI-only placeholder - no actual submission
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="bg-muted/50 rounded p-8 text-center">
        <CheckCircle className="w-12 h-12 mx-auto text-foreground/70 mb-4" />
        <h3 className="text-lg font-medium mb-2">Message Received</h3>
        <p className="text-muted-foreground">
          This is a placeholder form. In production, connect to your preferred form handler.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-4 text-sm text-muted-foreground hover:text-foreground underline"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-4 py-3 bg-muted border-0 rounded focus:ring-2 focus:ring-foreground/20 outline-none transition-shadow"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-3 bg-muted border-0 rounded focus:ring-2 focus:ring-foreground/20 outline-none transition-shadow"
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium mb-2">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          className="w-full px-4 py-3 bg-muted border-0 rounded focus:ring-2 focus:ring-foreground/20 outline-none transition-shadow"
          placeholder="What's this about?"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full px-4 py-3 bg-muted border-0 rounded focus:ring-2 focus:ring-foreground/20 outline-none transition-shadow resize-none"
          placeholder="Tell us about your project..."
        />
      </div>

      <button
        type="submit"
        className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-medium rounded hover:opacity-90 transition-opacity"
      >
        <Send className="w-4 h-4" />
        Send Message
      </button>

      <p className="text-xs text-muted-foreground">
        Note: This is a placeholder form for demonstration purposes.
      </p>
    </form>
  )
}
