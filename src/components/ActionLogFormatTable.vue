<template>
  <div id="format-list-table">
    <!-- <template v-if="loading">
      <v-col lg="12" sm="12" cols="12">
        <div class="text-center" style="min-height: 150px;">
          <v-progress-circular :width="3" color="primary" indeterminate></v-progress-circular>
        </div>
      </v-col>
    </template> -->
    <template>
      <v-data-table
        v-model="selected"
        dense
        :loading="loading"
        :headers="showHeaders"
        :items="items"
        :items-per-page="itemsPerPage"
        :custom-filter="customFilter"
        :search="search"
        :footer-props="rowsPerPageItems"
        :show-select="select"
        :item-key="itemKey"
        :class="`logdash-table${!simple ? '--border' : '--simple'}`"
      >
        <v-progress-linear v-slot:progress color="blue" indeterminate></v-progress-linear>

        <template v-slot:top>
          <v-divider></v-divider>
          <v-toolbar flat dense class="toolbar--no-padding mx-2">
            <v-menu :close-on-content-click="false" :nudge-width="100" bottom>
              <template v-slot:activator="{ on }">
                <v-chip v-ripple v-on="on" small class="filter__chip--dashed">
                  <v-icon class="mr-2">mdi-filter-variant</v-icon>
                  <span>{{ $t('common.filter.label') }}</span>
                </v-chip>
              </template>

              <v-list dense class="filter">
                <v-subheader class="ml-2">{{ $t('common.filter.label') }}</v-subheader>
                <v-divider class="mb-2"></v-divider>
                <template v-for="(filter, i) in filterMenu">
                  <!-- <div :key="filter.value"> -->
                  <!-- FIXME: Performanceに問題あり。メニューのリストをクリックするたびすべてのリストが再レンダリングされる-->
                  <v-menu
                    :key="i"
                    v-model="filterMenuList[filter.value]"
                    v-bind="filterValuePickerPosition"
                    offset-x
                    :close-on-content-click="false"
                    :allow-overflow="false"
                  >
                    <template v-slot:activator="{ on }">
                      <v-list-item v-on="on">
                        <v-list-item-content>
                          <v-list-item-title v-text="filter.text"></v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-icon>
                          <v-icon>chevron_right</v-icon>
                        </v-list-item-icon>
                      </v-list-item>
                    </template>
                    <v-card>
                      <v-text-field
                        v-model="inputTextFilterSearchList[filter.value]"
                        dense
                        solo
                        flat
                        hide-details
                        clearable
                        prepend-inner-icon="mdi-magnify mdi-18px"
                        placeholder="検索"
                      ></v-text-field>

                      <v-divider class="mb-1"></v-divider>

                      <v-list
                        :ref="filter.value"
                        dense
                        class="filter__picker mt-0 overflow-y-auto"
                        max-height="350"
                      >
                        <v-list-item
                          :key="index"
                          v-for="(value, index) in filter.valueList"
                          v-show="isShowListItem(filter.value, value)"
                        >
                          <v-checkbox
                            v-model="selectedFilterItemList[filter.value]"
                            dense
                            color="primary"
                            :label="value"
                            :value="value"
                            multiple
                            hide-details
                            :ripple="false"
                            @change="onFilterItem(filter.value, $event)"
                          >
                            >
                            <template v-slot:label>
                              <span
                                v-html="highlight(value, inputTextFilterSearchList[filter.value])"
                              ></span>
                            </template>
                          </v-checkbox>
                        </v-list-item>
                        <template
                          v-if="
                            inputTextFilterSearchList[filter.value] &&
                              !isChildComponent(filter.value)
                          "
                        >
                          <v-list-item>
                            <v-list-item-content>
                              <span>No data available</span>
                            </v-list-item-content>
                          </v-list-item>
                        </template>
                        <!-- <template v-if="getfilterdValueList(filter).length == 0">
                            <v-list-item>
                              <v-list-item-content>
                                <span>No data available</span>
                              </v-list-item-content>
                            </v-list-item>
                          </template> -->
                      </v-list>
                    </v-card>
                  </v-menu>
                  <!-- </div> -->
                </template>
              </v-list>
            </v-menu>

            <template v-for="(filterValues, filterKey) in selectedFilterItemList">
              <!-- <template v-if="filterValues && filterValues.length === 1"> -->
              <v-chip
                v-if="filterValues.length > 0"
                :key="filterKey"
                v-ripple
                small
                close
                @click="showFilterValuePicker($event, filterKey)"
                @click:close="
                  () => {
                    onFilterItem(filterKey, []);
                  }
                "
                class="ml-2"
                >{{ createSelectedFilterChipLabel(filterKey, filterValues) }}</v-chip
              >
            </template>

            <v-spacer class="d-flex justify-end"></v-spacer>
            <slot name="actions"></slot>
            <div class="d-flex justify-end">
              <v-text-field
                v-model="search"
                dense
                outlined
                hide-details
                single-line
                prepend-inner-icon="mdi-magnify mdi-18px"
                :placeholder="$t('format.search.label')"
              ></v-text-field>
              <v-menu absolute :close-on-content-click="false" :nudge-width="100">
                <template #activator="{ on: menu }">
                  <v-tooltip top v-bind="tooltipSettings">
                    <template #activator="{ on: tooltip }">
                      <v-btn small icon v-on="{ ...tooltip, ...menu }" class="ma-1">
                        <v-icon>mdi-view-column</v-icon>
                      </v-btn>
                    </template>
                    <span class="caption">{{ $t('common.table.options.display_column') }}</span>
                  </v-tooltip>
                </template>

                <div class="coumns-filter filter">
                  <v-card>
                    <v-list subheader dense>
                      <v-subheader>Columns</v-subheader>
                      <div class="filter__picker">
                        <v-list-item>
                          <!-- <v-list-item-icon>
                              <v-icon>mdi-magnify</v-icon>
                            </v-list-item-icon> -->
                          <v-list-item-content class="pa-0">
                            <v-text-field
                              v-model="columnSearchValue"
                              dense
                              solo
                              flat
                              hide-details
                              clearable
                              prepend-inner-icon="mdi-magnify mdi-18px"
                              placeholder="検索"
                            ></v-text-field>
                          </v-list-item-content>
                        </v-list-item>
                        <v-divider class="mb-2"></v-divider>
                        <!-- <v-list-item
                        @click="() => {}"
                        :key="i"
                        v-for="(header, i) in headers"
                        class="filter__picker"
                      >
                        <v-checkbox
                          :ripple="false"
                          pt-0
                          color="primary"
                          v-model="selectedHeaders"
                          :label="header.text"
                          :value="header.value"
                          hide-details
                        ></v-checkbox>
                      </v-list-item> -->
                        <v-list-item :key="index" v-for="(header, index) in getMatchHeaderList">
                          <v-checkbox
                            v-model="selectedHeaders"
                            dense
                            color="primary"
                            :label="header.text"
                            :value="header.value"
                            hide-details
                          >
                            <template v-slot:label>
                              <span v-html="highlight(header.text, columnSearchValue)"></span>
                            </template>
                          </v-checkbox>
                        </v-list-item>
                        <template v-if="getMatchHeaderList.length == 0">
                          <v-list-item>
                            <v-list-item-action>
                              <span>No data available</span>
                            </v-list-item-action>
                          </v-list-item>
                        </template>
                      </div>
                    </v-list>
                  </v-card>
                </div>
              </v-menu>
            </div>
          </v-toolbar>
          <v-divider></v-divider>
        </template>
        <template v-slot:header.data-table-select="{ on, props }">
          <v-simple-checkbox
            :ripple="false"
            hide-details
            color="primary"
            v-bind="props"
            v-on="on"
          ></v-simple-checkbox>
        </template>
        <template v-slot:item="props">
          <tr
            :active="select && props.isSelected"
            @click="props.select((props.isSelected = !props.isSelected))"
          >
            <td v-if="select">
              <v-simple-checkbox
                :ripple="false"
                color="primary"
                primary
                hide-details
                :value="props.isSelected"
                @input="props.select($event)"
              ></v-simple-checkbox>
            </td>
            <slot name="table-content" :headers="showHeaders" :props="props">
              <!-- //* テーブルデータのカスタマイズ方法 -->
              <!-- <template v-slot:table-content="{ props }">
                      <template v-if="props.item.id == 1">
                        <td>
                          <a href="https://google.com">{{ props.item.id }}</a>
                        </td>
                      </template>
                      <td>{{ props.item.id }}</td>
                    </template> -->

              <template v-for="(header, i) in showHeaders">
                <td :key="i">
                  <template v-if="header.value === 'action'">
                    <v-icon small class="mr-2" @click="showDetail(props.item.typeId, props.item)">
                      visibility
                    </v-icon>
                  </template>
                  <template
                    v-else-if="header.value.includes('version') && props.item[header.value]"
                  >
                    <v-chip v-ripple class="chip--clickable">
                      {{ props.item[header.value] }}
                    </v-chip>
                  </template>
                  <template v-else-if="header.value === 'label'">
                    <template v-for="(label, index) in props.item[header.value]">
                      <v-chip v-ripple label small :key="index" @click="addFilter(props.item)">
                        {{ label }}
                      </v-chip>
                    </template>
                  </template>

                  <template v-else-if="header.link">
                    <a @click="showDetail(props.item[keyId] || props.item.id, props.item)">{{
                      props.item[header.value]
                    }}</a>
                  </template>
                  <template v-else-if="header.version">
                    <!-- 該当のSoftwareバージョンで定義されているEventIdをマークする -->
                    <template v-if="isActiveEvent(header.value, props.item.id)">
                      <v-icon color="green" alt="active">
                        check_circle
                      </v-icon>
                    </template>
                    <template v-else>
                      <v-row justify="center">-</v-row>
                    </template>

                    <!-- <a @click="showDetail(props.item.eventId, props.item)">{{ header.value }}</a> -->
                  </template>
                  <template v-else>{{ props.item[header.value] }}</template>
                </td>
              </template>
            </slot>
          </tr>
        </template>
      </v-data-table>
    </template>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Emit, Component, Prop, Watch } from 'vue-property-decorator';
