<template>
  <v-card>
    <v-card-title class="headline">
      {{ title }}
    </v-card-title>
    <v-divider class="mb-2"></v-divider>

    <v-card-text class="text--primary">
      <template v-if="hasDescriptionSlot">
        <div class="form-description">
          <slot name="description"></slot>
        </div>
      </template>
      <template v-else>
        <div class="form-description">
          <span class="body-2">{{ description }}</span>
        </div>
        <template v-if="info">
          <div class="form-description">
            <span class="caption"
              ><v-icon small class="mr-2">mdi-information</v-icon>{{ info }}</span
            >
          </div>
        </template>
      </template>

      <v-row>
        <!-- <v-flex lg6 xs1 pr-2> -->
        <v-col class="mb-2 pr-2" lg="3" cols="3">
          <!-- <v-switch
            hide-details
            label="既存Eventを読み込む"
            :input-value="false"
            @change="toggleUseExistFormat($event)"
            color="primary"
            class="mb-2"
          ></v-switch> -->
          <!-- </v-flex> -->
          <v-autocomplete
            attach
            dense
            outlined
            label="既存Eventを読み込む"
            :items="actionTypeIds"
            @change="loadActionFormat"
            class="add-action__input-select"
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-form ref="add-action-form" class="add-action__form">
        <div class="add-action__log-info">
          <header class="title mb-3">
            Log Info
          </header>
          <span>このLogについての説明です。</span>
          <v-row>
            <v-col class="pr-2" lg="6" cols="6">
              <v-text-field
                v-model="logInfoItem.id"
                dense
                outlined
                :label="idField.text"
                :placeholder="`e.g. 99`"
                ref="newVersion"
                required
                class="add-action__input-text"
              >
              </v-text-field>
            </v-col>
            <v-col class="pl-2" lg="6" cols="6">
              <v-text-field
                v-model="logInfoItem.name"
                dense
                outlined
                label="Name"
                placeholder="e.g. SampleAction"
                class="add-action__input-text"
                ref="newVersion"
                required
                counter="100"
              >
              </v-text-field>
            </v-col>

            <v-col lg="12" cols="12">
              <v-textarea
                v-model="logInfoItem.description"
                dense
                outlined
                label="Description *"
                placeholder="Description"
                :rows="3"
                counter="500"
                class="add-action__input-textarea"
              ></v-textarea>
            </v-col>
            <v-col class="pr-2" lg="6" cols="6">
              <v-text-field
                v-model="logInfoItem.trigger"
                dense
                outlined
                label="Trigger"
                class="add-action__input-text"
                ref="newVersion"
                hide-details
              >
              </v-text-field>
            </v-col>
            <v-col class="pl-2" lg="6" cols="6">
              <v-text-field
                v-model="logInfoItem.precondition"
                dense
                outlined
                label="Pre-condition"
                class="add-action__input-text"
                ref="newVersion"
                hide-details
              >
              </v-text-field>
            </v-col>
          </v-row>

          <div :class="`add-action__log-info-detail${detailSettings ? '' : '--none'}`">
            <v-row>
              <v-col>
                <v-btn
                  class="add-action__log-info-detail-caption"
                  small
                  text
                  @click="detailSettings = !detailSettings"
                  ><span>詳細設定</span
                  ><v-icon>{{ detailSettings ? 'mdi-menu-up' : 'mdi-menu-down' }}</v-icon></v-btn
                >

                <template v-if="detailSettings">
                  <div>
                    <v-col>
                      <v-textarea
                        v-model="logInfoItem.example"
                        dense
                        outlined
                        :rows="1"
                        label="Example"
                        class="add-action__input-textarea"
                        ref="newVersion"
                        required
                      >
                      </v-textarea>
                    </v-col>
                    <v-col>
                      <v-text-field
                        v-model="logInfoItem.remark"
                        dense
                        outlined
                        label="Remark"
                        class="add-action__input-text"
                        ref="newVersion"
                        required
                      >
                      </v-text-field>
                    </v-col>
                    <v-col class="pr-2" lg="6" cols="6">
                      <v-combobox
                        v-model="logInfoItem.tags"
                        :search-input.sync="tagSearch"
                        :items="tagItems"
                        label="Tags"
                        dense
                        outlined
                        clearable
                        hide-selected
                        multiple
                        persistent-hint
                        small-chips
                        deletable-chips
                        class="add-action__input-select"
                      >
                        <template v-slot:no-data>
                          <v-list-item dense>
                            <v-list-item-content>
                              <v-list-item-title dense>
                                No results matching "<strong>{{ tagSearch }}</strong
                                >". Press <kbd>enter</kbd> to create a new one
                              </v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </template>
                      </v-combobox>
                    </v-col>
                    <!-- <v-flex>
                      <span class="caption">Latest version</span>
                      <v-text-field
                        v-model="logInfoItem.detailSettings.latestVersion"
                        label="Latest version"
                        class="add-action__input-text"
                        ref="newVersion"
                        required
                      >
                      </v-text-field>
                    </v-flex> -->
                    <template v-if="displayCustomLogInfoList.length > 0">
                      <template v-for="(customLogInfo, i) in displayCustomLogInfoList">
                        <v-col :key="i">
                          <span class="caption">{{ customLogInfo.labelText }}</span>
                          <v-text-field
                            :label="customLogInfo.labelText"
                            :value="customLogInfo.value"
                            dense
                            outlined
                            single-line
                            class="add-action__input-text"
                            ref="newVersion"
                            required
                          >
                            <template v-slot:append-outer>
                              <v-menu
                                v-model="customLogInfoList[i].edit"
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
                                  <v-card-title class="mb-0">表示項目の編集</v-card-title>
                                  <v-container class="pt-1">
                                    <v-row>
                                      <v-col cols="6" sm="6" class="pr-3">
                                        <v-text-field
                                          :value="customLogInfo.labelValue"
                                          @input="editLogInfoCustomLabelValue = String($event)"
                                          label="項目のkeyを設定"
                                          dense
                                          outlined
                                          class="add-action__input-text"
                                          ref="newVersion"
                                          required
                                        >
                                        </v-text-field>
                                      </v-col>
                                      <v-spacer></v-spacer>
                                      <v-col cols="6" sm="6">
                                        <v-text-field
                                          :value="customLogInfo.labelText"
                                          @input="editLogInfoCustomLabelText = String($event)"
                                          label="表示名を設定"
                                          outlined
                                          class="add-action__input-text"
                                          ref="newVersion"
                                          required
                                        >
                                        </v-text-field>
                                      </v-col>
                                    </v-row>
                                  </v-container>
                                  <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn text @click="cancelCustomLogInfoMenu(i)">{{
                                      $t('button.cancel')
                                    }}</v-btn>
                                    <v-btn
                                      color="primary"
                                      text
                                      @click="editCustomLogInfoLabel(i)"
                                      >{{ $t('button.update') }}</v-btn
                                    >
                                  </v-card-actions>
                                </v-card>
                              </v-menu>
                              <v-btn icon @click="customLogInfoList.splice(i, 1)" class="ma-0"
                                ><v-icon>mdi-delete</v-icon></v-btn
                              >
                            </template>
                          </v-text-field>
                        </v-col>
                      </template>
                    </template>
                    <v-col>
                      <v-menu
                        v-model="addMoreLogInfoMenu"
                        :close-on-content-click="false"
                        :nudge-width="200"
                        offset-x
                        top
                      >
                        <template v-slot:activator="{ on }">
                          <v-btn small color="white primary--text" class="text-none ml-0" v-on="on"
                            ><v-icon class="mr-2">mdi-plus</v-icon>更に追加</v-btn
                          >
                        </template>

                        <v-card>
                          <v-card-title class="mb-0">Add</v-card-title>
                          <v-card-text>
                            <span style="white-space: pre-line;">{{
                              `カスタムで表示する項目を追加します。
                              e.g.) `
                            }}</span>
                          </v-card-text>
                          <v-card-actions>
                            <v-row class="ma-2">
                              <v-col cols="6" sm="6">
                                <v-text-field
                                  v-model="logInfoCustomLabelValueAndLabelText"
                                  label="項目のkeyを設定"
                                  dense
                                  outlined
                                  class="add-action__input-text"
                                  ref="newVersion"
                                  required
                                >
                                  <template v-slot:append>
                                    <v-tooltip bottom transition="fade-transition" color="#263238">
                                      <template v-slot:activator="{ on }">
                                        <v-icon v-on="on" small style="margin-top: 4px;"
                                          >mdi-help-circle</v-icon
                                        >
                                      </template>
                                      <span class="caption" style="white-space: pre-line;">{{
                                        `LabelキーはcamelCaseで入力してください`
                                      }}</span>
                                    </v-tooltip>
                                  </template>
                                </v-text-field>
                              </v-col>
                              <v-spacer></v-spacer>
                              <v-col cols="6" sm="6">
                                <v-text-field
                                  v-model="logInfoCustomValue"
                                  label="Value"
                                  dense
                                  outlined
                                  class="add-action__input-text"
                                  ref="newVersion"
                                  required
                                >
                                </v-text-field>
                              </v-col>
                              <v-col cols="6" sm="6" class="pr-3">
                                <v-text-field
                                  v-model="logInfoCustomLabelText"
                                  label="表示名を設定"
                                  dense
                                  outlined
                                  class="add-action__input-text"
                                  ref="newVersion"
                                  required
                                >
                                </v-text-field>
                              </v-col>
                            </v-row>
                          </v-card-actions>

                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                              :disabled="
                                !logInfoCustomLabelValue ||
                                  !logInfoCustomLabelText ||
                                  !logInfoCustomValue
                              "
                              color="primary"
                              small
                              @click="creatMoreLogInfo"
                              >{{ $t('button.add') }}</v-btn
                            >
                            <v-btn text small @click="addMoreLogInfoMenu = false">{{
                              $t('button.cancel')
                            }}</v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-menu>
                    </v-col>
                  </div>
                </template>
              </v-col>
            </v-row>
          </div>
        </div>
        <v-divider class="mb-3" />

        <div class="add-key__key-info">
          <header class="title mb-3">
            Key Info
          </header>
          <p class="body-2">KeySetを選択するか「Keyを追加」からKeyを作成します。</p>
          <v-col lg="3" cols="3" class="pl-0 mb-2">
            <v-autocomplete
              attach
              dense
              outlined
              :search-input.sync="targetDeviceSearch"
              label="KeySetを選択"
              :items="targetList"
              item-value="id"
              item-text="name"
              hide-details
              clearable
              return-object
              multiple
              @change="loadTargetFormat"
              class="add-action__input-select"
            ></v-autocomplete>
          </v-col>
          <v-col lg="3" cols="3" class="pl-0 mb-2">
            <v-menu
              v-model="addKeyMenu"
              persistent
              :close-on-content-click="false"
              :close-on-click="false"
              :nudge-width="200"
              offset-x
            >
              <template v-slot:activator="{ on }">
                <!-- <v-btn
                  v-on="on"
                  :disabled="addKeyInfo || useExistFormat"
                  text
                  small
                  color="primary"
                  class="text-none ml-0"
                  @click="addKeyInfo = !addKeyInfo"
                  ><v-icon class="mr-2">mdi-plus</v-icon>Keyを追加</v-btn
                > -->
                <v-btn
                  v-on="on"
                  :disabled="addKeyInfo || useExistFormat"
                  text
                  small
                  color="primary"
                  class="text-none ml-0"
                  ><v-icon class="mr-2">mdi-plus</v-icon>Keyを追加</v-btn
                >
              </template>
              <v-card>
                <v-card-title>
                  新しいKeyを追加
                </v-card-title>
                <v-card-text>
                  <span class="caption">Key</span>
                  <v-text-field
                    v-model="newKey"
                    dense
                    outlined
                    single-line
                    ref="newVersion"
                    required
                    class="add-action__input-text"
                    :rules="[validateDuplicateKey]"
                  >
                  </v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-btn color="white primary--text" small @click="addKeyMenu = false">{{
                    $t('button.cancel')
                  }}</v-btn>
                  <v-btn :disabled="!newKey" color="primary" small @click="addKey()" class="ml-4">{{
                    $t('button.add')
                  }}</v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
          </v-col>
          <div id="key-info">
            <template v-for="(keyInfo, i) in keyInfoList">
              <v-card :key="i" outlined class="pa-2 mb-2 key-info">
                <v-row justify="space-between">
                  <v-col cols="auto">
                    <div class="title">{{ keyInfo.key }}</div>
                  </v-col>
                  <v-col cols="auto">
                    <v-btn icon color="" @click.stop="openRemoveKeyDialog(keyInfo.key, i)"
                      ><v-icon>mdi-close</v-icon></v-btn
                    >
                  </v-col>
                </v-row>
                <ActionLogFormatAddKeyInfoForm :key-info="keyInfo" class="mb-2">
                  <!-- <template v-slot:actions="props">
                  <v-btn color="white primary--text ml-0" small @click="cancelAddKey()">{{
                    $t('button.cancel')
                  }}</v-btn>
                  <v-btn color="primary" small @click="saveAddKey(props.keyInfo)" class="ml-4">{{
                    $t('button.add')
                  }}</v-btn>
                </template> -->
                </ActionLogFormatAddKeyInfoForm>
              </v-card>
            </template>
            <!-- <template v-if="removeKeyDialog"> -->
            <v-dialog v-model="removeKeyDialog" persistent width="290">
              <v-card>
                <v-card-title class="headline">{{ `${removeKeyItem.key}の削除` }}</v-card-title>
                <v-card-text>{{ `${removeKeyItem.key}を削除してもよろしいですか?` }}</v-card-text>
                <v-card-actions>
                  <div class="flex-grow-1"></div>
                  <v-btn small text color="primary" @click="closeRemoveKeyDialog()">{{
                    $t('button.cancel')
                  }}</v-btn>
                  <v-btn small text color="primary" @click="removeKey(removeKeyItem.index)">{{
                    $t('button.confirm')
                  }}</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>

          <template v-if="addKeyInfo">
            <!-- <v-overlay :value="addKeyInfo" :dark="false"> -->
            <!-- <v-flex> -->
            <!-- <v-menu v-model="addKeyInfo"> -->
            <v-form ref="add-action-form" class="add-action__form">
              <v-hover v-slot:default="{ hover }">
                <!-- <div flat :elevation="hover ? 12 : 1" class="pa-2 mb-2"> -->
                <v-card outlined class="pa-2 mb-2">
                  <ActionLogFormatAddKeyInfoForm class="mb-2">
                    <template v-slot:actions="props">
                      <v-btn color="white primary--text ml-0" small @click="cancelAddKey()">{{
                        $t('button.cancel')
                      }}</v-btn>
                      <v-btn
                        color="primary"
                        small
                        @click="saveAddKey(props.keyInfo)"
                        class="ml-4"
                        >{{ $t('button.add') }}</v-btn
                      >
                    </template>
                  </ActionLogFormatAddKeyInfoForm>
                </v-card>
              </v-hover>
            </v-form>
            <!-- </v-menu> -->
            <!-- </v-overlay> -->
          </template>

          <ActionLogFormatTable
            :headers="computedHeaders"
            :format-list="keyInfoList"
            :simple="true"
            :loading="loading"
          >
            <template v-slot:actions>
              <!-- <v-btn
                :disabled="addKeyInfo || useExistFormat"
                text
                small
                color="primary"
                class="text-none ml-0"
                @click="addKeyInfo = !addKeyInfo"
                ><v-icon class="mr-2">mdi-plus</v-icon>Keyを追加</v-btn
              > -->
            </template>
          </ActionLogFormatTable>
        </div>
      </v-form>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions class="ma-2 mb-5">
      <v-btn
        :disabled="!logInfoItem.name || !logInfoItem.description"
        color="primary"
        small
        @click="saveAddAction()"
        >{{ $t('button.create') }}</v-btn
      >
      <v-btn
        id="detail-settings"
        color="white primary--text"
        small
        @click="cancelAddAction()"
        class="mr-2"
        >{{ $t('button.cancel') }}</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Emit, Prop, Watch, Component, Vue } from 'vue-property-decorator';
