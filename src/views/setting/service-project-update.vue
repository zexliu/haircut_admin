<template>
  <service-project-detail :is-edit="true" />
</template>

<script>
import ServiceProjectDetail from './components/ServiceProjectDetail'

export default {
  name: 'UpdateServiceProject',
  components: { ServiceProjectDetail }
}
</script>

