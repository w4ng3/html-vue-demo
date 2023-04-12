# HTML + VUE

在html文件中引入 vue3 和 vue-router

```js
<script src="https://unpkg.com/vue@next"></script>
<script src="https://unpkg.com/vue-router@4"></script>
```

逻辑分离式开发

```js
 <script type="text/x-template" id="about-template">
    <div class="wrapper">
      <h1> {{val}}</h1>
      <div>You will get about 22.46 MATIC</div>
      <!-- 按钮 -->
      <button :class="['next-btn',{ 'next-btn-active': true }]">NEXT</button>
    </div>
  </script>
  <script>
    const About = {
      setup() {
        const { reactive, ref, onMounted } = Vue;
        const { useRoute } = VueRouter
        const route = useRoute();
        const val = ref(0)
        onMounted(() => {
          val.value = route.params.num
        })
        return {
          val
        };
      },
      template: '#about-template',
    };
  </script>
```

