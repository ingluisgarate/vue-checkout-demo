# vue-checkout-demo

A Vue 3 card form with Pinia and a fake tokenizer. The approved path returns a token and clears the card number and CVV. A declined card and a holder mismatch store nothing.

No payment provider is called.

## Try it

```bash
npm install
npm run dev
```

Open the printed local URL.

| Card | Name | Result |
|---|---|---|
| `4111111111111111` | Ana Ruiz | Approved token, number and CVV cleared |
| `4000000000000002` | Ana Ruiz | Declined, no token |
| `4111111111111111` | Any other name | Holder mismatch, no token |

Use any future expiry (`12/30`) and any 3 digit CVV.

## Test

```bash
npm test
```
