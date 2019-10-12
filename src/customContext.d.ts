import Vue from 'vue';

// .vueファイルで "this.$actionCreatorsや this.getAllStoreState()" で型が効くようにする。
declare module 'vue/types/vue' {
  interface Vue {
    $loggg: (message: any) => {};
  }
}