import VueI18n from 'vue-i18n';
import { getItemJson } from '@/util/storageUtils';
import { FormatDataModel } from '@/api';

const capitalizeLogInfoCustomLabelText = value => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

/**
 * ActionLogFormatのテーブルコンポーネント
 *
 */
@Component({
  name: 'ActionLogFormatTable',
  components: {},
})
export default class ActionLogFormatTable extends Vue {
  @Prop({ default: false })
  loading;

  @Prop({ default: 'typeId' })
  keyId;

  @Prop()
  dataFormat;

  @Prop()
  simple;

  @Prop({ default: () => [] })
  headers;

  @Prop({ default: () => [] })
  formatList;

  @Prop()
  version;

  @Prop({ default: () => ({}) })
  eventIdMap;

  @Prop({ default: 'id' })
  itemKey;

  @Prop()
  filterList;

  @Prop()
  customFilter;

  @Prop({
    default: () => ({
      itemsPerPageOptions: [10, 20, 50, 100, { text: 'All', value: -1 }],
      options: {
        itemsPerPage: 100,
      },
    }),
  })
  rowsPerPageItems;

  @Prop({ default: 100 })
  itemsPerPage;

  @Prop({ default: false })
  select;

  tooltipSettings = {
    transition: 'fade-transition',
    color: '#263238',
  };