import ActionLogFormatTable from '@/components/ActionLogFormatTable.vue';
import ActionLogFormatAddKeyInfoForm from '@/components/ActionLogFormatAddKeyInfoForm.vue';

const KEY_INFO_TABLE_HEADERS: any[] = [
  { text: 'Key', value: 'key', align: 'left' },
  { text: 'Type', value: 'type', align: 'left' },
  { text: 'Mandatory', value: 'mandatory' },
  { text: 'Description', value: 'description' },
];

interface LogInfoCustom {
  labelText: string;
  labelValue: string;
  value: string;
  edit: boolean;
}

export interface LogInfo {
  id: string;
  typeId: number;
  name: string;
  description: string;
  trigger?: string;
  precondition?: string;
  example?: string;
  remark?: string;
  tags?: [];
  additionalInfo?: {};
}

export interface KeyInfo {
  key: string;
  class: string;
  type: string;
  restriction: {
    min: string | number;
    max: string | number;
    pattern: string;
    minItem: string;
    maxItem: string;
  };
  mandatory: boolean;
  requirementLevel: string;
  values: string;
  multiValue: boolean;
  description: string;
}

export const DEFAULT_KEY_INFO: KeyInfo = {
  key: 'key1',
  class: 'Action',
  type: 'String',
  restriction: {
    min: 0,
    max: 200,
    pattern: '',
    minItem: '',
    maxItem: '',
  },
  mandatory: false,
  requirementLevel: 'OPTIONAL',
  values: '',
  multiValue: false,
  description: '',
};

