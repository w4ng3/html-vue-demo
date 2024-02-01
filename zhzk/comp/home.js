const Home = {
  setup() {
    const { reactive, toRefs, ref, computed, onMounted } = Vue;
    const { useRoute } = VueRouter
    const route = useRoute()

    let wxAppid = "wx31cf25d1328da3ca";
    let redirect_uri = 'https://box.viperyibaba.com/zhzk/index.html';

    const userOpenid = ref('openidxxx')
    /** 
     * @description 状态
     * 'success' 开门成功，'fail' 开门失败，'register': 需要绑定手机号，'loading':等待中
     */
    const status = ref('loading')

    onMounted(() => {
      let params = route.query
      console.log('param', params.code);
      // 判断是否有code参数
      if (params.code) {
        // 有code参数，说明是从微信授权页面跳转过来的
        let code = params.code;
        // /** 开门 */
        apipost(`/zhzk/getCode?code=${code}`, {}).then(res => {
          // 1.如果微信用户未绑定，显示表单
          if (res.code == 0) {
            let data = res.data
            userOpenid.value = data.openid
            status.value = 'register'
          }
          // 2. 开门成功
          else if (res.code == 1) {
            status.value = 'success'
          }
          // 3. 开门失败
          else {
            status.value = 'fail'
          }
        }).catch(err => { alert('网络错误') })
      } else {
        // 没有code参数，说明不是从微信授权页面跳转过来的，重定向到微信授权页面
        window.location.href =
          `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${wxAppid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`;
      }
    })


    /** 
     * 手机号表单
     */
    const formData = ref({
      mobile: '',
      verificationCode: ''
    });

    const formRules = {
      mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
      verificationCode: [
        { required: true, message: '请输入验证码', trigger: 'blur' }
      ]
    };

    const countDown = ref(0);

    async function getVerificationCode() {
      try {
        // 发送获取验证码的请求，假设这里使用了异步函数
        // 示例：调用一个获取验证码的API
        // 这里应该包括一些逻辑来确保在倒计时期间防止重复点击获取验证码
        // 如果成功发送请求，则开始倒计时
        await startCountDown();
      } catch (error) {
        console.error('获取验证码失败', error);
      }
    }

    async function startCountDown() {
      countDown.value = 60;

      const countdownInterval = setInterval(() => {
        if (countDown.value > 0) {
          countDown.value--;
        } else {
          clearInterval(countdownInterval);
        }
      }, 1000);
    }

    async function submitForm() {
      try {
        // 在这里执行表单提交的逻辑，可以调用API等
        console.log('表单提交成功', formData.value);
      } catch (error) {
        console.error('表单提交失败', error);
      }
    }
    /** 同意协议 */
    const agreeTerms = ref(false);

    return {
      formData,
      formRules,
      countDown,
      getVerificationCode,
      submitForm,
      status,
      agreeTerms
    };
  },
  template: '#home-template',
};
