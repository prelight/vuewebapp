<template>
  <div id="logdash">
    <!-- Appbar -->
    <!-- v-toolbarのprop -->
    <v-navigation-drawer
      app
      clipped
      v-model="drawer"
      @input="$emit('input', $event)"
      class="console-nav"
      id="style-1"
      temporary
      fixed
    >
      <v-list class="mt-12" dense>
        <v-subheader>サービス</v-subheader>
        <template v-for="item in serviceItems">
          <v-list-item
            v-if="item.title === 'Log Dash'"
            :key="item.title"
            to="/logdash/format"
            color="primary"
          >
            <v-list-item-icon class="menu-icon">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="menu-title">{{ $t(`${item.title}`) }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item v-else :key="item.title" @click="openExternalSite(item.src)">
            <v-list-item-icon class="menu-icon">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="menu-title">{{ $t(`${item.title}`) }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar dark clipped-left app dense class="appbar primary">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="ml-0 pl-3 white--text appbar__title">{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        text
        width="auto"
        href="https://www.tool.sony.biz/ux-conf/display/SDP/G%3A%3AConsole"
        target="_blank"
      >
        <span class="mr-2">Confluence</span>
      </v-btn>
      <v-text-field
        dense
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="search"
        label="サービス検索"
        placeholder="サービスを検索"
        class="appbar__input--search text--primary"
      ></v-text-field>

      <v-btn icon>
        <v-icon>refresh</v-icon>
      </v-btn>

      <v-menu :close-on-content-click="true" bottom>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon>
            <v-badge overlap color="red">
              <template v-if="notificationCount > 0" v-slot:badge>
                {{ notificationCount }}
              </template>
              <v-icon>
                notifications
              </v-icon>
            </v-badge>
          </v-btn>
        </template>
        <v-card>
          <template v-if="notificationCount > 0">
            <v-list dense>
              <v-list-item
                :key="item.id"
                v-for="item in itemList"
                @click="clickNotificationItem(item)"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ item.message }}</v-list-item-title>
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn small icon @click.stop="deleteItem(item.id)">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </template>
          <template v-else>
            <v-card-text>新しい通知はありません</v-card-text>
          </template>
        </v-card>
      </v-menu>

      <v-menu bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>more_vert</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-list dense>
            <v-list-item @click="clearCache">
              <v-list-item-content>
                <v-list-item-title>キャッシュ削除</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item @click="clickAboutLogDash">
              <v-list-item-content>
                <v-list-item-title>LogDashについて</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>

      <v-menu :close-on-content-click="false" bottom>
        <template v-slot:activator="{ on }">
          <v-btn small fab icon v-on="on">
            <v-avatar size="36">
              <img :src="user.avatar" :alt="user.username" />
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-list>
            <v-menu bottom full-width>
              <template v-slot:activator="{ on }">
                <v-list-item v-on="on" avatar>
                  <v-list-item-avatar>
                    <img :src="user.avatar" :alt="user.username" />
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title>{{ user.username }}</v-list-item-title>
                    <v-list-item-subtitle>{{ user.description }}</v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-btn :class="fav ? 'red--text' : ''" icon @click.stop="fav = !fav">
                      <v-icon>favorite</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </template>
              <v-card>
                <v-list subheader>
                  <v-subheader>ユーザー切り替え</v-subheader>
                  <v-divider></v-divider>
                  <v-list-item
                    v-for="user in userList.filter(user => user.username !== currentUserName)"
                    :key="user.id"
                    avatar
                    @click="changeUser(user)"
                  >
                    <template>
                      <v-list-item-avatar>
                        <img :src="user.avatar" />
                      </v-list-item-avatar>

                      <v-list-item-content>
                        <v-list-item-title v-html="user.username"></v-list-item-title>
                      </v-list-item-content>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>

            <v-list-item v-for="(item, i) in profileItems" :key="i" @click="item.onClickHandler">
              <v-list-item-icon>
                <v-icon left>{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title v-if="item.title === 'Data Catalog'" class="indigo-text">{{
                item.title
              }}</v-list-item-title>
              <v-list-item-title v-else>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list>
            <v-list-item>
              <v-list-item-action>
                <v-switch v-model="theme" color="primary"></v-switch>
              </v-list-item-action>
              <v-list-item-title>Dark</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-app-bar>

    <SideBar></SideBar>

    <v-content>
      <router-view />
      <v-snackbar v-model="message.text" :color="message.type" bottom>
        {{ message.text }}
        <v-btn dark flat @click="clearNotification()">
          Close
        </v-btn>
      </v-snackbar>
    </v-content>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import { mapActions, mapGetters, mapState } from 'vuex';
import '@/assets/styles/_index.scss';
import SideBar from '@/components/SideBar.vue';
import { User, DEMO_USERS } from '../auth';

@Component({
  components: {
    SideBar,
  },
  methods: {
    ...mapActions('account', { signout: 'logout' }),
    ...mapActions('notification', {
      clearNotification: 'clear',
    }),
  },
  computed: {
    ...mapState('notification', ['type', 'message']),
    ...mapGetters('account', {
      avatar: 'avatar',
    }),
  },
  watch: {
    $route(this: any, to, from) {
      // clear alert on location change
      this.clearNotification();
    },
  },
})
export default class Home extends Vue {
  drawer: boolean = false;

  serviceItems: any = [
    { title: 'Log Dash', src: 'https://www.sdata.sony.co.jp', icon: 'dashboard' },
    { title: 'Data Catalog', src: 'https://www.sdata.sony.co.jp', icon: 'image_search' },
    {
      title: 'Log Reader',
      src: 'https://www.tool.sony.biz/ux-conf/display/SDP/G%3A%3AConsole',
      icon: 'zoom_in',
    },
  ];

  profileItems: any[] = [{ title: 'Logout', icon: 'logout', onClickHandler: this.logout }];

  fav = true;

  user: User = {
    id: '',
    pass: '',
    username: '',
    serviceList: [],
    token: 'string',
  };

  currentUserName = '';

  userList = DEMO_USERS;

  isDark = false;

  barProp = { class: 'primary', dark: true };

  created() {
    this.$store.dispatch('account/getCurrentUser').then(currentUser => {
      this.user = currentUser;
      this.currentUserName = currentUser.username;
    });
  }

  clearNotification() {
    this.$store.dispatch('notification/clear');
  }

  get message() {
    return this.$store.getters['notification/message'];
  }

  // eslint-disable-next-line class-methods-use-this
  get theme() {
    return this.isDark;
  }

  set theme(isDark) {
    // this.$emit('change-theme', isDark);
    this.barProp.dark = !this.barProp.dark;
    this.changeTheme(isDark);
  }

  @Emit('change-theme')
  // eslint-disable-next-line class-methods-use-this
  changeTheme(isDark) {
    return isDark;
  }

  get title() {
    if (this.$route.meta.viewType && this.$route.meta.viewType === 'detail') {
      return `${this.$route.meta.title}#${this.$route.params.id}`;
    }
    return this.$route.meta.title;
  }

  changeUser(user) {
    this.$store
      .dispatch('account/changeUser', {
        username: user.username,
        password: user.username,
      })
      .then(() => this.reload());
  }

  logout(this: any) {
    this.$router.replace('/');
    this.signout();
  }

  reload = () => {
    window.location.reload();
  };

  openExternalSite = (url: string) => {
    window.open(url, '_blank');
  };

  clearCache = () => {
    const keep = localStorage.getItem('user');
    sessionStorage.removeItem('defaultService');
    // localStorage.removeItem('applyStatusList');
    // localStorage.removeItem('applyThreadList');
    // localStorage.removeItem('formatList');
    // localStorage.removeItem('customGroupList');
    // localStorage.removeItem('formatDetail');
    // localStorage.removeItem('versionList');
    // localStorage.removeItem('selectedVersion');
    localStorage.clear();
    localStorage.setItem('user', keep);
    this.reload();
  };

  clickNotificationItem(item) {
    const { link } = item;
    if (link) {
      this.$router.push(link);
    }
    this.deleteItem(item.id);
  }

  clickAboutLogDash() {
    const routeData = this.$router.resolve({
      name: 'about',
    });
    window.open(routeData.href, '_blank');
  }

  deleteItem(notificationId) {
    this.$store.commit('applyNotification/delete', notificationId);
  }

  get notificationCount() {
    return this.$store.getters['applyNotification/getItemCount'];
  }

  get itemList() {
    return this.$store.getters['applyNotification/getItemList'];
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/_index.scss';

#logdash {
  // font-size: 14px;
  color: #000;
  height: 100%;
  // TODO: BEM (block__element--modifier) ref: http://getbem.com/
  .appbar {
    // z-index: 10;
    // padding-left: 2px;
    &__title {
      width: 250px;
    }
    &__input--search {
      max-width: 300px;
    }
    .v-toolbar__content {
      padding: 0 12px;
      .v-btn {
        margin: 4px;
        height: 36px;
        width: 36px;
      }
    }
  }
  /** Override Vuetify styles - start*/
  .v-chip {
    box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.2), 0px 0px 0px 0px rgba(0, 0, 0, 0.14),
      0px 0px 0px 0px rgba(0, 0, 0, 0.12) !important;
  }
  .v-text-field--solo {
    .v-input__control {
      min-height: 34px;
      // height: 34px;
    }
  }

  .v-chip:focus:not(.v-chip--selected):after {
    background: none !important;
  }

  /** Override Vuetify styles - end */
}

.logdash-table {
  position: relative;
  &--simple {
    @include table;
  }
  &--border {
    @include table_border;
  }
}
</style>

<style lang="scss" scoped>
.console-nav {
  z-index: 5;
}
</style>

<style lang="scss" scoped></style>
