<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'
import agentDashboard from './agent'

export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard, agentDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (this.roles.includes('ADMIN')) {
      console.log('admin dashboard')
      this.currentRole = 'adminDashboard'
    } else if (this.roles.includes('AGENT')) {
      console.log('admin dashboard')
      this.currentRole = 'agentDashboard'
    } else {
      this.currentRole = 'editorDashboard'
    }
  }
}
</script>
