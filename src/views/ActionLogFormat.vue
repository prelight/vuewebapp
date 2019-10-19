<template>
  <div>
    <v-banner
      v-model="isDraft"
      :sticky="openDraftBanner"
      single-line
      transition="slide-y-transition"
      class="banner--draft"
    >
      <v-icon icon="mdi-information-outline" color="#FFF" class="mr-2">
        mdi-information-outline
      </v-icon>
      <span class="body-2">{{ $t('format.list.banner.draft_version') }}</span>
      <!-- <v-btn text color="primary" @click="$router.push({ name: 'apply' })">申請一覧</v-btn> -->
      <template v-slot:actions>
        <v-btn small color="primary--text" @click="createNewApply" class="mr-4">{{
          $t('apply.messages.create_apply')
        }}</v-btn>
        <v-btn icon small @click="toggleDraftBanner()"
          ><v-icon color="#FFF">{{ toggleDraftBannerIcon }}</v-icon></v-btn
        >
      </template>
    </v-banner>
    <v-container fluid>
      <v-row justify="space-between" class="px-2">
        <v-col cols="auto" class="service-id-select">
          <v-btn
            outlined
            class="service-id-switcher-button text-none ml-0 mt-0"
            @click="openServiceDialog"
          >
            <v-icon v-if="service.icon" size="20px" left>{{ service.icon }}</v-icon>
            <span class="mr-1">{{ service.text }}</span>
            <v-icon right>arrow_drop_down</v-icon>
          </v-btn>
        </v-col>

        <template v-if="!isInitialized">
          <v-col lg="12" sm="12" cols="12">
            <div class="text-center">
              <v-progress-circular :width="3" color="primary" indeterminate></v-progress-circular>
            </div>
          </v-col>
        </template>

        <template v-else-if="service.value !== '_none'">
          <template
            v-if="service && !selectedVersion.value && formatData && formatData.length == 0"
          >
            <v-col lg="12" sm="12" cols="12">
              <div class="body-2">{{ service.text }}のフォーマットは、まだ作成されていません</div>
              <p>
                <v-btn
                  small
                  color="primary"
                  class="text-none"
                  @click="createNewFormatGroupDialog = true"
                  >作成する</v-btn
                >
              </p>
            </v-col>
          </template>
          <template v-else>
            <v-col cols="auto">
              <ButtonDropdown class="mr-3">
                <template v-slot:label>
                  <v-icon :color="selectedOS.icon.color" class=" mr-2">{{
                    selectedOS.icon.name
                  }}</v-icon>
                  <span class="mr-2">{{ selectedOS.text }}</span>
                </template>

                <template v-slot:content>
                  <v-card>
                    <v-list dense>
                      <v-list-item
                        v-for="(item, index) in osList"
                        :key="index"
                        @click="handleOSClick(item)"
                      >
                        <v-list-item-avatar size="24">
                          <v-icon
                            :color="item.icon.color"
                            size="18"
                            class="ml-0"
                            style="border: solid 1px rgba(0,0,0,.12);"
                            >{{ item.icon.name }}</v-icon
                          >
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title v-text="item.text"></v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-card>
                </template>
              </ButtonDropdown>
            </v-col>
            <v-col class="d-flex">
              <ButtonDropdown
                :append-hint-text="
                  $t('format.list.buttons.select_version.tooltip', {
                    versionLabel: $t('format.list.actions.create_version.label', {
                      versionLabel: 'Software version',
                    }),
                  })
                "
                class="ml-2"
              >
                <template v-slot:label>
                  <span class="mr-2">Version: {{ selectedVersion.text }}</span
                  ><v-chip
                    v-if="selectedVersion.draft"
                    x-small
                    label
                    color="#EF6C00"
                    class=" ml-2 white--text"
                    >Draft</v-chip
                  >
                </template>
                <template v-slot:content>
                  <v-card>
                    <v-list dense>
                      <v-list-item
                        v-for="(item, index) in versionList"
                        :key="index"
                        @click="handleVersionClick(item)"
                      >
                        <v-list-item-content>
                          <v-list-item-title v-text="item.text"></v-list-item-title>
                        </v-list-item-content>
                        <v-chip
                          v-if="item.draft"
                          x-small
                          label
                          color="#EF6C00"
                          class="ml-0 white--text"
                          >Draft</v-chip
                        >
                      </v-list-item>
                    </v-list>
                    <v-divider></v-divider>
                    <v-list dense>
                      <v-list-item @click="openCreateNewVersionDialog">
                        <v-list-item-content>
                          <v-list-item-title
                            v-text="
                              $t('format.list.actions.create_version.label', {
                                versionLabel: 'Software version',
                              })
                            "
                          ></v-list-item-title> </v-list-item-content
                      ></v-list-item>
                    </v-list>
                  </v-card>
                </template>
              </ButtonDropdown>
            </v-col>
            <v-col cols="auto">
              <ExportButton class="ml-2"></ExportButton>

              <v-menu offset-x :close-on-content-click="false" :nudge-width="200" bottom>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on" class="ml-2">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-list dense>
                    <v-menu offset-y nudge-left="236px" :close-on-content-click="false" full-width>
                      <template v-slot:activator="{ on }">
                        <!-- <v-list-item slot="activator" v-on="on" @click=""> -->
                        <v-list-item v-on="on">
                          <v-list-item-icon>
                            <v-icon>mdi-code-braces</v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title>コード生成</v-list-item-title>
                          </v-list-item-content>
                          <v-list-item-icon>
                            <v-icon>chevron_right</v-icon>
                          </v-list-item-icon>
                        </v-list-item>
                      </template>

                      <v-card>
                        <v-list dense>
                          <v-subheader>Platformを選択</v-subheader>
                          <v-divider />
                          <v-list-item
                            v-for="(item, index) in platformList"
                            :key="index"
                            @click="download(item)"
                          >
                            <v-list-item-title>
                              {{ item }}
                            </v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-card>
                    </v-menu>

                    <v-divider></v-divider>

                    <v-list-item @click="debug('Import')">
                      <v-list-item-icon>
                        <v-icon>mdi-import</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>Import</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>

                    <v-divider></v-divider>

                    <v-subheader class="h4">カスタム</v-subheader>
                    <v-list-item @click="debug('カスタムフィールド')">
                      <v-list-item-icon>
                        <v-icon>mdi-table-column-plus-after</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>フィールドを追加</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-menu>
              <!-- </v-card-actions> -->
            </v-col>
            <v-col lg="12" sm="12" cols="12">
              <v-tabs
                :transition="false"
                dense
                height="34"
                color=""
                slider-color="black"
                class="mt-2"
              >
                <!-- <v-tab ripple style="text-transform: none !important;"> -->
                <v-tab ripple>
                  <v-icon small class="mr-2">mdi-gesture-tap-hold</v-icon>
                  <span class="caption">Events</span>
                </v-tab>
                <v-tab-item :transition="false" :reverse-transition="false">
                  <!-- <v-divider></v-divider> -->

                  <ActionLogFormatTable
                    :loading="loadingFormatList"
                    :headers="computedHeaders"
                    :format-list="formatData"
                    :event-id-map="eventIdMap"
                    :version="selectedVersion.value"
                    key-id="id"
                  >
                    <!-- Fomat追加 -->
                    <template v-if="selectedVersion.draft" v-slot:actions>
                      <v-btn
                        @click="openAddActionDialog"
                        small
                        text
                        color="primary"
                        class="button-base px-1"
                        ><v-icon>mdi-plus</v-icon
                        ><span class="mr-2">{{
                          $t('format.list.buttons.add_action.label', { action: 'Event' })
                        }}</span></v-btn
                      >
                      <v-tooltip right transition="fade-transition" color="#263238">
                        <template v-slot:activator="{ on }">
                          <v-icon v-on="on" small class="mr-2">mdi-help-circle</v-icon>
                        </template>
                        <span class="caption" style="white-space: pre-line;">{{
                          $t('format.list.buttons.add_action.tooltip', { action: 'Event' })
                        }}</span>
                      </v-tooltip>
                    </template>
                  </ActionLogFormatTable>

                  <!-- //TODO: α2以降で対応 -->
                  <!-- <v-btn
                    @click="openAddActionDialog"
                    small
                    text
                    color="primary"
                    class="align-self-center button-base"
                    ><v-icon>mdi-plus</v-icon><span class="mr-2">Groupを作成</span></v-btn
                  > -->
                </v-tab-item>
                <v-tab ripple>
                  <v-icon small class="mr-2">devices</v-icon>
                  <span class="caption">Targets</span>
                </v-tab>
                <v-tab-item :transition="false" :reverse-transition="false">
                  <ActionLogFormatTable
                    :loading="loadingFormatList"
                    :headers="targetDeviceList.headers"
                    :format-list="targetDeviceList.data"
                    :event-id-map="eventIdMap"
                    :version="selectedVersion.value"
                    :data-format="{ type: 'custom', name: 'targetDevice' }"
                  >
                  </ActionLogFormatTable>
                </v-tab-item>
              </v-tabs>
            </v-col>
          </template>
        </template>

        <!-- 新規サービス向けフォーマット作成ダイアログ -->
        <v-dialog
          v-model="createNewFormatGroupDialog"
          scrollable
          persistent
          max-width="1200px"
          width="unset"
        >
          <keep-alive :max="3">
            <template v-if="createNewFormatGroupDialog && step == 1">
              <!-- フォーマット作成ステップ1 -->
              <ActionLogFormatCreateFormatGroupForm @select-template="selectFormatTemplate">
                <template v-slot:action>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn small color="primary" text @click="cancelCreateFormat">キャンセル</v-btn>
                    <v-btn :disabled="!formatTemplate" color="primary" @click="step = 2"
                      >次へ</v-btn
                    >
                  </v-card-actions>
                </template>
              </ActionLogFormatCreateFormatGroupForm>
            </template>
            <template v-else-if="createNewFormatGroupDialog && step == 2">
              <!-- フォーマット作成ステップ2 -->
              {{ log(newVersionName) }}
              <!-- <div style="height: auto;"> -->
              <ActionLogFormatCreateNewVersionForm
                :versions="versionList"
                :defaultSelected="latestVersion"
                :headers="computedHeaders"
                :service="formatTemplate"
                :createVersion="1"
                v-model="newVersionName"
              >
                <template v-slot:action="props">
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn small color="primary" text @click="cancelCreateFormat">キャンセル</v-btn>
                    <v-btn small color="primary" text @click="step = 1">戻る</v-btn>
                    <v-btn
                      small
                      color="primary"
                      :disabled="!newVersionName"
                      @click="completeCreateFormat(props.form)"
                      >作成</v-btn
                    >
                  </v-card-actions>
                </template>
              </ActionLogFormatCreateNewVersionForm>
              <!-- </div> -->
            </template>
          </keep-alive>
        </v-dialog>

        <!-- Newバージョン作成用ダイアログ -->
        <v-dialog
          v-model="newVersionDialog"
          append
          scrollable
          persistent
          max-width="1200px"
          width="unset"
        >
          <!-- <keep-alive :max="0"> -->
          <template v-if="step == 1">
            <!-- フォーマット作成ステップ1 -->
            <ActionLogFormatCreateNewVersionForm
              :versions="versionList"
              :defaultSelected="getLatestVersion(service.value)"
              :headers="computedHeaders"
              :service="service"
              item-key="id"
              createVersion=""
              @selected-actions="selectedActionList"
              v-model="newVersionName"
            >
              <template v-slot:action="props">
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn small color="white primary--text" @click="cancelCreateFormat"
                    >キャンセル</v-btn
                  >
                  <v-btn
                    small
                    color="primary"
                    :disabled="!newVersionName"
                    @click="createNewVersion(props.form)"
                    >作成</v-btn
                  >
                </v-card-actions>
              </template>
            </ActionLogFormatCreateNewVersionForm>
          </template>
          <!-- </keep-alive> -->
        </v-dialog>

        <!-- serviceId選択ダイアログ -->
        <v-dialog v-model="serviceDialog" max-width="500">
          <v-card>
            <v-card-title class="headline">サービスの選択</v-card-title>
            <v-card-text>
              <v-select
                :loading="loading"
                :items="serviceList"
                cache-items
                label="Service"
                item-value="value"
                item-text="text"
                v-model="selectedService"
                return-object
              ></v-select>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn small color="primary" text @click="cancelSelectService">キャンセル</v-btn>
              <v-btn small color="primary" @click="setService">OK</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <template v-if="addActionDialog">
          <v-dialog
            id="addActionDialog"
            attach
            persistent
            scrollable
            full-width
            v-model="addActionDialog"
            max-width="900px"
            height="100%"
            content-class="add-action-dialog"
          >
            <ActionLogFormatAddActionForm
              :actionTypeId="nextTypeId"
              :onClickCancel="() => (addActionDialog = false)"
              :onClickSave="handleAddActionSave"
              title="New LogFormat"
              :action-type-ids="actionTypeIds"
              :id-field="{ text: 'Event Id', value: 'id' }"
            >
              <template v-slot:description>
                <div style="white-space: pre-line;">
                  <span class="body-2">{{
                    `新しいLogFormatを追加します。\n既存のEventをベースにして新たなLogFormatを作成することもできます。`
                  }}</span>
                </div>
                <!-- <div>
                  <span class="caption"
                    ><v-icon small class="mr-2">mdi-information</v-icon
                    >{{
                      `定義済みのLogFormatを使用する場合、'Keyの追加・変更'はできません。`
                    }}</span
                  >
                </div> -->
              </template>
            </ActionLogFormatAddActionForm>
          </v-dialog>
        </template>
      </v-row>

      <v-snackbar v-model="openSnack" v-bind="snack.settings">
        {{ snack.snackText }}
        <v-btn icon text @click="openSnack = false">Close</v-btn>
      </v-snackbar>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Emit, Component, Prop } from 'vue-property-decorator';
