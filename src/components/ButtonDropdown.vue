<template>
  <v-menu v-bind="menuProps">
    <template v-slot:activator="{ on: menu }">
      <div>
        <v-btn v-bind="mergedButtonSettings" class="button-dropdown" v-on="menu">
          <template v-if="hasLabelSlot"
            ><slot name="label" :selected="selectedItem"></slot>
          </template>
          <template v-else>
            <v-icon v-if="selectedItem && selectedItem.icon" size="20px" left>{{
              selectedItem.icon
            }}</v-icon
            ><span class="mr-1">{{ selectedItem[options.itemText] }}</span>
          </template>
          <v-icon right>arrow_drop_down</v-icon>
        </v-btn>
        <template v-if="appendHintText">
          <v-tooltip right transition="fade-transition" color="#263238">
            <template v-slot:activator="{ on: hint }">
              <v-icon v-on="hint" absolute small class="ml-2">mdi-help-circle</v-icon>
            </template>
            <span class="caption" style="white-space: pre-line;">{{ appendHintText }}</span>
          </v-tooltip>
        </template>
      </div>
    </template>
    <template v-if="hasContentSlot">
      <slot name="content"></slot>
    </template>
    <template v-else>
      <v-list dense>
        <v-list-item v-for="(item, index) in choices" :key="index" @click="itemClick(item)">
          <v-list-item-title>{{ item[options.itemText] }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </template>
  </v-menu>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { Emit, Prop, Component, Vue } from 'vue-property-decorator';

interface ItemOptions {
  itemText: string;
  itemValue: string;
}

export interface ButtonOptions {
  small: boolean;
  text: boolean;
  boader: string;
  class?: string;
}

const defaultButtonSettings = {
  small: false,
  text: false,
  outlined: true,
};

@Component({ name: 'ButtonDropdown' })
export default class ButtonDropdown extends Vue {
  @Prop({
    default: () => ({
      offsetY: true,
    }),
  })
  menuProps;

  @Prop({ default: () => ({}), required: false })
  buttonSettings: ButtonOptions;

  @Prop({ type: Array })
  items: [];

  @Prop({ default: () => ({}) })
  value;

  @Prop({
    type: Object as PropType<ItemOptions>,
    required: false,
    default: () => {
      return { itemText: 'text', itemValue: 'value' };
    },
  })
  options: ItemOptions;

  // @Prop()
  // defaultSelectedItem;

  @Prop({ type: Function })
  onClick;

  @Prop()
  appendHintText;

  selectedItem = this.value;

  get mergedButtonSettings() {
    return Object.assign(this.buttonSettings, defaultButtonSettings);
  }

  get hasLabelSlot() {
    return this.$slots.label;
  }

  get hasContentSlot() {
    return this.$slots.content;
  }

  get choices() {
    return this.items;
  }

  @Emit('item-click')
  // eslint-disable-next-line class-methods-use-this
  public itemClick(item) {
    this.selectedItem = item;
    return item;
  }

  /**
   * onClick
   */
  // onItemClick(item) {
  //   // eslint-disable-next-line no-unused-expressions
  //   this.itemClick(item);
  //   this.selectedItem = item;
  // }

  mounted() {}

  log(message: any) {
    console.log(message);
  }
}
</script>

<style lang="scss" scoped>
.button-dropdown {
  border: 1px solid #dadce0;
  text-transform: none;
  font-weight: normal;
}
</style>
