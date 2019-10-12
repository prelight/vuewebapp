<template>
  <div id="format-detile">
    <v-container fluid style="height:100%">
      <template v-if="loading">
        <div class="text-center" style="height: 100%;">
          <v-progress-circular :width="3" color="primary" indeterminate></v-progress-circular>
        </div>
      </template>
      <template v-else>
        <v-row>
          <v-col cols="auto" class="mr-auto">
            <span class="body-2"
              >Version: <strong>{{ version }}</strong> のフォーマット情報です。</span
            >
          </v-col>
          <v-col cols="auto">
            <!-- <ExportButton class="mr-4"></ExportButton> -->

            <v-tooltip bottom transition="fade-transition" color="#263238">
              <template v-slot:activator="{ on }">
                <v-btn small icon v-on="on">
                  <v-icon>mdi-file-document-edit</v-icon>
                </v-btn>
              </template>
              <span class="caption">Formatを編集する</span>
            </v-tooltip>
            <!-- <v-tooltip bottom transition="fade-transition" color="#263238">
              <template v-slot:activator="{ on }">
                <v-btn small icon v-on="on">
                  <v-icon small>mdi-content-copy</v-icon>
                </v-btn>
              </template>
              <span class="caption">Copyして新しいアクションを作成する</span>
            </v-tooltip> -->
          </v-col>
        </v-row>

        <v-divider></v-divider>

        <v-row>
          <v-col>
            <v-data-table
              dense
              hide-default-headers
              hide-default-footer
              :items="[actionDetail]"
              :expand="expand"
              :loading="loading"
              pb-5
              class="logdash-table--border loginfo-table"
            >
              <template v-slot:top>
                <v-toolbar flat dense>
                  <span class="title">Log info</span>
                </v-toolbar>
              </template>
              <template v-slot:item="props">
                <!-- <thead> -->
                <tr>
                  <th class="column text-left">
                    <span>ActionTypeId</span>
                  </th>

                  <td>{{ props.item.typeId }}</td>
                </tr>
                <tr>
                  <th class="column text-left">
                    <span style="">Name</span>
                  </th>

                  <td>{{ props.item.name }}</td>
                </tr>
                <tr>
                  <th class="column text-left">
                    <span>Description</span>
                  </th>

                  <td>{{ props.item.description }}</td>
                </tr>
                <tr>
                  <th class="column text-left">
                    <span>Trigger</span>
                  </th>
                  <td>
                    <span style="white-space: pre-wrap;">{{ props.item.trigger }}</span>
                  </td>
                </tr>
                <tr>
                  <th class="column text-left">
                    <span>Precondition</span>
                  </th>
                  <td>
                    <span style="white-space: pre-wrap;">{{ props.item.precondition }}</span>
                  </td>
                </tr>
                <tr>
                  <th class="column text-left">
                    <span>Example</span>
                  </th>
                  <td>
                    <span style="white-space: pre-wrap;">{{ props.item.example }}</span>
                  </td>
                </tr>
                <tr>
                  <th class="column text-left">
                    <span>Remark</span>
                  </th>
                  <td>
                    <span style="white-space: pre-wrap;">{{ props.item.remark }}</span>
                  </td>
                </tr>
                <tr>
                  <th class="column text-left">
                    <span>Latest version</span>
                  </th>
                  <td>
                    <span style="white-space: pre-wrap;">{{ props.item.latestVersion }}</span>
                  </td>
                </tr>
                <!-- </thead> -->
              </template>
            </v-data-table>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-toolbar flat dense class="toolbar">
              <span class="title">Key info</span>
              <v-spacer></v-spacer>
              <v-tooltip v-bind="tooltipSettings">
                <template v-slot:activator="{ on }">
                  <v-btn icon small v-on="on">
                    <template
                      v-if="
                        viewTypeState[actionDetail.typeId]
                          ? viewTypeState[actionDetail.typeId].currentListType === 'Table'
                          : true
                      "
                    >
                      <v-icon size="18" @click="toggleListView(actionDetail.typeId, 'JSON')"
                        >mdi-json</v-icon
                      >
                    </template>
                    <template v-else>
                      <v-icon size="18" @click="toggleListView(actionDetail.typeId, 'Table')"
                        >mdi-view-list</v-icon
                      >
                    </template>
                  </v-btn>
                </template>
                <span class="caption"
                  >{{
                    viewTypeState[actionDetail.typeId]
                      ? viewTypeState[actionDetail.typeId].previousListType
                      : 'JSON'
                  }}で表示する</span
                >
              </v-tooltip>
            </v-toolbar>
            <template
              v-if="
                viewTypeState[actionDetail.typeId]
                  ? viewTypeState[actionDetail.typeId].currentListType === 'Table'
                  : true
              "
            >
              <FormatTable
                dense
                hide-default-footer
                :headers="keyInfoTableHeaders"
                :format-list="actionDetail.keyInfo"
                :expand="expand"
                :loading="loading"
                class="logdash-table--border keyinfotable"
              >
                <template v-if="isDraft" v-slot:actions>
                  <v-tooltip v-bind="tooltipSettings">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        v-on="on"
                        small
                        text
                        color="primary"
                        @click="openDialog(actionDetail.typeId)"
                        class="toolbar__button-base"
                        ><v-icon>mdi-plus</v-icon> <span class="mr-2">Keyを追加</span></v-btn
                      >
                    </template>
                    <span class="caption">新しいkeyを追加する</span>
                  </v-tooltip>
                </template>

                <template v-slot:table-content="{ props, headers }">
                  <template v-for="(header, i) in headers">
                    <td :key="i" :name="header.value" :data-type="props.item.type">
                      <template
                        v-if="
                          header.value === 'class' &&
                            (props.item.valueInfo || props.item.objectInfo)
                        "
                      >
                        <v-row>
                          <v-icon
                            style="margin-right: 2px;"
                            @click="handleVisibility(props.item.key)"
                            small
                            left
                            v-if="props.item.show"
                            >mdi-minus-box-outline</v-icon
                          >
                          <v-icon
                            style="margin-right: 2px;"
                            @click="handleVisibility(props.item.key)"
                            small
                            left
                            v-else
                            >mdi-plus-box-outline</v-icon
                          >
                          <div style="margin-top: 2px">{{ props.item[header.value] }}</div>
                          <!-- <v-icon color="green" left v-if="props.item[header.value] === 'keyInfo'"
                            >mdi-new-box</v-icon
                          > -->
                        </v-row>
                      </template>
                      <template v-else-if="header.value === 'restriction'">
                        {{ props.item[header.value] && `min: ${props.item[header.value].min}`
                        }}<br />
                        {{ props.item[header.value] && `max: ${props.item[header.value].max}` }}
                      </template>
                      <template v-else-if="header.value === 'requirementLevel'">
                        <v-chip
                          small
                          label
                          v-bind="labelRequirementLevel(props.item[header.value])"
                          class="ma-0"
                          >{{ props.item[header.value] }}
                        </v-chip>
                      </template>
                      <template v-else-if="header.value === 'action'">
                        <v-icon small class="mr-2" @click="editItem(props.item.id, props.item)">
                          edit
                        </v-icon>
                      </template>
                      <template
                        v-else-if="isAdditionalHeader(header.value, props.item.additionalInfo)"
                      >
                        <template
                          v-if="
                            props.item.additionalInfo &&
                              additionalData[header.value].options.type == 'chip'
                          "
                        >
                          <v-chip small v-bind="additionalData[header.value].options"
                            >{{ additionalData[header.value].value }}
                          </v-chip>
                        </template>
                        <template v-else>
                          {{ additionalData[header.value].value }}
                        </template>
                      </template>
                      <template v-else>
                        {{
                          header.value == 'type' && props.item.typeName
                            ? props.item.typeName
                            : props.item[header.value]
                        }}
                      </template>
                    </td>
                  </template>

                  <template v-if="props.item.valueInfo">
                    <template v-for="(valueInfo, i) in props.item.valueInfo">
                      <!-- <template v-if="valueInfo.show"> -->
                      <tr :key="i" :class="valueInfo.show ? 'valueinfo' : 'hidden-valueinfo'">
                        <template v-for="(header, i) in keyInfoTableHeaders">
                          <td :key="i" :name="header.value">
                            <template v-if="header.value === 'action'">
                              <v-icon small class="mr-2" @click="editItem(i, valueInfo)">
                                edit
                              </v-icon>
                            </template>
                            <template v-else-if="header.value === 'restriction'">
                              {{ valueInfo[header.value] && `min: ${valueInfo[header.value].min}`
                              }}<br />
                              {{ valueInfo[header.value] && `max: ${valueInfo[header.value].max}` }}
                            </template>

                            <template
                              v-else-if="isAdditionalHeader(header.value, valueInfo.additionalInfo)"
                            >
                              <template
                                v-if="
                                  additionalData[header.value].options &&
                                    additionalData[header.value].options.type == 'chip'
                                "
                              >
                                <v-chip small v-bind="additionalData[header.value].options"
                                  >{{ additionalData[header.value].value }}
                                </v-chip>
                              </template>
                              <template v-else>
                                {{ additionalData[header.value].value }}
                              </template>
                            </template>
                            <template>
                              {{ valueInfo[header.value] }}
                            </template>
                          </td>
                        </template>
                      </tr>
                      <!-- </template> -->
                    </template>
                  </template>

                  <template v-if="props.item.objectInfo">
                    <template v-for="(objectInfo, i) in props.item.objectInfo">
                      <tr :key="i" :class="objectInfo.show ? 'objectinfo ' : 'objectinfo-hidden'">
                        <template v-for="(header, i) in keyInfoTableHeaders">
                          <td :key="i" :name="header.value">
                            <template v-if="header.value === 'action'">
                              <v-icon small class="mr-2" @click="editItem(i, props.item)">
                                edit
                              </v-icon>
                            </template>
                            <template v-else-if="header.value === 'requirementLevel'">
                              <v-chip
                                small
                                label
                                v-bind="labelRequirementLevel(objectInfo[header.value])"
                                class="ma-0"
                                >{{ objectInfo[header.value] }}
                              </v-chip>
                            </template>
                            <template v-else-if="header.value === 'restriction'">
                              {{ objectInfo[header.value] && `min: ${objectInfo[header.value].min}`
                              }}<br />
                              {{
                                objectInfo[header.value] && `max: ${objectInfo[header.value].max}`
                              }}
                            </template>
                            <template
                              v-else-if="
                                isAdditionalHeader(header.value, objectInfo.additionalInfo)
                              "
                            >
                              <template
                                v-if="
                                  additionalData[header.value].options &&
                                    additionalData[header.value].options.type == 'chip'
                                "
                              >
                                <v-chip small v-bind="additionalData[header.value].options"
                                  >{{ additionalData[header.value].value }}
                                </v-chip>
                              </template>
                              <template v-else>
                                {{ additionalData[header.value].value }}
                              </template>
                            </template>

                            <template v-else>
                              {{ objectInfo[header.value] }}
                            </template>
                          </td>
                        </template>
                      </tr>
                      <!--//! TypeがオブジェクトでkeyにvalueInfoを持っている場合 -->
                      <template v-if="objectInfo.valueInfo">
                        <template v-for="(valueInfo, i) in objectInfo.valueInfo">
                          <!-- <template v-if="valueInfo.show"> -->
                          <tr :key="i" :class="valueInfo.show ? 'valueinfo' : 'hidden-valueinfo'">
                            <template v-for="(header, i) in keyInfoTableHeaders">
                              <td :key="i" :name="header.value">
                                <template v-if="header.value === 'action'">
                                  <v-icon small class="mr-2" @click="editItem(i, valueInfo)">
                                    edit
                                  </v-icon>
                                </template>
                                <template
                                  v-else-if="
                                    isAdditionalHeader(header.value, valueInfo.additionalInfo)
                                  "
                                >
                                  <template
                                    v-if="
                                      additionalData[header.value].options &&
                                        additionalData[header.value].options.type == 'chip'
                                    "
                                  >
                                    <v-chip small v-bind="additionalData[header.value].options"
                                      >{{ additionalData[header.value].value }}
                                    </v-chip>
                                  </template>
                                  <template v-else>
                                    {{ additionalData[header.value].value }}
                                  </template>
                                </template>
                                <template>
                                  {{ valueInfo[header.value] }}
                                </template>
                              </td>
                            </template>
                          </tr>
                          <!-- </template> -->
                        </template>
                      </template>
                    </template>
                  </template>
                </template>
              </FormatTable>
            </template>
            <template v-else>
              <v-col>
                <JsonViewer :value="actionDetail.keyInfo" copyable expand-depth="5" />
              </v-col>
            </template>
            <!-- </v-card> -->
          </v-col>
        </v-row>
      </template>
    </v-container>
    <v-dialog v-model="addKeyInfoDialog.open" max-width="900">
      <v-card>
        <v-card-title>
          <span class="headline">{{ addKeyInfoDialog.title }}</span>
        </v-card-title>

        <v-card-text>
          <ActionLogFormatAddKeyInfoForm
            :key="keyInfoItems.key"
            :key-info="keyInfoItems"
            class="mb-2"
          >
            <template v-slot:actions="props">
              <v-btn color="white primary--text ml-0" small @click="cancelAddKey()">{{
                $t('button.cancel')
              }}</v-btn>
              <v-btn
                color="primary"
                small
                class="ml-4"
                @click="
                  addKeyInfoDialog.isEdit ? saveEditKey(props.keyInfo) : saveAddKey(props.keyInfo)
                "
                >{{ $t(addKeyInfoDialog.positiveButtonLabel) }}</v-btn
              >
            </template>
          </ActionLogFormatAddKeyInfoForm>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import ExportButton from '@/components/ExportButton.vue';
