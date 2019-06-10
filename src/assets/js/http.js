import axios from 'axios'
import { Loading, Message } from 'element-ui'

let loader = null
axios.interceptors.request.use(
  config => {
    if (config.url.indexOf('import') === -1) {
      loader = Loading.service({
        // target: document.querySelector('.el-table')
        text: '努力加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    }
    if (config.url.indexOf('projectId') !== -1) {
      config.url = config.url.replace(
        'projectId',
        sessionStorage.getItem('projectId')
      )
    }
    if (config.url.indexOf('settlementId') !== -1) {
      config.url = config.url.replace(
        'settlementId',
        config.data.type || 'SETTLEMENT'
      )
    }
    config.headers.Authorization = window.sessionStorage.getItem('token')
    // console.log(config, 'config')
    // 设置请求超时时间
    // config.timeout = 1000 * 60
    return config
  },
  error => {
    console.log(error, 'error')
    if (loader) {
      loader.close()
    }
    Message.error('请求错误！')
    return Promise.reject(error)
  }
)
axios.interceptors.response.use(
  response => {
    if (loader) {
      loader.close()
    }
    if (Number(response.data.status) === 408) {
      Message.error('Token 无效效，请检查。')
      sessionStorage.clear()
      // router.push('/login')
    }
    return response
  },
  error => {
    if (loader) {
      loader.close()
    }
    // console.dir(error, 'error')
    if (!error.response) {
      Message.error('服务器响应失败！')
    } else if (error.response.data.status === 402) {
      let msg = ''
      error.response.data.validatedMessages.forEach((item, index) => {
        msg += item.alert + '，'
      })
      Message.error(msg)
    } else {
      Message.error(error.response.data.Message)
    }
    return Promise.reject(error)
  }
)
export default axios
