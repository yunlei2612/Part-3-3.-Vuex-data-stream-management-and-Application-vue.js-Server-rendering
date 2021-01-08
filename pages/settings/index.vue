<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>
          <form @submit.prevent="updatedUser">
            <fieldset>
              <fieldset class="form-group">
                <input class="form-control" type="text" v-model="user.image" placeholder="URL of profile picture" />
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" v-model="user.username" type="text" placeholder="Your Name" required/>
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control form-control-lg"
                  rows="8"
                  v-model="user.bio"
                  placeholder="Short bio about you"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" v-model="user.email" type="email" placeholder="Email" required/>
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" type="password" v-model="user.password" placeholder="Password" required/>
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right">Update Settings</button>
            </fieldset>
          </form>
          <hr/>
          <button class="btn btn-outline-danger" @click="logout()">
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserInfo, updatedUser } from "@/api/user";
const Cookie = process.client ? require("js-cookie") : undefined;
export default {
  middleware: "authenticated",
  name: "SettingsIndex",
  data() {
    return {
      user: {
        image: "", // 
        username: "",
        password: "",
        bio: "",
        email: "",
      },
    };
  },
  async asyncData() {
    const { data } = await getUserInfo();
    const user = data.user;
    console.log(data)
    return {
      user
    };
  },

  methods: {
    async logout() {
      this.$store.commit("setUser", null);
      Cookie.set("user", null);
      this.$router.push("/");
    },
    async updatedUser () {
      const { data } = await updatedUser({user: this.user})
      this.$store.commit('setUser', data.user)
      Cookie.set('user', data.user)
      this.$router.push('/profile/'+ data.user.username)
    }
  },
};
</script>

<style>
</style>
