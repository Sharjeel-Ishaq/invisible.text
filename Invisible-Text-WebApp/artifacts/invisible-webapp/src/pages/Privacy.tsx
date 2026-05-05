import { Layout } from "@/components/Layout";
import { SeoHead } from "@/components/SeoHead";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import LastUpdated from "@/components/LastUpdated";

const ACCENT = "#00a884";

export default function Privacy() {
  // lastUpdated is derived from the page file mtime via the API to only change when the page changes

  return (
    <Layout>
      <SeoHead
        title="Privacy Policy"
        description="Our Privacy Policy explains how we collect, use, and protect your data when using Invisible Text Generator."
        canonical="https://textsinvisible.com/privacy-policy"
        ogTitle="Privacy Policy"
        ogDescription="Learn how we protect your privacy and data."
      />
      <div className="max-w-4xl mx-auto py-12 px-1">
        <div className="mb-8 space-y-2">
          <h1 className="text-4xl md:text-5xl font-display font-bold">Privacy Policy</h1>
          <LastUpdated page="privacy-policy" className="text-muted-foreground" />
        </div>

        <Card className="glass-card overflow-hidden" style={{ borderTop: `4px solid ${ACCENT}` }}>
          <CardContent className="p-8 md:p-10">
            <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:font-bold prose-p:leading-relaxed prose-a:text-[#00a884] prose-a:no-underline hover:prose-a:underline">
              <p>
                Welcome to Textsinvisible (“Website”, “we”, “our”, or “us”). Your privacy matters to us. This Privacy Policy explains what information we collect, how we use it, and the choices you have regarding your data when using our invisible text generator services.
              </p>
              <p>
                By accessing or using our Website, you agree to the practices described in this policy.
              </p>

              <h2 className="text-2xl mt-8 mb-4">1. Information We Collect</h2>
              <h3 className="text-xl mt-6 mb-2">A. Personal Information</h3>
              <p>
                We will only use your personal information in accordance with your consent. Which you have given us permission to do.
              </p>
              <ul>
                <li>Email address (for contact or support requests)</li>
                <li>Any information you submit through contact forms</li>
              </ul>
              <p>We do not require account registration to use our invisible text generator tool.</p>

              <h3 className="text-xl mt-6 mb-2">B. Automatically Collected Data</h3>
              <p>
                When you visit our Website, certain technical data may be collected automatically, including:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 mt-4">
                <ul className="mt-0">
                  <li>IP address</li>
                  <li>Browser type and version</li>
                  <li>Device type</li>
                  <li>Operating system</li>
                </ul>
                <ul className="mt-0">
                  <li>Pages visited</li>
                  <li>Time and date of visit</li>
                  <li>Time spent on pages</li>
                  <li>Referring URLs</li>
                </ul>
              </div>
              <p>We collect this information for better service, security, and statistical analysis.</p>

              <h2 className="text-2xl mt-8 mb-4">2. Cookies and Tracking Technologies</h2>
              <p>
                Textsinvisible uses cookies and similar technologies to enhance user experience and analyze website traffic.
              </p>
              <h3 className="text-xl mt-6 mb-2">Types of Cookies We Use</h3>
              <div className="space-y-4">
                <div>
                  <strong className="text-foreground">Essential Cookies</strong>
                  <p className="mt-1">These are required for the proper functioning of the Website.</p>
                </div>
                <div>
                  <strong className="text-foreground">Analytics Cookies</strong>
                  <p className="mt-1">This tells us how visitors use the website, so we can make it faster and easier.</p>
                </div>
                <div>
                  <strong className="text-foreground">Preference Cookies</strong>
                  <p className="mt-1">These remember your settings and preferences for a smoother experience. You can turn cookies on or off in your browser settings. But remember, if you turn cookies off, many useful features of the website, such as login or personal preferences, will not work properly.</p>
                </div>
              </div>

              <h2 className="text-2xl mt-8 mb-4">3. How We Use Your Information</h2>
              <p>We may use collected information to:</p>
              <ul>
                <li>Operate and maintain the Website</li>
                <li>Improve functionality and performance</li>
                <li>Respond to support inquiries</li>
                <li>Monitor and prevent misuse or security issues</li>
                <li>Comply with legal obligations</li>
              </ul>
              <p>We do not sell your personal information.</p>

              <h2 className="text-2xl mt-8 mb-4">4. Data Sharing</h2>
              <p>We may share limited data only in the following situations:</p>
              <div className="space-y-4">
                <div>
                  <strong className="text-foreground">Service Providers</strong>
                  <p className="mt-1">With trusted third-party services that help us operate analytics, hosting, or maintenance.</p>
                </div>
                <div>
                  <strong className="text-foreground">Legal Requirements</strong>
                  <p className="mt-1">If required by law or government authorities.</p>
                </div>
                <div>
                  <strong className="text-foreground">Business Transfers</strong>
                  <p className="mt-1">In case of merger, acquisition, or asset sale, data may be transferred as part of the business operations.</p>
                </div>
              </div>
              <p>We ensure reasonable safeguards are applied when sharing information.</p>

              <h2 className="text-2xl mt-8 mb-4">5. Data Retention</h2>
              <p>We retain personal information only as long as necessary to:</p>
              <ul>
                <li>Provide requested services</li>
                <li>Meet legal obligations</li>
                <li>Resolve disputes</li>
                <li>Enforce agreements</li>
              </ul>
              <p>Analytics data is typically stored for a shorter period unless needed for security or compliance.</p>

              <h2 className="text-2xl mt-8 mb-4">6. International Data Transfers</h2>
              <p>
                Your information may be processed and stored in countries outside your location. By using our Website, you consent to such transfers, provided appropriate security measures are in place.
              </p>

              <h2 className="text-2xl mt-8 mb-4">7. Your Rights</h2>
              <p>Depending on your jurisdiction, you may have the right to:</p>
              <ul>
                <li>Access your personal data</li>
                <li>Request correction</li>
                <li>Request deletion</li>
                <li>Object to processing</li>
                <li>Withdraw consent</li>
              </ul>
              <p>To exercise these rights, contact us using the details below.</p>

              <h2 className="text-2xl mt-8 mb-4">8. Children’s Privacy</h2>
              <p>
                Textsinvisible is not intended for children under 13 years of age. We do not knowingly collect personal information from children. If you believe a child has provided personal information, please contact us, and we will take appropriate action.
              </p>

              <h2 className="text-2xl mt-8 mb-4">9. Third-Party Links</h2>
              <p>
                Our Website may contain links to external websites. We are not responsible for the privacy practices or content of third-party sites. Please review their privacy policies separately.
              </p>

              <h2 className="text-2xl mt-8 mb-4">10. Data Security</h2>
              <p>
                We use reasonable technical and administrative measures to protect your information. However, no online transmission or storage system can be guaranteed 100% secure.
              </p>

              <h2 className="text-2xl mt-8 mb-4">11. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy periodically. When we do, we will revise the “Last Updated” date at the top of this page. Continued use of the Website after updates indicates acceptance of the revised policy.
              </p>

              <h2 className="text-2xl mt-8 mb-4">12. Contact Us</h2>
              <p>If you have questions about this Privacy Policy, you may contact us at:</p>
              <div className="not-prose space-y-3 mt-4 p-4 rounded-xl border bg-secondary/10">
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                  <span className="font-bold">Website:</span>
                  <a
                    href="https://textsinvisible.com/"
                    className="font-medium underline break-all hover:opacity-80"
                    style={{ color: ACCENT }}
                  >
                    https://textsinvisible.com/
                  </a>
                </div>

                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
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
