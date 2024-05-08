const Home = {
  setup() {
    const { ref, onMounted } = Vue;
    // const { useRoute } = VueRouter
    // const route = useRoute()

    let wxAppid = "wx31cf25d1328da3ca";
    // let redirect_uri = 'https://box.viperyibaba.com/zhzk/index.html#/';
    let redirect_uri = encodeURIComponent('https://box.viperyibaba.com/zhzk/index.html#/')

    const userOpenid = ref('code---')
    /** 
     * @description 状态
     * 'success' 开门成功，'fail' 开门失败，'register': 需要绑定手机号，'loading':等待中
     */
    const status = ref('loading')

    // 获取当前url的params参数，微信重定向后会丢失哈希路由
    function getParams() {
      let url = window.location.href;
      let params = {};
      if (url.indexOf("?") != -1) {
        let arr = url.split("?")[1].split("&");
        for (let i = 0; i < arr.length; i++) {
          let key = arr[i].split("=")[0];
          let value = arr[i].split("=")[1];
          params[key] = value;
        }
      }
      return params;
    }

    onMounted(() => {
      // let params = route.query
      let params = getParams();
      console.log('code:', params.code);
      // 判断是否有code参数
      if (params.code) {
        // 有code参数，说明是从微信授权页面跳转过来的
        let code = params.code;
        // 测试，待删～
        userOpenid.value = code
        // /** 开门 */
        apipost(`/zhzk/getCode?code=${code}`, {}).then(res => {
          // 1. 开门失败
          if (res.code == 0) {
            status.value = 'fail'
          }
          // 2. 开门成功
          else if (res.code == 1) {
            status.value = 'success'
          }
          // 3. 需要绑定
          else {
            let data = res.data
            // userOpenid.value = data.openid
            status.value = 'register'
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
      mobile: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        // 正则，手机号
        {
          pattern: /^1[3456789]\d{9}$/,
          message: '请输入正确的手机号',
          trigger: 'blur'
        }
      ],
      verificationCode: [
        { required: true, message: '请输入验证码', trigger: 'blur' }
      ]
    };

    const countDown = ref(0);

    async function getVerificationCode() {
      try {
        // 正则校验手机号，失败则不发送请求
        const mobile = formData.value.mobile;
        if (!/^1[3456789]\d{9}$/.test(mobile)) {
          return;
        }
        // 发送获取验证码的请求
        await apipost(`/zhzk/getVertifyCode`, { phone: mobile })
        // 如果成功发送请求，则开始倒计时
        await startCountDown();
      } catch (error) {
        console.error('获取验证码失败', error);
        alert('获取验证码失败')
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
      // 如果表单校验失败，则不提交
      if (!formData.value.mobile || !formData.value.verificationCode) {
        return;
      }
      try {
        // 在这里执行表单提交的逻辑，可以调用API等
        console.log('表单提交成功', formData.value);
        await apipost(`/zhzk/register`, {
          phone: mobile,
          code: formData.value.verificationCode,
          userOpenid: userOpenid.value
        })
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
      agreeTerms,
      userOpenid
    };
  },
  template: '#home-template',
};
