<template>
  <bank-detail :is-edit="false" />
</template>

<script>
import BankDetail from './components/BankDetail'

export default {
  name: 'AddBank',
  components: { BankDetail }
}
</script>

