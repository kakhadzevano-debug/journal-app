'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function PrivacyPage() {
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
            Privacy Policy
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

          <p style={{ color: '#e0e0e0', marginBottom: '32px' }}>
            This Privacy Policy describes how we collect, use, store, and protect your personal information when you use our voice journaling app ("the Service"). By using the Service, you agree to the collection and use of information in accordance with this policy.
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
                1. INFORMATION WE COLLECT
              </h2>
              <p style={{ color: '#e0e0e0', marginBottom: '12px' }}>We collect the following types of information:</p>
              
              <div style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <p style={{ color: '#e0e0e0', marginBottom: '8px', fontWeight: 500 }}>A. Account Information:</p>
                <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                  <li>Email address (required for account creation and login)</li>
                  <li>Password (stored in encrypted form - we never see your actual password)</li>
                  <li>Account creation date</li>
                  <li>Last login date</li>
                </ul>
              </div>

              <div style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <p style={{ color: '#e0e0e0', marginBottom: '8px', fontWeight: 500 }}>B. Journal Content:</p>
                <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                  <li>Journal entries (text content you create via typing or voice)</li>
                  <li>Journal dates (the date you assign to each entry)</li>
                  <li>Daily ratings (1-10 scale)</li>
                  <li>Metadata (creation timestamps, last edit timestamps)</li>
                  <li>Draft entries (temporarily stored locally on your device)</li>
                </ul>
              </div>

              <div style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <p style={{ color: '#e0e0e0', marginBottom: '8px', fontWeight: 500 }}>C. Usage Data:</p>
                <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                  <li>Features you use (voice recording, AI cleanup, etc.)</li>
                  <li>App interaction data (which pages you visit, button clicks)</li>
                  <li>Session duration and frequency</li>
                  <li>Streak data (consecutive days journaled)</li>
                  <li>Notification preferences</li>
                </ul>
              </div>

              <div style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <p style={{ color: '#e0e0e0', marginBottom: '8px', fontWeight: 500 }}>D. Voice Data (Temporary):</p>
                <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                  <li>When you use voice recording, audio is processed by your device's browser</li>
                  <li>Audio is converted to text locally when possible</li>
                  <li>We do not permanently store voice recordings</li>
                  <li>Transcribed text is saved as your journal entry</li>
                </ul>
              </div>

              <div style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <p style={{ color: '#e0e0e0', marginBottom: '8px', fontWeight: 500 }}>E. Technical Information:</p>
                <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                  <li>Device type and operating system</li>
                  <li>Browser type and version</li>
                  <li>IP address (for security and authentication)</li>
                  <li>Time zone</li>
                  <li>App version you're using</li>
                </ul>
              </div>

              <div style={{ marginLeft: '20px' }}>
                <p style={{ color: '#e0e0e0', marginBottom: '8px', fontWeight: 500 }}>F. Information We Do NOT Collect:</p>
                <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                  <li>We do not access your contacts, photos, or other apps</li>
                  <li>We do not track your location</li>
                  <li>We do not collect biometric data</li>
                  <li>We do not use tracking cookies for advertising</li>
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
                2. HOW WE USE YOUR INFORMATION
              </h2>
              <p style={{ color: '#e0e0e0', marginBottom: '12px' }}>We use your information solely to provide and improve the Service:</p>
              
              <div style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <p style={{ color: '#e0e0e0', marginBottom: '8px', fontWeight: 500 }}>A. To Provide Core Features:</p>
                <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                  <li>Authenticate your identity and maintain your session</li>
                  <li>Store and retrieve your journal entries</li>
                  <li>Calculate and display your journaling streak</li>
                  <li>Send reminder notifications (if you enable them)</li>
                  <li>Process voice recordings into text</li>
                  <li>Apply AI grammar improvements (if you enable this feature)</li>
                </ul>
              </div>

              <div style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <p style={{ color: '#e0e0e0', marginBottom: '8px', fontWeight: 500 }}>B. To Improve the Service:</p>
                <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                  <li>Analyze usage patterns to understand which features are most valuable</li>
                  <li>Identify and fix bugs or technical issues</li>
                  <li>Improve app performance and user experience</li>
                  <li>Develop new features based on how the app is used</li>
                </ul>
              </div>

              <div style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <p style={{ color: '#e0e0e0', marginBottom: '8px', fontWeight: 500 }}>C. To Communicate With You:</p>
                <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                  <li>Send account verification emails</li>
                  <li>Send password reset emails (if requested)</li>
                  <li>Send reminder notifications (if you enable them)</li>
                  <li>Notify you of important changes to Terms or Privacy Policy</li>
                  <li>Respond to your support requests</li>
                </ul>
              </div>

              <div style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <p style={{ color: '#e0e0e0', marginBottom: '8px', fontWeight: 500 }}>D. For Security:</p>
                <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                  <li>Detect and prevent unauthorized access</li>
                  <li>Protect against fraudulent or abusive activity</li>
                  <li>Maintain the security and integrity of the Service</li>
                </ul>
              </div>

              <div style={{ marginLeft: '20px' }}>
                <p style={{ color: '#e0e0e0', marginBottom: '8px', fontWeight: 500 }}>E. Legal Compliance:</p>
                <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                  <li>Comply with applicable laws and regulations</li>
                  <li>Respond to legal requests (court orders, subpoenas)</li>
                  <li>Enforce our Terms of Service</li>
                </ul>
              </div>
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
                3. HOW WE STORE AND PROTECT YOUR DATA
              </h2>
              
              <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>Data Storage:</p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc', marginBottom: '16px' }}>
                <li>All data is stored on secure cloud servers provided by Supabase</li>
                <li>Servers are located in the United States</li>
                <li>Data is replicated across multiple secure facilities for reliability</li>
                <li>Automatic daily backups are performed</li>
              </ul>

              <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>Encryption:</p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc', marginBottom: '16px' }}>
                <li>All data is encrypted in transit using HTTPS/TLS encryption</li>
                <li>All data is encrypted at rest on our servers using AES-256 encryption</li>
                <li>Passwords are hashed using industry-standard bcrypt algorithm</li>
                <li>We cannot see your actual password, even if we wanted to</li>
              </ul>

              <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>Access Controls:</p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc', marginBottom: '16px' }}>
                <li>Row-Level Security (RLS) ensures you can only access your own data</li>
                <li>Multi-factor authentication protects admin access to systems</li>
                <li>Access to production data is strictly limited and logged</li>
                <li>Regular security audits are performed</li>
              </ul>

              <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>Data Retention:</p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                <li>Your data is retained as long as your account is active</li>
                <li>When you delete your account, all data is permanently deleted within 30 days</li>
                <li>Backups containing your data are deleted within 90 days of account deletion</li>
                <li>We do not keep your data after deletion unless legally required</li>
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
                4. WHO CAN SEE YOUR DATA
              </h2>
              
              <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>Your Privacy is Our Priority:</p>
              
              <div style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <p style={{ color: '#e0e0e0', marginBottom: '8px', fontWeight: 500 }}>A. You:</p>
                <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                  <li>You have full access to all your journal entries through the app</li>
                  <li>You can view, edit, export, and delete your data at any time</li>
                </ul>
              </div>

              <div style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <p style={{ color: '#e0e0e0', marginBottom: '8px', fontWeight: 500 }}>B. Other Users:</p>
                <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                  <li>Your journal entries are completely private</li>
                  <li>No other users can see your data</li>
                  <li>We do not have social features that share your content</li>
                </ul>
              </div>

              <div style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <p style={{ color: '#e0e0e0', marginBottom: '8px', fontWeight: 500 }}>C. Us (The Service Providers):</p>
                <p style={{ color: '#e0e0e0', marginBottom: '8px' }}>We technically have access to the database, BUT:</p>
                <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                  <li>We have implemented technical controls (RLS) that prevent us from viewing your journals</li>
                  <li>We do not read your journal entries</li>
                  <li>We do not analyze individual journal content</li>
                  <li>We may see aggregate, anonymized usage statistics (e.g., "100 users created journals today")</li>
                </ul>
              </div>

              <div style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <p style={{ color: '#e0e0e0', marginBottom: '8px', fontWeight: 500 }}>D. Third-Party Services:</p>
                <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                  <li><strong>Supabase (Database & Authentication):</strong> Stores your encrypted data but cannot read it</li>
                  <li><strong>Google Gemini AI (Optional):</strong> If you enable AI grammar cleanup, your text is sent to Google's API for processing. Google's privacy policy applies to this processing. You can disable this feature anytime.</li>
                  <li><strong>Email Service:</strong> We use Supabase's email service to send account-related emails</li>
                </ul>
              </div>

              <div style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <p style={{ color: '#e0e0e0', marginBottom: '8px', fontWeight: 500 }}>E. We Will NEVER:</p>
                <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                  <li>Sell your personal data to third parties</li>
                  <li>Share your journal content with advertisers</li>
                  <li>Use your journal entries for AI training without explicit consent</li>
                  <li>Share your data for marketing purposes</li>
                </ul>
              </div>

              <div style={{ marginLeft: '20px' }}>
                <p style={{ color: '#e0e0e0', marginBottom: '8px', fontWeight: 500 }}>F. Legal Exceptions:</p>
                <p style={{ color: '#e0e0e0', marginBottom: '8px' }}>We may disclose your information if required by law:</p>
                <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc', marginBottom: '8px' }}>
                  <li>In response to a valid court order or subpoena</li>
                  <li>To protect our legal rights or property</li>
                  <li>To prevent imminent harm to people or property</li>
                  <li>To investigate fraud or security issues</li>
                  <li>With your explicit consent</li>
                </ul>
                <p style={{ color: '#e0e0e0', marginTop: '8px' }}>In such cases, we will:</p>
                <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                  <li>Carefully review each request for legal validity</li>
                  <li>Disclose only the minimum information required</li>
                  <li>Notify you when legally permitted</li>
                  <li>Challenge overly broad or inappropriate requests</li>
                </ul>
              </div>
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
                5. YOUR RIGHTS AND CHOICES
              </h2>
              <p style={{ color: '#e0e0e0', marginBottom: '12px' }}>You have the following rights regarding your data:</p>
              
              <div style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <p style={{ color: '#e0e0e0', marginBottom: '8px', fontWeight: 500 }}>A. Access Your Data:</p>
                <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                  <li>View all your journal entries in the app</li>
                  <li>See your account information in Settings</li>
                </ul>
              </div>

              <div style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <p style={{ color: '#e0e0e0', marginBottom: '8px', fontWeight: 500 }}>B. Export Your Data:</p>
                <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                  <li>Download all your data as a JSON file</li>
                  <li>Available in Settings → "Download My Data"</li>
                  <li>Includes all journal entries, ratings, and dates</li>
                </ul>
              </div>

              <div style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <p style={{ color: '#e0e0e0', marginBottom: '8px', fontWeight: 500 }}>C. Delete Your Data:</p>
                <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                  <li>Delete individual journal entries anytime</li>
                  <li>Delete your entire account in Settings</li>
                  <li>Account deletion is permanent and cannot be undone</li>
                  <li>All data is removed within 30 days</li>
                </ul>
              </div>

              <div style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <p style={{ color: '#e0e0e0', marginBottom: '8px', fontWeight: 500 }}>D. Correct Your Data:</p>
                <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                  <li>Edit journal entries at any time</li>
                  <li>Update your email address in account settings</li>
                </ul>
              </div>

              <div style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <p style={{ color: '#e0e0e0', marginBottom: '8px', fontWeight: 500 }}>E. Control Features:</p>
                <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                  <li>Enable or disable AI grammar cleanup</li>
                  <li>Enable or disable notification reminders</li>
                  <li>Choose notification times</li>
                </ul>
              </div>

              <div style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <p style={{ color: '#e0e0e0', marginBottom: '8px', fontWeight: 500 }}>F. Opt-Out of Communications:</p>
                <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                  <li>You cannot opt out of essential emails (account verification, password reset)</li>
                  <li>You can disable reminder notifications in Settings</li>
                </ul>
              </div>

              <div style={{ marginLeft: '20px' }}>
                <p style={{ color: '#e0e0e0', marginBottom: '8px', fontWeight: 500 }}>G. Lodge a Complaint:</p>
                <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                  <li>If you believe we've mishandled your data, contact us at <a href="mailto:kakhadzevano@gmail.com" style={{ color: '#f4a261', textDecoration: 'underline' }}>kakhadzevano@gmail.com</a></li>
                  <li>You also have the right to complain to your local data protection authority</li>
                </ul>
              </div>
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
                6. CHILDREN'S PRIVACY
              </h2>
              
              <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>Age Requirements:</p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc', marginBottom: '16px' }}>
                <li>The Service is intended for users 13 years of age and older</li>
                <li>We do not knowingly collect information from children under 13</li>
                <li>If you are under 18, you must have parental consent to use the Service</li>
              </ul>

              <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>If We Learn We Have Collected Data from a Child Under 13:</p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc', marginBottom: '16px' }}>
                <li>We will delete that information as quickly as possible</li>
                <li>Parents/guardians can contact us at <a href="mailto:kakhadzevano@gmail.com" style={{ color: '#f4a261', textDecoration: 'underline' }}>kakhadzevano@gmail.com</a></li>
                <li>We will verify parental identity before discussing child's information</li>
              </ul>

              <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>COPPA Compliance (U.S.):</p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                <li>We comply with the Children's Online Privacy Protection Act</li>
                <li>We do not target children under 13 for data collection</li>
                <li>We do not use persistent identifiers to track children</li>
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
                7. INTERNATIONAL DATA TRANSFERS
              </h2>
              
              <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>Location of Data:</p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc', marginBottom: '16px' }}>
                <li>Our servers are located in the United States</li>
                <li>If you access the Service from outside the U.S., your data will be transferred to and stored in the U.S.</li>
              </ul>

              <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>For Users in the European Union (EU/EEA):</p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc', marginBottom: '16px' }}>
                <li>We process your data based on your consent (by using the Service)</li>
                <li>You have rights under GDPR including access, deletion, and portability</li>
                <li>You can withdraw consent at any time by deleting your account</li>
                <li>Data transfers to the U.S. are protected by standard contractual clauses</li>
              </ul>

              <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>For Users in Other Countries:</p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                <li>By using the Service, you consent to the transfer of your data to the U.S.</li>
                <li>U.S. privacy laws may differ from those in your country</li>
                <li>We apply the same privacy protections regardless of your location</li>
              </ul>
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
                8. THIRD-PARTY SERVICES
              </h2>
              <p style={{ color: '#e0e0e0', marginBottom: '12px' }}>We use the following third-party services:</p>
              
              <div style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <p style={{ color: '#e0e0e0', marginBottom: '8px', fontWeight: 500 }}>A. Supabase (Database & Authentication):</p>
                <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                  <li>Purpose: Store your data and manage authentication</li>
                  <li>Data Shared: Email, encrypted journal entries, account info</li>
                  <li>Privacy Policy: <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#f4a261', textDecoration: 'underline' }}>https://supabase.com/privacy</a></li>
                  <li>Security: SOC 2 Type II certified, GDPR compliant</li>
                </ul>
              </div>

              <div style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <p style={{ color: '#e0e0e0', marginBottom: '8px', fontWeight: 500 }}>B. Google Gemini AI (Optional):</p>
                <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                  <li>Purpose: AI grammar cleanup feature (only if you enable it)</li>
                  <li>Data Shared: Text of journal entry being cleaned up</li>
                  <li>Privacy Policy: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#f4a261', textDecoration: 'underline' }}>https://policies.google.com/privacy</a></li>
                  <li>Control: You can disable this feature anytime in Settings</li>
                  <li>Note: Google processes your text but does not store it for training (per their API terms)</li>
                </ul>
              </div>

              <div style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <p style={{ color: '#e0e0e0', marginBottom: '8px', fontWeight: 500 }}>C. Browser Speech Recognition (Voice Recording):</p>
                <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                  <li>Purpose: Convert your speech to text</li>
                  <li>Data Shared: Voice recording processed locally in browser when possible</li>
                  <li>Control: You grant microphone permission through your browser</li>
                  <li>Note: Some browsers may send audio to Google or Apple for processing</li>
                </ul>
              </div>

              <p style={{ color: '#e0e0e0', marginTop: '16px', fontWeight: 500 }}>We Do Not Use:</p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                <li>Advertising networks</li>
                <li>Analytics services that track you across websites</li>
                <li>Social media pixels or tracking</li>
                <li>Marketing automation tools</li>
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
                9. COOKIES AND TRACKING
              </h2>
              
              <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>Essential Cookies Only:</p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc', marginBottom: '16px' }}>
                <li>We use only essential cookies required for the Service to function</li>
                <li>These include: authentication tokens, session management</li>
                <li>These cookies cannot be disabled if you want to use the Service</li>
              </ul>

              <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>We Do NOT Use:</p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc', marginBottom: '16px' }}>
                <li>Advertising cookies</li>
                <li>Analytics cookies (like Google Analytics)</li>
                <li>Social media cookies</li>
                <li>Third-party tracking cookies</li>
              </ul>

              <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>Browser Settings:</p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                <li>You can configure your browser to refuse cookies</li>
                <li>However, this will prevent you from logging in or using the Service</li>
                <li>Our cookies are httpOnly and secure (cannot be accessed by JavaScript)</li>
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
                10. DATA BREACH NOTIFICATION
              </h2>
              
              <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>Our Commitment:</p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc', marginBottom: '16px' }}>
                <li>We take security seriously and implement best practices</li>
                <li>We monitor our systems for potential security issues</li>
                <li>We have an incident response plan</li>
              </ul>

              <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>In the Event of a Data Breach:</p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc', marginBottom: '16px' }}>
                <li>We will investigate immediately</li>
                <li>We will notify affected users within 72 hours when possible</li>
                <li>We will notify relevant authorities as required by law</li>
                <li>We will take steps to prevent future breaches</li>
                <li>We will provide guidance on protecting your account</li>
              </ul>

              <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>What You Should Do:</p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                <li>Use a strong, unique password</li>
                <li>Enable two-factor authentication if available (future feature)</li>
                <li>Monitor your account for suspicious activity</li>
                <li>Contact us immediately if you notice unauthorized access</li>
              </ul>
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
                11. CHANGES TO THIS PRIVACY POLICY
              </h2>
              
              <p style={{ color: '#e0e0e0', marginBottom: '12px' }}>We may update this Privacy Policy from time to time.</p>
              
              <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>How We Notify You:</p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc', marginBottom: '16px' }}>
                <li>Email notification for material changes</li>
                <li>In-app notification when you next log in</li>
                <li>Updated "Last Updated" date at the top of this policy</li>
              </ul>

              <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>Your Options:</p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                <li>Material changes will be effective 30 days after notification</li>
                <li>If you disagree with changes, you can delete your account before they take effect</li>
                <li>Continued use of the Service after changes means you accept the new policy</li>
              </ul>

              <p style={{ color: '#e0e0e0', marginTop: '12px' }}>
                We encourage you to review this Privacy Policy periodically.
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
                12. DO NOT TRACK SIGNALS
              </h2>
              
              <p style={{ color: '#e0e0e0', marginBottom: '12px' }}>
                Some browsers have "Do Not Track" (DNT) features.
              </p>
              
              <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>Our Approach:</p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                <li>We respect DNT signals</li>
                <li>We don't use tracking cookies anyway</li>
                <li>We don't sell data to third parties</li>
                <li>We don't share data with advertisers</li>
              </ul>

              <p style={{ color: '#e0e0e0', marginTop: '12px' }}>
                Since we don't track you for advertising purposes, DNT signals don't change our data practices.
              </p>
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
                13. CALIFORNIA PRIVACY RIGHTS (CCPA)
              </h2>
              
              <p style={{ color: '#e0e0e0', marginBottom: '12px' }}>
                If you are a California resident, you have additional rights:
              </p>
              
              <div style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <p style={{ color: '#e0e0e0', marginBottom: '8px', fontWeight: 500 }}>A. Right to Know:</p>
                <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                  <li>What personal information we collect</li>
                  <li>How we use it and who we share it with</li>
                  <li>You can request this information by emailing us</li>
                </ul>
              </div>

              <div style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <p style={{ color: '#e0e0e0', marginBottom: '8px', fontWeight: 500 }}>B. Right to Delete:</p>
                <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                  <li>Request deletion of your personal information</li>
                  <li>Available through account deletion in Settings</li>
                  <li>Some data may be retained for legal compliance</li>
                </ul>
              </div>

              <div style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <p style={{ color: '#e0e0e0', marginBottom: '8px', fontWeight: 500 }}>C. Right to Opt-Out of Sale:</p>
                <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                  <li>We do not sell personal information</li>
                  <li>We have never sold personal information</li>
                  <li>We will never sell personal information</li>
                </ul>
              </div>

              <div style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <p style={{ color: '#e0e0e0', marginBottom: '8px', fontWeight: 500 }}>D. Right to Non-Discrimination:</p>
                <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                  <li>We will not discriminate against you for exercising your rights</li>
                  <li>You will receive the same service level regardless</li>
                </ul>
              </div>

              <p style={{ color: '#e0e0e0', marginTop: '16px', fontWeight: 500 }}>To Exercise Your Rights:</p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                <li>Email us at <a href="mailto:kakhadzevano@gmail.com" style={{ color: '#f4a261', textDecoration: 'underline' }}>kakhadzevano@gmail.com</a></li>
                <li>We will verify your identity before responding</li>
                <li>We will respond within 45 days</li>
              </ul>
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
                14. EUROPEAN PRIVACY RIGHTS (GDPR)
              </h2>
              
              <p style={{ color: '#e0e0e0', marginBottom: '12px' }}>
                If you are in the EU/EEA, you have rights under GDPR:
              </p>
              
              <div style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <p style={{ color: '#e0e0e0', marginBottom: '8px', fontWeight: 500 }}>A. Legal Basis for Processing:</p>
                <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                  <li>Consent: By using the Service, you consent to data processing</li>
                  <li>Contract: Processing is necessary to provide the Service to you</li>
                  <li>Legitimate Interest: Fraud prevention, security, service improvement</li>
                </ul>
              </div>

              <div style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <p style={{ color: '#e0e0e0', marginBottom: '8px', fontWeight: 500 }}>B. Your Rights:</p>
                <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                  <li>Right to Access: Request a copy of your data</li>
                  <li>Right to Rectification: Correct inaccurate data</li>
                  <li>Right to Erasure: Delete your data ("right to be forgotten")</li>
                  <li>Right to Restrict Processing: Limit how we use your data</li>
                  <li>Right to Data Portability: Receive your data in a standard format</li>
                  <li>Right to Object: Object to certain types of processing</li>
                  <li>Right to Withdraw Consent: Stop processing at any time</li>
                </ul>
              </div>

              <div style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <p style={{ color: '#e0e0e0', marginBottom: '8px', fontWeight: 500 }}>C. How to Exercise Your Rights:</p>
                <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                  <li>Most rights available through the app (edit, delete, export)</li>
                  <li>For other requests, email <a href="mailto:kakhadzevano@gmail.com" style={{ color: '#f4a261', textDecoration: 'underline' }}>kakhadzevano@gmail.com</a></li>
                  <li>We will respond within 30 days</li>
                  <li>No charge for reasonable requests</li>
                </ul>
              </div>

              <div style={{ marginLeft: '20px' }}>
                <p style={{ color: '#e0e0e0', marginBottom: '8px', fontWeight: 500 }}>D. Supervisory Authority:</p>
                <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                  <li>You can lodge a complaint with your local data protection authority</li>
                  <li>EU residents can contact their national authority</li>
                  <li>We will cooperate with authorities in investigations</li>
                </ul>
              </div>
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
                15. CONTACT US
              </h2>
              
              <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>Data Controller:</p>
              <p style={{ color: '#e0e0e0', marginBottom: '16px' }}>
                Email: <a href="mailto:kakhadzevano@gmail.com" style={{ color: '#f4a261', textDecoration: 'underline' }}>kakhadzevano@gmail.com</a>
              </p>

              <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>For Privacy Questions:</p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc', marginBottom: '16px' }}>
                <li>General inquiries: <a href="mailto:kakhadzevano@gmail.com" style={{ color: '#f4a261', textDecoration: 'underline' }}>kakhadzevano@gmail.com</a></li>
                <li>Data deletion requests: <a href="mailto:kakhadzevano@gmail.com" style={{ color: '#f4a261', textDecoration: 'underline' }}>kakhadzevano@gmail.com</a></li>
                <li>Data access requests: <a href="mailto:kakhadzevano@gmail.com" style={{ color: '#f4a261', textDecoration: 'underline' }}>kakhadzevano@gmail.com</a></li>
                <li>Security concerns: <a href="mailto:kakhadzevano@gmail.com" style={{ color: '#f4a261', textDecoration: 'underline' }}>kakhadzevano@gmail.com</a></li>
              </ul>

              <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>Response Time:</p>
              <ul style={{ color: '#e0e0e0', marginLeft: '20px', listStyle: 'disc' }}>
                <li>We aim to respond within 48-72 hours</li>
                <li>Complex requests may take up to 30 days</li>
                <li>We will acknowledge receipt of your message within 24 hours</li>
              </ul>
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
                16. SUMMARY (Quick Reference)
              </h2>
              
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                padding: '24px', 
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>What We Collect:</p>
                <p style={{ color: '#e0e0e0', marginBottom: '16px' }}>✓ Email, journal entries, usage data</p>

                <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>How We Use It:</p>
                <p style={{ color: '#e0e0e0', marginBottom: '16px' }}>✓ To provide the Service, improve features, ensure security</p>

                <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>Who Sees It:</p>
                <p style={{ color: '#e0e0e0', marginBottom: '8px' }}>✓ Only you (and optionally Google Gemini for AI cleanup)</p>
                <p style={{ color: '#e0e0e0', marginBottom: '16px' }}>✗ Not advertisers, not other users, not us (journals are private)</p>

                <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>Your Rights:</p>
                <p style={{ color: '#e0e0e0', marginBottom: '16px' }}>✓ Access, export, edit, delete your data anytime</p>

                <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>Security:</p>
                <p style={{ color: '#e0e0e0', marginBottom: '16px' }}>✓ Encrypted storage, secure servers, Row-Level Security</p>

                <p style={{ color: '#e0e0e0', marginBottom: '12px', fontWeight: 500 }}>Contact:</p>
                <p style={{ color: '#e0e0e0' }}>✓ <a href="mailto:kakhadzevano@gmail.com" style={{ color: '#f4a261', textDecoration: 'underline' }}>kakhadzevano@gmail.com</a> for any privacy questions</p>
              </div>
            </section>

            {/* Footer */}
            <div style={{ 
              marginTop: '40px', 
              paddingTop: '32px', 
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center'
            }}>
              <p style={{ color: '#a8a8b3', fontSize: '14px', fontStyle: 'italic' }}>
                By using this Service, you acknowledge that you have read and understood this Privacy Policy.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </main>
  )
}
