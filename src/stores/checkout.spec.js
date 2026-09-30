import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useCheckoutStore } from './checkout'

describe('checkout store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('tokenizes an approved card and drops the raw number and cvv', async () => {
    const store = useCheckoutStore()
    store.holder = 'Ana Ruiz'
    store.number = '4111111111111111'
    store.expiry = '12/30'
    store.cvv = '123'

    await store.submit()

    expect(store.status).toBe('approved')
    expect(store.token).toMatch(/^tok_1111_/)
    expect(store.maskedNumber).toBe('•••• •••• •••• 1111')
    expect(store.number).toBe('')
    expect(store.cvv).toBe('')
    expect(store.token).not.toContain('411111')
  })

  it('keeps a declined card as refused and stores no token', async () => {
    const store = useCheckoutStore()
    store.holder = 'Ana Ruiz'
    store.number = '4000000000000002'
    store.expiry = '12/30'
    store.cvv = '123'

    await store.submit()

    expect(store.status).toBe('refused')
    expect(store.refusalCode).toBe('card_declined')
    expect(store.token).toBeNull()
    expect(store.cvv).toBe('')
    expect(store.number).toBe('')
  })

  it('refuses the card when the holder does not match the account', async () => {
    const store = useCheckoutStore()
    store.holder = 'Other Person'
    store.number = '4111111111111111'
    store.expiry = '12/30'
    store.cvv = '123'

    await store.submit()

    expect(store.status).toBe('refused')
    expect(store.refusalCode).toBe('holder_mismatch')
    expect(store.token).toBeNull()
  })

  it('does not call the gateway when the card number fails validation', async () => {
    const store = useCheckoutStore()
    store.holder = 'Ana Ruiz'
    store.number = '4111111111111112'
    store.expiry = '12/30'
    store.cvv = '123'

    await store.submit()

    expect(store.status).toBe('invalid')
    expect(store.fieldErrors.number).toBeTruthy()
    expect(store.token).toBeNull()
    expect(store.cvv).toBe('123')
  })
})
