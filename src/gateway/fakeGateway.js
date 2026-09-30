import { digitsOnly, isLuhnValid } from './card'

export async function tokenizeCard(card) {
  const digits = digitsOnly(card.number)

  if (!isLuhnValid(digits)) {
    return { ok: false, code: 'invalid_card' }
  }

  const holder = String(card.holder ?? '').trim().toLowerCase()
  const accountHolder = String(card.accountHolder ?? '').trim().toLowerCase()
  if (holder !== accountHolder) {
    return { ok: false, code: 'holder_mismatch' }
  }

  if (digits.endsWith('0002')) {
    return { ok: false, code: 'card_declined' }
  }

  return {
    ok: true,
    token: `tok_${digits.slice(-4)}_${Math.random().toString(36).slice(2, 8)}`,
    last4: digits.slice(-4),
  }
}
