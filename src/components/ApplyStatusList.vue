<template>
  <!-- <ActionLogFormatTable
                      :loading="loading"
                      :headers="headers"
                      :format-list="items"
                      key-id="itemId"
                    >
                    </ActionLogFormatTable> -->
  <ApplyStatusTable
    :headers="headers"
    :format-list="items"
    :filter-list="filterItemList"
    :loading="loading"
    item-key="itemId"
    :simple="true"
  >
    <template v-slot:actions>
      <v-btn text small color="primary" class="mx-4" @click="createNewApply"
        ><v-icon>mdi-plus</v-icon>{{ $t('apply.messages.create_apply') }}</v-btn
      >
    </template>

    <template v-slot:table-content="{ props, headers }">
      <template v-for="(header, i) in headers">
        <td :key="i">
          <template v-if="header.value === 'itemId'">
            <a @click.stop="openDetail(props.item.itemId)" target="_blank">{{
              props.item[header.value]
            }}</a>
          </template>
          <template v-else-if="header.value === 'title'">
            <v-menu
              open-on-hover
              open-delay="200"
              close-delay="100"
              :close-on-content-click="false"
              top
              offset-x
            >
              <template v-slot:activator="{ on }">
                <a v-on="on" @click.stop="openDetail(props.item.itemId)" target="_blank">{{
                  props.item[header.value]
                }}</a>
              </template>
              <v-card width="450">
                <v-card-text>
                  <p>
                    <a
                      @click.stop="openDetail(props.item.itemId)"
                      target="_blank"
                      class="subhedding"
                      >{{ props.item[header.value] }}</a
                    >
                    <ApplyStateChip
                      :x-small="true"
                      :state="props.item.approvalStatus"
                      class=" ml-2"
                    />
                  </p>
                  <p v-if="props.item.description">
                    <template v-if="props.item.description.length > 100">
                      {{ props.item.description.slice(0, 100) }}...
                    </template>
                    <template v-else>
                      {{ props.item.description }}
                    </template>
                  </p>
                  <!-- {{ props.item.description }} -->
                </v-card-text>
              </v-card>
            </v-menu>
          </template>
          <template v-else-if="header.value === 'description'">
            <v-menu open-on-click offset-x>
              <template v-slot:activator="{ on }">
                <span v-on="on">{{
                  props.item[header.value] && props.item[header.value].split(/\n/)[0]
                }}</span>
              </template>
              <v-card width="auto" max-width="500" max-height="500" class="overflow-y-auto">
                <v-card-text>
                  <span
                    class="caption"
                    v-text="props.item[header.value]"
                    style="white-space: pre-wrap;"
                  ></span>
                </v-card-text>
              </v-card>
            </v-menu>
          </template>
          <template v-else-if="header.value === 'approver'">
            <template v-if="props.item.approver.length > 0">
              <v-menu bottom right transition="scale-transition" origin="top left">
                <template v-slot:activator="{ on }">
                  <v-chip
                    v-on="on"
                    small
                    v-text="props.item.approver[0].text"
                    class="ma-1"
                    style="white-space: nowrap"
                  ></v-chip>
                </template>
                <v-card width="300">
                  <v-card dense>
                    <v-card-title>
                      <div class="title font-weight-regular grey--text">Approver</div>
                      <v-spacer></v-spacer>
                      <v-btn icon>
                        <v-icon>mdi-close-circle-outline</v-icon>
                      </v-btn>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                      <v-chip
                        v-for="(approver, i) in props.item.approver"
                        :key="i"
                        small
                        v-text="approver.text"
                        class="mr-1 mt-1"
                        style="white-space: nowrap"
                      ></v-chip>
                    </v-card-text>
                  </v-card>
                </v-card>
              </v-menu>
            </template>
          </template>
          <template v-else-if="header.value === 'approvalStatus'">
            <ApplyStateChip
              :key="props.item.itemId"
              :state="props.item.approvalStatus"
              class="my-1"
            />
            <v-chip v-if="props.item.draft" small color="orange" class="white--text">Draft</v-chip>
          </template>
          <template v-else-if="header.value === 'action'">
            <v-btn
              v-if="props.item.approvalStatus === 'unapplied'"
              outline
              small
              color="primary"
              class="ma-1"
              @click="openApplyForm(props.item.itemId)"
              ><v-icon class="mr-2">mdi-file-document-edit-outline</v-icon
              >{{ props.item.draft ? '申請を再開' : '申請' }}</v-btn
            >
            <template
              v-else-if="
                props.item.approvalStatus === applyStatus.APPLYING ||
                  props.item.approvalStatus === applyStatus.REJECTED
              "
            >
              <v-menu offset-y :close-on-content-click="false" bottom>
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" small icon>
                    <v-icon small>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>

                <v-list dense>
                  <v-tooltip v-bind="tooltipSettings" top>
                    <template v-slot:activator="{ on }">
                      <v-list-item v-on="on" @click="cancelApply(props.item.itemId, props.item)">
                        <v-list-item-content>
                          <v-list-item-title>{{
                            $t('apply.messages.cancel_apply')
                          }}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                    <span class="caption">この申請を取り消します</span>
                  </v-tooltip>
                </v-list>
              </v-menu>
            </template>
            <!-- <v-btn v-else-if="props.item.approvalStatus === 'cancel'" color="error"
                    >再申請</v-btn
                  > -->
            <!-- <template v-else-if="props.item.approvalStatus === applyStatus.REJECTED">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      v-on="on"
                      x-small
                      color="red"
                      class="white--text py-0"
                      @click="cancelApply(props.item.itemId, props.item)"
                      ><v-icon  class="mr-2">mdi-close-circle-outline</v-icon>取り消す</v-btn
                    >
                  </template>
                  <span>この申請を取り消します</span>
                </v-tooltip>
              </template> -->
            <!-- <v-btn
                    v-else-if="props.item.approvalStatus === 'approved'"
                    outline
                    small
                    color="primary"
                    class="ma-0"
                    @click="openApplyForm(props.item.itemId)"
                  >
                    <v-icon class="mr-2">mdi-file-document-box-outline</v-icon>内容を見る</v-btn
                  > -->
          </template>
          <template v-else>
            {{ props.item[header.value] }}
          </template>
        </td>
      </template>
    </template>
  </ApplyStatusTable>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import ApplyStateChip from '@/components/ApplyStateChip.vue';