import ExportButton from '@/components/ExportButton.vue';
import VueI18n from 'vue-i18n';
import ButtonDropdown from '@/components/ButtonDropdown.vue';
import ActionLogFormatCreateFormatGroupForm from '@/components/ActionLogFormatCreateFormatGroupForm.vue';
import ActionLogFormatCreateNewVersionForm from '@/components/ActionLogFormatCreateNewVersionForm.vue';
import ActionLogFormatAddActionForm from '@/components/ActionLogFormatAddActionForm.vue';
import { getItemJson } from '@/util/storageUtils';
import { ServiceIdInfo } from '@/auth';
import { FormatDataModel, OSDataModel, FORMAT_LIST } from '@/api';
import ActionLogFormatTable from '@/components/ActionLogFormatTable.vue';
import { OS_LIST } from '@/static/hpc/data';

const labelColors = {
  active: {
    color: 'green',
    textColor: 'white',
    small: true,
    // style: { height: '24px' },
  },
  inactive: {
    color: 'red',
    textColor: 'white',
    small: true,
    // style: { height: '24px' },
  },
};

const DEFAULT_SERVICE = {
  text: 'サービスを選択してください',
  value: '_none',
  icon: 'mdi-service',
};

const DEFAULT_SNACK_SETTINGS = {
  settings: {
    bottom: true,
    color: 'orange',
    timeout: 6000,
  },
  options: {},
};

