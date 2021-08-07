import firebase from 'firebase/app'

export default {
    actions: {
        async login({ dispatch, commit }, { email, password }) {
            try {
                await firebase.auth().signInWithEmailAndPassword(email, password)
            } catch (e) {
                switch(e.code) {
                    case 'auth/user-not-found':
                        M.toast({html: 'Пользователя с таким email не существует'})
                        break
                    case 'auth/wrong-password':
                        M.toast({html: 'Неверный пароль'})
                        break
                    default:
                        M.toast({html: e.code})
                }
                throw e
            }
        },
        async register({dispatch, commit}, {email, password, name, isAgree}) {
            try {
                await firebase.auth().createUserWithEmailAndPassword(email, password)
                const uid = await dispatch('getUid')
                await firebase.database().ref(`/users/${uid}/info`).set({
                    name,
                    isAgree
                })
            } catch (e) {
                switch(e.code) {
                    case 'auth/email-already-in-use':
                        M.toast({html: 'Email уже занят'})
                        break
                    default:
                        M.toast({html: e.code})
                }
                throw e
            }
        },
        getUid() {
            const user = firebase.auth().currentUser
            return user ? user.uid : null
        },
        async logout({ commit }) {
            await firebase.auth().signOut()
            commit('clearInfo')
        }
    }
}

