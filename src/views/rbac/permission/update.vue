<template>
  <permission-detail :is-edit="true" />
</template>

<script>
import PermissionDetail from './components/PermissionDetail'

export default {
  name: 'UpdatePermission',
  components: { PermissionDetail }
}
</script>