const capitalizeLogInfoCustomLabelText = value => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const jarFilePath = require('@/assets/files/codesnippet.zip');

/**
 * ActionLogFormatの一覧画面
 *
 */
@Component({
  name: 'ActionLogFormat',
  components: {
    ActionLogFormatCreateFormatGroupForm,
    ActionLogFormatCreateNewVersionForm,
    ButtonDropdown,
    ExportButton,
    ActionLogFormatAddActionForm,
    ActionLogFormatTable,
  },
})
export default class ActionLogFormat extends Vue {
  /** data */
  isInitialized = false;

  loadingFormatList = false;

  osList = OS_LIST;

  selectedOS: OSDataModel = { text: 'OS', value: '' };

  serviceList: ServiceIdInfo[] = [];

  service = getItemJson(sessionStorage, 'defaultService', null) || DEFAULT_SERVICE;

  selectedService = this.service;

  serviceDialog: boolean = false;

  createNewFormatGroupDialog = false;

  newVersionDialog = false;

  addActionDialog = false;

  versionList: { text: string; value: string; draft?: boolean }[] = [];

  platformList = ['Android', 'iOS', 'Linux'];

  selectedVersion: { text?: string; value?: string; draft?: boolean } = {};

  step = 1;

  latestVersion: any = {};

