<template>
  <el-dialog title="新建目录" :closeOnClickModal="false" v-model="dialogVisible">
    <el-form :label-position="'left'" label-width="80px">
      <el-form-item label="目录名">
        <el-input type="text" placeholder="请输入目录名" v-model="info.dir"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitMkdir">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ref, provide, inject } from 'vue'
  import createUploadApi from '../apis/file/upload'
  import { ElMessage } from 'element-plus'
  import { dialogInjectionKey } from 'gitart-vue-dialog'
  const $dialog = inject(dialogInjectionKey)
  const props = defineProps({
    dir: {
      type: String,
      default: ''
    },
    domain: String,
    bucket: String
  })
  const { dir, domain, bucket } = props;
  const info = ref({
    dir: dir ? dir + '/目录名' : '目录名'
  });
  const dialogVisible = ref(true)
  const submitMkdir = () => {
    if (info.value.dir) {
      createUploadApi.mkdir({ dir: info.value.dir, domain: domain, bucket: bucket })
        .then((res:any)=>{
          if (res=='ok') {
            ElMessage({
              message: '目录创建成功！',
              type: 'success'
            });
          }
          $dialog.removeDialog(0)
        })
    }
  }
</script>