const Home = {
  setup() {
    const { reactive, toRefs, ref, computed, onMounted } = Vue;
    const { useRoute } = VueRouter
    const route = useRoute()

    onMounted(() => {
      let param = route.query.param || 13
      console.log('param', param);
      // let decodedData = window.atob(param) //base64解密
      // ----------------
      apiget(`/`, {}).then(res => {
        console.log('res :>> ', res);
      }).catch(err => { alert('网络错误') })
      // apipost(`/note/getShareNote?params=${param}`, {}).then(res => {
      //   if (res.code == 0) {
      //     let data = res.data
      //     note.nickname = data.nickname
      //     note.avatar = data.avatar
      //     note.time = TimestampToDate(data.timestamp)
      //     note.noteId = data.noteId
      //     note.content = data.content
      //     note.resourceList = data.resourceList
      //     note.title = data.title
      //   }
      // }).catch(err => { alert('网络错误') })
    })
    const note = reactive({

      nickname: '',
      avatar: '',
      time: '',
      noteId: 0,
      content: "",
      // 资源：0图片，1视频
      resourceList: [],
      title: ""
    })

    // 时间戳转时间
    function TimestampToDate(Timestamp) {
      let date1 = new Date(Timestamp);
      return date1.toLocaleDateString().replace(/\//g, "-") + " " + date1.toTimeString().substr(0, 8);
    }

    // 全屏幕播放
    const btnFullVideo = (id) => {
      const elVideo = document.getElementById(id);
      if (elVideo.requestFullscreen) {
        elVideo.requestFullscreen()
        elVideo.play()
      }
      else if (elVideo.webkitRequestFullScreen) {
        elVideo.webkitRequestFullScreen()
        elVideo.play()
      } else if (elVideo.mozRequestFullScreen) {
        elVideo.mozRequestFullScreen()
        elVideo.play()
      } else {
        elVideo.play()
      }
    }
    // 退出全屏停止
    const fullscreenchange = (id) => {
      const video = document.getElementById(id);
      if (!document.webkitIsFullScreen) {
        video.pause()
      }

    }

    return {
      note,
      btnFullVideo,
      fullscreenchange
    };
  },
  template: '#home-template',
};
