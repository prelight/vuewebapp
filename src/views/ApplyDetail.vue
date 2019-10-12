<template>
  <v-container fluid>
    <template v-if="loading">
      <v-row class="px-2">
        <v-col lg="12">
          <div class="text-center">
            <v-progress-circular :width="3" color="primary" indeterminate></v-progress-circular>
          </div>
        </v-col>
      </v-row>
    </template>
    <template v-else>
      <v-row>
        <v-col cols="6">
          <v-form>
            <v-text-field
              v-model="applyStatus.title"
              :readonly="!isEditTitle"
              :flat="!isEditTitle"
              solo
              autofocus
              :loading="loading"
              hide-details
              placeholder="タイトルを入力してください"
              class="title mb-2 pa-0 ml-0"
            ></v-text-field>
          </v-form>
        </v-col>
        <v-col cols="6" class="mt-1">
          <template v-if="isEditTitle">
            <v-btn small text color="primary" @click="isEditTitle = false">{{
              $t('button.cancel')
            }}</v-btn>
            <v-btn small color="primary" class="ml-2" @click="isEditTitle = false">{{
              $t('button.save')
            }}</v-btn>
          </template>
          <template v-else>
            <v-btn flat icon class="ma-0" @click.stop="isEditTitle = true"
              ><v-icon size="18">mdi-pencil</v-icon></v-btn
            >
          </template>
        </v-col>
      </v-row>
      <v-row class="px-2">
        <v-col cols="8" md="8">
          <v-tabs v-model="active" height="38">
            <v-tab ripple style="text-transform: none !important;">
              <v-icon small class="mr-2">mdi-comment-multiple-outline</v-icon>
              <span class="caption">Conversation</span>
            </v-tab>
            <v-tab-item :transition="false" :reverse-transition="false">
              <!-- <v-layout row wrap justify-center> -->
              <v-row>
                <v-col class="mr-2">
                  <v-timeline dense align-top class="timeline--none ml-2 mt-2">
                    <v-timeline-item small class="mb-0">
                      <template v-slot:icon>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-avatar size="36">
                              <img
                                src="https://image.flaticon.com/icons/svg/145/145843.svg"
                                alt="demo"
                              />
                            </v-avatar>
                          </template>
                          <span>{{ applyStatus.applicant }}</span>
                        </v-tooltip>
                      </template>
                      <v-card color="#f5f5f5" class="elevation-1 mb-4" style="border-color: #f5f5f">
                        <v-card-title class="py-2">
                          <!-- <span class="mr-2">{{ applyStatus.applicant }}</span> -->
                          <span class="caption">{{ applyStatus.date }}</span>
                          <v-spacer></v-spacer>
                          <v-btn
                            :disabled="isEditComment"
                            :loading="loading"
                            icon
                            class="ma-0"
                            @click.stop="isEditComment = true"
                            ><v-icon size="18">mdi-pencil</v-icon></v-btn
                          >
                        </v-card-title>
                        <v-card-text class="white text--primary py-2">
                          <template v-if="isEditComment">
                            <v-textarea
                              v-model="editedDescription"
                              dense
                              outlined
                              single-line
                              label="コメント"
                              :placeholder="$t('apply.form.placeholder.comment')"
                              :rules="[this.rules.required]"
                              counter="2000"
                              rows="3"
                            >
                            </v-textarea>
                          </template>
                          <template v-else>
                            <span style="white-space: pre-line;">{{
                              applyStatus.description
                            }}</span>
                          </template>
                        </v-card-text>
                        <v-card-actions v-if="isEditComment" class="white">
                          <v-spacer></v-spacer>
                          <v-btn small color="primary" @click="saveEditedDescription">保存</v-btn
                          ><v-btn small flat @click="cancelEditDescription">キャンセル</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-timeline-item>
                  </v-timeline>

                  <template v-if="Object.keys(inlineCommentThreadList).length > 0">
                    <template v-for="(thread, typeId) in inlineCommentThreadList">
                      <!-- <v-card :key="typeId" flat color="#f5f5f5" class="mt-0">
                      <v-card-title class="py-1">{{ typeId }}: {{ thread[0].name }}</v-card-title>
                      <v-card-text class="white text--primary py-1"> -->
                      <div :key="typeId">
                        <span class="body-2">{{ thread[0].commenter }}さんがコメントしました</span>
                        <span class="caption font-italic ml-2"
                          >{{ typeId }}:{{ thread[0].name }}</span
                        >
                        <ApplyComment :threadList="thread" itemId="1"></ApplyComment>
                      </div>
                      <!-- </v-card-text>
                    </v-card> -->
                    </template>
                  </template>
                  <template v-else>
                    <p class="caption">{{ $t('apply.messages.no_comment') }}</p>
                  </template>

                  <v-divider></v-divider>

                  <v-timeline dense align-top class="timeline--none ml-2">
                    <v-timeline-item small class="mb-0">
                      <template v-slot:icon>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-avatar size="36">
                              <img :src="user.avatar" :alt="user.username" />
                            </v-avatar>
                          </template>
                          <span>{{ applyStatus.applicant }}</span>
                        </v-tooltip>
                      </template>
                      <v-card class="elevation-1" style="border-color: #f5f5f">
                        <v-card-text class="white text--primary py-2">
                          <v-textarea
                            v-model="newComment"
                            dense
                            outlined
                            label="コメント"
                            :placeholder="leaveCommentPlaceholder"
                            hide-details
                            rows="3"
                          >
                          </v-textarea>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-tooltip top>
                            <template v-slot:activator="{ on }">
                              <v-btn
                                v-on="on"
                                v-if="!isFinalState()"
                                :disabled="!newComment"
                                small
                                flat
                                color="red"
                                class="white--text mr-2"
                                @click="cancelApply"
                                ><v-icon small class="mr-2">mdi-close-circle-outline</v-icon
                                >取り消す</v-btn
                              >
                            </template>
                            <span>この申請を取り消します</span>
                          </v-tooltip>
                          <v-btn
                            v-if="isCancelState()"
                            :disabled="!newComment"
                            small
                            color="primary"
                            @click="reopenApply(newComment)"
                            class="mr-2"
                            >再申請</v-btn
                          >
                          <v-btn
                            :disabled="!newComment"
                            small
                            color="primary"
                            @click="addComment(newComment)"
                            class="mr-2"
                            >コメント</v-btn
                          >
                        </v-card-actions>
                      </v-card>
                    </v-timeline-item>
                  </v-timeline>
                  <v-divider class="mb-2"></v-divider>
                  <v-btn small @click="pageBack">戻る</v-btn>
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab ripple style="text-transform: none ">
              <v-icon small class="mr-2">mdi-plus-minus</v-icon>
              <span class="caption">Format changed</span>
            </v-tab>
            <v-tab-item :transition="false" :reverse-transition="false">
              <!-- <v-divider class="mt-1"></v-divider> -->

              <v-data-table
                dense
                class="application-contents-table"
                :headers="tableHeaders"
                :items="formatData"
                expand
                :footer-props="footerProps"
                :items-per-page="itemsPerPage"
                :pagination.sync="pagination"
                item-key="typeId"
              >
                <template v-slot:top>
                  <v-divider></v-divider>
                  <v-toolbar dense flat class="toolbar--no-padding mx-2">
                    <v-menu
                      full-width
                      transition="none"
                      :close-on-content-click="false"
                      offset-y
                      content-class="menu--no-transition"
                    >
                      <template v-slot:activator="{ on }">
                        <v-chip v-ripple v-on="on" small class="filter__chip--dashed">
                          <v-icon class="mr-2">mdi-filter-variant</v-icon>
                          <span>フィルタ</span>
                        </v-chip>
                      </template>

                      <v-card>
                        <v-list dense>
                          <v-subheader>フィルタ項目</v-subheader>
                          <v-divider></v-divider>
                          <v-menu
                            offset-x
                            :close-on-content-click="true"
                            content-class="menu--no-transition"
                          >
                            <template v-slot:activator="{ on }">
                              <v-list-item class="mb-0" v-on="on">
                                <v-list-item-title>State</v-list-item-title>
                                <v-list-item-action class="justify-end">
                                  <v-icon>chevron_right</v-icon>
                                </v-list-item-action>
                              </v-list-item>
                            </template>

                            <v-list dense>
                              <div class="filter__picker">
                                <v-list-item
                                  v-for="(state, i) in filterList"
                                  :key="i"
                                  :disabled="selectedFilterList[i]"
                                  @click="selectedFilterList.push(state)"
                                >
                                  <v-list-item-content>
                                    <v-list-item-title>{{ state.text }}</v-list-item-title>
                                  </v-list-item-content>
                                </v-list-item>
                              </div>
                            </v-list>
                          </v-menu>
                        </v-list>
                      </v-card>
                    </v-menu>
                    <template v-for="(filter, i) in selectedFilterList">
                      <v-chip
                        :key="i"
                        v-ripple
                        small
                        close
                        @click:close="
                          selectedFilterList.splice(selectedFilterList.indexOf(filter), 1)
                        "
                        class="ml-2"
                        >{{ filter.text }}</v-chip
                      >
                    </template>
                  </v-toolbar>
                  <v-divider></v-divider>
                </template>
                <template v-slot:item="props">
                  <tr
                    @click="showEditComment($event, props.item.typeId, props.item)"
                    :class="
                      `application-contents-table${
                        props.item.isNew
                          ? '--new-action'
                          : props.item.isUpdate
                          ? '--update-action'
                          : ''
                      }`
                    "
                  >
                    <template v-for="(header, i) in tableHeaders">
                      <td :key="i">
                        <template v-if="header.value === 'state'">
                          <v-chip
                            v-if="props.item.isNew"
                            x-small
                            label
                            color="red"
                            class="white--text ma-0"
                            >New</v-chip
                          >
                          <v-chip
                            v-else-if="props.item.isUpdate"
                            x-small
                            label
                            color="green"
                            class="white--text ma-0"
                            >Update</v-chip
                          >
                        </template>
                        <template v-else-if="header.value === 'inlineComment'">
                          <v-icon
                            size="18"
                            :color="inlineCommentThreadList[props.item.typeId] && 'primary'"
                          >
                            {{
                              inlineCommentThreadList[props.item.typeId]
                                ? 'mdi-comment-plus'
                                : 'mdi-comment-plus-outline'
                            }}
                          </v-icon>
                        </template>
                        <template v-else-if="header.value === 'label'">
                          <template v-for="(label, index) in props.item[header.value]">
                            <v-chip
                              v-ripple
                              label
                              small
                              :key="index"
                              @click="showDetail(i, props.item)"
                            >
                              {{ label }}
                            </v-chip>
                          </template>
                        </template>

                        <template v-else-if="header.value == 'typeId'">
                          <a @click.stop="showDetail(props.item[header.value], props.item)">{{
                            props.item[header.value]
                          }}</a>
                        </template>
                        <template v-else>{{ props.item[header.value] }}</template>
                      </td>
                    </template>
                  </tr>
                </template>
              </v-data-table>

              <v-divider class="mb-5"></v-divider>

              <!-- <v-layout row wrap> -->
              <v-col cols="12">
                <v-textarea
                  v-model="newReviewComment"
                  dense
                  outlined
                  label="コメント"
                  :placeholder="leaveCommentPlaceholder"
                  :rules="[this.rules.required]"
                  hide-details
                  rows="3"
                >
                </v-textarea>
              </v-col>
              <v-col>
                <v-radio-group v-model="confirmState" class="form__checkbox">
                  <v-radio color="primary" value="comment" label="Comment"></v-radio>
                  <v-radio
                    v-if="!isFinalState() && username === 'admin'"
                    color="primary"
                    value="approve"
                    label="Approve"
                  ></v-radio>
                  <v-radio
                    v-if="!isFinalState() && username === 'admin'"
                    color="primary"
                    value="reject"
                    label="Reject"
                  ></v-radio>
                </v-radio-group>
              </v-col>
              <v-card-actions class="px-0">
                <v-btn :disabled="!confirmState" small color="primary" class="mr-2" @click="submit"
                  >Submit</v-btn
                >
                <v-btn small @click="pageBack">戻る</v-btn>
              </v-card-actions>
              <!-- </v-layout> -->
            </v-tab-item>
          </v-tabs>
        </v-col>

        <v-col cols="4" md="4">
          <span class="caption">承認者</span>
          <!-- <v-row> -->
          <div class="my-2">
            <template v-if="selectedApproverList.length === 0">
              <div class="body-2">承認者が選択されていません。</div>
            </template>
            <template v-for="(approver, i) in selectedApproverList">
              <div :key="i">
                <v-chip
                  v-ripple
                  small
                  close
                  @click:close="
                    selectedApproverList.splice(selectedApproverList.indexOf(approver), 1)
                  "
                  class="mb-1"
                  >{{ approver.text }}</v-chip
                >
              </div>
            </template>
          </div>

          <!-- </v-row> -->
          <v-menu
            :close-on-content-click="false"
            offset-y
            content-class="menu--no-transition"
            full-width
          >
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" small text color="primary" class="toolbar__button-base pl-1"
                ><v-icon>mdi-plus</v-icon><span class="">承認者を追加</span></v-btn
              >
            </template>

            <v-list dense>
              <v-list-item :key="i" v-for="(approver, i) in approverList">
                <v-checkbox
                  v-model="selectedApproverList"
                  :label="approver.text"
                  :value="approver"
                  hide-details
                  return-object
                  :ripple="false"
                  color="primary"
                  class="filter__picker"
                >
                </v-checkbox>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-divider class="mt-1"></v-divider>
        </v-col>
      </v-row>

      <!-- </template> -->
      <!-- </v-form> -->
    </template>

    <v-menu
      v-model="editInlineCommentMenu"
      v-bind="editInlineCommentMenuPosition"
      :close-on-click="false"
      :close-on-content-click="false"
      z-index="20"
      right
    >
      <v-card>
        <v-card-title class="py-2">
          <span class="subtitle-1">{{ editedTypeId }} のコメント</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="editInlineCommentMenu = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-row>
            <v-col lg="12" style="max-height:450px; overflow-y:auto" class="mb-3">
              <ApplyComment
                :threadList="editInlineCommentMenu ? inlineCommentThreadList[editedTypeId] : []"
                itemId="1"
              ></ApplyComment>
            </v-col>
            <v-col lg="12">
              <span class="caption">コメント</span>
              <v-textarea
                v-model="inlineCommentList[editedTypeId]"
                dense
                outlined
                single-line
                rows="3"
                scroll
                hide-details
                autofocus
                class="form__input-textarea mb-2"
              ></v-textarea>
              <v-card-actions class="px-0">
                <v-btn small @click="editInlineCommentMenu = false">{{ $t('button.close') }}</v-btn>
                <v-btn
                  small
                  color="primary"
                  @click="addInlineComment(editedTypeId, editedItem.name)"
                  >{{ $t('button.add') }}</v-btn
                >
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-menu>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapActions, mapGetters } from 'vuex';
import { Component, Prop } from 'vue-property-decorator';
import { APPROVAL_STATUS } from '@/store/applyModule';
import ApplyComment from '@/components/ApplyComment.vue';
import { getItemJson } from '@/util/storageUtils';
import { FORMAT_LIST } from '@/api';

