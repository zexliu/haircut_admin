<template>
  <service-project-detail :is-edit="false" />
</template>

<script>
import ServiceProjectDetail from './components/ServiceProjectDetail'

export default {
  name: 'AddServiceProject',
  components: { ServiceProjectDetail }
}
</script>

