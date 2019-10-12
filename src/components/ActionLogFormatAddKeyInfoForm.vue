<template>
  <div class="add-keyinfo-form">
    <v-row class="mb-3">
      <v-col lg="3">
        <v-text-field
          dense
          outlined
          required
          v-model="keyInfoItems.key"
          label="Key"
          class="add-keyinfo-form__input-text"
        ></v-text-field>
      </v-col>
      <v-col class="pl-2" lg="2">
        <v-select
          v-model="keyInfoItems.type"
          dense
          outlined
          required
          placeholder="Type"
          label="Type"
          :items="['String', 'Integer', 'Long', 'Boolean', 'Array', 'Map']"
          @change="onDataTypeChange"
          class="add-keyinfo-form__input-select"
          style="min-width: 110px"
        ></v-select>
      </v-col>
      <v-col class="pl-2" lg="3">
        <v-select
          v-model="keyInfoItems.requirementLevel"
          dense
          outlined
          required
          label="Requirement Level"
          :items="['REQUIRED', 'OPTIONAL', 'RECOMMENDED']"
          class="add-keyinfo-form__input-select"
          style="min-width: 170px"
        ></v-select>
      </v-col>
      <v-col class="pl-2" lg="2">
        <div>
          <v-text-field
            v-model="keyInfoItems.restriction.min"
            dense
            outlined
            type="number"
            :min="0"
            label="Min"
            class="add-keyinfo-form__input-text"
          ></v-text-field>
        </div>
      </v-col>
      <v-col class="pl-2" lg="2">
        <div>
          <v-text-field
            v-model="keyInfoItems.restriction.max"
            dense
            outlined
            type="number"
            :min="0"
            label="Max"
            class="add-keyinfo-form__input-text"
          ></v-text-field>
        </div>
      </v-col>
      <v-col lg="12" cols="12" class="pt-0">
        <v-textarea
          v-model="keyInfoItems.description"
          dense
          outlined
          required
          hide-details
          :rows="3"
          placeholder="説明を入力してください"
          label="Description"
          class="add-keyinfo-form__input-textarea"
        ></v-textarea>
      </v-col>

      <template v-if="isCreateMapFormat">
        <v-col lg="12" cols="12" class="pt-0">
          <!-- <v-menu> -->
          <v-btn
            :disabled="addKeyInfo"
            small
            color="primary"
            class="text-none pl-2"
            @click="addKeyInfo = !addKeyInfo"
            ><v-icon class="mr-2">mdi-plus</v-icon>{{ keyInfoItems.key }}のKeyを追加</v-btn
          >
          <!-- <v-btn small text v-on="on" color="primary">Add Properties</v-btn> -->
          <v-template v-if="addKeyInfo" outlined>
            <!-- <v-overlay absolute :dark="false"> -->
            <v-card outlined>
              <v-col lg="12" cols="12">
                <ActionLogFormatAddKeyInfoForm>
                  <template v-slot:actions="props">
                    <v-btn
                      color="white primary--text ml-0"
                      small
                      @click="addKeyInfo = !addKeyInfo"
                      >{{ $t('button.cancel') }}</v-btn
                    >
                    <v-btn color="primary" small @click="saveAddKey(props.keyInfo)" class="ml-4">{{
                      $t('button.add')
                    }}</v-btn>
                  </template>
                </ActionLogFormatAddKeyInfoForm>
              </v-col>
            </v-card>
            <!-- </v-overlay> -->
          </v-template>
          <!-- </v-menu> -->
        </v-col>
      </template>
    </v-row>
    <div :class="`keyinfo-detail${keInfoDetailSettings ? '' : '--none'}`">
      <v-row>
        <v-col>
          <v-btn
            class="keyinfo-detail__caption"
            small
            text
            @click="keInfoDetailSettings = !keInfoDetailSettings"
            ><span>詳細設定</span
            ><v-icon>{{ detailSettings ? 'mdi-menu-up' : 'mdi-menu-down' }}</v-icon></v-btn
          >

          <template v-if="keInfoDetailSettings">
            <div>
              <v-col class="pr-2" lg="6" cols="6">
                <!-- <span class="caption">このKeyに入力される値のリスト</span> -->
                <v-combobox
                  v-model="valueModel"
                  :items="valueItems"
                  :search-input.sync="valueSearch"
                  label="このKeyに入力される値のリスト"
                  dense
                  outlined
                  clearable
                  hide-selected
                  multiple
                  persistent-hint
                  small-chips
                  deletable-chips
                  class="add-keyinfo-form__input-select"
                >
                  <template v-slot:no-data>
                    <v-list-item dense>
                      <v-list-item-content>
                        <v-list-item-title dense>
                          No results matching "<strong>{{ valueSearch }}</strong
                          >". Press <kbd>enter</kbd> to create a new one
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-combobox>
              </v-col>

              <template v-if="displayAdditionalKeyInfoList.length > 0">
                <template v-for="(additionalKeyInfo, i) in displayAdditionalKeyInfoList">
                  <v-col :key="i">
                    <span class="caption">{{ additionalKeyInfo.labelText }}</span>
                    <v-text-field
                      :label="additionalKeyInfo.labelText"
                      :value="additionalKeyInfo.value"
                      class="add-keyinfo-form__input-text"
                      ref="newVersion"
                      required
                    >
                      <template v-slot:append-outer>
                        <v-menu
                          v-model="additionalKeyInfoList[i].edit"
                          persistent
                          :close-on-content-click="false"
                          :close-on-click="false"
                          :nudge-width="200"
                          offset-x
                        >
                          <template v-slot:activator="{ on }">
                            <v-btn icon v-on="on" class="ma-0 mr-2"
                              ><v-icon>mdi-pencil</v-icon></v-btn
                            >
                          </template>

                          <v-card>
                            <v-card-title class="mb-0">Edit label</v-card-title>
                            <v-container class="pt-1">
                              <v-row>
                                <v-col cols="6" sm="6" class="pr-3">
                                  <span class="caption">Label</span>
                                  <v-text-field
                                    :value="additionalKeyInfo.labelValue"
                                    @input="editAdditionalKeyInfoLabelValue = String($event)"
                                    label="Key"
                                    class="add-keyinfo-form__input-text"
                                    ref="newVersion"
                                    required
                                  >
                                  </v-text-field>
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col cols="6" sm="6">
                                  <span class="caption">LabelText</span>
                                  <v-text-field
                                    :value="additionalKeyInfo.labelText"
                                    @input="editAdditionalKeyInfoLabelText = String($event)"
                                    label="Value"
                                    class="add-keyinfo-form__input-text"
                                    ref="newVersion"
                                    required
                                  >
                                  </v-text-field>
                                </v-col>
                              </v-row>
                            </v-container>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn text @click="cancelAdditionalKeyInfo(i)">{{
                                $t('button.cancel')
                              }}</v-btn>
                              <v-btn color="primary" text @click="editAdditionalKeyInfoLabel(i)">{{
                                $t('button.update')
                              }}</v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-menu>
                        <v-btn icon @click="additionalKeyInfoList.splice(i, 1)" class="ma-0"
                          ><v-icon>mdi-delete</v-icon></v-btn
                        >
                      </template>
                    </v-text-field>
                  </v-col>
                </template>
              </template>
              <v-col class="mb-2">
                <v-menu
                  v-model="additionalKeyInfoMenu"
                  :close-on-content-click="false"
                  top
                  offset-x
                >
                  <template v-slot:activator="{ on }">
                    <v-btn small color="white primary--text" class="text-none ml-0" v-on="on"
                      ><v-icon class="mr-2">mdi-plus</v-icon>更に追加</v-btn
                    >
                  </template>

                  <v-card>
                    <v-card-title class="mb-0">Add</v-card-title>
                    <v-card-text>
                      <v-container class="pa-2">
                        <v-row>
                          <v-col cols="6" sm="6" class="pr-3">
                            <v-text-field
                              v-model="additionalKeyInfoLabelValueAndLabelText"
                              label="項目のkeyを設定"
                              dense
                              outlined
                              class="add-keyinfo-form__input-text"
                              ref="newVersion"
                              required
                            >
                              <template v-slot:append>
                                <v-tooltip right transition="fade-transition" color="#263238">
                                  <template v-slot:activator="{ on }">
                                    <v-icon v-on="on" small style="margin-top: 4px;"
                                      >mdi-help-circle</v-icon
                                    >
                                  </template>
                                  <span style="white-space: pre-line;">{{
                                    'Labelキーはcamel caseで入力してください'
                                  }}</span>
                                </v-tooltip>
                              </template>
                            </v-text-field>
                          </v-col>
                          <v-spacer></v-spacer>
                          <v-col cols="6" sm="6">
                            <v-text-field
                              v-model="keyInfoCustomValue"
                              label="Value"
                              dense
                              outlined
                              class="add-keyinfo-form__input-text"
                              ref="newVersion"
                              required
                            >
                            </v-text-field>
                          </v-col>
                          <v-col cols="6" sm="6" class="pr-3">
                            <v-text-field
                              v-model="additionalKeyInfoLabelText"
                              label="表示名を設定"
                              dense
                              outlined
                              class="add-keyinfo-form__input-text"
                              ref="newVersion"
                              required
                            >
                            </v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn text @click="additionalKeyInfoMenu = false">{{
                        $t('button.cancel')
                      }}</v-btn>
                      <v-btn
                        :disabled="
                          !additionalKeyInfoLabelValue ||
                            !additionalKeyInfoLabelText ||
                            !keyInfoCustomValue
                        "
                        color="primary"
                        text
                        @click="creatAdditionalKeyInfo"
                        >{{ $t('button.add') }}</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-menu>
              </v-col>
            </div>
          </template>
          <slot></slot>
        </v-col>
      </v-row>
    </div>
    <slot :key-info="keyInfoItems" name="actions"></slot>
  </div>
