"use client";

import { useState } from "react";
import AnimatedHeading from "./AnimatedHeading";

export default function LetsTalk() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("https://formspree.io/f/xvzwvqkk", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("sent");
        form.reset();
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      id="contact"
      className="py-24 bg-white/40"
      aria-labelledby="contact-heading"
    >
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="max-w-xl">
          <AnimatedHeading
            id="contact-heading"
            className="font-serif text-ink text-[40px] leading-tight tracking-[-0.02em] mb-4"
          >
            {"Let's Talk"}
          </AnimatedHeading>
          <p className="font-sans text-muted text-[16px] leading-relaxed mb-10">
            Whether you&apos;re looking to collaborate, have me speak at your
            event, have a role you think could be a fit, or just want to connect
            I&apos;d love to hear from you.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label
                  htmlFor="name"
                  className="block font-sans text-[15px] text-muted mb-1.5"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full font-sans text-[16px] text-ink bg-white border border-ink/15 rounded-none px-4 py-3 outline-none focus:border-purple focus:ring-1 focus:ring-purple transition"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block font-sans text-[15px] text-muted mb-1.5"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full font-sans text-[16px] text-ink bg-white border border-ink/15 rounded-none px-4 py-3 outline-none focus:border-purple focus:ring-1 focus:ring-purple transition"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block font-sans text-[15px] text-muted mb-1.5"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="w-full font-sans text-[16px] text-ink bg-white border border-ink/15 rounded-none px-4 py-3 outline-none focus:border-purple focus:ring-1 focus:ring-purple transition resize-none"
                />
              </div>

              {status === "error" && (
                <p className="font-sans text-[16px] text-red-600">
                  Something went wrong. Please try again or reach out on
                  LinkedIn.
                </p>
              )}

              {status === "sent" && (
                <p
                  className="font-sans text-[15px] text-ink border-l-2 border-purple pl-4 py-1"
                  style={{ animation: "fadeIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both" }}
                >
                  You&apos;re in my inbox! Excited to read your message.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="font-sans font-semibold text-[16px] text-white bg-purple px-6 py-3 rounded-none hover:bg-purple-medium transition-colors disabled:opacity-60 self-start"
              >
                {status === "sending" ? "Sending…" : "Send message"}
              </button>
            </form>

          <p className="font-sans text-muted text-[15px] mt-8">
            Or find me on{" "}
            <a
              href="https://linkedin.com/in/melmilloway"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple underline decoration-purple underline-offset-4 hover:text-purple-medium transition-colors"
            >
              LinkedIn
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
