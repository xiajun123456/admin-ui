<template>
  <div>
    <el-form-item label=""
                  prop="">
      <div class="slideBox">
        <div class="imgBox">
          <div class="bgImg">
          </div>
          <img class="puzzleImg"/>
        </div>
        <div class="slideBar">
          <div class="slideBg"></div>
          <div class="slideTip">向右拖动滑块验证</div>
          <div class="slideBtn">
            <i :class="iconClass"></i>
          </div>
        </div>
      </div>
    </el-form-item>
    <el-form-item label=""
                  prop="smsCode">
      <el-row :gutter="6"
              type="flex"
              justify="space-around">
        <el-col :span=8>
          <el-input ref="smsInputRef"
                    placeholder="短信验证码"
                    :disabled=isDisabledSms
                    v-model="loginForm.smsCode"
                    @keyup.enter.native="login()">
          </el-input>
        </el-col>
        <el-col :span=15>
          <el-button ref="smsBtnRef"
                     :disabled=isDisabledBtn
                     type="primary"
                     plain
                     @click="resetValidate"
                     class="smsBtn">滑动验证后自动发出短信
          </el-button>
        </el-col>
      </el-row>
    </el-form-item>
  </div>
</template>

<script>
import $ from 'jquery'
import $http from '@/assets/js/http'
import appConst from '@/assets/js/appConst'

export default {
  props: ['loginForm'],
  name: 'Login',
  data () {
    return {
      imgId: '',
      imgOrder: '',
      offsetX: '',
      // 验证成功禁止点击的标记
      isClick: true,
      isDisabledSms: true,
      isDisabledBtn: true,
      iconClass: ['iconfont icon-right'],
      // 当获取图片失败，将 flag 值改为 false ，不发送发请求
      isAjax: true
    }
  },
  created () {
    this.getImg()
  },
  mounted () {
  },
  methods: {
    login () {
      this.$emit('login')
    },
    async getImg () {
      // 用 参数系列 格式化一个字符串
      // 如："abc/{0}/{1}/{0}".formatWith(100,200)
      /* eslint-disable */
      String.prototype.formatWith = function () {
        let arg = arguments
        return this.replace(/\{(\d+)\}/g, function ($, $1) {
          return arg[+$1]
        })
      }
      /* eslint-enable */

      // 获取图片 id
      const { data: res } = await $http.get(appConst.imgUrl + '/image/imgcheck/v1.0/new')
      console.log(res)
      if (res.status !== 1000000) {
        this.$message.error('获取图片数组失败。')
        this.isAjax = false
        // return
      }
      // if (res.status !== 1000000) return true
      this.imgId = res.data.id
      this.imgOrder = res.data.order

      let rowCount = 2
      let colCount = 10
      let width = 320
      let height = 160
      let sliceWidth = width / colCount
      let sliceHeight = height / rowCount
      let bgImg = $('.bgImg')
      let puzzleImg = $('.puzzleImg')
      // 生成 20 个小的背景图容器 start
      // 生成子元素之前先清空所有子元素
      bgImg.empty()
      let count = rowCount * colCount
      for (let i = 0; i < count; i++) {
        bgImg.append('<div></div>')
      }
      let sliceImgs = $('div', bgImg)
      // 生成 20 个小的背景图容器 end
      let bgCache = document.createElement('img')

      // 获取图片
      const { data: response } = await $http.get(appConst.imgUrl + '/image/imgcheck/v1.0/bg?id=' + this.imgId)
      // console.log(response)
      console.log(!!response, '图片 response')
      if (!response) {
        this.$message.error('获取图片失败。')
        this.isAjax = false
        // return
      } else {
        // 设置背景图
        puzzleImg.attr('src', appConst.imgUrl + '/image/imgcheck/v1.0/puzzle?id=' + this.imgId)
        bgCache.src = appConst.imgUrl + '/image/imgcheck/v1.0/bg?id=' + this.imgId
        sliceImgs.css('backgroundImage', 'url(' + bgCache.src + ')')
        if (rowCount <= 0) return
        for (let i = 0; i < rowCount; i++) {
          for (let j = 0; j < colCount; j++) {
            let n = this.imgOrder[i * colCount + j]
            sliceImgs[n].style.backgroundPosition = '{0}px {1}px'.formatWith(
              -j * sliceWidth,
              -i * sliceHeight
            )
          }
        }
        sliceImgs.css({ 'float': 'left', 'width': 32, 'height': 80, 'background-repeat': 'no-repeat' })
      }

      this.slideRight()
    },
    slideRight () {
      $('.slideBtn').on('mousedown', e => {
        // 如果验证成功值为 false ，禁止点击
        if (this.isClick) {
          $('.imgBox').show()
          $('.slideTip').text('向右拖动滑块验证').css('color', '#363636')
          let x = e.pageX - $('.slideBox').offset().left
          $(document).on('mousemove', e => {
            let endX = e.pageX - $('.slideBox').offset().left
            this.offsetX = endX - x
            if (this.offsetX < 0) {
              this.offsetX = 0
            }
            if (this.offsetX > $('.slideBox').outerWidth() - $('.slideBtn').outerWidth()) {
              this.offsetX = $('.slideBox').outerWidth() - $('.slideBtn').outerWidth() - 1
            }
            $('.slideBtn').css('left', this.offsetX)
            $('.puzzleImg').css('left', this.offsetX)
            $('.slideBg').width(this.offsetX)
          })
        }
      })
      // 鼠标抬起，解绑鼠标移动事件，隐藏图片，数据重置, 校验用户名密码
      $(document).on('mouseup', async () => {
        $(document).off('mousemove')
        $('.imgBox').hide()
        // 如果验证成功值 为 false ，禁止点击
        if (this.offsetX > 20 && this.isClick) {
          if (!this.loginForm.userName || !this.loginForm.pwd) {
            this.resetData('登录名和密码不能为空！', 'red')
            this.offsetX = 0
            // 默认为 true ，允许发送请求；当获取图片失败，值为 false ，不发送请求
          } else if (this.isAjax) {
            // 如果用户名和密码不为空，则发送图片验证请求
            let imgValidate = {
              userName: this.loginForm.userName,
              pwd: this.loginForm.pwd,
              id: this.imgId,
              value: Math.round(this.offsetX)
            }
            const { data: res } = await $http.post(appConst.imgUrl + '/image/imgcheck/v1.0/validate', imgValidate)
            console.log(res, '图片验证')
            if (res.status !== 1000000) {
              this.resetData(res.data, 'red')
              this.offsetX = 0
              return
            }
            if (!res.data.imgCheckStatus) {
              this.resetData('验证失败，请重试。', 'red')
              this.offsetX = 0
              return
            }
            if (!res.data.uid) {
              this.resetData('服务器未返回 token。', 'red')
              this.offsetX = 0
              return
            }
            this.loginForm.smsToken = res.data.uid
            // 图片验证成功，允许输入短信验证码
            this.isDisabledSms = false
            // 图片验证成功，120 秒内禁止点击
            this.isClick = false
            let maxX = $('.slideBox').outerWidth() - $('.slideBtn').outerWidth() - 1
            $('.slideTip').text('成功！短信验证码已发出。')
            $('.slideBtn').css('left', maxX)
            $('.slideBg').css('background-color', 'rgb(1, 204, 103)').width(maxX)
            this.iconClass = ['iconfont icon-duihao']
            let btnText = $(this.$refs.smsBtnRef.$el).find('span')
            let second = 60
            btnText.text(second + ' 秒后才可再次验证')// 解决没有第 120 秒的问题
            let intervalId = window.setInterval(() => {
              second--
              btnText.text(second + ' 秒后才可再次验证')
              if (second <= 0) {
                console.log(second)
                window.clearInterval(intervalId)
                this.isDisabledBtn = false
                btnText.text('没有收到短信，重新验证')
              }
            }, 1000)
          }
        }
      })
    },
    resetValidate () {
      // 针对验证成功的重置
      // 图片验证成功，120 秒后允许点击
      this.isClick = true
      this.resetData('向右拖动滑块验证')
      this.offsetX = 0
      $(this.$refs.smsBtnRef.$el).find('span').text('滑动验证后自动发出短信')
      this.isDisabledSms = true
      this.isDisabledBtn = true
      this.iconClass = ['iconfont icon-right']
      this.getImg()
    },
    resetData (tip, colorStr) {
      let color = colorStr || '#363636'
      $('.slideTip').text(tip).css('color', color)
      $('.slideBtn').css('left', 0)
      $('.puzzleImg').css('left', 0)
      $('.slideBg').css('background-color', 'rgba(34, 132, 230, 0.6)').width(0)
    }
  }
}
</script>

