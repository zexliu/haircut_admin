<template>
  <div class="app-container">

    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-form-item label="姓名：">
        {{ form.name }}
        <!-- <el-input v-model="form.name" :disabled="!isEdit" /> -->
      </el-form-item>
      <el-form-item label="联系电话：">
        {{ form.linkMobile }}
        <!-- <el-input v-model="form.linkMobile" :disabled="!isEdit" /> -->
      </el-form-item>
      <el-form-item label="身份证号：">
        {{ form.identityCardNo }}
        <!-- <el-input v-model="form.identityCardNo" :disabled="!isEdit" /> -->
      </el-form-item>
      <el-form-item label="身份证正面：">
        <el-image
          style="width: 340px; height: 216px"
          :src="form.identityCardFront"
          fit="cover"
          :preview-src-list="[form.identityCardFront,form.identityCardBack]"
        />
      </el-form-item>
      <el-form-item label="身份证反面：">
        <el-image
          style="width: 340px; height: 216px"
          :src="form.identityCardBack"
          fit="cover"
          :preview-src-list="[form.identityCardFront,form.identityCardBack]"
        />
      </el-form-item>
      <el-form-item label="备注：">
        {{ form.remark }}
        <!-- <el-input v-model="form.linkMobile" :disabled="!isEdit" /> -->
      </el-form-item>
      <el-row />
    </el-form>
  </div>
</template>

<script>
import { fetchList as fetchRegionList } from '@/api/region'
import { fetchCurrentAgent } from '@/api/agent'

export default {
  data() {
    return {
      isEdit: false,
      form: {},
      rules: {},
      regions: []

    }
  },
  created() {
    this.fetchRegion()
    this.getCurrent()
  },
  methods: {
    getRegionName(adCode) {
      const region = this.regions.find(item => {
        return item.adCode === adCode
      })
      return region ? region.name : ''
    },
    fetchRegion() {
      fetchRegionList().then(response => {
        this.regions = response
      })
    }, getCurrent() {
      fetchCurrentAgent().then(response => {
        this.form = response
      })
    }

  }
}
</script>

<style>

</style>
