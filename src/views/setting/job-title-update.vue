<template>
  <job-title-detail :is-edit="true" />
</template>

<script>
import JobTitleDetail from './components/JobTitleDetail'

export default {
  name: 'UpdateJobTitle',
  components: { JobTitleDetail }
}
</script>