const saveThread = (serviceId, applyId, typeId, thread) => {
  let applyThreadList = getItemJson(localStorage, 'applyThreadList', null);

  if (applyThreadList) {
    const allApplyList = applyThreadList[serviceId];

    if (!allApplyList) {
      applyThreadList[serviceId] = { [applyId]: { [typeId]: [thread] } };
    } else {
      const applyList = allApplyList[applyId];
      if (!allApplyList[applyId]) {
        allApplyList[applyId] = { [typeId]: [thread] };
      } else if (applyList[typeId]) {
        applyList[typeId].push(thread);
      } else {
        applyList[typeId] = [thread];
      }
    }
  } else {
    applyThreadList = {
      [serviceId]: { [applyId]: { [typeId]: [thread] } },
    };
  }

  localStorage.setItem('applyThreadList', JSON.stringify(applyThreadList));
};

const changeStatus = (serviceId, applyId, version, comment, approver, applicant, nextStatus) => {
  if (nextStatus) {
    const applicationList = getItemJson(localStorage, 'applyStatusList', {});
    const applyStatus = applicationList[serviceId].find(status => status.itemId === applyId);
    applyStatus.draft = false;
    applyStatus.comment = comment;
    applyStatus.approvalStatus = nextStatus;
    applyStatus.approver = approver;
    applyStatus.applicant = applicant;
    localStorage.setItem('applyStatusList', JSON.stringify(applicationList));
  }
};

