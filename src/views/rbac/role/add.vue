<template>
  <role-detail :is-edit="false" />
</template>

<script>
import RoleDetail from './components/RoleDetail'

export default {
  name: 'AddRole',
  components: { RoleDetail }
}
</script>

