<template>
  <permission-detail :is-edit="false" />
</template>

<script>
import PermissionDetail from './components/PermissionDetail'

export default {
  name: 'AddPermission',
  components: { PermissionDetail }
}
</script>

