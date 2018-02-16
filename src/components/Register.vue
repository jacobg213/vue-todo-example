<template>
  <div class="register container">
    <h1>Register to start using the app</h1>
    <h2>Please enter your details</h2>
    <div class="row">
      <div class="col-sm-12">
        <form>
          <div class="form-group">
            <label for="name">Your name:</label>
            <input v-model="name" type="text" class="form-control" id="name" placeholder="Enter your name">
          </div>
          <div class="form-group">
            <label for="email">Email address:</label>
            <input v-model="email" type="email" class="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter your email">
            <small id="emailHelp" class="form-text text-muted">We will never share your email with anyone.</small>
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input v-model="password" type="password" class="form-control" id="password" placeholder="Password">
          </div>
          <div class="form-group">
            <label for="password_confirmation">Confirm your password:</label>
            <input v-model="password_confirmation" type="password" class="form-control" id="password_confirmation" placeholder="Password">
          </div>
          <button v-on:click.prevent="register()" type="submit" class="btn btn-primary">Register</button>
        </form>
      </div>
      <div class="col-sm-12">
        <span>Already have an account? <router-link v-bind:to="'/'">Click here.</router-link></span>
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
  name: 'Register',
  data () {
    return {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      has_error: false,
      error_message: ''
    }
  },
  methods: {
    register () {
      let self = this
      this.axios.post(Domain + 'register', {
        name: this.name,
        email: this.email,
        password: this.password,
        password_confirmation: this.password_confirmation
      }).then((response) => {
        alert('Your account has been registered!')
        router.push({
          name: 'Welcome'
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
