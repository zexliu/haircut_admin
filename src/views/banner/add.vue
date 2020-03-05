<template>
  <banner-detail :is-edit="false" />
</template>

<script>
import BannerDetail from './components/BannerDetail'

export default {
  name: 'AddBanner',
  components: { BannerDetail }
}
</script>

