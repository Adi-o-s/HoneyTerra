import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Privacy Policy",
  description:
    "How HoneyTerra collects, uses, shares and protects your personal information when you shop with us.",
};

const LAST_UPDATED = "June 23, 2026";

export default function PrivacyPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-50 via-paper to-cream" />
        <div className="absolute inset-0 -z-10 bg-honeycomb opacity-60" />
        <div className="container-page py-14 text-center lg:py-16">
          <p className="inline-flex items-center gap-2 rounded-full bg-brand-100/70 px-4 py-1.5 text-sm font-semibold text-brand-700">
            <ShieldCheck className="h-4 w-4" /> Your privacy
          </p>
          <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-ink-muted">Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      <section className="container-page max-w-3xl pb-24">
        <div className="space-y-10 text-ink-soft">
          <p className="text-lg leading-relaxed">
            At HoneyTerra (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), we believe privacy is part of treating people
            well. This policy explains what personal information we collect when you visit our
            website or place an order, how we use it, who we share it with, and the choices and
            rights you have. By using our website you agree to the practices described here.
          </p>

          <Section title="1. Information we collect">
            <p>We collect information in three ways:</p>
            <ul>
              <li>
                <strong>Information you give us.</strong> Your name, email address, phone number,
                shipping and billing address, account login details, and any messages you send us
                — for example when you create an account, place an order, sign up for our
                newsletter, or contact support.
              </li>
              <li>
                <strong>Order and payment information.</strong> Details about the products you buy
                and your order history. Payments are processed by our payment provider; we receive
                confirmation of payment and limited transaction details, but{" "}
                <strong>we never see or store your full card number, UPI PIN, or banking
                passwords</strong>.
              </li>
              <li>
                <strong>Information collected automatically.</strong> Basic technical data such as
                your device type, browser, IP address, and how you use our site, gathered through
                cookies and similar technologies (see Section 6).
              </li>
            </ul>
          </Section>

          <Section title="2. How we use your information">
            <p>We use your information to:</p>
            <ul>
              <li>process, fulfil and deliver your orders, and send order confirmations and updates;</li>
              <li>create and manage your account and let you track orders;</li>
              <li>respond to your questions and provide customer support;</li>
              <li>send you marketing emails and offers, where you have asked to receive them;</li>
              <li>prevent fraud, secure our website, and meet our legal and tax obligations;</li>
              <li>improve our products, website and overall customer experience.</li>
            </ul>
          </Section>

          <Section title="3. Legal basis for processing">
            <p>
              We process your information where it is necessary to perform our contract with you
              (such as fulfilling an order), where we have your consent (such as marketing emails),
              where we have a legitimate interest (such as improving and securing our service), or
              where we are required to by law.
            </p>
          </Section>

          <Section title="4. Who we share it with">
            <p>
              We do not sell your personal information. We share it only with trusted service
              providers who help us run our business, and only as far as needed to do their job:
            </p>
            <ul>
              <li><strong>Payment processors</strong> (e.g. Razorpay) to handle payments securely;</li>
              <li><strong>Logistics and courier partners</strong> to deliver your orders;</li>
              <li><strong>Hosting, database and email providers</strong> that power our website and communications;</li>
              <li>
                <strong>Authorities or advisors</strong> where we are legally required to disclose
                information, or to protect our rights and the safety of others.
              </li>
            </ul>
            <p>
              These providers are required to protect your information and may only use it for the
              services they provide to us.
            </p>
          </Section>

          <Section title="5. How long we keep your information">
            <p>
              We keep your information for as long as your account is active or as needed to provide
              you with our services. We also retain order and transaction records for as long as
              required to meet legal, accounting and tax obligations. When we no longer need your
              information, we securely delete or anonymise it.
            </p>
          </Section>

          <Section title="6. Cookies">
            <p>
              We use cookies and similar technologies to keep you signed in, remember the items in
              your cart, understand how our site is used, and improve your experience. You can
              control or disable cookies through your browser settings, though some parts of the
              site may not work properly without them.
            </p>
          </Section>

          <Section title="7. How we protect your information">
            <p>
              We use industry-standard safeguards — including encryption in transit (HTTPS),
              access controls and secure, reputable infrastructure providers — to protect your
              information. No method of transmission over the internet is ever completely secure,
              but we work hard to keep your data safe and to limit who can access it.
            </p>
          </Section>

          <Section title="8. Your rights and choices">
            <ul>
              <li>
                <strong>Access and update.</strong> You can view and update your account details
                any time from your account page.
              </li>
              <li>
                <strong>Marketing opt-out.</strong> You can unsubscribe from marketing emails using
                the link in any email, without affecting order-related messages.
              </li>
              <li>
                <strong>Deletion.</strong> You can ask us to delete your personal information,
                subject to records we must keep by law.
              </li>
            </ul>
            <p>
              To exercise any of these rights, email us at{" "}
              <a href="mailto:hello@honeyterra.in">hello@honeyterra.in</a>.
            </p>
          </Section>

          <Section title="9. Children's privacy">
            <p>
              Our website and products are intended for adults. We do not knowingly collect
              personal information from children. If you believe a child has provided us with their
              information, please contact us and we will delete it.
            </p>
          </Section>

          <Section title="10. Changes to this policy">
            <p>
              We may update this policy from time to time to reflect changes in our practices or
              the law. When we do, we&rsquo;ll revise the &ldquo;Last updated&rdquo; date above. Significant changes
              will be communicated where appropriate.
            </p>
          </Section>

          <Section title="11. Contact us">
            <p>
              Questions about this policy or your information? We&rsquo;re happy to help. Reach us at{" "}
              <a href="mailto:hello@honeyterra.in">hello@honeyterra.in</a>, or through our{" "}
              <Link href="/contact">contact page</Link>.
            </p>
          </Section>
        </div>
      </section>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-brand-800">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed [&_a]:font-semibold [&_a]:text-brand-700 [&_a:hover]:underline [&_li]:ml-1 [&_strong]:text-ink [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
        {children}
      </div>
    </div>
  );
}
