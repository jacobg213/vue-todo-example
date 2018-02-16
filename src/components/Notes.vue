/*eslint-env jquery*/
<template>
  <div class="notes container">
    <h1>Hi {{ name }}</h1>
    <button type="button" class="btn btn-primary" data-toggle="modal" data-target=".new-note">Create new note</button>
    <h2>These are your notes:</h2>
    <div class="row">
      <div v-if="!has_notes" class="col-sm-12 text-center">
        <span>Sorry you do not have any notes.</span>
      </div>
      <div class="card-columns" v-if="has_notes">
        <div class="card" v-for="note in notes" :key="note.id">
          <div class="card-body">
            <h5 class="card-title">{{ note.title }}</h5>
            <div class="text-center">
              <a v-on:click="goto(note.id)" class="btn btn-primary">View note</a>
              <button v-on:click.prevent="remove(note.id)" class="btn btn-danger">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12">
        <button class="btn" v-on:click="logout()">Logout</button>
      </div>
    </div>

    <div id="new-note-modal" class="modal fade new-note" tabindex="-1" role="dialog" aria-labelledby="NewNoteModal" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">New note</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group">
                <label for="type">Type:</label>
                <select v-model="newType" class="form-control" id="type">
                  <option value='0'>Regular note</option>
                  <option value='1'>Todo list</option>
                </select>
              </div>
              <div class="form-group">
                <label for="title" class="col-form-label">Title:</label>
                <input v-model="newTitle" type="text" class="form-control" id="title">
              </div>
              <div class="form-group">
                <label for="body" class="col-form-label">Content:</label>
                <textarea v-model="newBody" class="form-control" id="body"></textarea>
              </div>
              <div class="text-left" v-if="newType === '1'">
                <button class="btn" v-on:click.prevent="add_task()">Add task</button>
                <div class="text-center" v-for="task in newTasks" :key="task.id">
                  <div class="form-group">
                    <label for="body" class="col-form-label">Task:</label>
                    <button type="button" class="pull-right btn btn-sm" v-on:click.prevent="remove_task(task.id)">
                      <span aria-hidden="true">&times;</span>
                    </button>
                    <textarea v-model="task.body" class="form-control" id="body"></textarea>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" v-on:click.prevent="save_new_note()" class="btn btn-primary">Save note</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import Domain from './../config'
import router from './../router'
export default {
  name: 'Notes',
  data () {
    return {
      name: '',
      user_id: '',
      notes: [],
      newTitle: '',
      newBody: '',
      newType: '0',
      newTasks: []
    }
  },
  computed: {
    has_notes: function () {
      return this.notes.length > 0
    }
  },
  mounted () {
    this.name = this.$root.name
    this.user_id = this.$root.user_id
    this.load_notes()
  },
  methods: {
    goto (id) {
      router.push({
        name: 'Note',
        params: {
          id: id
        }
      })
    },
    remove (id) {
      let sure = confirm('Do you really want to delete this note?')
      if (sure) {
        this.axios.delete(Domain + 'notes/' + id + '/delete?token=' + this.$root.token)
          .then((response) => {
            this.$root.$emit('update_token', response.data.token)
            this.load_notes()
          }).catch(function (error) {
            alert(error.response.data)
          })
      }
    },
    load_notes () {
      this.axios.get(Domain + 'notes/index?token=' + this.$root.token)
        .then((response) => {
          this.$root.$emit('update_token', response.data.token)
          this.notes = response.data.resource.data
        }).catch(function (error) {
          alert(error.response.data)
        })
    },
    save_new_note () {
      if (this.newType === '0') {
        this.axios.post(Domain + 'notes', {
          token: this.$root.token,
          title: this.newTitle,
          body: this.newBody,
          type: this.newType
        }).then((response) => {
          this.$root.$emit('update_token', response.data.token)
          this.load_notes()
        }).catch(function (error) {
          alert(error.response.data)
        })
      } else if (this.newType === '1') {
        this.axios.post(Domain + 'notes', {
          token: this.$root.token,
          title: this.newTitle,
          body: this.newBody,
          type: this.newType,
          tasks: this.newTasks
        }).then((response) => {
          this.$root.$emit('update_token', response.data.token)
          this.load_notes()
        }).catch(function (error) {
          alert(error.response.data)
        })
      } else {
        alert('Something went wrong!')
      }
      $('#new-note-modal').modal('toggle')
      this.newTitle = ''
      this.newBody = ''
      this.newType = '0'
      this.newTasks = []
    },
    add_task () {
      this.newTasks.push({
        id: this.newTasks.length,
        body: '',
        status: false
      })
    },
    remove_task (id) {
      this.newTasks.splice(id, 1)
    },
    logout () {
      this.axios.post(Domain + 'logout', {
        token: this.$root.token
      }).then((response) => {
        this.$root.$emit('update_token', '')
        router.push({
          name: 'Welcome'
        })
      }).catch(function (error) {
        alert(error.response.data)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pull-right {
  float: right;
}
.btn-primary {
  color: white !important;
}
</style>