import VueI18n from 'vue-i18n';
import JsonViewer from 'vue-json-viewer/ssr';
import 'vue-json-viewer/style.css';
import testActionDetail from '@/static/action3000Detail';
import { getItemJson } from '@/util/storageUtils';
import FormatTable from '@/components/ActionLogFormatTable.vue';
import ActionLogFormatAddKeyInfoForm from '@/components/ActionLogFormatAddKeyInfoForm.vue';

interface ShowMoreMap {
  [s: string]: boolean;
}

interface StateMap {
  showMore: ShowMoreMap;
  currentListType: string;
  previousListType: string;
}

const KEY_INFO_HEADERS = [
  { text: 'Class', value: 'class', align: 'left', width: '130px' },
  {
    text: 'Key',
    value: 'key',
    align: 'left',
  },
  { text: 'Type', value: 'type' },
  { text: 'Restriction', value: 'restriction', sortable: false, width: '180px' },
  { text: 'Value', value: 'value', sortable: false },
  { text: 'Mandatory', value: 'mandatory' },
  { text: 'Requirement Level', value: 'requirementLevel' },
  { text: 'Description', value: 'description', sortable: false, width: '250px' },
  { text: 'Example', value: 'sample', sortable: false },
  { text: '', value: 'action', sortable: false },
];