  items = this.formatList;

  search = '';

  selectedHeaders = [];

  columnSearchValue = '';

  // columnFilter = { value: 'columns', valueList: this.headers.map(header => header.text) };

  filterList_ = [];

  filterMenuList = {
    // showLabelFilterMenu: false,
    // version1: false,
    // version2: false,
    // version3: false,
    // version4: false,
  };

  filterValuePickerPosition = {
    positionX: 0,
    positionY: 0,
    absolute: false,
  };

  // inputTextFilterSearchList = this.initSelectedFilterItemList();
  inputTextFilterSearchList = {};

  selectedFilterItemList: any = {};

  localSelected = [];

  @Watch('formatList')
  onFormatListChange(formatList) {
    this.items = formatList;
    this.filterList_ = this.initFilterList();
  }

  @Watch('headers')
  onHeadersChange(headers) {
    this.selectedHeaders = this.tableHeaders.filter((h, i) => i < 11).map(header => header.value);
  }

  @Emit('selected-actions')
  selectedActions() {
    return this.localSelected;
  }

  get filterMenu() {
    return this.filterList_;
  }

  get tableHeaders() {
    return this.headers.filter(header => !header.hide);
  }

  set selected(item) {
    this.$store.commit('format/selectedItem', item);
    this.localSelected = item;
  }

