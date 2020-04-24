<template>
  <bank-detail :is-edit="true" />
</template>

<script>
import BankDetail from './components/BankDetail'

export default {
  name: 'UpdateBank',
  components: { BankDetail }
}
</script>