const LOG_INFO_HEADERS: any[] = [
  {
    text: 'Description',
    value: 'description',
  },
  {
    text: ' Log set timing',
    value: 'timing',
  },
  {
    text: 'Example',
    value: 'example',
  },
  {
    text: 'Remark',
    value: 'remark',
  },
  {
    text: 'Latest version',
    value: 'latestVersion',
  },
];

interface KeyInfoCustom {
  labelText: string;
  labelValue: string;
  value: string;
  edit: boolean;
}

const getLabelSettings = value => {
  const settings: { color?: string; textColor?: string } = {};
  switch (value) {
    case 'REQUIRED':
      settings.color = 'red';
      settings.textColor = 'white';
      break;
    case 'RECOMMENDED':
      settings.color = 'secondary';
      settings.textColor = 'white';
      break;
    default:
      break;
  }
  return settings;
};

/**
 *
 */
@Component({
  name: 'ActionLogFormat',
  components: {
    ActionLogFormatAddKeyInfoForm,
    ExportButton,
    FormatTable,
    JsonViewer,
  },
})
export default class ActionLogFormat extends Vue {
  @Prop()
  id;

  /** data */
  serviceId = JSON.parse(sessionStorage.getItem('defaultService'));

  typeId: number | string;

  version: string;

  type: string;