const saveDraft = (serviceId, applyId) => {
  const applicationList = getItemJson(localStorage, 'applyStatusList', {});
  applicationList[serviceId].find(applyStatus => applyStatus.itemId === applyId).draft = true;
  localStorage.setItem('applyStatusList', JSON.stringify(applicationList));
};

const submit = ({
  serviceId,
  itemId: applyId,
  version,
  comment,
  approver,
  applicant,
  approvalStatus: nextStatus,
}) => {
  changeStatus(serviceId, applyId, version, comment, approver, applicant, nextStatus);
  if (nextStatus === 'approved') {
    const formatVersionList = getItemJson(localStorage, 'versionList', {});
    const index = formatVersionList[serviceId].findIndex(
      formatVersion => formatVersion.value === version
    );
    const newFormatVersion = formatVersionList[serviceId][index];
    newFormatVersion.draft = false;
    newFormatVersion.createdTimestamp = Date.now();
    formatVersionList[serviceId].splice(index, 1, newFormatVersion);

    localStorage.setItem('versionList', JSON.stringify(formatVersionList));
  }
};

const confirmTypeToNextStateMap = {
  approve: APPROVAL_STATUS.APPROVED,
  reject: APPROVAL_STATUS.REJECTED,
};

const getNextState = curretnState => {
  return confirmTypeToNextStateMap[curretnState];
};