<style lang="scss" scoped>
  .slideBox {
    width: 320px;
    user-select: none;
    position: relative;

    .imgBox {
      position: absolute;
      display: none;
      z-index: 100;
      bottom: 40px;

      .bgImg {
        width: 320px;
        height: 160px;
        background-color: #e8e8e8;
        border-radius: 4px;
        overflow: hidden;
        background: #e5eff1 url(../../assets/imgs/loading.gif) no-repeat center;
        background-size: 100%;
      }

      .puzzleImg {
        position: absolute;
        left: 0px;
        top: 0px;
      }
    }

    .slideBar {
      border-radius: 4px;
      width: 320px;
      height: 40px;
      background-color: #f5f5f5;
      // background-color: #e8e8e8;
      border: 1px solid #dcdfe6;
      position: relative;

      .slideBg {
        width: 0px;
        height: 100%;
        background-color: rgba(34, 132, 230, 0.6);
      }

      .slideTip {
        width: 100%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-size: 14px;
        color: #363636;
        position: absolute;
        top: 0px;
        left: 0px;
      }

      .slideBtn {
        border-radius: 4px;
        width: 40px;
        height: 38px;
        line-height: 38px;
        text-align: center;
        background: #fff;
        border-right: 1px solid #dcdfe6;
        cursor: move;
        color: #888;
        position: absolute;
        top: 0px;
        left: 0px;
        background: -moz-linear-gradient(
            top,
            rgba(245, 246, 246, 1) 0%,
            rgba(219, 220, 226, 1) 21%,
            rgba(184, 186, 198, 1) 49%,
            rgba(221, 223, 227, 1) 80%,
            rgba(245, 246, 246, 1) 100%
        );
        background: -webkit-linear-gradient(
            top,
            rgba(245, 246, 246, 1) 0%,
            rgba(219, 220, 226, 1) 21%,
            rgba(184, 186, 198, 1) 49%,
            rgba(221, 223, 227, 1) 80%,
            rgba(245, 246, 246, 1) 100%
        );
        background: linear-gradient(
            to bottom,
            rgba(245, 246, 246, 1) 0%,
            rgba(219, 220, 226, 1) 21%,
            rgba(184, 186, 198, 1) 49%,
            rgba(221, 223, 227, 1) 80%,
            rgba(245, 246, 246, 1) 100%
        );
        filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#f5f6f6', endColorstr='#f5f6f6', GradientType=0);
        // background-color: #409eff;
      }
    }
  }

  .smsBtn {
    letter-spacing: normal;
    width: 200px !important;
  }
</style>