@Component({
  name: 'ActionLogFormatAddActionForm',
  components: { ActionLogFormatTable, ActionLogFormatAddKeyInfoForm },
})
export default class ActionLogFormatAddActionForm extends Vue {
  tooltip = {
    top: true,
    transition: 'fade-transition',
    color: '#263238',
  };

  // Log info
  defaultLogInfoItem: LogInfo = {
    id: '',
    typeId: -1,
    name: '',
    description: '',
    precondition: '',
    trigger: '',
    example: '',
    tags: [],
    additionalInfo: {},
  };

  logInfoItem: LogInfo = {
    id: '',
    typeId: -1,
    name: '',
    description: '',
    precondition: '',
    trigger: '',
    example: '',
    tags: [],
    additionalInfo: {},
  };

  detailSettings: boolean = false;

  logInfoCustomLabelValue: string = '';

  logInfoCustomLabelText: string = '';

  editLogInfoCustomLabelValue: string = '';

  editLogInfoCustomLabelText: string = '';

  logInfoCustomValue: string = '';

  addMoreLogInfoMenu = false;

  customLogInfoList: LogInfoCustom[] = [];

  editCustomLogInfoMenuIndex = 0;

  // Key info
  keyInfoList: KeyInfo[] = [];

  addKeyMenu = false;

