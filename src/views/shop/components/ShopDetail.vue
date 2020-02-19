<template>
  <el-card class="large-form-container" shadow="never">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="店铺名称：" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="关联用户：" prop="userId">
            <el-select
              v-model="form.userId"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="remoteMethod"
              :loading="loading"
            >
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.nickname"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="店铺LOGO：" prop="logo">
            <avatar-upload v-model="form.logo" />
          </el-form-item>
          <el-form-item label="封面图片：" prop="coverImage">
            <avatar-upload v-model="form.coverImage" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人：" prop="leaderName">
            <el-input v-model="form.leaderName" />
          </el-form-item>

          <el-form-item label="联系电话：" prop="leaderMobile">
            <el-input v-model="form.leaderMobile" />
          </el-form-item>

          <el-form-item label="营业执照：" prop="businessLicense">
            <avatar-upload v-model="form.businessLicense" />

          </el-form-item>
          <el-form-item label="可用状态：" prop="enable">
            <el-switch
              v-model="form.enable"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="简介信息：" prop="introduction">
        <el-input v-model="form.introduction" />
      </el-form-item>

      <el-form-item label="详情信息：" prop="htmlInfo">
        <tinymce v-model="form.htmlInfo" :height="100" />
      </el-form-item>
      <el-row>

        <el-col :span="8">
          <el-form-item label="所属省：" prop="provinceCode">
            <el-select v-model="form.provinceCode" disabled placeholder="请选择">
              <el-option
                v-for="item in provinceOptions"
                :key="item.id"
                :label="item.name"
                :value="item.adCode"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所属市：" prop="cityCode">
            <el-select v-model="form.cityCode" disabled placeholder="请选择">
              <el-option
                v-for="item in cityOptions"
                :key="item.id"
                :label="item.name"
                :value="item.adCode"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所属区：" prop="districtCode">
            <el-select v-model="form.districtCode" disabled placeholder="请选择">
              <el-option
                v-for="item in districtOptions"
                :key="item.id"
                :label="item.name"
                :value="item.adCode"
              />
            </el-select>
          </el-form-item>
        </el-col>

      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="详细地址：" prop="address">
            <el-input v-model="form.address" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="经度：" label-width="80px" prop="longitude">
            <el-input v-model="form.longitude" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="纬度：" label-width="80px" prop="latitude">
            <el-input v-model="form.latitude" :disabled="true" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="地图位置：">
        <div class="amap-page-container">
          <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult" />
          <el-amap vid="amapDemo" :center="mapCenter" :zoom="16" :events="mapEvents" class="amap-demo">
            <el-amap-marker
              v-for="(marker,index) in markers"
              :key="index"
              :events="searchMarkerEvents"
              :icon="blueIcon"
              :position="marker"
            />
            <el-amap-marker
              v-if="currentMaker"
              :z-index="200"
              :position="currentMaker"
              :draggable="true"
              :events="currentMarkerEvents"
              :icon="redIcon"
            />
          </el-amap>
        </div>
      </el-form-item>

      <div
        style="
              margin-top:70px"
      >
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">提交</el-button>
          <el-button v-if="!isEdit" @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </div>
    </el-form>
  </el-card>
</template>

<script>
import { fetchList as fetchUserList } from '@/api/user'
import { fetchDetail, create, update } from '@/api/shop'

