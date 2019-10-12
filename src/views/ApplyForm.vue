<template>
  <v-container fluid class="pa-6">
    <v-row>
      <!-- <v-col lg="12"> -->
      <v-col class="text-center" v-if="loading">
        <v-progress-circular :width="3" color="primary" indeterminate></v-progress-circular>
      </v-col>
      <template v-else>
        <v-col cols="12" class="pt-0">
          <span style="white-space: pre-line;" class="body-2">{{
            $t('apply.form.description', { version: applyStatus.version.text })
          }}</span>
        </v-col>
        <!-- <v-divider class="mx-0 mb-2"></v-divider> -->
        <v-form class="apply-form">
          <!-- <template v-if="!applyStatus.title || isEditTitle"> -->
          <!-- <v-row> -->
          <v-col cols="5">
            <v-select
              v-model="applyStatus.version"
              dense
              outlined
              label="申請するVersionを選択"
              :items="versionList"
              @click="item => (applyStatus.version = item)"
            >
            </v-select>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="applyStatus.title"
              dense
              outlined
              label="タイトルを入力 *"
              :rules="[v => !!v || 'タイトルを入力してください']"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <!-- <v-select
                  v-model="selectedApproverList"
                  dense
                  :items="approverList"
                  multiple
                  small-chips
                  deletable-chips
                  :rules="[v => !!(v.length > 0) || '一人以上の承認者を選択してください!!']"
                  class="form__input-select"
                  style="width: 600px;"
                  return-object
                ></v-select> -->
            <v-select
              v-model="selectedApproverList"
              dense
              outlined
              label="承認者を選択"
              :items="approverList"
              multiple
              small-chips
              deletable-chips
              return-object
            ></v-select>
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="applyStatus.description"
              dense
              outlined
              label="コメント *"
              :placeholder="$t('apply.form.placeholder.comment')"
              :rules="[this.rules.required]"
              rows="3"
            >
            </v-textarea>
          </v-col>
        </v-form>
        <!-- <v-btn small @click="createApplyRequest(true)" class="ml-0">保存</v-btn> -->
        <v-col class="mb-2" cols="12">
          <v-btn small color="primary" :disabled="!validate()" @click="createApplyRequest"
            >申請</v-btn
          >
          <v-btn text small @click="pageBack" class="ml-3">キャンセル</v-btn>
        </v-col>
        <!-- </v-row> -->
        <v-col cols="auto">
          <span class="title">Format changed</span>

          <v-data-table
            dense
            class="application-contents-table"
            :headers="tableHeaders"
            :items="formatData"
            :rows-per-page-items="rowsPerPageItems"
            :pagination.sync="pagination"
            item-key="typeId"
          >
            <template v-slot:top>
              <v-divider class="mx-0 my-2"></v-divider>

              <v-divider></v-divider>
            </template>
            <template v-slot:headerCell="props">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <span v-on="on">{{ props.header.text }}</span>
                </template>
                <template v-if="props.header.options">
                  <span>{{ props.header.options.tooltip }}</span>
                </template>
                <template v-else>
                  <span>{{ props.header.text }}</span>
                </template>
              </v-tooltip>
            </template>

            <template v-slot:items="props">
              <tr
                @click="showEditComment($event, props.item.typeId)"
                :class="
                  `application-contents-table${
                    props.item.isNew ? '--new-action' : props.item.isUpdate ? '--update-action' : ''
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
                        class="chip--x-small white--text ma-0"
                        >New</v-chip
                      >
                      <v-chip
                        v-else-if="props.item.isUpdate"
                        label
                        color="green"
                        class="chip--x-small white--text ma-0"
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

          <v-divider class="mb-4"></v-divider>
        </v-col>
        <!-- </v-form> -->
      </template>
      <!-- </v-col> -->

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
            <span class="subtitle-1">コメントの編集</span>
            <v-spacer></v-spacer>
            <v-btn icon @click="editInlineCommentMenu = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-card-text>TypeId: {{ editedTypeId }} のコメント </v-card-text>

          <v-container>
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
                  rows="3"
                  scroll
                  hide-details
                  label="Edit"
                  autofocus
                  class="form__input-textarea"
                ></v-textarea>
                <v-card-actions class="px-0">
                  <v-btn small @click="editInlineCommentMenu = false">閉じる</v-btn>
                  <v-btn small color="primary" @click="addInlineComment(editedTypeId)">追加</v-btn>
                </v-card-actions>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-menu>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapActions, mapGetters } from 'vuex';
import { Component, Prop } from 'vue-property-decorator';
import { APPROVAL_STATUS } from '@/store/applyModule';
import ApplyComment from '@/components/ApplyComment.vue';
import { getItemJson } from '@/util/storageUtils';
import ButtonDropdown from '@/components/ButtonDropdown.vue';
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

@Component({
  name: 'ApplyForm',
  components: { ApplyComment, ButtonDropdown },
})
export default class ApplyForm extends Vue {
  loading = false;

  expandMessage = '申請内容';

  rowsPerPageItems = [10, 20, 50, 100, 1000, { text: 'All', value: -1 }];

  pagination = {
    rowsPerPage: 100,
  };

  approvalStatus = APPROVAL_STATUS;

  approveComment: string = '';

  isTableExpand: boolean = false;

  panel: boolean[] = [true];

  selected = { userName: 'Hara, Keiko' };

  approverList = [
    { text: 'Hara, Keiko', value: 'Hara, Keiko', avatar: '' },
    { text: 'Tanaka, Chiaki', value: 'Tanaka, Chiaki', avatar: '' },
  ];

  selectedApproverList = [];

  rules = {
    required: value => !!value || 'Required',
  };

  handlingItem: any = {};

  tableHeaders: any[] = [
    { text: 'TypeID', value: 'typeId', align: 'left', width: '80px' },
    { text: '', value: 'state', align: 'left', width: '80px' },
    { text: 'Name', value: 'name', align: 'left' },
    { text: 'Description', value: 'description', sortable: false, minWidth: '300px' },
    { text: '', value: 'inlineComment' },
  ];

  itemId;

  service;

  username;

  applyStatus: any = {};

  formatData;

  applyComment: string = '';

  applyCommentThreadList: { [typeId: number]: { threadId: number }[] } = {};

  editInlineCommentMenuList = {};

  inlineCommentList = {};

  inlineCommentThreadList: { [typeId: number]: { threadId: number }[] } = {};

  user;

  versionList = [];

  async created() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.username = this.user.username;
    this.service = JSON.parse(sessionStorage.getItem('defaultService'));

    if (!this.service) {
      this.$router.push({ name: 'format' });
    } else {
      this.loading = true;

      const versionList = await this.fetchData();
      this.versionList = versionList.filter(version => version.draft);
      this.itemId = this.$route.params.id;

      if (this.itemId) {
        this.applyStatus = this.getAapplyStatus();
        if (!this.applyStatus) {
          // idが指定されて申請アイテムがない場合は不正
          this.pageBack();
          this.loading = false;
          return;
        }
      } else {
        this.applyStatus = {
          ...this.applyStatus,
          version: this.versionList[0],
          approver: this.approverList[0],
        };
      }

      this.formatData = await this.$store.dispatch('format/get', {
        serviceId: this.service.value,
        version: this.applyStatus.version.value,
      });
      this.loading = false;
    }
  }

  fetchData() {
    // this.applyStatus = {};
    // this.formatData = this.getFormatData();
    this.formatData = [];
    // this.inlineCommentThreadList = this.getInlineCommentList();
    return this.$store.dispatch('format/getVersionList', { serviceId: this.service.value });
  }

  /**
   * 申請内容を取得する
   */
  getAapplyStatus() {
    const applyStatusList = JSON.parse(localStorage.getItem('applyStatusList'));
    return applyStatusList
      ? applyStatusList[this.service.value].find(item => item.itemId === this.itemId)
      : undefined;
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

  editInlineCommentMenuPosition = {
    positionX: 0,
    positionY: 0,
    // absolute: true,
    // top:true
  };

  editInlineCommentMenu = false;

  editedTypeId = '';

  showEditComment(e, typeId) {
    e.preventDefault();
    if (!this.editInlineCommentMenu) {
      this.editedTypeId = typeId;
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

  addInlineComment(typeId) {
    const comment = this.inlineCommentList[typeId];
    const threadId = this.getNextInlineCommentThreadId(typeId);
    const { avatar } = this.user;
    const thread = {
      threadId,
      typeId,
      datetime: new Date().toLocaleString(),
      content: this.inlineCommentList[typeId],
      commenter: this.username,
      avatar,
      category: 'comment',
    };

    // const applyThreadList = { [this.service.value]: { [this.itemId]: { [typeId]: [thread] } } };
    let threadList = this.inlineCommentThreadList[typeId];
    if (threadList) {
      threadList.unshift(thread);
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

  getNextInlineCommentThreadId(typeId) {
    const applyThread = this.inlineCommentThreadList[typeId];

    const threadId = applyThread ? applyThread.length + 1 : 1;
    return threadId;
  }

  pageBack() {
    this.$router.push({ name: 'apply' });
  }

  validate() {
    return this.applyStatus.title && this.applyStatus.version && this.applyStatus.approver;
  }

  createApplyRequest(draft = false) {
    const version: any = this.applyStatus.version.text;
    const date: string = new Date().toLocaleString();
    const applyStatus = {
      // itemId: this.$store.getters['apply/getItemId'],
      // itemId: getApplyId(),
      date,
      title: this.applyStatus.title,
      comment: this.applyStatus.description,
      description: this.applyStatus.description,
      version,
      applicant: this.username,
      // approver: this.applyStatus.approver.text,
      approver: this.selectedApproverList,
      approvalStatus: APPROVAL_STATUS.APPLYING,
      action: 0,
      updatedAt: date,
      // draft,
    };

    this.$store
      .dispatch('apply/create', { serviceId: this.service.value, contents: applyStatus })
      .then(applyId => {
        const notification = {
          id: this.getLastItemId + 1,
          type: 'apply',
          message: `Version: ${version} の申請があります。`,
          link: { name: 'applyDetail', params: { id: encodeURIComponent(applyId) } },
        };

        this.addNotification(notification);
      });

    // const notification = {
    //   id: this.getLastItemId + 1,
    //   type: 'apply',
    //   message: `Version: ${version.text} が追加されました`,
    //   link: { name: 'apply' },
    // };

    // this.addNotification(notification);

    // let applyStatusList = getItemJson(localStorage, 'applyStatusList', {});

    // if (applyStatusList[this.service.value]) {
    //   applyStatusList[this.service.value].push(applyStatus);
    // } else {
    //   applyStatusList = { [this.service.value]: [applyStatus] };
    // }

    // localStorage.setItem('applyStatusList', JSON.stringify(applyStatusList));

    this.$router.push({ name: 'apply' });
  }

  // eslint-disable-next-line class-methods-use-this
  close() {
    console.log('Dialog closed');
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
  @include table;
  &--new-action {
    background-color: #b9f6ca;
  }
  &--update-action {
    background-color: #ffd180;
  }
}

::v-deep .apply-form {
  width: 600px;
  .v-textarea {
    @include input-textarea;
  }
}

.menu {
  left: auto;
  right: 0px;
}
</style>
