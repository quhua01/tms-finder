<template>
  <div class="info">
    <div v-if="schemas">
      <el-table :data="files" stripe style="width: 100%" @row-dblclick="rowDbClick" v-if="viewStyle == '1'">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column v-for="(s, k) in schemas.properties" :key="k" :prop="k" :label="s.title"></el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="scope">
            <el-button @click="setInfo(scope.row)">编辑</el-button>
            <el-button @click="download(scope.row)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="icon-view" v-if="viewStyle == '2'">
        <div class="icon-lists" v-if="files.length">
          <el-card
            :class="cardClass"
            v-for="(item, index) in files"
            :key="index + '-only'"
            :body-style="{ padding: '0px' }"
            shadow="never"
          >
            <svg class="icon" aria-hidden="true">
              <use :xlink:href="formateFileType(item)" />
            </svg>
            <div style="padding: 0 14px 14px">
              <span class="file-comment">{{ item.comment }}</span>
              <div class="bottom clearfix">
                <el-button @click="setInfo(item)">编辑</el-button>
                <el-button @click="download(item)">下载</el-button>
              </div>
            </div>
          </el-card>
          <div
            :class="emptyClass"
            v-for="index in columns - (files.length % columns)"
            :key="index"
            v-show="files.length % columns > 0"
          ></div>
        </div>
        <div class="empty" v-else>暂无数据</div>
      </div>
    </div>
    <el-pagination
      background
      v-model:currentPage="batch.page"
      :page-sizes="[10, 20, 30]"
      v-model:pageSize="batch.size"
      layout="total, sizes, prev, pager, next"
      :total="batch.total"
    ></el-pagination>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, reactive, ref, toRaw, watch } from 'vue'
import { dialogInjectionKey } from 'gitart-vue-dialog'
import { Batch } from 'tms-vue3'
import facStore from '@/store'
import manageApi from '@/apis/file/manage'
import utils from '@/utils'
import Editor from './Editor.vue'

type Tms_Finder_File = {
  name: string
  path: string
  size: number
  birthtime: number
  info: any
}

const props = defineProps({
  domain: { type: String },
  bucket: { type: String },
})

const store = facStore()
const $dialog = inject(dialogInjectionKey)

const { domain, bucket } = props
const files = ref([])

const batch = reactive(new Batch(manageApi.list, domain, bucket))
batch.size = 12

const columns = ref(9)
const cardClass = ref('el-card')
const emptyClass = ref('empty-card')

const schemas = computed(() => {
  return store.schemas
})

const viewStyle = computed(() => {
  return store.viewStyle
})

watch(
  () => batch.page,
  (page) => {
    batchList(page)
  }
)

const batchList = (page: number) => {
  batch.goto(page).then((batchResult: any) => {
    files.value = batchResult.result.files
  })
}

const setInfo = (file: any) => {
  $dialog?.addDialog({
    component: Editor,
    props: { domain, bucket, schemas: toRaw(schemas), path: file.path, info: file.info },
  })
}

const download = (file: any) => {
  // const fileurl = this.$utils.getFileUrl(file)
  // MessageBox.confirm(fileurl, file.name, {
  //   confirmButtonText: '下载',
  //   cancelButtonText: '取消'
  // }).then(() => {
  //   window.open(fileurl)
  // })
}

const rowDbClick = (file: any) => {
  utils.postMessage(() => utils.getFileUrl(file))
}

const formateFileType = (data) => {
  const fileType = utils.matchType(data.name)
  let iconId = ''
  switch (fileType) {
    case 'image':
      iconId = '#iconyunpanlogo-6'
      break
    case 'txt':
      iconId = '#iconyunpanlogo-5'
      break
    case 'excel':
      iconId = '#iconyunpanlogo-'
      break
    case 'word':
      iconId = '#iconyunpanlogo-2'
      break
    case 'pdf':
      iconId = '#iconyunpanlogo-7'
      break
    case 'ppt':
      iconId = '#iconyunpanlogo-1'
      break
    case 'video':
      iconId = '#iconyunpanlogo-4'
      break
    case 'viewStyle':
      iconId = '#iconyunpanlogo-3'
      break
    case 'other':
      iconId = '#iconicon_weizhiwenjian'
      break
    default:
      iconId = '#iconicon_weizhiwenjian'
      break
  }
  return iconId
}

onMounted(async () => {
  if (window.screen.width >= 1920) {
    columns.value = 10
    cardClass.value = 'el-card-2'
    emptyClass.value = 'empty-card-2'
  } else {
    columns.value = 9
    cardClass.value = 'el-card'
    emptyClass.value = 'empty-card'
  }
  await store.getSchemas(bucket, domain)
  batchList(1)
})
</script>
<style lang="scss">
.info {
  display: flex;
  flex-direction: column;

  .el-card {
    margin-bottom: 10px;
    width: 10%;
  }

  .empty-card {
    margin-bottom: 10px;
    width: 10%;
  }

  .el-card-2 {
    margin-bottom: 10px;
    width: 9%;
  }

  .empty-card-2 {
    margin-bottom: 10px;
    width: 9%;
  }

  .empty {
    width: 100%;
    margin-top: 50px;
    line-height: 60px;
    text-align: center;
    color: #909399;
    border-top: 1px solid #ebeef5;
    border-bottom: 1px solid #ebeef5;
    font-size: 14px;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
    margin-left: 6px;
  }
}
</style>