  newKey = '';

  // set computedKeyInfoList(keyInfoList) {
  //   this.keyInfoList = keyInfoList;
  //   this.keyInfoList = this.keyInfoList.concat();
  //   // this.keyInfoList.splice(0, this.keyInfoList.length, keyInfoList);
  // }

  cacheKeyInfoList = [];

  addKeyInfo: boolean = false;

  useExistFormat: boolean = false;

  actionTypeId: number;

  targetList: any[] = [];

  selectTarget: any = {};

  removeKeyDialog = false;

  removeKeyItem: { key?: string; index?: number } = {};

  @Prop({ default: 'New Action', type: String })
  title: string;

  @Prop({ default: '新しいActionを作成します\n説明文' })
  description: string;

  @Prop()
  info: string;

  @Prop({ default: () => ({ text: 'ActionTypeId', value: 'typeId' }) })
  idField: any;

  @Prop({ default: () => [] })
  tagItems: any[];

  tagSearch = null;

  targetDeviceSearch = '';

  @Watch('targetDeviceSearch')
  onSearchTextChange() {
    // if (this.targetList.length > 0) {
    //   return;
    // }
    // if (this.loading) {
    //   return;
    // }
    // this.getCustomGroup().then(response => this.targetList = response.data);
  }

  mouted() {
    this.logInfoItem.typeId = this.actionTypeId;
  }