const FINAL_STATE_LIST = [
  APPROVAL_STATUS.APPROVED,
  // APPROVAL_STATUS.REJECTED,
  APPROVAL_STATUS.CLOSED,
  APPROVAL_STATUS.CANCELED,
];

const isFinalState = state => {
  return FINAL_STATE_LIST.includes(state);
};

const cancel = (serviceId, applyId, version, comment, approver, applicant, nextStatus) => {
  changeStatus(serviceId, applyId, version, comment, approver, applicant, nextStatus);
};

const createUUID = () => {
  const chars = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.split('');
  for (let i = 0, len = chars.length; i < len; i++) {
    switch (chars[i]) {
      case 'x':
        chars[i] = Math.floor(Math.random() * 16).toString(16);
        break;
      case 'y':
        chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16);
        break;
      default:
        break;
    }
  }
  return chars.join('');
};

@Component({
  name: 'ApplyForm',
  components: { ApplyComment },
  methods: {
    ...mapActions('notification', {
      clearNotification: 'clear',
      success: 'success',
    }),
  },
})
export default class ApplyForm extends Vue {
  loading = true;

  itemsPerPage = 100;

  footerProps = {
    itemsPerPageOptions: [10, 20, 50, 100, { text: 'All', value: -1 }],
    options: {
      itemsPerPage: this.itemsPerPage,
    },
  };

