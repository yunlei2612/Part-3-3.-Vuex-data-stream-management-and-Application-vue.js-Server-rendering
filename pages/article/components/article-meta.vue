<template>
  <div class="article-meta">
    <nuxt-link
      :to="{
        name: 'profile',
        params: {
          username: article.author.username,
        },
      }"
    >
      <img :src="article.author.image" />
    </nuxt-link>
    <div class="info">
      <nuxt-link
        class="author"
        :to="{
          name: 'profile',
          params: {
            username: article.author.username,
          },
        }"
      >
        {{ article.author.username }}
      </nuxt-link>
      <span class="date">{{ article.createdAt | date("MMM DD, YYYY") }}</span>
    </div>
    <template v-if="article.author.username !== user.username">
      <button 
        class="btn btn-sm btn-outline-secondary"
        :class="{
          active: article.author.following,
        }"
        @click="followLike(article.author.username, article.author.following)"
      >
        <i class="ion-plus-round"></i>
        &nbsp;
        {{ article.author.following ? "Unfollow" : "Follow" }}
        <span class="counter">{{ article.author.username }}</span>
      </button>
      &nbsp;&nbsp;
      <button
        class="btn btn-sm btn-outline-primary"
        :class="{
          active: article.favorited,
        }"
        @click="onFavorite(article)"
      >
        <i class="ion-heart"></i>
        &nbsp; Favorite Post <span class="counter">({{article.favoritesCount}})</span>
      </button>
    </template>
    <template v-else>
      <span class="ng-scope">
        <nuxt-link
          class="btn btn-outline-secondary btn-sm"
          :to="{
            name: 'editor',
            params: {
              slug: article.slug,
            },
          }"
        >
          <i class="ion-edit"></i> Edit Article
        </nuxt-link>
        <button class="btn btn-outline-danger btn-sm" @click="deleteArticle">
          <i class="ion-trash-a"></i> Delete Article
        </button>
      </span>
    </template>
  </div>
</template>

<script>
import { deleteArticle } from "@/api/edit";
import{
   follow,
   unFollow
} from "@/api/profile"
import {
  addFavorite,
  deleteFavorite
} from '@/api/article'
import { mapState } from "vuex";
export default {
  name: "ArticleMeta",
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    async deleteArticle() {
      const { slug } = this.article;
      await deleteArticle(slug);
      this.$router.push("/");
    },
     async followLike (name, following) {
      const { data } = following ? await follow(name) : await unFollow(name)
      this.article.author.following = data.profile.following
    },
    async onFavorite (article) {
      this.article.favoriteDisabled = true
      if (article.favorited) {
        // 取消点赞
        await deleteFavorite(article.slug)
        this.article.favorited = false
        this.article.favoritesCount -= 1
      } else {
        // 点赞
        await addFavorite(article.slug)
        this.article.favorited = true
        this.article.favoritesCount += 1
      }
      this.article.favoriteDisabled = false
    }
  },
};
</script>

<style>
</style>
