<template>
  <shop-detail :is-edit="true" />
</template>

<script>
import ShopDetail from './components/ShopDetail'

export default {
  name: 'UpdateShop',
  components: { ShopDetail }
}
</script>

