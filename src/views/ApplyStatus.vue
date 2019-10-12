<template>
  <v-container fluid class="pa-6">
    <v-row>
      <v-col cols="12" class="pt-0">
        <div class="title">{{ service.text }}のフォーマット申請ステータス一覧</div>
      </v-col>
      <v-col cols="12">
        <ApplyStatusList></ApplyStatusList>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import ApplyStatusList from '@/components/ApplyStatusList.vue';

// export const APPROVAL_STATUS = {
//   UNAPPLIED: 'unapplied',
//   APPLYING: 'applying',
//   APPROVED: 'approved',
//   CANCELED: 'canceled',
//   REJECTED: 'rejected',
//   CLOSED: 'closed',
// };
@Component({ name: 'ApplyStatus', components: { ApplyStatusList } })
export default class ApplyStatus extends Vue {
  // service = this.$store.getters['account/getService'];
  service = JSON.parse(sessionStorage.getItem('defaultService'));
}
</script>

<style lang="scss" scoped></style>
