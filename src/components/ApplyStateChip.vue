<template>
  <v-chip
    :small="!xSmall"
    :x-small="xSmall"
    v-if="chipSettings"
    :disabled="chipSettings.disabled"
    :color="chipSettings.color"
    :text-color="chipSettings.textColor"
    style="white-space: nowrap;"
  >
    <v-avatar class="pl-0 mr-1">
      <v-icon :small="xSmall">{{ chipSettings.icon }}</v-icon>
    </v-avatar>
    {{ chipSettings.text }}
  </v-chip>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { APPROVAL_STATUS } from '@/store/applyModule';

@Component({ name: 'ApplyStateChip', components: {} })
export default class ApplyStateChip extends Vue {
  @Prop()
  state;

  @Prop({ default: false })
  xSmall;

  settings: {
    text?: string;
    color?: string;
    textColor?: string;
    icon?: string;
    disabled?: boolean;
  } = {};

  get chipSettings() {
    switch (this.state) {
      case APPROVAL_STATUS.UNAPPLIED:
        this.settings.text = '未申請';
        this.settings.color = 'primary';
        this.settings.textColor = 'white';
        this.settings.icon = 'mdi-file-document-edit-outline';
        break;
      case APPROVAL_STATUS.APPLYING:
        this.settings.text = '申請中';
        this.settings.color = 'secondary';
        this.settings.textColor = 'white';
        this.settings.icon = 'mdi-progress-check';
        break;
      case APPROVAL_STATUS.APPROVED:
        this.settings.text = '承認済み';
        this.settings.color = 'success';
        this.settings.textColor = 'white';
        this.settings.icon = 'mdi-check';
        break;
      case APPROVAL_STATUS.CANCELED:
        this.settings.text = 'キャンセル';
        this.settings.disabled = true;
        this.settings.color = '';
        this.settings.textColor = '';
        this.settings.icon = 'mdi-cancel';
        break;
      case APPROVAL_STATUS.CLOSED:
        this.settings.text = 'キャンセル';
        this.settings.disabled = true;
        this.settings.color = '';
        this.settings.textColor = '';
        this.settings.icon = 'mdi-cancel';
        break;
      case APPROVAL_STATUS.REJECTED:
        this.settings.text = '差し戻し';
        this.settings.color = 'error';
        this.settings.textColor = 'white';
        this.settings.icon = 'mdi-seat-recline-extra';
        break;
      default:
        this.settings = undefined;
    }
    return this.settings;
  }
}
</script>

<style lang="scss" scoped></style>