  pagination = {
    rowsPerPage: 100,
  };

  approvalStatus = APPROVAL_STATUS;

  approveComment: string = '';

  isTableExpand: boolean = false;

  panel: boolean[] = [true];

  placeholder: string = 'Please write the details of this change.';

  leaveCommentPlaceholder = 'Leave a comment';

  selected = { userName: 'Hara, Keiko' };

  items = [{ userName: 'Hara, Keiko' }, { userName: 'Tanaka, Chiaki' }];

  rules = {
    required: value => !!value || 'Required',
  };

  flowItems = [
    {
      text: 'Apply Status',
      disabled: false,
      pathName: 'apply',
      naviFlag: false,
    },
    {
      text: 'Enter Apply Form',
      disabled: true,
      pathName: 'applyForm',
      naviFlag: true,
    },
    {
      text: 'Confirm Application',
      disabled: true,
      pathName: 'applyConfirm',
      naviFlag: false,
    },
  ];

  handlingItem: any = {};

  tableHeaders: any[] = [
    { text: 'TypeID', value: 'typeId', align: 'left', width: '80px' },
    { text: '', value: 'state', align: 'left', width: '80px' },
    { text: 'Name', value: 'name', align: 'left' },
    { text: 'Description', value: 'description', sortable: false, minWidth: '300px' },
    { text: '', value: 'inlineComment' },
  ];

  filterList = ['update', 'new'].map(state => ({
    text: state.charAt(0).toUpperCase() + state.slice(1),
    value: state,
  }));

  approverList = [
    { text: 'Hara, Keiko', value: 'Hara, Keiko', avatar: '' },
    { text: 'Tanaka, Chiaki', value: 'Tanaka, Chiaki', avatar: '' },
  ];

