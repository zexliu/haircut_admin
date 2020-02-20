<template>
  <shop-title-detail :is-edit="false" />
</template>

<script>
import ShopTitleDetail from './components/ShopTitleDetail'

export default {
  name: 'AddShopTitle',
  components: { ShopTitleDetail }
}
</script>