  creatMoreLogInfo() {
    this.addMoreLogInfoMenu = false;
    this.customLogInfoList.push({
      labelValue: this.logInfoCustomLabelValue,
      labelText: this.logInfoCustomLabelText,
      value: this.logInfoCustomValue,
      edit: false,
    });
    this.logInfoCustomLabelValue = '';
    this.logInfoCustomLabelText = '';
    this.logInfoCustomValue = '';
  }

  cancelCustomLogInfoMenu(index: number) {
    this.customLogInfoList[index].edit = false;
    // this.editCustomLogInfoMenuList.splice(index, 1, false);
    this.editLogInfoCustomLabelValue = '';
    this.editLogInfoCustomLabelText = '';
  }

  editCustomLogInfoLabel(index: number) {
    this.customLogInfoList[index].edit = false;
    if (this.editLogInfoCustomLabelValue) {
      this.customLogInfoList[index].labelValue = this.editLogInfoCustomLabelValue;
    }
    if (this.editLogInfoCustomLabelText) {
      this.customLogInfoList[index].labelText = this.editLogInfoCustomLabelText;
    }
    this.editLogInfoCustomLabelValue = '';
    this.editLogInfoCustomLabelText = '';
  }

  toggleUseExistFormat(event) {
    this.useExistFormat = event;
    // if (this.useExistFormat) {
    if (this.useExistFormat) {
      this.cacheKeyInfoList = this.keyInfoList.concat();
      this.keyInfoList = [];
    } else {
      this.actionTypeId = null;
      this.keyInfoList = this.cacheKeyInfoList.concat();
    }

    // }
  }

