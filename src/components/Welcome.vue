<template>
  <div class="welcome container">
    <h1>Welcome to the TODO/Notebook app</h1>
    <h2>Please log in or <router-link v-bind:to="'/register'">register</router-link> your account</h2>
    <div class="row">
      <div class="col-sm-12">
        <form>
          <div class="form-group">
            <label for="email">Email address:</label>
            <input v-model="email" type="email" class="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter your email">
            <small id="emailHelp" class="form-text text-muted">Enter the email you used to register</small>
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input v-model="password" type="password" class="form-control" id="password" placeholder="Password">
          </div>
          <button type="submit" class="btn btn-primary" v-on:click.prevent="login()">Login</button>
        </form>
      </div>
    </div>
    <div v-if="has_error" class="row">
      <div class="col-sm-12 text-left">
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          {{ error_message }}
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Domain from './../config'
import router from './../router'
export default {
  name: 'Welcome',
  data () {
    return {
      email: '',
      password: '',
      has_error: false,
      error_message: ''
    }
  },
  methods: {
    login () {
      let self = this
      this.axios.post(Domain + 'login', {
        email: this.email,
        password: this.password
      }).then((response) => {
        this.$root.$emit('logged_id', response.data.resource.id, response.data.resource.name)
        this.$root.$emit('update_token', response.data.token)
        router.push({
          name: 'Notes'
        })
      }).catch(function (error) {
        self.has_error = true
        self.error_message = error.response.data
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
