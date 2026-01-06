'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function TermsPage() {
  return (
    <main 
      className="min-h-screen flex flex-col"
      style={{
        background: 'linear-gradient(135deg, #1a1625 0%, #2d1b3d 100%)',
        padding: '24px 20px',
        paddingBottom: '100px'
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/settings">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center w-12 h-12 rounded-full glass-card"
              style={{
                cursor: 'pointer',
                border: 'none'
              }}
            >
              <span style={{ fontSize: '24px' }}>←</span>
            </motion.button>
          </Link>
          <h1 style={{ 
            color: '#ffffff', 
            fontSize: '32px', 
            fontWeight: 600, 
            letterSpacing: '0.3px' 
          }}>
            Terms of Service
          </h1>
          <div className="w-12"></div>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="glass-card rounded-3xl"
          style={{
            padding: '40px',
            color: '#ffffff',
            lineHeight: '1.8'
          }}
        >
          <p style={{ 
            color: '#a8a8b3', 
            fontSize: '14px', 
            marginBottom: '32px',
            fontStyle: 'italic'
          }}>
            Last Updated: January 5, 2026
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Section 1 */}
            <section>
              <h2 style={{ 
                color: '#ffffff', 
                fontSize: '24px', 
                fontWeight: 600, 
                marginBottom: '16px',
                letterSpacing: '0.3px'
              }}>
                1. ACCEPTANCE OF TERMS
              </h2>
              <p style={{ color: '#e0e0e0', marginBottom: '12px' }}>
                By accessing and using this journaling app ("the Service"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
              </p>
              <div style={{ marginLeft: '20px' }}>
                <p style={{ color: '#e0e0e0', marginBottom: '8px', fontWeight: 500 }}>Age Requirement:</p>
                <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                  <li>You must be at least 13 years old to use this Service</li>
                  <li>If you are under 18, you must have parental consent</li>
                  <li>By using the Service, you confirm you meet these age requirements</li>
                </ul>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 style={{ 
                color: '#ffffff', 
                fontSize: '24px', 
                fontWeight: 600, 
                marginBottom: '16px',
                letterSpacing: '0.3px'
              }}>
                2. USER RESPONSIBILITIES
              </h2>
              <p style={{ color: '#e0e0e0', marginBottom: '12px' }}>You are responsible for:</p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Ensuring your use of the Service complies with applicable laws</li>
                <li>Not using the Service for any illegal or unauthorized purpose</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 style={{ 
                color: '#ffffff', 
                fontSize: '24px', 
                fontWeight: 600, 
                marginBottom: '16px',
                letterSpacing: '0.3px'
              }}>
                3. ACCOUNT RULES
              </h2>
              <p style={{ color: '#e0e0e0', marginBottom: '12px' }}>You agree to:</p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc', marginBottom: '16px' }}>
                <li>Provide accurate and complete information when creating an account</li>
                <li>Use a strong password (minimum 8 characters)</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Not share your account credentials with others</li>
                <li>Maintain only one account per person</li>
              </ul>
              <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>Prohibited Activities:</p>
              <p style={{ color: '#e0e0e0', marginBottom: '12px' }}>You agree NOT to:</p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                <li>Upload malicious code, viruses, or harmful software</li>
                <li>Attempt to hack, breach, or test the security of the Service</li>
                <li>Use the Service to harass, abuse, or harm others</li>
                <li>Create multiple accounts to abuse features</li>
                <li>Attempt to access other users' accounts or data</li>
                <li>Use automated tools to scrape or copy data</li>
                <li>Reverse engineer or decompile the application</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h2 style={{ 
                color: '#ffffff', 
                fontSize: '24px', 
                fontWeight: 600, 
                marginBottom: '16px',
                letterSpacing: '0.3px'
              }}>
                4. USER CONTENT AND OWNERSHIP
              </h2>
              <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>Your Journal Entries:</p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc', marginBottom: '16px' }}>
                <li>You retain full ownership of all journal entries you create</li>
                <li>Your journals are private and personal to you</li>
                <li>We will never read, access, share, or sell your journal content without your permission</li>
                <li>We store your data solely to provide the Service to you</li>
              </ul>
              <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>Our Limited License:</p>
              <p style={{ color: '#e0e0e0', marginBottom: '12px' }}>By using the Service, you grant us a limited license to:</p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc', marginBottom: '16px' }}>
                <li>Store your journal entries on our secure servers</li>
                <li>Process your content to provide features (AI cleanup, search, notifications)</li>
                <li>Back up your data for security and recovery purposes</li>
              </ul>
              <p style={{ color: '#e0e0e0', marginBottom: '12px' }}>This license ends when you delete your account or specific entries.</p>
              <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>Your Rights:</p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                <li>Export all your data at any time through the app</li>
                <li>Delete individual entries whenever you wish</li>
                <li>Request complete account deletion, which permanently removes all your data</li>
                <li>Access your data through the app interface</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section>
              <h2 style={{ 
                color: '#ffffff', 
                fontSize: '24px', 
                fontWeight: 600, 
                marginBottom: '16px',
                letterSpacing: '0.3px'
              }}>
                5. AI-POWERED FEATURES
              </h2>
              <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>Grammar Cleanup:</p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc', marginBottom: '16px' }}>
                <li>Our AI grammar cleanup feature uses Google Gemini to improve text quality</li>
                <li>AI processing is not perfect and may make errors or change meaning</li>
                <li>You are responsible for reviewing AI-processed content before saving</li>
                <li>We do not guarantee the accuracy, completeness, or appropriateness of AI-generated text</li>
                <li>You can disable this feature at any time in settings</li>
              </ul>
              <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>Voice Transcription:</p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                <li>Voice-to-text uses browser speech recognition technology</li>
                <li>Transcription accuracy may vary based on accent, audio quality, language, and environment</li>
                <li>You are responsible for reviewing and editing all transcribed text</li>
                <li>Voice recordings are processed locally when possible</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section>
              <h2 style={{ 
                color: '#ffffff', 
                fontSize: '24px', 
                fontWeight: 600, 
                marginBottom: '16px',
                letterSpacing: '0.3px'
              }}>
                6. ACCOUNT TERMINATION
              </h2>
              <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>Your Right to Terminate:</p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc', marginBottom: '16px' }}>
                <li>You may delete your account at any time through the app settings</li>
                <li>Account deletion is permanent and cannot be undone</li>
                <li>All your data will be permanently deleted within 30 days</li>
                <li>You can export your data before deletion</li>
              </ul>
              <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>Our Right to Terminate:</p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                <li>We may suspend or terminate accounts that violate these terms</li>
                <li>We may terminate accounts used for illegal activity or abuse of the Service</li>
                <li>We will provide notice when possible, except in cases of serious violations</li>
                <li>Upon termination by us, your access will be revoked immediately</li>
                <li>You may contact us to appeal termination decisions</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section>
              <h2 style={{ 
                color: '#ffffff', 
                fontSize: '24px', 
                fontWeight: 600, 
                marginBottom: '16px',
                letterSpacing: '0.3px'
              }}>
                7. SERVICE AVAILABILITY AND MODIFICATIONS
              </h2>
              <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>Service Availability:</p>
              <p style={{ color: '#e0e0e0', marginBottom: '12px' }}>
                We strive to provide a reliable Service, but we do not guarantee that the Service will be available at all times. The Service may be temporarily unavailable due to:
              </p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc', marginBottom: '16px' }}>
                <li>Scheduled maintenance (we'll notify you when possible)</li>
                <li>Technical issues or server problems</li>
                <li>Updates or improvements</li>
                <li>Circumstances beyond our control</li>
              </ul>
              <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>Service Changes:</p>
              <p style={{ color: '#e0e0e0', marginBottom: '12px' }}>We reserve the right to:</p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc', marginBottom: '12px' }}>
                <li>Modify, suspend, or discontinue any feature at any time</li>
                <li>Update the app to fix bugs, improve security, or add features</li>
                <li>Change pricing structures (with 30 days notice for existing users)</li>
              </ul>
              <p style={{ color: '#e0e0e0' }}>
                We are not liable for any modifications, interruptions, or temporary unavailability.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 style={{ 
                color: '#ffffff', 
                fontSize: '24px', 
                fontWeight: 600, 
                marginBottom: '16px',
                letterSpacing: '0.3px'
              }}>
                8. DATA AND PRIVACY
              </h2>
              <p style={{ color: '#e0e0e0', marginBottom: '12px' }}>
                Your privacy is important to us. Please review our <Link href="/privacy" style={{ color: '#f4a261', textDecoration: 'underline' }}>Privacy Policy</Link> to understand:
              </p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc', marginBottom: '16px' }}>
                <li>What data we collect (email, journal entries, usage data)</li>
                <li>How we store and protect your data (encryption, secure servers)</li>
                <li>How we use your data (to provide and improve the Service)</li>
                <li>Your rights regarding your data (access, export, deletion)</li>
                <li>How to delete your data permanently</li>
              </ul>
              <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>Data Security:</p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                <li>We use industry-standard encryption to protect your data in transit and at rest</li>
                <li>We store data on secure servers provided by Supabase</li>
                <li>We implement authentication and access controls</li>
                <li>However, no system is 100% secure - please use a strong, unique password</li>
              </ul>
            </section>

            {/* Section 9 */}
            <section>
              <h2 style={{ 
                color: '#ffffff', 
                fontSize: '24px', 
                fontWeight: 600, 
                marginBottom: '16px',
                letterSpacing: '0.3px'
              }}>
                9. INTELLECTUAL PROPERTY
              </h2>
              <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>Our Rights:</p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc', marginBottom: '16px' }}>
                <li>The Service, including its code, design, features, and branding, is owned by us</li>
                <li>All trademarks, logos, and service marks are our property</li>
                <li>You may not copy, modify, distribute, sell, or create derivative works from the Service</li>
              </ul>
              <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>Your License:</p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                <li>We grant you a limited, non-exclusive, non-transferable license to use the Service</li>
                <li>This license is for personal, non-commercial use only</li>
                <li>The license automatically terminates if you violate these terms</li>
                <li>You may not sublicense or transfer this license to others</li>
              </ul>
            </section>

            {/* Section 10 */}
            <section>
              <h2 style={{ 
                color: '#ffffff', 
                fontSize: '24px', 
                fontWeight: 600, 
                marginBottom: '16px',
                letterSpacing: '0.3px'
              }}>
                10. DISCLAIMERS AND WARRANTIES
              </h2>
              <p style={{ color: '#e0e0e0', marginBottom: '12px' }}>
                The Service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied.
              </p>
              <p style={{ color: '#e0e0e0', marginBottom: '12px' }}>We do not warrant that:</p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc', marginBottom: '12px' }}>
                <li>The Service will be uninterrupted, timely, secure, or error-free</li>
                <li>All data will be preserved without loss (though we make reasonable efforts)</li>
                <li>The Service will meet your specific requirements or expectations</li>
                <li>AI features will be 100% accurate or appropriate for all uses</li>
                <li>Defects will be corrected immediately</li>
              </ul>
              <p style={{ color: '#e0e0e0' }}>
                Use the Service at your own risk. You are responsible for backing up important data.
              </p>
            </section>

            {/* Section 11 */}
            <section>
              <h2 style={{ 
                color: '#ffffff', 
                fontSize: '24px', 
                fontWeight: 600, 
                marginBottom: '16px',
                letterSpacing: '0.3px'
              }}>
                11. LIMITATION OF LIABILITY
              </h2>
              <p style={{ color: '#e0e0e0', marginBottom: '12px' }}>
                To the maximum extent permitted by law:
              </p>
              <p style={{ color: '#e0e0e0', marginBottom: '12px' }}>
                We shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
              </p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc', marginBottom: '16px' }}>
                <li>Loss of profits or revenues</li>
                <li>Loss of data or content</li>
                <li>Loss of use or access to the Service</li>
                <li>Emotional distress or psychological harm</li>
                <li>Any damages resulting from use or inability to use the Service</li>
              </ul>
              <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>Maximum Liability:</p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc', marginBottom: '12px' }}>
                <li>Our total liability to you shall not exceed the greater of:
                  <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
                    <li>(a) The amount you paid us in the past 12 months, or</li>
                    <li>(b) $100 USD</li>
                  </ul>
                </li>
                <li>For free users, our maximum liability is $100 USD</li>
              </ul>
              <p style={{ color: '#e0e0e0' }}>
                Some jurisdictions do not allow limitations on liability, so these limitations may not apply to you.
              </p>
            </section>

            {/* Section 12 */}
            <section>
              <h2 style={{ 
                color: '#ffffff', 
                fontSize: '24px', 
                fontWeight: 600, 
                marginBottom: '16px',
                letterSpacing: '0.3px'
              }}>
                12. PAYMENTS AND SUBSCRIPTIONS
              </h2>
              <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>Current Status:</p>
              <p style={{ color: '#e0e0e0', marginBottom: '16px' }}>
                The Service is currently free to use.
              </p>
              <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>Future Paid Features:</p>
              <p style={{ color: '#e0e0e0', marginBottom: '12px' }}>
                If we introduce paid features or subscriptions in the future:
              </p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                <li>Pricing will be clearly displayed before any purchase</li>
                <li>Subscriptions auto-renew unless cancelled before the renewal date</li>
                <li>You can cancel anytime through your device's subscription settings (App Store or Google Play)</li>
                <li>Refunds are handled according to the applicable app store's refund policy</li>
                <li>We will provide 30 days notice before converting any free features to paid features</li>
              </ul>
            </section>

            {/* Section 13 */}
            <section>
              <h2 style={{ 
                color: '#ffffff', 
                fontSize: '24px', 
                fontWeight: 600, 
                marginBottom: '16px',
                letterSpacing: '0.3px'
              }}>
                13. CHANGES TO TERMS
              </h2>
              <p style={{ color: '#e0e0e0', marginBottom: '12px' }}>
                We reserve the right to modify these Terms of Service at any time.
              </p>
              <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>Notification of Changes:</p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc', marginBottom: '12px' }}>
                <li>We will notify you via email and/or in-app notification</li>
                <li>Material changes will be effective 30 days after notice is provided</li>
                <li>Minor changes (typos, formatting, clarifications) are effective immediately</li>
                <li>Your continued use of the Service after changes constitutes acceptance</li>
              </ul>
              <p style={{ color: '#e0e0e0' }}>
                We encourage you to review these terms periodically. The "Last Updated" date at the top indicates when terms were last modified.
              </p>
            </section>

            {/* Section 14 */}
            <section>
              <h2 style={{ 
                color: '#ffffff', 
                fontSize: '24px', 
                fontWeight: 600, 
                marginBottom: '16px',
                letterSpacing: '0.3px'
              }}>
                14. GOVERNING LAW AND DISPUTES
              </h2>
              <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>Governing Law:</p>
              <p style={{ color: '#e0e0e0', marginBottom: '16px' }}>
                These Terms are governed by and construed in accordance with the laws of the State of Georgia, United States, without regard to its conflict of law principles.
              </p>
              <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>Dispute Resolution:</p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                <li>You agree to first contact us at kakhadzevano@gmail.com to attempt informal resolution</li>
                <li>If informal resolution fails, disputes will be resolved through binding arbitration</li>
                <li>Arbitration will be conducted in Georgia, United States (or online)</li>
                <li>You agree to resolve disputes individually, not as part of a class action lawsuit</li>
                <li>Either party may seek injunctive relief in court for intellectual property violations</li>
              </ul>
              <p style={{ color: '#e0e0e0', marginTop: '12px' }}>
                Some jurisdictions do not allow arbitration agreements, so this may not apply to you.
              </p>
            </section>

            {/* Section 15 */}
            <section>
              <h2 style={{ 
                color: '#ffffff', 
                fontSize: '24px', 
                fontWeight: 600, 
                marginBottom: '16px',
                letterSpacing: '0.3px'
              }}>
                15. SEVERABILITY
              </h2>
              <p style={{ color: '#e0e0e0' }}>
                If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will remain in full force and effect.
              </p>
            </section>

            {/* Section 16 */}
            <section>
              <h2 style={{ 
                color: '#ffffff', 
                fontSize: '24px', 
                fontWeight: 600, 
                marginBottom: '16px',
                letterSpacing: '0.3px'
              }}>
                16. ENTIRE AGREEMENT
              </h2>
              <p style={{ color: '#e0e0e0' }}>
                These Terms, together with our <Link href="/privacy" style={{ color: '#f4a261', textDecoration: 'underline' }}>Privacy Policy</Link>, constitute the entire agreement between you and us regarding the Service and supersede any prior agreements.
              </p>
            </section>

            {/* Section 17 */}
            <section>
              <h2 style={{ 
                color: '#ffffff', 
                fontSize: '24px', 
                fontWeight: 600, 
                marginBottom: '16px',
                letterSpacing: '0.3px'
              }}>
                17. CONTACT INFORMATION
              </h2>
              <p style={{ color: '#e0e0e0', marginBottom: '12px' }}>
                If you have any questions, concerns, or requests regarding these Terms of Service, please contact us at:
              </p>
              <p style={{ color: '#f4a261', marginBottom: '16px', fontWeight: 500 }}>
                Email: <a href="mailto:kakhadzevano@gmail.com" style={{ color: '#f4a261', textDecoration: 'underline' }}>kakhadzevano@gmail.com</a>
              </p>
              <p style={{ color: '#e0e0e0' }}>
                We will respond to inquiries within 48-72 hours during business days.
              </p>
            </section>

            {/* Footer */}
            <div style={{ 
              marginTop: '40px', 
              paddingTop: '32px', 
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center'
            }}>
              <p style={{ color: '#a8a8b3', fontSize: '14px', fontStyle: 'italic' }}>
                By using this Service, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </main>
  )
}