import { APPROVAL_STATUS } from '@/store/applyModule';
import { ApplyStatus } from '@/api';
import ApplyStatusTable from '@/components/ActionLogFormatTable.vue';

const STATUS_TABLE_HEADERS = [
  { text: 'ID', value: 'itemId', width: 80 },
  { text: 'Title', value: 'title', maxWidth: 150 },
  { text: 'Description', value: 'description', sortable: false },
  { text: 'Comment', value: 'comment', sortable: false },
  { text: 'Date', value: 'date', width: 150 },
  { text: 'UpdatedAt', value: 'updatedAt' },
  { text: 'Version', value: 'version', width: 80 },
  { text: 'Applicant', value: 'applicant' },
  { text: 'Approver', value: 'approver', valueType: 'ArrayObject' },
  // { text: 'Detail', value: 'detail', sortable: false },
  { text: 'ApprovalStatus', value: 'approvalStatus', sortable: true },

  { text: '', value: 'action', sortable: false, noFilter: true },
];

@Component({ name: 'ApplyStatusList', components: { ApplyStatusTable, ApplyStateChip } })
export default class ApplyStatusList extends Vue {
  expand: boolean = true;

  tooltipSettings = {
    transition: 'fade-transition',
    color: '#263238',
  };

  pagination: any = {
    sortBy: 'itemId',
    // TODO: v2
    // sortDesc: true,
    descending: true,
    rowsPerPage: 25,
  };

  // service = this.$store.getters['account/getService'];
  service = JSON.parse(sessionStorage.getItem('defaultService'));

  headers: any = STATUS_TABLE_HEADERS;

  switchableHeaders = this.headers.filter(header => !header.fixed);

  selectedHeaders: string[] = this.headers.map(header => header.value);

  filterItemList = STATUS_TABLE_HEADERS;

  get showHeaders() {
    return this.headers.filter(header => this.selectedHeaders.includes(header.value));
  }

  applyStatus = APPROVAL_STATUS;

  items = [];

  filterList = Object.values(APPROVAL_STATUS).map(state => ({
    text: state.charAt(0).toUpperCase() + state.slice(1),
    value: state,
  }));

  selectedFilterValueList = [];

  created() {
    this.service = JSON.parse(sessionStorage.getItem('defaultService'));
    if (!this.service) {
      this.$router.push({ name: 'format' });
    } else {
      this.fetchData();
    }
    // if (this.items === null) {
    //   this.items = this.defaultItems;
    //   localStorage.setItem('applyStatusList', JSON.stringify(this.items));
    // }
  }

  async fetchData() {
    this.items = await this.$store.dispatch('apply/list', this.service.value);
    // const applyStatusList = JSON.parse(localStorage.getItem('applyStatusList'));
    // this.items = applyStatusList ? applyStatusList[this.service.value] : [];
  }

  createNewApply() {
    this.$router.push({ name: 'crateApplyForm' });
  }

  openDetail(applyId): void {
    this.$router.push({
      name: 'applyDetail',
      params: { id: encodeURIComponent(applyId) },
    });
    // const routeData = this.$router.resolve({
    //   name: 'applyDetail',
    //   params: { itemId, items: JSON.stringify(this.items) },
    // });
    // window.open(routeData.href, '_blank');
  }

  reopenApplyForm(applyId): void {
    this.$router.push({
      name: 'crateApplyForm',
      params: { id: encodeURIComponent(applyId) },
    });
  }

  cancelApply(applyId, contents) {
    const cancelContents = contents;
    cancelContents.comment = 'キャンセルしました。';
    this.$store.dispatch('apply/cancel', {
      serviceId: this.service.value,
      applyId,
      contents: cancelContents,
    });
    this.fetchData();
  }

  get loading() {
    return this.$store.getters['apply/loading'];
  }

  set loading(loading) {
    this.$store.commit('apply/loading', loading);
  }

  log(msg) {
    console.log(msg);
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_index.scss';
</style>
