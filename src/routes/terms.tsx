import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions · Eminent Magazine" },
      { name: "description", content: "Terms and conditions governing the Eminent Magazine voting contest platform." },
      { property: "og:title", content: "Terms & Conditions · Eminent Magazine" },
      { property: "og:description", content: "Rules for contestants and voters on the Eminent Magazine platform." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <SiteLayout>
      <PageHeader
        canGoBack={true}
        eyebrow="Legal"
        title="Terms & Conditions"
        subtitle="Effective 1st August, 2025 · Last updated 31st July, 2025"
      />
      <section className="container-editorial py-16 md:py-24">
        <article className="prose-editorial max-w-3xl mx-auto text-foreground/90 leading-relaxed space-y-8">
          <p>
            These Terms and Conditions (“Terms”) govern your access to and use of our online voting
            contest platform (“the Platform”). By participating in the contest as a contestant or
            voter, you agree to be bound by these Terms. If you do not agree, please do not use the
            Platform.
          </p>

          <Section n="1" title="Eligibility">
            <ul>
              <li>Contestants must be at least 18 years old or have parental/guardian consent to enter.</li>
              <li>Voters must use accurate and valid contact information.</li>
              <li>We reserve the right to verify eligibility at any time.</li>
            </ul>
          </Section>

          <Section n="2" title="Contest Overview">
            <ul>
              <li>Contestants upload their pictures and any required details to enter.</li>
              <li>The public votes for their favorite contestants using paid voting.</li>
              <li>Votes are counted only after successful payment confirmation.</li>
              <li>The contestant with the highest verified votes at contest end wins.</li>
            </ul>
          </Section>

          <Section n="3" title="Entry Rules">
            <ul>
              <li>Entries must be original and submitted with full consent of the individual in the photo.</li>
              <li>By entering, contestants grant us a royalty-free license to use content for promotion.</li>
              <li>Inappropriate or offensive content will lead to disqualification.</li>
            </ul>
          </Section>

          <Section n="4" title="Voting Rules">
            <ul>
              <li>Votes are cast via paid options and are only counted after successful payment.</li>
              <li>Vote limits may be applied per user, IP, or location as necessary.</li>
              <li>Vote manipulation is strictly prohibited and may lead to disqualification or legal action.</li>
            </ul>
          </Section>

          <Section n="5" title="Prizes & Winner Selection">
            <ul>
              <li>The winner is the contestant with the most verified votes at the contest close.</li>
              <li>In the case of a tie, a tie-breaker may be applied.</li>
              <li>Winners must provide valid ID to claim their prize.</li>
            </ul>
          </Section>

          <Section n="6" title="Refunds">
            <p>All payments for votes are non-refundable, as outlined in our Refund Policy.</p>
          </Section>

          <Section n="7" title="Disqualification">
            <p>We reserve the right to disqualify any user for fraudulent activity, abuse, or rule violations.</p>
          </Section>

          <Section n="8" title="Intellectual Property">
            <p>
              All content on the Platform is owned by us or our licensors. Contestants retain rights
              to submitted content but grant us permission to use it for contest promotion and
              operation.
            </p>
          </Section>

          <Section n="9" title="Limitation of Liability">
            <p>
              We are not liable for technical issues, payment errors, vote miscounts, or user
              disputes. Use of the Platform is at your own risk.
            </p>
          </Section>

          <Section n="10" title="Changes to the Contest or Terms">
            <p>
              We may update these Terms or modify the contest at any time. Continued use of the
              Platform after changes implies acceptance.
            </p>
          </Section>

          <Section n="11" title="Governing Law">
            <p>
              These Terms are governed by the laws of Nigeria. Legal disputes will be resolved under
              that jurisdiction.
            </p>
          </Section>

          <Section n="12" title="Contact Us">
            <p>If you have any questions, please contact us at:</p>
            <ul>
              <li>Email: <a className="underline" href="mailto:info@eminentmagazine.com">info@eminentmagazine.com</a></li>
              <li>Phone: +234 706-043-9131</li>
              <li>Address: 75 Arthur Eze Avenue, Unizik Junction, Awka, Anambra State</li>
            </ul>
          </Section>
        </article>
      </section>
    </SiteLayout>
  );
}

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl md:text-3xl mb-3">
        <span className="text-gold mr-3">{n}.</span>
        {title}
      </h2>
      <div className="[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_p]:mt-2 text-foreground/85">
        {children}
      </div>
    </section>
  );
}
