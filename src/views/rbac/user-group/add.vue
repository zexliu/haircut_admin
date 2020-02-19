<template>
  <user-group-detail :is-edit="false" />
</template>

<script>
import UserGroupDetail from './components/UserGroupDetail'

export default {
  name: 'AddUserGroup',
  components: { UserGroupDetail }
}
</script>