  latestVersionList;

  newVersionName = '';

  nextTypeId: number = -1;

  openSnack: boolean = false;

  snack: { snackText?: string; settings?: {}; options?: {} } = DEFAULT_SNACK_SETTINGS;

  openDraftBanner: boolean = false;

  isDraft: boolean = false;

  toggleDraftBannerIcon: string = 'mdi-pin';

  tableHeaders: any[] = [
    { text: 'Event ID', value: 'id', width: '100', link: true },
    { text: 'Event Name', value: 'name', link: true },
    { text: 'Description', value: 'description', sortable: false, minWidth: '300px' },
    { text: 'Pre-condition', value: 'precondition' },
    { text: 'Target', value: 'target' },
    { text: 'Trigger', value: 'trigger' },
  ];

  actionLogTableHeaders = [];

  eventIdMap = {};

  customFieldList = [];

  selectedHeaders: string[] = this.actionLogTableHeaders
    .filter(header => header.value !== 'label')
    .map(header => header.value);

  formatTemplate: { text?: string; value?: string } = {};

  // NOTE: プロトタイプ用
  targetDeviceList: { headers?: []; data?: [] } = {};

  // ActionLogFormatAddActionForm
  actionTypeIds = [];

  get loading() {
    return this.$store.getters['format/loading'] || this.$store.getters['account/loading'];
  }

