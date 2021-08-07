<template>
  <Loader v-if="loading" />

  <!-- Form input fields -->
  <div v-else class="formData">
    <p class="required">* Required field</p>
    <!--Title of the task-->
    <div class="form-group" :class="{ error: v$.task.title.$errors.length }">
      <label for="title">Title <span class="required">*</span></label>
      <input id="title" class="form-control" placeholder="Enter title of the task" type="text" v-model="v$.task.title.$model">
      <!-- Error message -->
      <div class="input-errors" v-for="(error, index) of v$.task.title.$errors" :key="index">
        <div class="error-msg">{{ error.$message }}</div>
      </div>
    </div>

    <!--Description of the task-->
    <div class="input-field">
      <textarea id="description" class="materialize-textarea" v-model="task.description"></textarea>
      <label for="description">Description of the task</label>
    </div>

    <!--Importance-->
    <div class="form-group" :class="{ error: v$.task.importance.$errors.length }">
      <label for="importance">Importance <span class="required">*</span></label>
      <input id="importance" class="form-control" placeholder="Enter importance of the task" type="number" min="0" max="5" v-model="v$.task.importance.$model" @change="checkImportance">
      <!-- Error message -->
      <div class="input-errors" v-for="(error, index) of v$.task.title.$errors" :key="index">
        <div class="error-msg">{{ error.$message }}</div>
      </div>
    </div>

    <!-- Date of completion -->
    <div class="form-group" :class="{ error: v$.task.dateCompletion.$errors.length }">
      <label for="dateCompletion">Date of completion <span class="required">*</span></label>
      <input id="dateCompletion" class="form-control" placeholder="Select date of completion" type="text" ref="dateCompletion" v-model.lazy="v$.task.dateCompletion.$model">
      <!-- Error message -->
      <div class="input-errors" v-for="(error, index) of v$.task.dateCompletion.$errors" :key="index">
        <div class="error-msg">{{ error.$message }}</div>
      </div>
    </div>

    <!-- Time of completion -->
    <div class="form-group" :class="{ error: v$.task.timeCompletion.$errors.length }">
      <label for="timeCompletion">Time of completion <span class="required">*</span></label>
      <input id="timeCompletion" class="form-control" placeholder="Select time of completion" type="text" ref="timeCompletion" v-model.lazy="v$.task.timeCompletion.$model">
      <!-- Error message -->
      <div class="input-errors" v-for="(error, index) of v$.task.timeCompletion.$errors" :key="index">
        <div class="error-msg">{{ error.$message }}</div>
      </div>
    </div>

    <!-- Upload files -->
    <span class="btn btn-file deep-purple accent-3">
      Upload files
      <input type="file" @change="uploadFiles" multiple>
    </span>

    <!-- Uploaded files -->
    <template v-if="task.files">
      <div v-if="task.files.length">
        <h6>Uploaded files:</h6>
        <div v-for="(file, idx) in task.files" :key="idx" class="files">
          <div class="file">
            <div class="file__preview">
              <figure v-if="file.preview">
                <img :src="file.preview" alt="Preview of uploaded image">
              </figure>
              <i v-else class="material-icons">upload_file</i>
            </div>
            <div class="file__name">
              {{ file.name }}
            </div>
            <div class="file__delete">
              <TodoItemButton @click="removeFile(file)" :color="'red accent-3'" :icon="'delete_outline'"/>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Form buttons -->
    <div class="buttons">
      <!--Create button-->
      <SubmitButton @click="sendData" :text="submitButton" :color="'pink accent-2'" :disabled="v$.$invalid"/>

      <!--Back button-->
      <AppButton @click="backRoute" :text="'back'" :icon="'arrow_back'" :color="'grey'" :is-large="false"/>
    </div>

  </div>
</template>

<script>
  import useVuelidate from '@vuelidate/core'
  import { required } from '@vuelidate/validators'

  import SubmitButton from '@/components/buttons/SubmitButton'
  import AppButton from '@/components/buttons/AppButton'
  import TodoItemButton from '@/components/buttons/TodoItemButton'
  import Loader from '@/components/app/Loader'

  export default {
    name: "FormTask",
    emits: ["sendData"],

    props: {
      submitButton: {
        type: String,
        required: true
      },
      editView: {
        type: Boolean,
        required: false
      }
    },

    setup () {
      return { v$: useVuelidate() }
    },

    data() {
      return {
        task: {
          title: '',
          description: '',
          importance: null,
          dateCompletion: '',
          timeCompletion: '',
          files: []
        },
        loading: true
      }
    },

    validations() {
      return {
        task: {
          title: {
            required
          },
          importance: {
            required,
          },
          dateCompletion: {
            required
          },
          timeCompletion: {
            required
          }
        }
      }
    },

    computed: {
      checkImportance() {
        if (this.task.importance < 0) {
          M.toast({html: 'Самое маленькое значение - 0'})
          this.task.importance = 0
        }
        else if (this.task.importance > 5) {
          M.toast({html: 'Самое большое значение - 5'})
          this.task.importance = 5
        }
      }
    },

    methods: {
      sendData() {
        this.$emit('sendData', this.task)
      },

      backRoute() {
        this.$router.go(-1)
      },

      uploadFiles(e) {
        this.task.files = []
        const fileList = Array.prototype.slice.call(e.target.files)

        fileList.forEach(f => {

          let newFile = {}
          newFile.name = f.name
          newFile.file = f

          if(!f.type.match("image.*")) {
            //newFile.preview = null
            this.task.files.push(newFile)
            return
          }

          let ctx = this
          let reader = new FileReader()
          reader.onload = function (e) {
            newFile.preview = e.target.result
            ctx.task.files.push(newFile)
          }

          reader.readAsDataURL(f)
        })

      },

      removeFile(file) {
        this.task.files = this.task.files.filter(f => f !== file)
      }
    },

    async mounted() {

      this.$nextTick(() => {
        M.Datepicker.init(this.$refs.dateCompletion, {
          format: 'dd.mm.yyyy'
        })
        M.Timepicker.init(this.$refs.timeCompletion, {
          twelveHour: false
        })
      })

      if (this.editView) {

        const id = this.$route.params.id,
              parentId = this.$route.params.parentId
        let task

        if (id === parentId) {
          task = this.$store.getters.getTaskById(id)
        }
        else {
          task = this.$store.getters.getSubtaskById(id)
        }

        this.task = {
          ...task
        }
      }

      this.loading = false
    },

    components: {
      SubmitButton,
      AppButton,
      TodoItemButton,
      Loader
    }
  }
</script>

<style lang="scss" scoped>
  h6 {
    margin-bottom: 20px;
    font-weight: 600;
  }

  .required {
    color: #ff0000;
  }

  .material-icons {
    font-size: 3rem;
  }

  .file {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
  }

  .buttons {
    display: flex;
    justify-content: space-between;
  }

  .btn-file {
    margin-bottom: 20px;
    position: relative;
    overflow: hidden;
  }

  .btn-file input[type=file] {
    position: absolute;
    top: 0;
    right: 0;
    min-width: 100%;
    min-height: 100%;
    font-size: 100px;
    text-align: right;
    filter: alpha(opacity=0);
    opacity: 0;
    outline: none;
    background: white;
    cursor: inherit;
    display: block;
  }

  figure {
    width: 100px;
    height: 100px;
    margin: 0;
  }

  figure img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
