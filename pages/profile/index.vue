<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="userProfile.image" class="user-img" />
            <h4>{{ userProfile.username }}</h4>
            <p>
              Cofounder @GoThinkster, lived in Aol's HQ for a few months, kinda
              looks like Peeta from the Hunger Games
            </p>
            <nuxt-link
              v-if="userProfile.username === user.username"
              class="btn btn-sm btn-outline-secondary action-btn"
              to="/settings"
            >
              <i class="ion-plus-round"></i>
              &nbsp; Edit Profile Settings
            </nuxt-link>
            <button
              v-if="userProfile.username !== user.username"
              class="btn btn-sm btn-outline-secondary action-btn"
              @click="followingAuth(userProfile)"
            >
              <i class="ion-plus-round"></i>
              &nbsp; {{ userProfile.following ? "Unfollow" : "Follow" }}
              {{ userProfile.username }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'my_article',
                  }"
                  exact
                  :to="{
                    name: 'profile',
                    query: {
                      tab: 'my_article',
                    },
                  }"
                  >My Articles</nuxt-link
                >
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'favorit_article',
                  }"
                  exact
                  :to="{
                    name: 'profile',
                    query: {
                      tab: 'favorit_article',
                    },
                  }"
                  >Favorited Articles</nuxt-link
                >
              </li>
            </ul>
          </div>

          <div
            class="article-preview"
            v-for="items in articles"
            :key="items.slug"
          >
            <div class="article-meta">
              <nuxt-link to="/">
                <img :src="items.author.image" />
              </nuxt-link>
              <div class="info">
                <nuxt-link to="/" class="author">{{
                  items.author.username
                }}</nuxt-link>
                <span class="date">{{
                  items.createdAt | date("MMM DD, YYYY")
                }}</span>
              </div>
              <button class="btn btn-outline-primary btn-sm pull-xs-right">
                <i class="ion-heart"></i> {{ items.favoritesCount }}
              </button>
            </div>
            <nuxt-link
              :to="{
                name: 'article',
                params: {
                  slug: items.slug,
                },
              }"
              class="preview-link"
            >
              <h1>{{ items.title }}</h1>
              <p>{{ items.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>

          <!-- 分页列表 -->
          <nav>
            <ul class="pagination">
              <li
                class="page-item"
                v-for="item in totalPage"
                :class="{
                  active: item === page,
                }"
                :key="item"
              >
                <nuxt-link
                  class="page-link"
                  :to="{
                    name: 'profile',
                    query: {
                      page: item,
                      tab: tab,
                    },
                  }"
                  >{{ item }}</nuxt-link
                >
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getProfile, follow, unFollow } from "@/api/profile";
import { getArticles } from "@/api/article";
import { mapState } from "vuex";
export default {
  middleware: "authenticated",
  name: "UserProfile",
  data() {
    return {
      userProfile: "",
    };
  },
  async asyncData({ params, query }) {
    const limit = 5;
    const page = Number.parseInt(query.page || 1);
    const username = params.username;
    const tab = query.tab || "my_article";
    const loadArticles =
      tab === "my_article"
        ? {
            author: username,
            limit,
            offset: (page - 1) * limit,
          }
        : {
            favorited: username,
            limit,
            offset: (page - 1) * limit,
          };
    const [userInfo, article] = await Promise.all([
      getProfile(username),
      getArticles(loadArticles),
    ]);
    const userProfile = userInfo.data.profile;
    const { articles, articlesCount } = article.data;
    return {
      userProfile,
      limit, // 每页大小
      tab,
      page,
      articlesCount,
      articles,
    };
  },
  computed: {
    ...mapState(["user"]),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit);
    },
  },
  watchQuery: ["tab", "page"],
  methods: {
    async followingAuth(userProfile) {
      if (userProfile.following) {
        await unFollow(userProfile.username);
        userProfile.following = false;
      } else {
        await follow(userProfile.username);
        userProfile.following = true;
      }
    },
  },
  mounted() {
    console.log(this.user.name === this.userProfile.username);
  },
};
</script>

<style>
</style>
