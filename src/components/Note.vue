/*eslint-env jquery*/
<template>
  <div class="note container">
    <div class="card text-left">
      <div class="card-body">
        <button class="btn" style="float:right" v-on:click="go_back()">Go back</button>
        <button class="btn btn-primary mr-2" style="float:right" data-toggle="modal" data-target=".edit-note">Edit note</button>
        <h5 class="card-title">{{ title }}</h5>
        <p class="card-text">{{ body }}</p>
        <ul v-if="has_tasks" class="list-group list-group-flush">
          <li v-for="task in tasks" :key="task.id" class="list-group-item list-group-item-action" v-bind:class="{completed : task.status}">
            <span v-if="editedTask !== task.id">{{ task.body }}</span>
            <div style="display:inline" v-if="editedTask === task.id">
              <input type="text" v-model="task.body">
              <button class="btn btn-primary" v-on:click="update_task(task.id, task.status)">Save</button>
            </div>
            <button style="float:right" class="btn btn-danger mt-2" v-on:click="remove_task(task.id)">Remove</button>
            <button style="float:right" class="btn btn-default mt-2 mr-2" v-on:click="edit_task(task.id)">Edit</button>
            <button style="float:right" class="btn btn-primary mt-2 mr-2" v-on:click="update_task(task.id, !task.status)">Toggle</button>
          </li>
        </ul>
        <div class="text-center" v-if="this.type === 1">
          <button class="btn btn-primary mt-4" data-toggle="modal" data-target=".add-task">Add task</button>
        </div>
      </div>
    </div>

    <div id="edit-note-modal" class="modal fade edit-note" tabindex="-1" role="dialog" aria-labelledby="EditNoteModal" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Editing a note</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group">
                <label for="title" class="col-form-label">Title:</label>
                <input v-model="title" type="text" class="form-control" id="title">
              </div>
              <div class="form-group">
                <label for="body" class="col-form-label">Content:</label>
                <textarea v-model="body" class="form-control" id="body"></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" v-on:click.prevent="update_note()" class="btn btn-primary">Save note</button>
          </div>
        </div>
      </div>
    </div>

    <div id="add-task-modal" class="modal fade add-task" tabindex="-1" role="dialog" aria-labelledby="AddTaskModal" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Creating a new task</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group">
                <label for="new-task-body" class="col-form-label">Content:</label>
                <textarea v-model="newTaskBody" class="form-control" id="new-task-body" placeholder="What's the task?"></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" v-on:click.prevent="add_task()" class="btn btn-primary">Add new task</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import router from './../router'
import Domain from './../config'
export default {
  name: 'Note',
  data () {
    return {
      id: '',
      title: '',
      body: '',
      type: '',
      created_at: '',
      updated_at: '',
      tasks: [],
      newTaskBody: '',
      editedTask: ''
    }
  },
  computed: {
    has_tasks: function () {
      return this.tasks.length > 0
    }
  },
  mounted () {
    this.name = this.$root.name
    this.user_id = this.$root.user_id
    this.get_note_details()
  },
  methods: {
    get_note_details () {
      this.axios.get(Domain + 'notes/' + this.$route.params.id + '?token=' + this.$root.token)
        .then((response) => {
          this.$root.$emit('update_token', response.data.token)
          this.id = response.data.resource.id
          this.title = response.data.resource.title
          this.body = response.data.resource.body
          this.type = response.data.resource.type
          this.created_at = response.data.resource.created_at
          this.updated_at = response.data.resource.updated_at
          this.tasks = response.data.resource.tasks
        }).catch(function (error) {
          alert(error.response.data)
        })
    },
    update_task (id, completed) {
      let task = this.tasks.find(x => x.id === id)
      this.axios.patch(Domain + 'tasks/' + id + '/update', {
        token: this.$root.token,
        body: task.body,
        status: completed,
        note_id: this.id
      }).then((response) => {
        this.$root.$emit('update_token', response.data.token)
        this.get_note_details()
        this.editedTask = ''
      }).catch(function (error) {
        alert(error.response.data)
      })
    },
    remove_task (id) {
      let sure = confirm('Do you really want to delete this task?')
      if (sure) {
        this.axios.delete(Domain + 'tasks/' + id + '/delete?token=' + this.$root.token)
          .then((response) => {
            this.$root.$emit('update_token', response.data.token)
            this.get_note_details()
          }).catch(function (error) {
            alert(error.response.data)
          })
      }
    },
    update_note () {
      this.axios.patch(Domain + 'notes/' + this.id + '/update', {
        token: this.$root.token,
        title: this.title,
        body: this.body,
        type: this.type
      }).then((response) => {
        this.$root.$emit('update_token', response.data.token)
        this.get_note_details()
        $('#edit-note-modal').modal('toggle')
      }).catch(function (error) {
        alert(error.response.data)
      })
    },
    go_back () {
      router.push({
        name: 'Notes'
      })
    },
    add_task () {
      this.axios.post(Domain + 'tasks', {
        token: this.$root.token,
        body: this.newTaskBody,
        status: false,
        note_id: this.id
      }).then((response) => {
        this.$root.$emit('update_token', response.data.token)
        this.get_note_details()
        $('#add-task-modal').modal('toggle')
        this.newTaskBody = ''
      }).catch(function (error) {
        alert(error.response.data)
      })
    },
    edit_task (id) {
      this.editedTask = id
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.completed {
  text-decoration: line-through;
  background-color: rgb(240, 250, 240);
}
.note {
  white-space: pre-wrap;
}
</style>