</template>

<script lang="ts">
import { Emit, Prop, Component, Vue, Watch } from 'vue-property-decorator';
import ActionLogFormatTable from '@/components/ActionLogFormatTable.vue';
import { KeyInfo, DEFAULT_KEY_INFO } from '@/components/ActionLogFormatAddActionForm.vue';

interface AdditionalKeyInfo {
  labelText: string;
  labelValue: string;
  value: string;
  edit: boolean;
}

@Component({
  name: 'ActionLogFormatAddKeyInfoForm',
  components: { ActionLogFormatTable },
})
export default class ActionLogFormatAddKeyInfoForm extends Vue {
  @Prop()
  keyInfo;

  @Prop({ default: 'New Action', type: String })
  title: string;

  @Prop({ default: '新しいActionを作成します\n説明文' })
  description: string;

  @Prop({ default: () => [] })
  valueItems: any[];

  @Prop({ type: Function })
  onClickCancel;

  @Prop({ type: Function })
  onClickSave;

  tooltip = {
    top: true,
    transition: 'fade-transition',
    color: '#263238',
  };

  detailSettings: boolean = false;

  // Key info
  keyInfoList = [];

  keyInfoItems: KeyInfo = this.keyInfo ? { ...this.keyInfo } : DEFAULT_KEY_INFO;