  set logInfoCustomLabelValueAndLabelText(value) {
    this.logInfoCustomLabelValue = value;
    this.logInfoCustomLabelText = value.charAt(0).toUpperCase() + value.slice(1);
  }

  get logInfoCustomLabelValueAndLabelText() {
    return this.logInfoCustomLabelValue;
  }

  get displayCustomLogInfoList() {
    return this.customLogInfoList;
  }

  @Prop({ type: Function })
  onClickCancel;

  @Prop({ type: Function })
  onClickSave;

  @Prop()
  actionTypeIds;

  async created() {
    const group = await this.getCustomGroup();
    this.targetList = group.data;
  }

  cancelAddAction() {
    this.onClickCancel();
  }

  get hasDescriptionSlot() {
    return this.$slots.description;
  }

  async saveAddAction() {
    const logInfo = Object.assign(
      {},
      { ...this.logInfoItem, keyInfo: this.keyInfoList, isNew: true }
    );
    if (!this.useExistFormat) {
      // 新規の場合自動でTypeIdを割り当てる
      logInfo.typeId = await this.getNextTypeId();
    }
    // TODO: 未使用
    const keyInfo = Object.assign({}, { id: this.actionTypeId, isNew: true });

    this.onClickSave(logInfo, keyInfo);

    this.logInfoItem = Object.assign({}, { ...this.defaultLogInfoItem });
  }

  cancelAddKey() {
    this.addKeyInfo = false;
  }

