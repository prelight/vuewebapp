<template>
  <v-card>
    <v-card-title>
      <span class="headline">Create new format group</span>
    </v-card-title>
    <v-container>
      <v-row>
        <v-col lg="12" sm="12" md="12">
          <div class="select-template">
            <v-radio-group v-model="templateGroup" class="select-template__radio-group">
              <v-radio color="primary" value="standard" label="デフォルトセットを使用">
                <template v-slot:label>
                  <span>標準ログフォーマットセットを使用</span>
                  <v-tooltip tag="p" top transition="fade-transition">
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on" right small>mdi-help-circle</v-icon>
                    </template>
                    <span>標準ログフォーマを使用してフォーマットを作成します。</span><br />
                    <span>作成したフォーマットは、独自にカスタマイズすることができます。</span>
                  </v-tooltip>
                </template>
              </v-radio>
              <v-radio
                color="primary"
                value="clone"
                label="既存サービスのフォーマットをクローンする"
                ><template v-slot:label>
                  <span>既存サービスのフォーマットをクローンする</span>
                  <v-tooltip tag="p" top transition="fade-transition">
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on" right small>mdi-help-circle</v-icon>
                    </template>
                    <span>既存のサービスで定義されているフォーマットを使用します。</span><br />
                    <span>作成したフォーマットは、独自にカスタマイズすることができます。</span>
                  </v-tooltip>
                </template></v-radio
              >
              <v-radio color="primary" value="template" label="テンプレートを使用する"></v-radio>
            </v-radio-group>
            <template v-if="templateGroup !== 'standard'">
              <v-select
                v-model="formatTemplate"
                class="select-template__selection"
                flat
                dense
                :items="radioGroups[templateGroup].items"
                :placeholder="radioGroups[templateGroup].placeholder"
                hide-details
                return-object
                required
              >
                <template v-slot:item="props">
                  {{ props.item.text
                  }}<v-chip v-if="props.item.type" class="ml-2" small label right>{{
                    props.item.type
                  }}</v-chip>
                </template>
              </v-select>
            </template>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <slot name="action"></slot>
  </v-card>
</template>

<script lang="ts">
import { Emit, Prop, Component, Vue } from 'vue-property-decorator';

@Component
export default class ActionLogFormatCreateFormatGroupForm extends Vue {
  dialog: boolean = false;

  selectGroup: string = 'clone';

  get templateGroup() {
    return this.selectGroup;
  }

  set templateGroup(group) {
    this.selectGroup = group;
    this.selectedFormatTemplate(null);
  }

  @Prop({ default: () => [{ text: 'ECIA', value: 'ecia' }] })
  services: [{ text: string; value: any }];

  @Prop({ default: () => [{ text: 'SampleFormat1', value: 'ecia' }] })
  templates: [{ text: string; value: any }];

  get radioGroups() {
    return {
      clone: { items: this.services, placeholder: 'サービスを選択' },
      template: {
        items: this.templates,
        placeholder: 'テンプレートを選択',
      },
    };
  }

  set formatTemplate(template) {
    // this.$emit('change-theme', isDark);
    this.selectedFormatTemplate(template);
  }

  @Emit('select-template')
  // eslint-disable-next-line class-methods-use-this
  selectedFormatTemplate(template) {
    if (this.templateGroup === 'standard') {
      return 'standard';
    }
    return template;
  }

  debug(item) {
    alert(item);
  }
}

// Register the component globally
// Vue.component('ActionLogFormatCreateFormatGroupForm', ActionLogFormatCreateFormatGroupForm);
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_index.scss';

::v-deep .select-template {
  input {
    font-size: 13px;
  }
  label {
    font-size: 13px;
  }
  &__radio-group {
    @include radio;
  }
  &__selection {
    padding-left: 24px;
    .v-select__selection {
      font-size: 13px;
    }
  }
}
</style>