  set loading(loading) {
    this.$store.commit('format/loading', loading);
  }

  get computedHeaders() {
    // return this.actionLogTableHeaders.filter(header => this.selectedHeaders.includes(header.value));
    return this.actionLogTableHeaders;
  }

  get selectedActionList() {
    return this.$store.getters['format/selectedItem'];
  }

  get formatData(): FormatDataModel[] {
    const format = this.$store.getters['format/formatList'] || [];
    return format;
  }

  // Lifecycle methods
  async created() {
    [this.selectedOS] = this.osList;
    this.init();
  }

  // Methods -----------------------------------------------------------------------------
  async init() {
    this.isInitialized = false;
    this.serviceList = await this.getServiceList();
    console.log('******* 010');
    console.log(this.serviceList);

    const defaultService = getItemJson(sessionStorage, 'defaultService', null);

    if (defaultService) {
      this.service = defaultService;
      this.selectedService = this.service;
      await this.fetchFormatData();
    } else {
      this.service = DEFAULT_SERVICE;
    }
    this.isInitialized = true;
  }

  getServiceList() {
    // Amplify.configure({
    //   // Auth: {
    //   //     identityPoolId: 'us-east-2:407c0b68-9a34-4fa1-a916-47bd46686284', //REQUIRED - Amazon Cognito Identity Pool ID
    //   //     region: 'us-east-2', // REQUIRED - Amazon Cognito Region
    //   //     userPoolId: 'us-east-2_I3nRjackN', //OPTIONAL - Amazon Cognito User Pool ID
    //   //     userPoolWebClientId: '6mdsa320oe530p1r774mkjtt98', //OPTIONAL - Amazon Cognito Web Client ID
    //   // },
    //   API: {
    //     endpoints: [
    //       {
    //           name: "AmplifyTest",
    //           // endpoint: "https://pwoihyr22i.execute-api.us-east-2.amazonaws.com/v1"
    //           endpoint: "https://gi94xc5bhj.execute-api.us-west-2.amazonaws.com/alpha1"
    //       }
    //     ]
    //   }
    // });

    // Amplify.API.get('AmplifyTest', '/logdash/auth/ssss')
    // .then(res => {
    //   console.log('******* 005');
    //   console.log(res);
    //   return res;
    // })
    // .cache(e => {
    //   return e;
    // });

    // // .then((
    // //   return 
    // // ))
    return this.$store.dispatch('account/getServiceList');
  }

