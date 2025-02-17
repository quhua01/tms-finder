import { defineStore } from 'pinia'
import browseApi from '../apis/file/browse'

export default defineStore('webfs', {
  state: () => {
    return {
      schemas: null,
      tree: { name: '全部', path: '' },
      files: [],
      searchFiles: [] as any,
      currentDir: null,
      viewStyle: '1',
    }
  },
  actions: {
    searchFiles(searchFiles) {
      this.searchFiles = searchFiles
    },
    setCurrentDir(dir) {
      this.currentDir = dir
    },
    setViewStyle(value: string) {
      this.viewStyle = value
    },
    getSchemas(bucket?: string, domain?: string) {
      return new Promise((resolve) => {
        browseApi.schemas(domain, bucket).then((schemas: any) => {
          this.schemas = schemas
          resolve(schemas)
        })
      })
    },
    list(dir, domain?: string, bucket?: string) {
      return new Promise((resolve) => {
        browseApi.list(dir.path, domain, bucket).then((listData) => {
          let { dirs, files } = listData
          dir.dirs = dirs
          dirs.forEach((d) => {
            d.path = `${dir.path}/${d.name}`
            d.parent = dir
          })
          this.files = files
          resolve({ dirs, files })
        })
      })
    },
    expand(dir: any, domain: string, bucket: string) {
      return new Promise((resolve) => {
        browseApi.list(dir.path, domain, bucket).then((expandData) => {
          let { dirs } = expandData
          dir.dirs = dirs
          dirs.forEach((d) => {
            d.path = `${dir.path}/${d.name}`
            d.parent = dir
          })
          resolve(dirs)
        })
      })
    },
    overallSearch(dir, basename) {
      return new Promise((resolve) => {
        const params = {
          basename,
          dir: dir.path || '',
        }
        browseApi.overallSearch(params).then((searchData) => {
          let { dirs, files } = searchData
          this.files = files
          resolve({ dirs, files })
        })
      })
    },
  },
})
