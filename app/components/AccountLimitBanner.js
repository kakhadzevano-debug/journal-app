'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { getAccountType, getCurrentMonthJournalCount, canCreateJournal } from '@/lib/accountUtils'

const FREE_MONTHLY_LIMIT = 16

export default function AccountLimitBanner() {
  const router = useRouter()
  const [accountInfo, setAccountInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAccountInfo = async () => {
      try {
        const { accountType } = await getAccountType()
        const currentCount = await getCurrentMonthJournalCount()
        const limitCheck = await canCreateJournal(true)

        setAccountInfo({
          accountType,
          currentCount,
          limit: accountType === 'pro' ? Infinity : FREE_MONTHLY_LIMIT,
          canCreate: limitCheck.canCreate,
          message: limitCheck.message
        })
      } catch (error) {
        console.error('Error loading account info:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAccountInfo()
  }, [])

  if (loading || !accountInfo) {
    return null
  }

  // Don't show banner for pro users
  if (accountInfo.accountType === 'pro') {
    return null
  }

  // Only show warning if close to limit or at limit
  if (accountInfo.currentCount < FREE_MONTHLY_LIMIT - 3 && accountInfo.canCreate) {
    return null
  }

  const remaining = FREE_MONTHLY_LIMIT - accountInfo.currentCount
  const isAtLimit = !accountInfo.canCreate
  const isCloseToLimit = remaining <= 3 && accountInfo.canCreate

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-xl p-4 mb-4"
      style={{
        background: isAtLimit 
          ? 'linear-gradient(135deg, rgba(230, 57, 70, 0.2) 0%, rgba(230, 57, 70, 0.1) 100%)'
          : 'linear-gradient(135deg, rgba(244, 162, 97, 0.2) 0%, rgba(244, 162, 97, 0.1) 100%)',
        border: isAtLimit
          ? '1px solid rgba(230, 57, 70, 0.4)'
          : '1px solid rgba(244, 162, 97, 0.4)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ 
          fontSize: '24px',
          lineHeight: 1
        }}>
          {isAtLimit ? '⚠️' : '📊'}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ 
            fontSize: '14px', 
            fontWeight: 600, 
            color: '#ffffff',
            marginBottom: '4px'
          }}>
            {isAtLimit 
              ? 'Monthly Limit Reached'
              : `${remaining} Journal${remaining === 1 ? '' : 's'} Remaining This Month`
            }
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: 'rgba(255, 255, 255, 0.8)',
            lineHeight: 1.4,
            marginBottom: isAtLimit ? '12px' : '0'
          }}>
            {isAtLimit 
              ? `You've used all ${FREE_MONTHLY_LIMIT} free journals this month. Upgrade to Pro for unlimited journals.`
              : `You've created ${accountInfo.currentCount} of ${FREE_MONTHLY_LIMIT} free journals this month.`
            }
          </div>
          {isAtLimit && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/settings')}
              style={{
                marginTop: '12px',
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.3px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                width: '100%',
                justifyContent: 'center'
              }}
            >
              ⭐ Upgrade to Pro
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