  async fetchFormatData() {
    this.loadingFormatList = true;
    this.openSnack = false;
    this.isDraft = false;
    this.openDraftBanner = false;

    this.versionList =
      (await this.$store.dispatch('format/getVersionList', {
        serviceId: this.service.value,
      })) || [];

    const selectedVersion = getItemJson(localStorage, 'selectedVersion', {});
    if (selectedVersion.value) {
      // 選択済みのバージョンがある場合
      this.selectedVersion = this.versionList.find(
        version => version.value === selectedVersion.value
      );
    } else {
      this.selectedVersion = this.getLatestVersion();
      localStorage.setItem('selectedVersion', JSON.stringify(this.selectedVersion));
    }

    // const data = await this.$store.dispatch('format/getFormatList', {
    //   serviceId: this.selectedService.value,
    //   version: this.selectedVersion.value,
    // });
    await this.$store.dispatch('format/getFormatList', {
      serviceId: this.selectedService.value,
      version: this.selectedVersion.value,
    });

    this.actionTypeIds = this.formatData
      .map(format => format.typeId)
      .sort((a: number, b: number) => a - b)
      .map(typeId => ({ text: String(typeId), value: typeId }));

    this.customFieldList =
      (await this.$store.dispatch('format/getCustomFieldList', {
        serviceId: this.selectedService.value,
      })) || [];

    this.actionLogTableHeaders = this.tableHeaders
      .concat(this.customFieldList)
      .concat(this.versionList.map(version => ({ ...version, sortable: false, version: true })));
    this.selectedHeaders = this.actionLogTableHeaders
      .filter(header => header.value !== 'label')
      .map(header => header.value);

    this.eventIdMap = await this.$store.dispatch('format/getEventIdMap', {
      serviceId: this.service.value,
    });
    this.log(this.eventIdMap);
    this.targetDeviceList = (await this.$store.dispatch('format/getCustomGroup', {
      serviceId: this.service.value,
      groupName: 'targetDevice',
      version: this.selectedVersion.value,
    })) || { headers: [], data: [] };

    if (this.selectedVersion.draft) {
      this.isDraft = true;
      this.openDraftBanner = true;
    }

    this.loadingFormatList = false;

    // this.formatData = data;
  }

  nextVersion() {
    const nextVersion = `${Number(this.getLatestVersion(this.service.value).value) + 1}`;
    return nextVersion;
  }

  cancelCreateFormat() {
    this.createNewFormatGroupDialog = false;
    this.newVersionDialog = false;
    this.step = 1;
  }