import { fetchTree as fetchRegionTree, fetchByCode } from '@/api/region'
import AvatarUpload from '@/components/Upload/AvatarUpload'
import Tinymce from '@/components/Tinymce'
const defaultForm = {
  name: null,
  userId: null,
  leaderName: null,
  leaderMobile: null,
  logo: null,
  businessLicense: null,
  coverImage: null,
  enable: true,
  introduction: null,
  htmlInfo: null,
  longitude: null,
  latitude: null,
  provinceCode: null,
  cityCode: null,
  districtCode: null,
  address: null

}
export default {
  name: 'ShopDetail',
  components: { AvatarUpload, Tinymce },

  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      redIcon: require('@/icons/red-marker.png'),
      blueIcon: require('@/icons/blue-marker.png'),
      zoom: 12,
      center: [121.59996, 31.197646],
      id: null,
      form: Object.assign({}, defaultForm),
      rules: {
        name: [
          { required: true, message: '请输入店铺名称', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
            trigger: 'blur'
          }
        ],
        leaderName: [
          { required: true, message: '请输入联系人姓名', trigger: 'blur' },
          {
            min: 2,
            max: 8,
            message: '长度在 2 到 8 个字符',
            trigger: 'blur'
          }
        ],
        userId: [
          { required: true, message: '请选择关联用户', trigger: 'blur' }
        ],

        leaderMobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {
            min: 11,
            max: 11,
            message: '长度在11个字符',
            trigger: 'blur'
          }
        ],
        logo: [
          { required: true, message: '请上传店铺LOGO', trigger: 'blur' }
        ],
        coverImage: [
          { required: true, message: '请上传封面图', trigger: 'blur' }
        ],
        provinceCode: [
          { required: true, message: '请选择有效地址', trigger: 'blur' }
        ],
        cityCode: [
          { required: true, message: '请选择有效地址', trigger: 'blur' }
        ],
        districtCode: [
          { required: true, message: '请选择有效地址', trigger: 'blur' }
        ],
        latitude: [
          { required: true, message: '请选择有效地址', trigger: 'blur' }
        ],
        longitude: [
          { required: true, message: '请选择有效地址', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入有效地址', trigger: 'blur' },
          {
            min: 2,
            max: 30,
            message: '长度在 2 - 30个字符',
            trigger: 'blur'
          }
        ]
      },
      options: [],
      loading: false,
      searchOption: {
        city: '唐山',
        citylimit: false
      },
      mapCenter: [118.181573, 39.63194],
      markers: [],
      currentMaker: null,

      mapEvents: {
        'click': (e) => {
          this.currentMaker = [e.lnglat.lng, e.lnglat.lat]
          this.getAddress()
        }
      },
      currentMarkerEvents: {
        dragend: (e) => {
          this.currentMaker = [e.lnglat.lng, e.lnglat.lat]
          this.getAddress()
        }
      },
      searchMarkerEvents: {
        click: (e) => {
          this.currentMaker = [e.lnglat.lng, e.lnglat.lat]
          this.getAddress()
        }
      },
      provinceOptions: [],
      cityOptions: [],
      districtOptions: []

    }
  },

  created() {
    const promisies = [fetchRegionTree({ level: 3 })]
    if (this.isEdit) {
      this.id = this.$route.params && this.$route.params.id
      promisies.push(fetchDetail(this.id))
    }
    Promise.all(promisies).then(results => {
      this.provinceOptions = results[0]
      if (this.isEdit) {
        this.form = results[1]
      }
    })
  },
  methods: {
    getAddress() {
      const that = this
      AMap.plugin('AMap.Geocoder', function() {
        var geocoder = new AMap.Geocoder({})
        geocoder.getAddress(that.currentMaker, function(status, result) {
          if (status === 'complete' && result.info === 'OK') {
            // result为对应的地理位置详细信息
            that.form.latitude = that.currentMaker[1]
            that.form.longitude = that.currentMaker[0]
            const adCode = result.regeocode.addressComponent.adcode
            const province = result.regeocode.addressComponent.province
            const city = result.regeocode.addressComponent.city
            const district = result.regeocode.addressComponent.district
            let address = result.regeocode.formattedAddress
            if (province && address.startsWith(province)) {
              address = address.substr(province.length, address.length - province.length)
            }
            if (city && address.startsWith(city)) {
              address = address.substr(city.length, address.length - city.length)
            }
            if (district && address.startsWith(district)) {
              address = address.substr(district.length, address.length - district.length)
            }
            that.form.districtCode = parseInt(adCode)
            that.form.address = address
            that.getProvinceAndCityByCode()
          }
        })
      })
    },
    getProvinceAndCityByCode() {
      fetchByCode(this.form.districtCode).then(response => {
        console.log('result')
        this.form.provinceCode = response.provinceCode
        const province = this.provinceOptions.find(item => {
          return item.adCode === this.form.provinceCode
        })
        console.log('province', province)
        this.cityOptions = province.children
        this.form.cityCode = response.cityCode

        const city = this.cityOptions.find(item => {
          return item.adCode === this.form.cityCode
        })
        console.log('city', city)
        this.districtOptions = city.children
      })
    },
    onSearchResult(pois) {
      let latSum = 0
      let lngSum = 0
      if (pois.length > 0) {
        pois.forEach(poi => {
          const { lng, lat } = poi
          lngSum += lng
          latSum += lat
          this.markers.push([poi.lng, poi.lat])
        })
        const center = {
          lng: lngSum / pois.length,
          lat: latSum / pois.length
        }
        this.mapCenter = [center.lng, center.lat]
      }
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        fetchUserList({ current: 1, size: 20, keywords: query }).then(response => {
          this.loading = false
          this.options = response.records
        })
      } else {
        this.options = []
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.form = Object.assign({}, defaultForm)
      this.$refs.tree.setCheckedKeys([])
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // 组装数据 keys数组中排除权限模块的数据 值提交权限
            if (this.isEdit) {
              update(this.id, this.form).then(() => {
                this.$notify({
                  message: '修改成功',
                  type: 'success',
                  duration: 1000
                })
                this.$router.back()
              })
            } else {
              create(this.form).then(() => {
                this.$refs[formName].resetFields()
                this.form = Object.assign({}, defaultForm)
                this.$notify({
                  message: '提交成功',
                  type: 'success',
                  duration: 1000
                })
              })
            }
          })
        } else {
          this.$notify({
            message: '效验失败',
            type: 'error',
            duration: 1000
          })
          return false
        }
      })
    }
  }

}

</script>

<style>
  .search-box {
      position: absolute;
      top: 60px;
      left: 20px;
    }
    .amap-page-container {
      margin-top: -30px;
      height: 400px;
      position: relative;
    }
</style>
