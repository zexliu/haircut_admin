<template>
  <module-detail :is-edit="false" />
</template>

<script>
import ModuleDetail from './components/ModuleDetail'

export default {
  name: 'AddModule',
  components: { ModuleDetail }
}
</script>