  validateDuplicateKey(key) {
    if (this.keyInfoList.find(keyInfo => keyInfo.key === this.newKey)) {
      return 'Duplicate Key';
    }
    return true;
  }

  addKey() {
    if (this.keyInfoList.find((keyInfo: KeyInfo) => keyInfo.key === this.newKey)) {
    } else {
      this.keyInfoList.push(Object.assign({}, DEFAULT_KEY_INFO, { key: this.newKey }));
    }

    this.newKey = '';
    this.addKeyMenu = false;
  }

  openRemoveKeyDialog(key, index) {
    this.removeKeyItem = { key, index };
    this.removeKeyDialog = true;
  }

  closeRemoveKeyDialog() {
    this.removeKeyItem = {};
    this.removeKeyDialog = false;
  }

  removeKey(index) {
    this.$delete(this.keyInfoList, index);
    this.closeRemoveKeyDialog();
  }

  saveAddKey(keyInfo) {
    this.addKeyInfo = false;
    this.keyInfoList.push(Object.assign({}, keyInfo));
  }

  async getNextTypeId() {
    return this.$store.dispatch('format/getNextTypeId', { serviceId: null, version: null });
  }

  async loadActionFormat(item) {
    const format = await this.$store.dispatch('format/get', { serviceId: '', typeId: item });
    this.keyInfoList = format.keyInfo;
  }

  // TODO: 今はKey情報も取ってきているが、IDとNameのリストで、選択時にAPIで取得するようにする
  loadTargetFormat(itemList) {
    if (itemList.length > 0) {
      itemList.forEach(item => {
        this.keyInfoList = item ? item.keyInfo || [] : [];
      });
    } else {
      this.keyInfoList = [];
    }
    // this.keyInfoList = this.keyInfoList.concat();
    // this.keyInfoList.splice(0, this.keyInfoList.length, item ? item.keyInfo || [] : []);
  }

  async getCustomGroup() {
    return this.$store.dispatch('format/getCustomGroup', {
      serviceId: null,
      groupName: 'targetDevice',
      version: '7.0.0',
    });
  }

  defaultKeyInfoTableHeaders: any[] = KEY_INFO_TABLE_HEADERS;

  customHeaders = this.customLogInfoList.map(customLogInfo => ({
    text: customLogInfo.labelText,
    value: customLogInfo.labelValue,
  }));

  keyInfoTableHeaders = this.defaultKeyInfoTableHeaders.concat(this.customHeaders);

  selectedHeaders: string[] = this.keyInfoTableHeaders.map(header => header.value);

  get computedHeaders() {
    return this.keyInfoTableHeaders.filter(header => this.selectedHeaders.includes(header.value));
  }

  get loading() {
    return this.$store.getters['format/loading'];
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_index.scss';
.form-description {
  // margin-bottom: 16px;
  span {
    white-space: pre-line;
  }
}

.add-action {
  &__log-info {
    padding-bottom: 24px;
  }
  &__log-info-detail {
    position: relative;
    border: 1px dashed #999;
    border-radius: 5px;
    margin: 16px 0 0;
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
  }

  &__log-info-detail-caption {
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

::v-deep .add-action {
  &__form {
    // max-width: 900px;
  }

  &__input-text {
    @include input-text;
    // width: 400px;
  }

  &__input-textarea {
    @include input-textarea;
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

::v-deep .keyinfo-table {
  @include table;
}

::v-deep .v-input--switch {
  padding-top: 0;
  margin-top: 0;
  .v-input--switch__track {
    height: 10px;
  }
  .v-input--selection-controls__input {
    height: 10px;
    width: 34px;
  }
  .v-input--switch__thumb {
    top: calc(50% - 12px);
    height: 18px;
    width: 18px;
  }
  .v-label {
    font-size: 12px;
    // color: var(--v-primary-text);
  }
  .v-input--selection-controls__ripple {
    transform: scale(0.8);
    left: -13px;
    top: calc(50% - 25px);
    height: 30px;
    width: 30px;
  }
}
</style>