  target: string;

  isDraft: boolean;

  actionDetail: any = {};

  rowsPerPageItems = [10, 20, 50, 100, { text: 'All', value: -1 }];

  pagination = {
    rowsPerPage: 100,
  };

  tooltipSettings = {
    bottom: true,
    transition: 'fade-transition',
    color: '#263238',
  };

  expand: boolean = true;

  additionalHeaders = [];

  keyInfoTableHeaders = KEY_INFO_HEADERS;

  logInfoHeaders = LOG_INFO_HEADERS;

  selectedHeaders: string[] = [];

  // get computedHeaders() {
  //   return this.keyInfoTableHeaders.filter(header => this.selectedHeaders.includes(header.value));
  // }

  additionalData = {};

  state: StateMap = {
    showMore: { dummy: false },
    previousListType: 'JSON',
    currentListType: 'Table',
  };

  viewTypeState = {};

  keyInfoList = [];

  addMoreKeyInfoMenu: boolean = false;

  customKeyInfoList: KeyInfoCustom[] = [];

  keyInfoCustomLabelValue: string = '';

  keyInfoCustomLabelText: string = '';

  keyInfoCustomValue: string = '';

  editKeyInfoCustomLabelValue: string = '';

  editKeyInfoCustomLabelText: string = '';

  addKeyInfoDialog = {
    open: false,
    title: 'Keyを追加',
    isEdit: false,
    positiveButtonLabel: 'button.add',
  };

