import firebase from 'firebase/app'

export default {
    state: {
        tasks: [],
        subtasks: []
    },
    mutations: {
        updateTasks(state, tasks) {
            state.tasks = tasks
        },

        deleteTask(state, id) {
            state.tasks = state.tasks.filter( t => t.id !== id)
        },

        updateSubtasks(state, subtasks) {
            state.subtasks = subtasks
        },

        deleteSubtask(state, id) {
            state.subtasks = state.subtasks.filter( t => t.id !== id)
        }
    },
    actions: {
        async fetchTasks({ commit, dispatch }) {
            try {
                const uid = await dispatch('getUid')
                const tasks = (await firebase.database().ref(`/users/${uid}/tasks`).once('value')).val() || {}

                commit('updateTasks', Object.keys(tasks).map(key => ({...tasks[key], id: key})))
            } catch (e) {
                M.toast({html: e.code})
                throw e
            }
        },
        async fetchTaskById({ dispatch, commit }, id) {
            try {
                const uid = await dispatch('getUid')
                const task = (await firebase.database().ref(`/users/${uid}/tasks`).child(id).once('value')).val() || {}

                return {...task, id}
            } catch (e) {
                M.toast({html: e.code})
                throw e
            }
        },
        async createTask({ commit, dispatch }, { title, description, date, completed, importance, dateCompletion, timeCompletion, files }) {
            try {
                const uid = await dispatch('getUid')

                if (files.length) {
                    let key
                    let filesUrl = []
                    firebase.database().ref(`/users/${uid}/tasks`).push({ title, description, date, completed, importance, dateCompletion, timeCompletion, files })
                        .then(data => {
                            key = data.key
                            firebase.database().ref(`/users/${uid}/tasks`).child(key).update({ parentId: key })
                            return key
                        })
                        .then( key => {
                            files.forEach( f => {
                                firebase.storage().ref('tasks/' + key + '_' + f.name).put(f.file)
                                    .then( () => {
                                        firebase.storage().ref('tasks/' + key + '_' + f.name).getDownloadURL()
                                            .then(fileUrl => {
                                                filesUrl.push(fileUrl)
                                                firebase.database().ref(`/users/${uid}/tasks`).child(key).update({ filesUrl: filesUrl })
                                            })
                                    })
                            })
                        })
                }
                else {
                    let key
                    firebase.database().ref(`/users/${uid}/tasks`).push({ title, description, date, completed, importance, dateCompletion, timeCompletion })
                        .then(data => {
                            key = data.key
                            firebase.database().ref(`/users/${uid}/tasks`).child(key).update({ parentId: key })
                            return key
                        })
                }

            } catch (e) {
                M.toast({ html: e.code })
                throw e
            }
        },
        async deleteTask({ commit, dispatch },  { id } ) {
            try {
                const uid = await dispatch('getUid')
                await firebase.database().ref(`/users/${uid}/tasks/${id}`).remove()

                commit('deleteTask', id)
            } catch (e) {
                M.toast({html: e.code})
                throw e
            }
        },
        async updateTask({ commit, dispatch }, { title, description, date, importance, id, dateCompletion, timeCompletion, files }) {
            try {
                const uid = await dispatch('getUid')

                let key
                let filesUrl = []
                firebase.database().ref(`/users/${uid}/tasks`).child(id).update({ title, description, date, importance, dateCompletion, timeCompletion, files })
                    .then(() => {
                        key = id
                        return key
                    })
                    .then( key => {
                        files.forEach( f => {
                            firebase.storage().ref('tasks/' + key + '_' + f.name).put(f.file)
                                .then( () => {
                                    firebase.storage().ref('tasks/' + key + '_' + f.name).getDownloadURL()
                                        .then(fileUrl => {
                                            filesUrl.push(fileUrl)
                                            firebase.database().ref(`/users/${uid}/tasks`).child(key).update({ filesUrl: filesUrl })
                                        })
                                })
                        })
                    })
            } catch (e) {
                M.toast({ html: e.code })
                throw e
            }
        },
        async updateSubtask({ commit, dispatch }, { title, description, date, importance, parentId, id, dateCompletion, timeCompletion, files }) {
            try {
                const uid = await dispatch('getUid')

                let key
                let filesUrl = []
                firebase.database().ref(`/users/${uid}/tasks/${parentId}/subtasks`).child(id).update({ title, description, date, importance, files, dateCompletion, timeCompletion, })
                    .then(() => {
                        key = id
                        return key
                    })
                    .then( key => {
                        files.forEach( f => {
                            firebase.storage().ref(`tasks/task_${parentId}/subtasks` + key + '_' + f.name).put(f.file)
                                .then( () => {
                                    firebase.storage().ref(`tasks/task_${parentId}/subtasks` + key + '_' + f.name).getDownloadURL()
                                        .then(fileUrl => {
                                            filesUrl.push(fileUrl)
                                            firebase.database().ref(`/users/${uid}/tasks/${parentId}/subtasks`).child(key).update({ filesUrl: filesUrl })
                                        })
                                })
                        })
                    })
            } catch (e) {
                M.toast({ html: e.code })
                throw e
            }
        },
        async updateProgressTask({ commit, dispatch }, { completed, id}) {
            try {
                const uid = await dispatch('getUid')
                await firebase.database().ref(`/users/${uid}/tasks`).child(id).update({ completed })
            } catch (e) {
                throw e
            }
        },
        async createSubtask({ dispatch, commit }, { title, description, date, completed, importance, parentId, files, dateCompletion, timeCompletion }) {
            try {
                const uid = await dispatch('getUid')

                if (files.length) {
                    let key
                    let filesUrl = []
                    firebase.database().ref(`/users/${uid}/tasks/${parentId}/subtasks`).push({ title, description, date, completed, parentId, importance, files, dateCompletion, timeCompletion, })
                        .then(data => {
                            key = data.key
                            return key
                        })
                        .then( key => {
                            files.forEach( f => {
                                firebase.storage().ref(`tasks/task_${parentId}/subtasks` + key + '_' + f.name).put(f.file)
                                    .then( () => {
                                        firebase.storage().ref(`tasks/task_${parentId}/subtasks` + key + '_' + f.name).getDownloadURL()
                                            .then(fileUrl => {
                                                filesUrl.push(fileUrl)
                                                firebase.database().ref(`/users/${uid}/tasks/${parentId}/subtasks`).child(key).update({ filesUrl: filesUrl })
                                            })
                                    })
                            })
                        })
                }
                else {
                    let key
                    firebase.database().ref(`/users/${uid}/tasks/${parentId}/subtasks`).push({ title, description, date, completed, parentId, importance, dateCompletion, timeCompletion })
                        .then(data => {
                            key = data.key
                            return key
                        })
                }
            } catch(e) {
                throw e
            }
        },
        async fetchSubtasks({ commit, dispatch }, parentId) {
            try {
                const uid = await dispatch('getUid')
                const subtasks = (await firebase.database().ref(`/users/${uid}/tasks/${parentId}/subtasks`).once('value')).val() || {}

                commit('updateSubtasks', Object.keys(subtasks).map(key => ({...subtasks[key], id: key})))
            } catch (e) {
                M.toast({html: e.code})
                throw e
            }
        },
        async updateProgressSubtask({ commit, dispatch }, { completed, id, parentId }) {
            try {
                const uid = await dispatch('getUid')
                await firebase.database().ref(`/users/${uid}/tasks/${parentId}/subtasks`).child(id).update({ completed })
            } catch (e) {
                throw e
            }
        },
        async deleteSubtask({ dispatch, commit }, { parentId, id }) {
            try {
                const uid = await dispatch('getUid')
                await firebase.database().ref(`/users/${uid}/tasks/${parentId}/subtasks/${id}`).remove()

                commit('deleteSubtask', id)
            } catch(e) {
                throw e
            }
        },
        async fetchSubtaskById({ dispatch, commit }, id, parentId) {
            try {
                const uid = await dispatch('getUid')
                const task = (await firebase.database().ref(`/users/${uid}/tasks/${parentId}/subtasks`).child(id).once('value')).val() || {}
                return { ...task, id }
            } catch (e) {
                M.toast({html: e.code})
                throw e
            }
        },
    },
    getters: {
        getTasks: s => s.tasks,
        getSubtasks: s => s.subtasks,
        getTaskById: state => id => {
            return state.tasks.find(t => t.id === id);
        },
        getSubtaskById: state => id => {
            return state.subtasks.find(t => t.id === id);
        }
    }
}