  get selected() {
    // this.selectedActions();
    const selectedItems = this.$store.getters['format/selectedItem'];
    return selectedItems;
  }

  get showHeaders() {
    const filteredHeaders = this.tableHeaders.filter(
      header => !header.hide && this.selectedHeaders.includes(header.value)
    );
    return filteredHeaders;
  }

  mounted() {
    // this.items = this.localItems;
    this.filterList_ = this.initFilterList();
    this.selected = this.items;
    this.selectedHeaders = this.tableHeaders.filter((h, i) => i < 11).map(header => header.value);
  }

  // -- Methods start -----------------------------------------------------------------------------
  isActiveEvent(version, eventId) {
    const eventIdList = this.eventIdMap[version];
    return eventIdList ? eventIdList.includes(eventId) : false;
  }

  initFilterList() {
    const filterList = [];
    const headers = this.filterList || this.tableHeaders;
    headers
      .filter(el => !el.noFilter)
      .forEach(header => {
        const values = this.items
          .map(target => {
            const value = target[header.value];
            if (header.valueType === 'ArrayObject') {
              return value.map(value => value.value);
            }
            return value;
          })
          .filter((value, i, self) => value !== undefined && self.indexOf(value) === i);

        const filterTitle = header.text || header.value;
        const filter = {
          text: filterTitle,
          value: header.value,
          valueList: values.flat(1),
        };
        filterList.push(filter);
      });

    return filterList;
  }

  // TODO: 整理する
  updateFilter(excludeColumn = '') {
    const headers = this.filterList || this.tableHeaders;
    this.filterList_
      .filter(f => f.value !== excludeColumn)
      .forEach(filter => {
        const { valueType } = headers.find(header => filter.value === header.value);
        const values = this.items
          .map(target => {
            const value = target[filter.value];
            if (valueType === 'ArrayObject') {
              return value.map(value => value.value);
            }
            return value;
          })
          .filter((value, i, self) => value !== undefined && self.indexOf(value) === i);
        filter.valueList = values.flat(1);

        // this.items.map(format => {
        //   Object.entries(format).forEach(([key, value]) => {
        //     if (filter.value === key) {
        //       const { valueList } = filter;
        //       if (valueList.indexOf(value) === -1) {
        //         valueList.push(value);
        //       }
        //     }
        //   });
        // });
        // });
      });
    // this.filterList_ = filterList;
  }

  isChildComponent(ref) {
    const search = this.inputTextFilterSearchList[ref];
    const filterListComponent = this.$refs[ref];
    if (!filterListComponent) {
      return false;
    }
    return filterListComponent[0].$children.length > 0;

    // const search = this.inputTextFilterSearchList[filter.value];
    // return search
    //   ? filter.valueList.filter(value => value.toLowerCase().indexOf(search.toLowerCase()) !== -1)
    //   : filter.valueList;
  }

