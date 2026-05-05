import { Layout } from "@/components/Layout";
import { SeoHead } from "@/components/SeoHead";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import LastUpdated from "@/components/LastUpdated";

const ACCENT = "#00a884";

export default function Terms() {
  return (
    <Layout>
      <SeoHead
        title="Terms and Conditions"
        description="Read our Terms and Conditions for using Invisible Text Generator and our services."
        canonical="https://textsinvisible.com/terms-and-conditions"
        ogTitle="Terms and Conditions"
        ogDescription="Our Terms and Conditions for using our services."
      />
      <div className="max-w-5xl mx-auto py-12 px-1">
        <div className="mb-8 space-y-2">
          <h1 className="text-4xl md:text-5xl font-display font-bold">Terms and Conditions</h1>
          <LastUpdated page="terms-and-conditions" className="text-muted-foreground" />
        </div>

        <Card className="glass-card overflow-hidden" style={{ borderTop: `4px solid ${ACCENT}` }}>
          <CardContent className="p-8 md:p-10">
            <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:font-bold prose-p:leading-relaxed prose-a:text-[#00a884] prose-a:no-underline hover:prose-a:underline">
              <p>
                Welcome to Textsinvisible (“we”, “our” or “the Service”). These Terms and Conditions govern your use of our website and all tools available on it. By accessing or using the Website, you are acknowledging that you have read, comprehended and accepted to be bound by these Terms. In case you do not like anything, then please stop using the Website.
              </p>

              <h2 className="text-2xl mt-8 mb-4">1. Eligibility</h2>
              <p>
                You must be at least 18 years of age and have the capacity to form legal contracts to use the Website. With the Service you state that you fulfill these requirements.
              </p>

              <h2 className="text-2xl mt-8 mb-4">2. Service Description</h2>
              <p>
                Textsinvisible provides online tools that facilitate invisible Unicode characters and related text formatting. This service is available for personal and legal purposes, and we reserve the right to change, suspend, or discontinue it at any time without prior notice.
              </p>

              <h2 className="text-2xl mt-8 mb-4">3. Intellectual Property</h2>
              <p>
                All original content on the website is our property, unless otherwise stated. You are permitted limited and non-commercial use, however the following is not permitted:
              </p>
              <ul>
                <li>Republishing or distributing content without permission.</li>
                <li>Using the content for sale or commercial purposes.</li>
                <li>Interfering with or attempting to reverse engineer the functionality of the website.</li>
              </ul>

              <h2 className="text-2xl mt-8 mb-4">4. User Behavior</h2>
              <p>You agree not to use the Website for any unlawful or harmful purpose. In particular, you will not:</p>
              <ul>
                <li>Violation of a law or regulation.</li>
                <li>Transmission of viruses, malware or malicious code.</li>
                <li>Attempted unauthorized access to the server or data.</li>
                <li>Automated scraping or data collection.</li>
              </ul>
              <p>We may suspend or terminate your access in the event of misuse.</p>

              <h2 className="text-2xl mt-8 mb-4">5. User Content</h2>
              <p>
                If you provide us with any feedback or content, you grant us a worldwide, royalty-free right to use, modify, and publish it. You warrant that the content you provide is legal and does not infringe the rights of any third party. We have the right to delete content at our own will.
              </p>

              <h2 className="text-2xl mt-8 mb-4">6. Third-Party Links</h2>
              <p>
                The Website may contain external links that are provided for convenience only. We are not responsible for the content or policies of these websites, and you access them at your own risk.
              </p>

              <h2 className="text-2xl mt-8 mb-4">7. Disclaimer of Warranties</h2>
              <p>
                The Service is offered on an as is policy and on an as available policy. We do not guarantee that the Website will be free from interruptions and errors and that the generated invisible characters will be compatible with all platforms in an equal manner.
              </p>

              <h2 className="text-2xl mt-8 mb-4">8. Limitation of Liability</h2>
              <p>
                To the extent permitted by applicable law, we will not be liable for any indirect or consequential damages, loss of data, or business interruption. If any liability is established, it will not exceed the greater of $100 USD or the fees paid (if any).
              </p>

              <h2 className="text-2xl mt-8 mb-4">9. Finishing</h2>
              <p>
                We can freeze or block your access without any warning in case of violation of these Terms. When you are terminated, you will no longer have the right to use the Service.
              </p>

              <h2 className="text-2xl mt-8 mb-4">10. Privacy</h2>
              <p>
                Use of the Website is subject to our <Link href="/privacy-policy">Privacy Policy</Link>, and by using the Service you consent to the collection and use of information as described there.
              </p>

              <h2 className="text-2xl mt-8 mb-4">11. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the United States of America. Users accessing from other countries shall be responsible for compliance with their local laws.
              </p>

              <h2 className="text-2xl mt-8 mb-4">12. Changes</h2>
              <p>
                We may modify these Terms at any time, and updates will be posted on this page with a new effective date. Your use of the Website following the updates will constitute acceptance of the new Terms.
              </p>

              <h2 className="text-2xl mt-8 mb-4">13. Contact</h2>
              <p>If you have any questions about these terms, please contact us:</p>
              <div className="not-prose space-y-3 mt-4 p-4 rounded-xl border bg-secondary/10">

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="font-bold">Website:</span>
                  <a
                    href="https://textsinvisible.com/"
                    className="font-medium underline break-all hover:opacity-80"
                    style={{ color: ACCENT }}
                  >
                    https://textsinvisible.com/
                  </a>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="font-bold">Contact Page:</span>
                  <Link
                    href="/contact"
                    className="font-medium underline break-all hover:opacity-80"
                    style={{ color: ACCENT }}
                  >
                    https://textsinvisible.com/contact/
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