  completeCreateFormat(form) {
    const version = {
      text: '1',
      value: '1',
      draft: true,
    };

    if (form.validate()) {
      const newFormat = {
        [version.value]: this.selectedActionList.map(action => {
          const newAction: any = { ...action };
          newAction.typeId += 1000;
          newAction.isNew = true;
          return newAction;
        }),
      };

      if (this.versionList) {
        this.versionList.unshift(version);
      } else {
        this.versionList = [version];
      }
      localStorage.setItem('versionList', JSON.stringify(this.versionList));
      const formatList = getItemJson(localStorage, FORMAT_LIST, {});
      formatList[this.service.value] = newFormat;
      localStorage.setItem(FORMAT_LIST, JSON.stringify(formatList));

      this.selectedVersion = version;
      localStorage.setItem('selectedVersion', JSON.stringify(this.selectedVersion));
      // this.formatData = this.fetchFormatData();
      this.fetchFormatData();
      this.createNewFormatGroupDialog = false;
      this.newVersionDialog = false;
      this.step = 1;
    }
  }

  createNewVersion(form) {
    const version = this.newVersionName;
    this.latestVersion = {
      text: `${version}`,
      value: `${version}`,
      draft: true,
    };

    const update = this.$store
      .dispatch('format/createNewVersion', {
        serviceId: this.service.value,
        version: this.latestVersion,
        format: this.selectedActionList,
      })
      .then(() => {
        this.fetchFormatData();
        this.selectedVersion = this.latestVersion;

        localStorage.setItem('selectedVersion', JSON.stringify(this.selectedVersion));
      });

    // this.selectedVersion = this.latestVersion;

    // localStorage.setItem('selectedVersion', JSON.stringify(this.selectedVersion));
    // this.formatData = this.fetchFormatData();
    // this.fetchFormatData();
    this.createNewFormatGroupDialog = false;
    this.newVersionDialog = false;
  }

  getApplyId = () => {
    const applyId = localStorage.getItem('applyId') || '0';
    const next = (Number(applyId) + 1).toString();
    localStorage.setItem('applyId', next);
    return next;
  };

  selectFormatTemplate(template) {
    this.formatTemplate = template;
  }

  openCreateNewVersionDialog() {
    this.newVersionDialog = true;
  }

  openAddActionDialog() {
    this.nextTypeId = this.getNextTypeId();
    this.addActionDialog = true;
  }

  openServiceDialog() {
    this.serviceDialog = true;
  }

  cancelSelectService() {
    this.serviceDialog = false;
  }

  async setService() {
    sessionStorage.setItem('defaultService', JSON.stringify(this.selectedService));
    this.service = this.selectedService;

    this.$store.dispatch('account/changeService', this.service);
    localStorage.removeItem('selectedVersion');
    this.init();
    // this.versionList =
    //   (await this.$store.dispatch('format/getVersionList', { serviceId: this.service.value })) ||
    //   {};

    // this.selectedVersion = this.getLatestVersion(this.service.value);
    // localStorage.setItem('selectedVersion', JSON.stringify(this.selectedVersion));
    // // this.formatData = this.fetchFormatData();
    // this.fetchFormatData();
    this.serviceDialog = false;
  }

  getLatestVersion(serviceId?): any {
    return this.versionList && this.versionList.length > 0 ? this.versionList[0] : {};
  }

  getNextTypeId(): any {
    const lastIndex = this.formatData.length - 1;
    const latestTypeId = this.formatData[lastIndex].typeId;
    return latestTypeId ? Number(latestTypeId) + 1 : 0;
  }

  showDetail(typeId, item) {
    const params: { typeId: number; version: string } = {
      typeId,
      version: this.selectedVersion.value,
    };
    this.$router.push({
      name: 'formatDetail',
      params: { id: encodeURIComponent(typeId) },
      query: { v: encodeURIComponent(this.selectedVersion.value) },
    });
  }

  getLabelColor = value => {
    return labelColors[value];
  };

