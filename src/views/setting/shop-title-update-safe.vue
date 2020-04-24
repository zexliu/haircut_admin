<template>
  <shop-title-detail :is-edit="true" />
</template>

<script>
import ShopTitleDetail from './components/ShopTitleDetailSafe'

export default {
  name: 'UpdateShopTitle',
  components: { ShopTitleDetail }
}
</script>

