export function digitsOnly(value) {
  return String(value ?? '').replace(/\D/g, '')
}

export function isLuhnValid(digits) {
  if (!/^\d{13,19}$/.test(digits)) {
    return false
  }

  let sum = 0
  let alternate = false

  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index])
    if (alternate) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }
    sum += digit
    alternate = !alternate
  }

  return sum % 10 === 0
}

export function isExpiryValid(value, now = new Date()) {
  const match = /^(\d{2})\/(\d{2})$/.exec(String(value ?? '').trim())
  if (!match) {
    return false
  }

  const month = Number(match[1])
  const year = 2000 + Number(match[2])
  if (month < 1 || month > 12) {
    return false
  }

  const expiry = new Date(year, month, 1)
  const current = new Date(now.getFullYear(), now.getMonth(), 1)

  return expiry > current
}

export function validateCard(input, now = new Date()) {
  const errors = {}

  if (String(input.holder ?? '').trim().length < 3) {
    errors.holder = 'Enter the name on the card.'
  }

  if (!isLuhnValid(digitsOnly(input.number))) {
    errors.number = 'Enter a valid card number.'
  }

  if (!isExpiryValid(input.expiry, now)) {
    errors.expiry = 'Enter a future expiry date.'
  }

  if (!/^\d{3,4}$/.test(String(input.cvv ?? ''))) {
    errors.cvv = 'Enter the security code.'
  }

  return errors
}

export function maskLast4(last4) {
  return `•••• •••• •••• ${last4}`
}
