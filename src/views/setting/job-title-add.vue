<template>
  <job-title-detail :is-edit="false" />
</template>

<script>
import JobTitleDetail from './components/JobTitleDetail'

export default {
  name: 'AddJobTitle',
  components: { JobTitleDetail }
}
</script>

