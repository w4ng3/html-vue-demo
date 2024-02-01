// ---
axios.defaults.baseURL = 'https://www.fastmock.site/mock/823603c19da381d3b926d34331f6cfb7/gg-api';
// axios.defaults.headers.common['token'] = sessionStorage.getItem("token");
//axios封装post请求
function apipost(url, data) {
  let result = axios({
    method: 'post',
    url: url,
    data: Qs.stringify(data),
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  }).then(resp => {
    if (resp.data.code == 4001 || resp.data.code == 99) {
      alert("登陆超时,请重新登录");
      window.location.href = 'login.html';
    }
    return resp.data;
  }).catch(error => {
    return "exception=" + error;
  });
  return result;
}

//get请求
function apiget(url, data) {
  var result = axios({
    method: 'get',
    data: Qs.stringify(data),
    url: url,
  }).then(function (resp) {
    if (resp.data.code == 4001 || resp.data.code == 99) {
      alert("登陆超时,请重新登录");
      window.location.href = 'login.html';
    }
    return resp.data;
  }).catch(function (error) {
    return "exception=" + error;
  });
  return result;
}