  detailSettings: boolean = false;

  defaultKeyInfoItems = {
    id: 0,
    class: 'action',
    key: 'key1',
    type: 'String',
    restriction: {
      min: 0,
      max: 200,
    },
    min: 0,
    max: 200,
    mandatory: false,
    requirementLevel: 'OPTIONAL',
    values: [],
    multiValue: false,
    description: '',
    isUpdate: false,
  };

  keyInfoItems = Object.assign({}, this.defaultKeyInfoItems);

  dialog: boolean = false;

  helpDialog: boolean = false;

  editedIndex = -1;

  get loading() {
    return this.$store.getters['format/loading'];
  }

  set loading(loading) {
    this.$store.commit('format/loading', loading);
  }

  set keyInfoCustomLabelValueAndLabelText(value) {
    this.keyInfoCustomLabelValue = value;
    this.keyInfoCustomLabelText = value.charAt(0).toUpperCase() + value.slice(1);
  }

  get keyInfoCustomLabelValueAndLabelText() {
    return this.keyInfoCustomLabelValue;
  }

  async created() {
    this.version = decodeURIComponent(String(this.$route.query.v));
    this.type = decodeURIComponent(String(this.$route.query.type));
    this.target = decodeURIComponent(String(this.$route.query.target));

    // Storeにデータがある場合、初期データとして表示する
    this.actionDetail =
      this.$store.getters['format/formatList'].find(
        format => format.typeId === Number(decodeURIComponent(this.id))
      ) || {};
    const versionDetail = getItemJson(localStorage, 'versionList', {})[this.serviceId.value].find(
      version => version.value === this.version
    );

    this.isDraft = versionDetail.draft;
    const response = await this.fetchData();
    const { meta, keyInfo } = response;
    const additionalHeaders = meta ? meta.additionalHeaders : [];
    this.additionalHeaders = additionalHeaders;
    Array.prototype.splice.apply(
      this.keyInfoTableHeaders,
      [this.keyInfoTableHeaders.length - 1, 0].concat(additionalHeaders)
    );
    this.selectedHeaders = this.keyInfoTableHeaders.map(header => header.value);

    this.actionDetail = response || {};
  }

