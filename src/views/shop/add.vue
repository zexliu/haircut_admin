<template>
  <shop-detail :is-edit="false" />
</template>

<script>
import ShopDetail from './components/ShopDetail'

export default {
  name: 'AddShop',
  components: { ShopDetail }
}
</script>

