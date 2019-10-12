// TODO: 削除予定
<template>
  <v-menu absolute v-bind="menuProps" :menu-props="{ minWidth: '0' }">
    <template #activator="{ on: menu }">
      <v-tooltip v-bind="tooltipSettings" :disabled="!menuProps.tooltip">
        <template #activator="{ on: tooltip }">
          <v-btn outlined small class="button-dropdown" text v-on="{ ...tooltip, ...menu }">
            <!-- <span class="hidden-sm-and-down mr-1"><slot></slot></span> -->
            <slot name="label"></slot>
            <v-icon right>arrow_drop_down</v-icon>
          </v-btn>
        </template>
        <span>{{ menuProps.tooltip }}</span>
      </v-tooltip>
    </template>
    <template v-if="hasContentSlot">
      <slot name="content"></slot>
    </template>
  </v-menu>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { Prop, Component, Vue } from 'vue-property-decorator';

@Component({ name: 'ButtonDropdown' })
export default class ButtonDropdown extends Vue {
  @Prop({
    default: () => ({
      offsetY: true,
    }),
  })
  menuProps;

  @Prop({
    default: () => ({
      top: true,
      transition: 'fade-transition',
      color: '#263238',
    }),
  })
  tooltipSettings;

  menu = false;

  get hasContentSlot() {
    return this.$slots.content;
  }
}
</script>

<style scoped lang="scss">
.button-dropdown {
  text-transform: none;
  font-weight: normal;
}
</style>
