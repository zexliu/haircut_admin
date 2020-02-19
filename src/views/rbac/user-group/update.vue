<template>
  <user-group-detail :is-edit="true" />
</template>

<script>
import UserGroupDetail from './components/UserGroupDetail'

export default {
  name: 'UpdateUserGroup',
  components: { UserGroupDetail }
}
</script>