  fetchData() {
    this.typeId = Number(decodeURIComponent(this.id));
    let response;

    if (this.type === 'custom') {
      response = this.$store.dispatch('format/getCustomData', {
        serviceId: this.serviceId.value,
        version: this.version,
        groupName: this.target,
        id: this.typeId,
      });
    } else {
      response = this.$store.dispatch('format/get', {
        serviceId: this.serviceId.value,
        version: this.version,
        typeId: this.typeId,
      });
    }
    return response;
  }

  creatMoreKeyInfo() {
    this.addMoreKeyInfoMenu = false;
    this.customKeyInfoList.push({
      labelValue: this.keyInfoCustomLabelValue,
      labelText: this.keyInfoCustomLabelText,
      value: this.keyInfoCustomValue,
      edit: false,
    });
    this.keyInfoCustomLabelValue = '';
    this.keyInfoCustomLabelText = '';
    this.keyInfoCustomValue = '';
  }

  cancelCustomLogInfoMenu(index: number) {
    this.customKeyInfoList[index].edit = false;
    // this.editCustomLogInfoMenuList.splice(index, 1, false);
    this.editKeyInfoCustomLabelValue = '';
    this.editKeyInfoCustomLabelText = '';
  }

  editCustomLogInfoLabel(index: number) {
    this.customKeyInfoList[index].edit = false;
    if (this.editKeyInfoCustomLabelValue) {
      this.customKeyInfoList[index].labelValue = this.editKeyInfoCustomLabelValue;
    }
    if (this.editKeyInfoCustomLabelText) {
      this.customKeyInfoList[index].labelText = this.editKeyInfoCustomLabelText;
    }
    this.editKeyInfoCustomLabelValue = '';
    this.editKeyInfoCustomLabelText = '';
  }

  clearCustomKeyInfoField() {
    this.editKeyInfoCustomLabelValue = '';
    this.editKeyInfoCustomLabelText = '';
  }

  cancelAddKey() {
    this.addKeyInfoDialog.isEdit = false;
    this.addKeyInfoDialog.open = false;

    // this.keyInfoItems = Object.assign({}, this.defaultKeyInfoItems);
  }

  saveAddKey(item) {
    this.addKeyInfoDialog.open = false;
    const newKeyInfo = item;
    let { keyInfo } = this.actionDetail;
    const nextId = keyInfo && keyInfo.length > 0 ? keyInfo[keyInfo.length - 1].id + 1 : 1;
    newKeyInfo.id = nextId;
    newKeyInfo.isUpdate = true;
    this.actionDetail.isUpdate = true;

    if (keyInfo) {
      keyInfo.push(Object.assign({}, newKeyInfo));
    } else {
      keyInfo = new Array(Object.assign({}, newKeyInfo));
    }

    this.actionDetail.keyInfo = keyInfo;

    this.$store.dispatch('format/updateAction', {
      serviceId: this.serviceId.value,
      version: this.version,
      action: this.actionDetail,
    });
    this.clearCustomKeyInfoField();
  }

  saveEditKey(keyInfo) {
    this.addKeyInfoDialog.open = false;
    // this.keyInfoItems.isUpdate = true;
    const updateKeyInfo = keyInfo;
    updateKeyInfo.isUpdate = true;
    this.actionDetail.isUpdate = true;
    const index = this.actionDetail.keyInfo.findIndex(
      preKeyInfo => preKeyInfo.id === this.editedIndex
    );
    this.actionDetail.keyInfo.splice(index, 1, Object.assign({}, updateKeyInfo));

    this.$store.dispatch('format/updateAction', {
      serviceId: this.serviceId.value,
      version: this.version,
      action: this.actionDetail,
    });
    this.clearCustomKeyInfoField();
  }

  isAdditionalHeader(header, infoList) {
    const res: boolean = infoList && header && header.includes('additional_');
    if (res) {
      const additionalData = infoList.find(info => info.key === header.replace('additional_', ''));
      this.additionalData[header] = { ...additionalData };
      // this.$set(this.additionalData, header, { ...additionalData });
      // this.additionalData = Object.assign({}, this.additionalData, { ...additionalData });
    }

    return res;
  }

