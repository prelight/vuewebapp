<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    clipped
    :mini-variant-width="62"
    :mini-variant="mini"
    @input="$emit('input', $event)"
    class="side-menu"
  >
    <v-list dense>
      <template v-for="item in items">
        <v-tooltip :disabled="!mini" bottom :key="item.title">
          <template v-slot:activator="{ on }">
            <v-list-item v-on="on" :key="item.title" :to="{ path: item.path }" color="primary">
              <v-list-item-icon class="mr-4">
                <v-icon class="side-menu__icon">{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="menu-title">{{ $t(`${item.title}`) }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <span class="caption">{{ $t(`${item.title}`) }}</span>
        </v-tooltip>
      </template>
    </v-list>
    <template v-slot:append>
      <div :class="`side-menu__toggle${mini ? '--rotate' : ''}`">
        <v-divider></v-divider>
        <v-spacer></v-spacer>
        <v-btn icon v-blur @click.stop="mini = !mini" class="my-2 mx-3">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({ name: 'SideBar' })
export default class SideBar extends Vue {
  drawer: boolean = true;

  mini: boolean = false;

  items: any = [
    {
      group: 'Format',
      title: 'menu_labels.format',
      path: '/logdash/format',
      icon: 'mdi-file-table',
    },
    { title: 'menu_labels.apply', path: '/logdash/apply', icon: 'mdi-pencil-box' },
  ];
}
</script>

<style lang="scss" scoped>
.side-menu {
  width: auto;
  // text-align: end;
  &__toggle {
    .v-icon {
      transform: -ms-transform 300ms ease;
    }

    &--rotate {
      .v-icon {
        transform: rotateZ(180deg);
      }
    }
  }
  &__icon {
    margin-left: 4px;
    margin-right: auto;
  }
  .v-list-item {
    justify-content: left;
  }
}
</style>
