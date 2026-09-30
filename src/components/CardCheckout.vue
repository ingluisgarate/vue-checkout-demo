<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCheckoutStore } from '../stores/checkout'

const store = useCheckoutStore()
const {
  accountHolder,
  holder,
  number,
  expiry,
  cvv,
  status,
  token,
  maskedNumber,
  refusalCode,
  fieldErrors,
} = storeToRefs(store)

const refusalMessage = computed(() => {
  if (refusalCode.value === 'holder_mismatch') {
    return `The name on the card does not match ${accountHolder.value}.`
  }
  if (refusalCode.value === 'card_declined') {
    return 'The card was declined. No token was stored.'
  }
  return 'The card could not be tokenized.'
})

function onNumber(event) {
  const digits = event.target.value.replace(/\D/g, '').slice(0, 19)
  number.value = digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
}

function onExpiry(event) {
  const digits = event.target.value.replace(/\D/g, '').slice(0, 4)
  expiry.value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}

function onCvv(event) {
  cvv.value = event.target.value.replace(/\D/g, '').slice(0, 4)
}

function onSubmit() {
  store.submit()
}
</script>

<template>
  <section class="checkout">
    <header class="checkout__header">
      <p class="eyebrow">Sample checkout</p>
      <h1>Save a card</h1>
      <p class="lede">
        The account holder is <strong>{{ accountHolder }}</strong>. The form talks to a fake
        tokenizer. Nothing is charged.
      </p>
    </header>

    <form v-if="status !== 'approved'" class="card" @submit.prevent="onSubmit">
      <label>
        Name on card
        <input v-model="holder" autocomplete="cc-name" />
        <span v-if="fieldErrors.holder" class="error">{{ fieldErrors.holder }}</span>
      </label>

      <label>
        Card number
        <input
          :value="number"
          inputmode="numeric"
          autocomplete="cc-number"
          placeholder="4111 1111 1111 1111"
          @input="onNumber"
        />
        <span v-if="fieldErrors.number" class="error">{{ fieldErrors.number }}</span>
      </label>

      <div class="row">
        <label>
          Expiry
          <input
            :value="expiry"
            inputmode="numeric"
            autocomplete="cc-exp"
            placeholder="MM/YY"
            @input="onExpiry"
          />
          <span v-if="fieldErrors.expiry" class="error">{{ fieldErrors.expiry }}</span>
        </label>
        <label>
          CVV
          <input
            :value="cvv"
            inputmode="numeric"
            autocomplete="cc-csc"
            placeholder="123"
            @input="onCvv"
          />
          <span v-if="fieldErrors.cvv" class="error">{{ fieldErrors.cvv }}</span>
        </label>
      </div>

      <p v-if="status === 'refused'" class="banner" role="alert">{{ refusalMessage }}</p>

      <button type="submit" :disabled="status === 'submitting'">
        {{ status === 'submitting' ? 'Saving…' : 'Save card' }}
      </button>
    </form>

    <div v-else class="card result" role="status">
      <p class="eyebrow">Token saved</p>
      <p class="masked">{{ maskedNumber }}</p>
      <p class="token">{{ token }}</p>
      <p class="hint">The full number and the CVV were cleared from the form.</p>
      <button type="button" class="secondary" @click="store.reset()">Use another card</button>
    </div>

    <aside class="samples">
      <p>Try these numbers with the name Ana Ruiz and any future expiry.</p>
      <ul>
        <li><code>4111 1111 1111 1111</code> approves</li>
        <li><code>4000 0000 0000 0002</code> is declined</li>
        <li>Any other name is a holder mismatch</li>
      </ul>
    </aside>
  </section>
</template>
