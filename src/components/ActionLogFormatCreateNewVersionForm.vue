<template>
  <!-- <v-layout  row justify-center> -->
  <v-card>
    <v-card-title>
      <span class="headline">Select version and actions</span>
    </v-card-title>

    <v-toolbar flat class="toolbar pb-2">
      <span>Version name: </span>

      <div class="version-label">
        <v-form v-model="valid" ref="form" onSubmit="return false;">
          <v-text-field
            v-model="newVersion"
            dense
            outlined
            single-line
            hide-details
            label="New version name"
            placeholder="New version name"
            class="version-label__input-text ml-2"
            ref="newVersion"
            :rules="[rules.required]"
            required
          >
            ></v-text-field
          >
        </v-form>
      </div>
      <v-tooltip right transition="fade-transition" color="#263238">
        <template v-slot:activator="{ on }">
          <v-icon v-on="on" small class="ml-2">mdi-help-circle</v-icon>
        </template>
        <span style="white-space: pre-wrap;">新しいバージョン名を入力してください</span><br />
        <span style="white-space: pre-wrap;">例: 2</span>
      </v-tooltip>
    </v-toolbar>

    <v-divider></v-divider>

    <v-toolbar flat class="toolbar">
      <span>Select base version:</span>
      <ButtonDropdown
        v-model="defaultSelected"
        :items="versions"
        @item-click="itemClick"
        :button-settings="{ class: 'ml-2' }"
      />
    </v-toolbar>
    <template v-if="loading">
      <v-card-text style="width: 1200px; height: 760px;">
        <div class="text-center">
          <v-progress-circular :width="3" color="primary" indeterminate></v-progress-circular>
        </div>
      </v-card-text>
    </template>
    <template v-else>
      <v-card-text class="pt-0" style="min-width: 1200px;  height: auto;">
        <v-row>
          <v-col lg="12" sm="12" md="12">
            <ActionLogFormatTable
              :select="true"
              :headers="showHeaders"
              :format-list="formatData"
              :item-key="itemKey"
            >
            </ActionLogFormatTable>
          </v-col>
        </v-row>
      </v-card-text>
    </template>
    <slot name="action" :form="this.$refs.form"></slot>
  </v-card>
</template>

<script lang="ts">
import { Emit, Prop, Component, Vue } from 'vue-property-decorator';
import ButtonDropdown from '@/components/ButtonDropdown.vue';
import eciaActions, { customFieldList as testVersionList } from '@/static/eciaActions'; // ActionTypeIDのリスト
import songpalActions from '@/static/songpalActions'; // ActionTypeIDのリスト
import { getItemJson } from '@/util/storageUtils';
import ActionLogFormatTable from '@/components/ActionLogFormatTable.vue';
import { FORMAT_LIST } from '@/api';

const TEST_DATA = {
  ecia: eciaActions,
  songpal: songpalActions,
};

@Component({
  name: 'ActionLogFormatCreateNewVersionForm',
  components: { ButtonDropdown, ActionLogFormatTable },
})
export default class ActionLogFormatCreateNewVersionForm extends Vue {
  tooltipSettings = {
    transition: 'fade-transition',
    color: '#263238',
  };

  dialog: boolean = false;

  radioGroup = 'clone';

  // nextVersion;
  @Prop()
  headers: { text: string; value: string }[];

  @Prop()
  service;

  @Prop({ default: [] })
  versions;

  @Prop({ default: 'id' })
  itemKey;

  @Prop()
  createVersion;

  @Prop()
  defaultSelected;

  formatData = [];

  valid = true;

  selectedHeaders = Array.from(this.headers).map(header => header.value);

  get showHeaders() {
    return this.headers.filter(header => this.selectedHeaders.includes(header.value));
  }

  customFieldList;

  value;

  rules = {
    required: value => !!value || 'This field is required.',
  };

  updateNewVersion(newVersion) {
    this.$emit('input', newVersion);
  }

  get newVersion() {
    this.$emit('input', this.createVersion);
    return this.createVersion;
  }

  set newVersion(newVersion) {
    this.updateNewVersion(newVersion);
  }

  selectedVersion = this.defaultSelected;

  itemClick(item) {
    if (this.selectedVersion !== item) {
      this.selectedVersion = item;
      this.formatData = this.getFormatData();
      this.selected = this.formatData;
    }
  }

  localSelected = [];

  set selected(item) {
    this.localSelected = item;
  }

  get selected() {
    // this.selectedActions();
    return this.localSelected;
  }

  rowsPerPageItems = [10, 20, 50, 100, { text: 'All', value: -1 }];

  pagination = {
    sortBy: 'typeId',
    rowsPerPage: 100,
  };

  loading = true;

  select = true;

  get newVersionName() {
    return this.value;
  }

  // get getActions() {
  //   this.loading = true;
  //   setTimeout(() => (this.loading = false), 800);
  //   return this.actions[this.selectedVersion.value];
  // }

  getFormatData() {
    this.loading = true;

    setTimeout(() => {
      this.loading = false;
    }, 800);

    // const formatData =
    //   Object.assign({}, this.$store.getters['format/list']([this.service.value]))[
    //     this.selectedVersion.value
    //   ] || [];
    const formatData = getItemJson(localStorage, FORMAT_LIST, {})[this.service.value][
      this.selectedVersion.value
    ];
    return formatData;
  }

  showDetail(typeId, item) {
    const routeData = this.$router.resolve({
      name: 'formatDetail',
      params: { id: encodeURIComponent(typeId) },
      query: { service: this.service.value, v: this.selectedVersion.value },
    });
    window.open(routeData.href, '_blank');
  }

  created() {
    this.loading = false;
    this.init();
    this.formatData = this.getFormatData();
    this.selected = this.formatData;
  }

  init() {
    this.customFieldList = testVersionList;
    // this.actionLogTableHeaders = this.tableHeaders.concat(this.customFieldList);
    // this.versionOfServiceList = versionOfServiceList;
    // this.selectedVersionOfService = versionOfServiceList[0];
    // this.selectedHeaders = this.actionLogTableHeaders.map(header => header.value);
  }

  // eslint-disable-next-line class-methods-use-this
  debug(item) {
    alert(item);
  }
}

// Register the component globally
// Vue.component('ActionLogFormatCreateFormatGroupForm', ActionLogFormatCreateFormatGroupForm);
</script>

<style lang="scss" scoped>
::v-deep .loglist-table {
  .v-table {
    th {
      border-top: 1px solid #dddddd;
      border-bottom: none;
      background: #f5f5f5;
      color: black !important;
    }
    td {
      // border-left: 1px solid #dddddd;
      // border-right: 1px solid #dddddd;
      // color: black !important;
    }
    tr[active] {
      background: #e1f5fe !important;
    }
    tbody td,
    thead th {
      height: 30px;
      padding: 0 12px;
    }
    thead tr {
      height: 30px;
    }
    .v-input--checkbox {
      width: 8px;
    }
  }
  .v-icon {
    font-size: 18px;
  }
  .v-input--selection-controls__ripple {
    transform: scale(0.6);
    left: -15px;
  }
}
::v-deep .version-label {
  width: 170px;
  &__input-text {
    &.v-text-field {
      .v-input__control {
        font-size: 14px;
      }
      .v-label {
        font-size: 14px;
      }
    }
  }
  label::after {
    content: '*';
  }
}
::v-deep .v-input--switch {
  padding-top: 0;
  label {
    font-size: 14px;
  }
  .v-input--selection-controls__input {
    height: 10px;
  }
  .v-input--switch__track {
  }
}
</style>