  keInfoDetailSettings: boolean = false;

  additionalKeyInfoMenu: boolean = false;

  additionalKeyInfoList: AdditionalKeyInfo[] = [];

  additionalKeyInfoLabelValue: string = '';

  additionalKeyInfoLabelText: string = '';

  keyInfoCustomValue: string = '';

  editAdditionalKeyInfoLabelValue: string = '';

  editAdditionalKeyInfoLabelText: string = '';

  isCreateMapFormat = false;

  addKeyInfo = false;

  valueModel = [];

  valueSearch = null;

  set additionalKeyInfoLabelValueAndLabelText(value) {
    this.additionalKeyInfoLabelValue = value;
    this.additionalKeyInfoLabelText = value.charAt(0).toUpperCase() + value.slice(1);
  }

  get additionalKeyInfoLabelValueAndLabelText() {
    return this.additionalKeyInfoLabelValue;
  }

  get displayAdditionalKeyInfoList() {
    return this.additionalKeyInfoList;
  }

  creatAdditionalKeyInfo() {
    this.additionalKeyInfoMenu = false;
    this.additionalKeyInfoList.push({
      labelValue: this.additionalKeyInfoLabelValue,
      labelText: this.additionalKeyInfoLabelText,
      value: this.keyInfoCustomValue,
      edit: false,
    });
    this.additionalKeyInfoLabelValue = '';
    this.additionalKeyInfoLabelText = '';
    this.keyInfoCustomValue = '';
  }

  cancelAdditionalKeyInfo(index: number) {
    this.additionalKeyInfoList[index].edit = false;
    // this.editCustomKeyInfoMenuList.splice(index, 1, false);
    this.clearAdditionalKeyInfoForm();
  }

  editAdditionalKeyInfoLabel(index: number) {
    this.additionalKeyInfoList[index].edit = false;
    if (this.editAdditionalKeyInfoLabelValue) {
      this.additionalKeyInfoList[index].labelValue = this.editAdditionalKeyInfoLabelValue;
    }
    if (this.editAdditionalKeyInfoLabelText) {
      this.additionalKeyInfoList[index].labelText = this.editAdditionalKeyInfoLabelText;
    }
    this.clearAdditionalKeyInfoForm();
  }

  clearAdditionalKeyInfoForm() {
    this.editAdditionalKeyInfoLabelValue = '';
    this.editAdditionalKeyInfoLabelText = '';
  }

  onDataTypeChange(type) {
    switch (type) {
      case 'Map':
        this.isCreateMapFormat = true;
        break;
      default:
        this.isCreateMapFormat = false;
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_index.scss';

::v-deep .add-keyinfo-form {
  &__input-text {
    @include input-text;
  }

  &__input-textarea {
    @include input-textarea(true);
  }

  &__input-select {
    @include input-select;
  }

  &__checkbox {
    .v-icon {
      font-size: 18px;
    }
    .v-label {
      font-size: 14px;
      color: var(--v-primary-text);
    }
    .v-input--selection-controls__ripple {
      transform: scale(0.8);
      left: -14px;
    }
    .v-list__tile {
      height: 40px;
    }

    .v-list__tile--link {
      cursor: default !important;
    }
  }
}

.keyinfo-detail {
  position: relative;
  border: 1px dashed #999;
  border-radius: 5px;
  margin: 16px 0;
  padding: 6px;
  transition: border-top 200ms ease-in, border-color 300ms ease;
  &--none {
    position: relative;
    margin: 16px 0 0;
    padding: 4px;
    border-top: 1px solid;
    border-color: transparent;
    // border-left: 0;
    // border-right: 0;
    // border-bottom: 0;
  }
  &--display {
    border: 1px dashed #999;
    border-radius: 5px;
    padding: 1px;
    margin: 4px;
  }
  &__caption {
    position: absolute;
    top: -6px;
    right: 0;
    background-color: white;
    transform: translateY(-50%) translateX(-1em);
  }

  &__key-info {
    padding-bottom: 24px;
  }
}

::v-deep .keyinfo-table {
  @include table;
}
</style>
