<template>
  <v-app id="inspire" :dark="theme" class="theme">
    <router-view @change-theme="changeTheme" />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { mapActions } from 'vuex';
import { getItemJson } from './util/storageUtils';
import eciaActions, { versionOfServiceList } from '@/static/eciaActions'; // ActionTypeIDのリスト
import list, {
  customGroupList as hpcCustomGroupList,
  softwareVersionList,
  OS_LIST as osList,
} from '@/static/hpc/data';
import { FORMAT_LIST, OS_LIST } from '@/api';

const initDemoData = () => {
  const formatList = getItemJson(localStorage, FORMAT_LIST, null);
  const customGroupList = getItemJson(localStorage, 'customGroupList', null);
  const versionList = getItemJson(localStorage, 'versionList', null);

  if (!formatList) {
    localStorage.setItem(
      FORMAT_LIST,
      JSON.stringify({
        ecia: eciaActions,
        hpc: list,
      })
    );
  }

  if (!customGroupList) {
    localStorage.setItem(
      'customGroupList',
      JSON.stringify({
        hpc: hpcCustomGroupList,
      })
    );
  }

  if (!versionList) {
    localStorage.setItem(
      'versionList',
      JSON.stringify({
        ecia: versionOfServiceList,
        hpc: softwareVersionList,
      })
    );
  }

  localStorage.setItem(
    OS_LIST,
    JSON.stringify({
      ecia: osList,
      hpc: osList,
    })
  );
};

@Component({
  name: 'App',
})
export default class App extends Vue {
  theme = false;

  $vuetify: any;

  changeTheme(theme) {
    this.$vuetify.theme.dark = theme;
    this.theme = theme;
  }

  // eslint-disable-next-line class-methods-use-this
  created() {
    initDemoData();
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/_index.scss';
// .footer {
//   position: sticky;
//   bottom: 0;
//   width: 100%;
//   /* height: 100px; */
//   /* max-height: 100%; */
//   /* overflow: auto; */
// }
// .items {
//   /* max-height: 200px; */
//   overflow: auto;
// }

.menu {
  // left: auto;
  // right: 0px;
  &--no-transition {
    &.v-menu__content {
      transition: none;
    }
  }
}

// .menu-icon {
//   min-width: 0;
// }
// .menu-title {
//   // padding-left: 16px;
// }

// .chip {
//   &--x-small {
//     font-size: 10px;
//     height: 16px;
//   }
// }

.toolbar {
  // &.v-toolbar {
  //   background: none;
  //   // padding-top: 6px;
  // }
  &--no-padding {
    @extend .toolbar;
    .v-toolbar__content {
      padding: 0;
      // max-height: 38px;
    }
  }
  // &--table {
  //   &.v-toolbar {
  //     background: none;
  //     // padding-top: 6px;
  //     .v-toolbar__content {
  //       padding: 0;
  //       min-height: 40px;
  //       height: auto !important;
  //     }
  //   }
  // }

  &__button-base {
    // border: 1px solid #dadce0;
    text-transform: none;
    font-weight: normal;
    padding-right: 2px;
  }
}

// header.toolbar {
//   height: auto !important;
//   .v-toolbar__content {
//     max-height: 40px;
//   }
// }
.v-input--dense {
  @include font-size;
}
.v-input--dense.v-text-field--outlined {
  .v-input__slot,
  .v-select__slot,
  .v-autocomplete {
    min-height: 0 !important;
    height: 36px;
  }
  .v-label {
    top: 9px;
  }
  .v-input__prepend-inner {
    margin-top: 6px !important;
  }
}
.v-input--dense.v-input--checkbox,
.v-simple-checkbox {
  @include font-size;
  margin: 0;
  .v-icon {
    font-size: 20px;
  }
  // .v-input--selection-controls {
  //   padding: 2px 0;
  // }
  .v-input--selection-controls__ripple {
    transform: scale(0.8);
    left: -14px;
  }
  // align-items: baseline;
}
.v-label {
  @include font-size;
}

.v-input--dense.v-textarea {
  @include input-textarea;
}

.button-base {
  // border: 1px solid #dadce0;
  text-transform: none;
  font-weight: normal;
  // padding-right: 2px;
}
</style>

<style lang="scss" scoped>
.theme {
  background-color: var(--v-background-base);
}
// .theme {
// background: #fff;
// &--dark {
//   background: #303030;
// }
// }
</style>
