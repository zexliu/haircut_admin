<template>
  <half-time-detail :is-edit="false" />
</template>

<script>
import HalfTimeDetail from './components/HalfTimeDetail'

export default {
  name: 'AddHalfTime',
  components: { HalfTimeDetail }
}
</script>

