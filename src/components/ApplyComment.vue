<template>
  <v-timeline v-if="threadList.length > 0" dense align-top class="ml-2">
    <v-slide-x-transition group>
      <v-timeline-item v-for="item in threadList" :key="item.threadId" small class="mb-2">
        <template v-slot:icon>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-avatar size="36">
                <v-img v-on="on" :src="item.avatar" />
              </v-avatar>
            </template>
            <span>{{ item.commenter }}</span>
          </v-tooltip>
        </template>
        <v-card color="#f5f5f5" class="elevation-1 mr-3">
          <v-card-title class="caption py-2"
            >{{ item.datetime
            }}<v-chip label small v-bind="getLabelSettings(item.commentType)" class="ml-2">{{
              item.commentType
            }}</v-chip></v-card-title
          >
          <v-card-text class="white text--primary py-2">{{ item.content }}</v-card-text>
        </v-card>
      </v-timeline-item>
    </v-slide-x-transition>
  </v-timeline>
  <span v-else class="caption">まだコメントがありません。</span>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component({
  name: 'ApplyComment',
  components: {},
})
export default class ApplyDetail extends Vue {
  @Prop({ type: String })
  itemId;

  @Prop({ default: () => [] })
  threadList;

  created() {}

  commentSettingsMap = {
    reject: { color: 'red', class: 'white--text' },
    approve: { color: 'green', class: 'white--text' },
  };

  getLabelSettings(commentType) {
    return this.commentSettingsMap[commentType];
  }
}
</script>

<style lang="scss">
.disabledChips {
  pointer-events: none;
}
</style>