  isShowListItem(key, value = '') {
    const search = this.inputTextFilterSearchList[key];
    if (!search) {
      return true;
    }
    return value.toLowerCase().indexOf(search.toLowerCase()) !== -1;
  }

  get getMatchHeaderList() {
    let matchedHeaderList = this.tableHeaders;
    if (this.columnSearchValue) {
      matchedHeaderList = this.tableHeaders.filter(
        header => header.text.toLowerCase().indexOf(this.columnSearchValue.toLowerCase()) !== -1
      );
    }
    return matchedHeaderList;
  }

  // eslint-disable-next-line class-methods-use-this
  createSelectedFilterChipLabel(itemKey, values) {
    let label = `${itemKey} = "${values[0]}"`;
    if (values.length > 1) {
      label = label.concat(' more ', (values.length - 1).toString());
    }
    return label;
  }

  showDetail(typeId, item, isNewTab = false) {
    let target = 'action';
    let type = 'default';
    if (this.dataFormat) {
      ({ type } = this.dataFormat);
      target = this.dataFormat.name;
    }

    const routeData = this.$router.resolve({
      name: 'formatDetail',
      params: { id: encodeURIComponent(typeId) },
      query: { v: encodeURIComponent(this.version), type, target },
    });

    if (isNewTab) {
      window.open(routeData.href);
    } else {
      this.$router.push(routeData.href);
    }
  }

  addFilter(item) {
    this.log(item);
  }

  showFilterValuePicker(e, filter) {
    e.preventDefault();
    this.filterMenuList[filter] = false;
    this.filterValuePickerPosition.positionX = e.clientX;
    this.filterValuePickerPosition.positionY = e.clientY;
    this.$nextTick(() => {
      this.filterMenuList[filter] = true;
      this.filterValuePickerPosition.absolute = true;
    });
  }

  onFilterItem(column, value) {
    const valueList = value;
    // if (!this.selectedFilterItemList[column]) {
    //   this.$set(this.selectedFilterItemList, column, [value]);
    //   valueList = [value];
    // } else {
    //   this.$set(this.selectedFilterItemList, column, value);
    // }

    if (valueList.length > 0) {
      const newitem = this.formatList.filter(item => valueList.includes(item[column]));
      // const filterItem = this.items.filter(item => valueList.includes(item[column]));
      this.items = newitem;
      this.updateFilter(column);
    } else {
      this.$delete(this.selectedFilterItemList, column);
      this.items = this.formatList;
      Object.entries(this.selectedFilterItemList).forEach(
        ([filterKey, filterValues]: [string, any]) => {
          // const filterItem = this.items.filter(item => filterItem.valueList.includes(item[filterItem.value]));
          if (filterValues.length > 0) {
            this.items = this.items.filter(item => filterValues.includes(item[filterKey]));
          }
        }
      );
      this.updateFilter();

      // const filterItem = this.formatList.filter(item =>  column in item);
      // // this.items = Object.assign(this.items, filterItem);
      // Array.prototype.push.apply(this.items,filterItem);
    }
  }

  highlight = (words, query) => {
    return query
      ? words.replace(new RegExp(query, 'gi'), "<span part='highlight' class='highlight'>$&</span>")
      : words;
  };

  log(msg) {
    console.log(msg);
  }

  // -- Methods end --
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_index.scss';
.logdash-table {
  position: relative;
  &--simple {
    @include table;
  }
  &--border {
    @include table_border;
  }
}

::v-deep span {
  .highlight {
    font-weight: bold;
  }
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
    @include input-solo-flat-dense;
    .v-input__slot {
      padding: 0 !important;
    }
    @include checkbox-small;
  }
}

::v-deep .loading {
  height: 900px;
  position: absolute;
  opacity: 0.3;
  background: #fff;
}
</style>