  handleVersionClick(item) {
    if (this.selectedVersion.value !== item.value) {
      this.selectedVersion = item;
      localStorage.setItem('selectedVersion', JSON.stringify(this.selectedVersion));
      this.fetchFormatData();
      // this.init();
    }
  }

  handleOSClick(item) {
    if (this.selectedOS.value !== item.value) {
      this.selectedOS = item;
      // TODO: chnage os
      this.fetchFormatData();
    }
  }

  createNewApply() {
    this.$router.push({ name: 'crateApplyForm' });
  }

  // eslint-disable-next-line class-methods-use-this
  customFilter(items: any[], search: string) {
    return items.filter(
      format =>
        JSON.stringify(format)
          .toLowerCase()
          .indexOf(search.toLowerCase()) !== -1
    );
  }

  toggleDraftBanner() {
    this.openDraftBanner = !this.openDraftBanner;
    this.toggleDraftBannerIcon = this.openDraftBanner ? 'mdi-pin' : 'mdi-pin-off';
  }

  handleAddActionSave(logInfo, keyInfo) {
    const formatList = getItemJson(localStorage, FORMAT_LIST, {});
    formatList[this.service.value][this.selectedVersion.value].push(logInfo);

    localStorage.setItem(FORMAT_LIST, JSON.stringify(formatList));

    // this.formatData = this.fetchFormatData();

    this.addActionDialog = false;

    this.fetchFormatData();

    this.snack = {
      snackText: 'Actionを追加しました',
      settings: {
        right: true,
        // top: true,
        color: 'primary',
        timeout: 5000,
      },
      options: {},
    };
    this.openSnack = true;
  }

  download(item) {
    if (this.platformList.indexOf(item) === -1) {
      this.snack = {
        snackText: 'No Such Platform.',
        settings: {
          // top: true,
          color: 'error',
          timeout: 5000,
        },
        options: {},
      };
      this.openSnack = true;
    } else {
      const file = 'codesnippet.zip';
      const xhr = new XMLHttpRequest();
      xhr.open('GET', jarFilePath);
      xhr.responseType = 'arraybuffer';

      xhr.onload = function() {
        if (this.status === 200) {
          const blob = new Blob([xhr.response], { type: 'application/octet-stream' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = file;
          link.click();
        }
      };
      xhr.send();
    }
  }

  getFileName = item => {
    const fileName = 'SampleAction';
    let extension = '.java';

    switch (item) {
      case 'Android':
        extension = '.java';
        break;
      case 'iOS':
        extension = '.swift';
        break;
      case 'Linux':
        extension = '.cpp';
        break;
      default:
        extension = '.jar';
    }
    return fileName + extension;
  };

  // eslint-disable-next-line class-methods-use-this
  log(message: any) {
    console.log(message);
  }

  // eslint-disable-next-line class-methods-use-this
  debug(message) {
    alert(message);
  }
}
</script>

<style lang="scss">
.filter-menu {
}

.create-format {
  &__dialog {
    .v-dialog {
      width: unset;
    }
  }
}
.format-search-input {
  max-width: 280px;
}

.format-search-input .v-input__icon--prepend-inner .v-icon {
  // color: purple;
  font-size: 20px;
}

.service-id-switcher-button {
  border: 1px solid #dadce0;
  // text-transform: none;
  font-weight: normal;
  padding-right: 2px;
}
</style>

<style lang="scss" scoped>
.add-filer {
  &__chip {
    &--dashed {
      background: transparent !important;
      border: 1px dashed currentColor !important;
      color: #999;
    }
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

::v-deep .add-action-dialog {
  max-height: 95%;
}

::v-deep .add-action {
  &__form {
    // max-width: 800px;
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
.banner {
  &--draft {
    background: var(--v-warning-base);
    color: #fff;
  }
}
::v-deep .chip {
  &--clickable {
    .v-chip__content {
      cursor: pointer;
    }
  }
  &--clickable:hover {
    background: #ccc;
  }
}
</style>
