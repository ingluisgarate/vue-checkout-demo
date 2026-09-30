import { defineStore } from 'pinia'
import { digitsOnly, maskLast4, validateCard } from '../gateway/card'
import { tokenizeCard } from '../gateway/fakeGateway'

export const useCheckoutStore = defineStore('checkout', {
  state: () => ({
    accountHolder: 'Ana Ruiz',
    holder: '',
    number: '',
    expiry: '',
    cvv: '',
    status: 'idle',
    token: null,
    maskedNumber: null,
    refusalCode: null,
    fieldErrors: {},
  }),
  actions: {
    async submit() {
      if (this.status === 'submitting') {
        return
      }

      const snapshot = {
        holder: this.holder,
        number: digitsOnly(this.number),
        expiry: this.expiry,
        cvv: this.cvv,
        accountHolder: this.accountHolder,
      }
      const errors = validateCard(snapshot)
      this.fieldErrors = errors

      if (Object.keys(errors).length > 0) {
        this.status = 'invalid'
        this.token = null
        this.maskedNumber = null
        this.refusalCode = null
        return
      }

      this.status = 'submitting'
      const result = await tokenizeCard(snapshot)

      this.number = ''
      this.cvv = ''

      if (!result.ok) {
        this.status = 'refused'
        this.token = null
        this.maskedNumber = null
        this.refusalCode = result.code
        return
      }

      this.status = 'approved'
      this.token = result.token
      this.maskedNumber = maskLast4(result.last4)
      this.refusalCode = null
    },
    reset() {
      this.holder = ''
      this.number = ''
      this.expiry = ''
      this.cvv = ''
      this.status = 'idle'
      this.token = null
      this.maskedNumber = null
      this.refusalCode = null
      this.fieldErrors = {}
    },
  },
})