  selectedApproverList = [];

  selectedFilterList = [];

  itemId;

  service;

  username;

  status = '';

  applyStatus;

  formatData;

  newComment = '';

  newReviewComment = '';

  applyComment: string = '';

  applyCommentThreadList: { [typeId: number]: { threadId: number }[] } = {};

  isEditTitle = false;

  editedTitle = '';

  isEditComment = false;

  editedDescription = '';

  editInlineCommentMenuList = {};

  inlineCommentList = {};

  inlineCommentThreadList: { [typeId: number]: { threadId: number }[] } = {};

  confirmState = 'comment';

  user;

  created() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.username = this.user.username;
    this.service = JSON.parse(sessionStorage.getItem('defaultService'));

    if (!this.service) {
      this.$router.push({ name: 'format' });
    } else {
      this.itemId = this.params();
      this.fetchData();
      this.applyComment = this.applyStatus.comment;
      this.approveComment = this.applyStatus.approveComment;
      this.selectedApproverList = Array.from(this.applyStatus.approver);
      this.editedDescription = this.applyStatus.description;
    }
  }

  params() {
    return decodeURIComponent(this.$route.params.id);
  }

  fetchData() {
    setTimeout(() => {
      this.loading = false;
    }, 800);
    this.applyStatus = this.getAapplyStatus();
    this.formatData = this.getFormatData();
    // this.inlineCommentList = this.getInlineCommentList();
    this.inlineCommentThreadList = this.getInlineCommentList();
    // for (const format in this.formatData) {
    //   this.editInlineCommentMenuList.push(format.typeId);
    // }
  }

  /**
   * 申請内容を取得する
   */
  getAapplyStatus() {
    const applyStatusList = JSON.parse(localStorage.getItem('applyStatusList'));
    return applyStatusList
      ? applyStatusList[this.service.value].find(item => item.itemId === this.itemId)
      : {};
  }

  getFormatData() {
    this.loading = true;

    setTimeout(() => {
      this.loading = false;
    }, 800);

    const formatList = getItemJson(localStorage, FORMAT_LIST, [])[this.service.value];
    return formatList ? formatList[this.applyStatus.version] : [];
  }

  showDetail(typeId, item) {
    const routeData = this.$router.resolve({
      name: 'formatDetail',
      params: { id: encodeURIComponent(typeId) },
      query: { v: encodeURIComponent(this.applyStatus.version) },
    });
    window.open(routeData.href, '_blank');
  }

  max25chars(v) {
    return (v && v.length <= 25) || 'Input too long!';
  }

  saveEditedDescription() {
    this.applyStatus.description = this.editedDescription;
    this.updateApplyStatus();
    this.isEditComment = false;
  }

  cancelEditDescription() {
    this.editedDescription = this.applyStatus.description;
    this.isEditComment = false;
  }

  editInlineCommentMenuPosition = {
    positionX: 0,
    positionY: 0,
    // absolute: true,
    // top:true
  };

  editInlineCommentMenu = false;

  editedTypeId = '';

  editedItem = {};

  showEditComment(e, typeId, item) {
    e.preventDefault();
    if (!this.editInlineCommentMenu) {
      this.editedTypeId = typeId;
      this.editedItem = item;
      this.editInlineCommentMenuPosition.positionX = e.clientX;
      this.editInlineCommentMenuPosition.positionY = e.clientY;
      this.$nextTick(() => {
        this.editInlineCommentMenu = true;
      });
    }
  }

  getInlineCommentList() {
    const allApplyThreadList =
      getItemJson(localStorage, 'applyThreadList', {})[this.service.value] || {};

    const inlineCommentThreadList = allApplyThreadList[this.itemId]
      ? allApplyThreadList[this.itemId]
      : [];
    return inlineCommentThreadList;
  }

  addInlineComment(typeId, name) {
    const comment = this.inlineCommentList[typeId];
    const threadId = this.getNextInlineCommentThreadId(typeId);
    const { avatar } = this.user;
    const thread = {
      threadId,
      typeId,
      name,
      datetime: new Date().toLocaleString(),
      content: this.inlineCommentList[typeId],
      commenter: this.username,
      avatar,
      category: 'comment',
    };

    // const applyThreadList = { [this.service.value]: { [this.itemId]: { [typeId]: [thread] } } };
    let threadList = this.inlineCommentThreadList[typeId];
    if (threadList) {
      // threadList.unshift(thread);
      threadList.push(thread);
    } else {
      threadList = [thread];
    }
    this.inlineCommentThreadList = Object.assign({}, this.inlineCommentThreadList, {
      [typeId]: threadList,
    });

    saveThread(this.service.value, this.itemId, typeId, thread);
    this.inlineCommentList[typeId] = '';
    // this.editInlineCommentMenuList[typeId] = false;
  }

  addComment(comment, commentType = 'comment') {
    const { avatar } = this.user;
    const commentId = createUUID();
    const formatComment = {
      threadId: 1,
      datetime: new Date().toLocaleString(),
      content: comment,
      commenter: this.username,
      avatar,
      category: 'comment',
      commentType,
    };

    saveThread(this.service.value, this.itemId, commentId, formatComment);
    this.newComment = '';

    this.inlineCommentThreadList = this.getInlineCommentList();
  }

  getNextInlineCommentThreadId(typeId) {
    const applyThread = this.inlineCommentThreadList[typeId];

    const threadId = applyThread ? applyThread.length + 1 : 1;
    return threadId;
  }

  commentHistory = false;

  showCommentHistory() {
    this.commentHistory = !this.commentHistory;
  }

  pageBack() {
    this.$router.push({ name: 'apply' });
  }

  saveApply() {
    // this.success('保存しました');
    saveDraft(this.service.value, this.itemId);
    this.$router.go(-1);
  }

  cancelApply() {
    if (this.newComment) {
      this.applyStatus.comment = this.newComment;
    }

    this.$store.dispatch('apply/cancel', {
      serviceId: this.service.value,
      applyId: this.itemId,
      contents: this.applyStatus,
    });
    this.$router.go(-1);
  }

  reopenApply(comment) {
    this.applyStatus.approvalStatus = APPROVAL_STATUS.APPLYING;
    this.applyStatus.comment = comment;
    this.updateApplyStatus();
    this.addComment(comment);
  }

  updateApplyStatus() {
    this.$store.dispatch('apply/update', {
      serviceId: this.service.value,
      applyId: this.itemId,
      contents: this.applyStatus,
    });
  }

  submit() {
    const submitContents = Object.assign({}, this.applyStatus);
    const nextStatus = getNextState(this.confirmState);

    submitContents.serviceId = this.service.value;
    submitContents.approvalStatus = nextStatus;
    submitContents.comment = this.newReviewComment;

    submit(submitContents);
    this.addComment(this.newReviewComment, this.confirmState);

    if (nextStatus) {
      const notification = {
        id: this.getLastItemId + 1,
        type: 'apply',
        message: `Version: ${this.applyStatus.version} の申請が${
          nextStatus === 'approved' ? '承認' : '却下'
        }されました`,
        link: { name: 'apply' },
      };

      this.addNotification(notification);
    }

    this.$router.go(-1);
  }

  isCancelState() {
    return this.applyStatus.approvalStatus === APPROVAL_STATUS.CANCELED;
  }

  isFinalState() {
    const state = this.applyStatus.approvalStatus;
    return isFinalState(state);
  }

  get getLastItemId() {
    return this.$store.getters['applyNotification/getLastItemId'];
  }

  addNotification(notification) {
    this.$store.commit('applyNotification/add', notification);
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_index.scss';

::v-deep .application-contents-table {
  @include table_border;
  &--new-action {
    background-color: #b9f6ca;
  }
  &--update-action {
    background-color: #ffd180;
  }
}

::v-deep .form {
  &__input-text {
    @include input-text;
  }

  &__input-textarea {
    @include input-textarea;
  }

  &__input-select {
    @include input-select;
    align-items: flex-start;
  }

  &__checkbox {
    @include radio;
  }
}

::v-deep .timeline--none.v-timeline:before {
  content: none;
}

::v-deep .filter {
  &__chip {
    &--dashed {
      background: transparent !important;
      border: 1px dashed currentColor !important;
      color: #999;
    }
  }
  &__picker {
    .v-icon {
      font-size: 20px;
    }
    .v-label {
      font-size: 14px;
    }
    .v-input--selection-controls__ripple {
      transform: scale(0.8);
      left: -14px;
    }
  }
}
</style>
