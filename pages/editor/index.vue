<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form>
            <fieldset>
              <fieldset class="form-group">
                <input
                  v-model="article.title"
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="article.description"
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model="article.body"
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  v-model="tag"
                  @keyup.enter="addTag"
                  placeholder="Enter tags"
                />
                <div class="tag-list" v-if="article && article.tagList.length > 0">
                  <span
                    class="tag-default tag-pill"
                    v-for="(item, index) in article.tagList"
                    :key="index"
                  >
                    <i class="ion-close-round"></i>
                    {{ item }}
                  </span>
                </div>
              </fieldset>
              <button
                class="btn btn-lg pull-xs-right btn-primary"
                type="button"
                @click="updateArticle"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { addArticle, editArticle } from "@/api/edit";
import { getArticle } from "@/api/article";
export default {
  // 在路由匹配组件渲染之前会先执行中间件处理
  middleware: "authenticated",
  name: "EditorIndex",

  data() {
    return {
      article: {
        body: "",
        description: "",
        tagList: [],
        title: "",
      },
      tag: "",
    };
  },
  async asyncData(context) {
    console.log(context);
    if (!context.params.slug) {
      return {
        article: {
          body: "",
          description: "",
          tagList: [],
          title: "",
        },
      };
    }
    const { data } = await getArticle(context.params.slug);
    const { article } = data;
    const tag = "";
    return {
      tag,
      article,
    };
  },

  methods: {
    addTag() {
      this.tag.trim() && this.article.tagList.unshift(this.tag.trim());
      this.tag = "";
    },
    async updateArticle() {
      const {
        article,
        article: { slug = "" },
      } = this;
      if (slug) {
        const { data } = await editArticle({ article });
        this.$router.push("/article/" + data.article.slug);
      } else {
        const { data } = await addArticle({ article });
        this.$router.push("/article/" + data.article.slug);
      }
    },
  },
};
</script>

<style>
</style>
