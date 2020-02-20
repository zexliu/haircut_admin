<template>
  <shop-title-detail :is-edit="true" />
</template>

<script>
import ShopTitleDetail from './components/ShopTitleDetail'

export default {
  name: 'UpdateShopTitle',
  components: { ShopTitleDetail }
}
</script>

