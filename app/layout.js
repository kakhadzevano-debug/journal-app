import './globals.css'
import { AuthProvider } from './providers/AuthProvider'
import { SessionRefreshWrapper } from './components/SessionRefreshWrapper'

export const metadata = {
  title: 'Voice Journal',
  description: 'Your personal voice journaling app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <SessionRefreshWrapper>
            {children}
          </SessionRefreshWrapper>
        </AuthProvider>
      </body>
    </html>
  )
}