  labelRequirementLevel(value) {
    return getLabelSettings(value);
  }

  toggleListView(typeId: number, listType: string) {
    const currentListType = this.viewTypeState[typeId]
      ? this.viewTypeState[typeId].currentListType
      : 'Table';
    const viewState = <StateMap>{
      currentListType: listType,
      previousListType: currentListType,
    };

    this.viewTypeState = Object.assign({}, this.viewTypeState, { [typeId]: { ...viewState } });
  }

  // actionDetail = { logInfo: [], keyInfo: [] };
  // actionDetail = testActionDetail;
  openDialog(index) {
    // this.dialog =this.dialog.push(index, true);
    this.addKeyInfoDialog.title = 'Keyを追加';
    this.keyInfoItems = Object.assign({}, this.defaultKeyInfoItems);
    this.addKeyInfoDialog.open = true;
  }

  handleVisibility(key) {
    const keyInfo = this.actionDetail.keyInfo.find(info => info.key === key);
    if (keyInfo.valueInfo) {
      keyInfo.valueInfo.forEach((element, index) => {
        element.show = !element.show;
      });
    }
    if (keyInfo.objectInfo) {
      keyInfo.objectInfo.forEach((element, index) => {
        element.show = !element.show;
      });
    }
  }

  editItem(index, item) {
    this.editedIndex = index;
    this.keyInfoItems = Object.assign({}, item);
    // if (!this.keyInfoItems.restriction) {
    //   this.keyInfoItems.restriction = {};
    // }
    // this.dialog = true;
    this.addKeyInfoDialog.title = `${item.key}を編集`;
    this.addKeyInfoDialog.isEdit = true;
    this.addKeyInfoDialog.positiveButtonLabel = 'button.save';
    this.addKeyInfoDialog.open = true;
  }

  /**
   * Debug log
   */
  log(message: any) {
    console.log(message);
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_index.scss';

.loginfo-table {
  tbody {
    th,
    td {
      height: 30px;
    }
    th {
      background: #f5f5f5;
      width: auto;
    }
    tr th {
      white-space: nowrap;
      overflow: auto;
      max-width: 500px;
      border-left: 1px solid #dddddd;
      border-bottom: 1px solid #dddddd;
    }
    tr td {
      width: 100%;
      border-left: 1px solid #dddddd;
      border-right: 1px solid #dddddd;
      border-bottom: 1px solid #dddddd;
    }
    tr:first-child td,
    tr:first-child th {
      border-top: 1px solid #dddddd !important;
    }
  }
}

.keyinfo [name='sample'] {
  font-style: italic;
  color: #e65100;
}
.keyinfo [name='value'] {
  font-weight: bold;
  font-style: italic;
  color: #01579b;
}
.keyinfo [name='value'][data-type='Object'] {
  font-weight: bold;
  font-style: italic;
  color: #000000;
  // background: #f3e5f5;
}

.valueinfo td {
  background: #e8f5e9;
  color: #01579b;
  border-color: #e8f5e9;
}
.hidden-valueinfo {
  visibility: collapse;
}

.valueinfo [name='value'] {
  font-weight: bold;
  font-style: italic;
}

.objectinfo td {
  background: #f3e5f5;
  // color: #01579b;
  border-color: #e8f5e9;

  // border-bottom: solid 1px #faf2f2;
}
.objectinfo [name='value'] {
  font-weight: bold;
  font-style: italic;
  color: #01579b;
}
.objectinfo [name='sample'] {
  font-style: italic;
  color: #e65100;
}
.objectinfo-hidden {
  visibility: collapse;
}

::v-deep .add-action {
  &__form {
    // max-width: 900px;
  }

  &__key-info-detail {
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

  &__key-info-detail-caption {
    position: absolute;
    top: -6px;
    right: 0;
    background-color: white;
    transform: translateY(-50%) translateX(-1em);
  }

  &__input-text {
    @include input-text;
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
</style>
