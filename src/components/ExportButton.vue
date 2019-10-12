<template>
  <v-menu :close-on-content-click="false" bottom>
    <template v-slot:activator="{ on }">
      <v-btn small outlined color="primary" class="px-2" v-on="on">
        <v-icon small left class="mr-2">mdi-download</v-icon>export
      </v-btn>
    </template>

    <v-list dense>
      <v-subheader>Exportの形式を選択</v-subheader>
      <v-divider></v-divider>
      <v-list-item
        v-for="format in formatList"
        :key="format.id"
        class="mb-0"
        @click="onItemClick(format.value)"
      >
        <v-list-item-content>
          <v-list-item-title>{{ format.text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { Emit, Prop, Component, Vue } from 'vue-property-decorator';

const csvPath = require('@/assets/files/export/format.csv');
const jsonPath = require('@/assets/files/export/format.txt');
const excelPath = require('@/assets/files/export/format.xlsx');

const FORMAT_LIST = [
  { id: 1, text: 'CSV', value: 'csv' },
  { id: 2, text: 'JSON', value: 'json' },
  { id: 3, text: 'Excel', value: 'excel' },
];

const download = format => {
  let filePath = '';
  let fileName = '';

  switch (format) {
    case 'csv':
      filePath = csvPath;
      fileName = 'format.csv';
      break;
    case 'json':
      filePath = jsonPath;
      fileName = 'format.json';
      break;
    case 'excel':
      filePath = excelPath;
      fileName = 'format.xlsx';
      break;
    default:
      filePath = 'format';
  }
  const xhr = new XMLHttpRequest();
  xhr.open('GET', filePath);
  xhr.responseType = 'arraybuffer';

  xhr.onload = function() {
    if (this.status === 200) {
      const blob = new Blob([xhr.response], { type: 'application/octet-stream' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    }
  };
  xhr.send();
};

@Component({ name: 'ExportButton' })
export default class ExportButton extends Vue {
  formatList = FORMAT_LIST;

  /**
   * onClick
   */
  // eslint-disable-next-line class-methods-use-this
  onItemClick(format) {
    download(format);
  }
}
</script>
