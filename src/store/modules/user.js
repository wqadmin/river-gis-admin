import Vue from 'vue'
import {
  login,
  logout,
  getUserCurrent,
  projectMinesTructure
} from '@/api/login'
import {
  ACCESS_TOKEN
} from '@/store/mutation-types'
import {
  welcome
} from '@/utils/util'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, {
      name,
      welcome
    }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    Login({
      commit,
      state,
      rootState
    }, userInfo) {
      console.log(userInfo);
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const result = response.data
          Vue.ls.set(ACCESS_TOKEN, 'Bearer ' + result.token, 7 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', 'Bearer ' + result.token)
          getUserCurrent().then(res => {
            var arr = res.data
            res.data.forEach(v => {
              if (v.id=="5e142f3273e44f2d59d43766") {
                commit('getOperationPermission',{name:v.write,key:0})
              }else if(v.id=="5e142f8373e44f2d59d43767"){
                commit('getOperationPermission',{name:v.write,key:1})
              }else if(v.id=="5e142f8e73e44f2d59d43768"){
                v.children.forEach(a => {
                  if (a.id=="5e144bdfa96a47239fbf9d72") {
                    commit('getOperationPermission',{name:a.write,key:2})
                  }else if(a.id=="5e15857aa96a47239fbf9dc5"){
                    commit('getOperationPermission',{name:a.write,key:3})
                  }else if(a.id=="5e15858ba96a47239fbf9dc6"){
                    commit('getOperationPermission',{name:a.write,key:4})
                  }else if(a.id=="5e1585d5a96a47239fbf9dc8"){
                    commit('getOperationPermission',{name:a.write,key:5})
                  }else if(a.id=="5e1587f4a96a47239fbf9dc9"){
                    commit('getOperationPermission',{name:a.write,key:6})
                  }else if(a.id=="5e158f06a96a47239fbf9dcf"){
                    commit('getOperationPermission',{name:a.write,key:7})
                  }else if(a.id=="5e158f26a96a47239fbf9dd0"){
                    commit('getOperationPermission',{name:a.write,key:8})
                  }else if(a.id=="5e158f37a96a47239fbf9dd1"){
                    commit('getOperationPermission',{name:a.write,key:9})
                  }else if(a.id=="5e158f4ba96a47239fbf9dd2"){
                    commit('getOperationPermission',{name:a.write,key:10})
                  }else if(a.id=="5e158f58a96a47239fbf9dd3"){
                    commit('getOperationPermission',{name:a.write,key:11})
                  }else if(a.id=="5e158f67a96a47239fbf9dd4"){
                    commit('getOperationPermission',{name:a.write,key:12})
                  }
                  // else if(a.id=="5e1585b3a96a47239fbf9dc7"){
                  //   commit('getOperationPermission',{name:a.write,key:5})
                  // }
                });
              }
            });
            if (arr[0].children) {
              window.localStorage.setItem('DefaultRoutePath', arr[0].children[0].route)
              // commit('getDefaultRoutePath', arr[0].children[0].route)
            }else{
              window.localStorage.setItem('DefaultRoutePath', arr[0].route)
              // commit('getDefaultRoutePath', arr[0].route)
            }
          })
          // getUserCurrent().then(res => {
          //   console.log(res)
          //   console.log(rootState.permissionList)
          //   let data = res.data.permission
          //   for (const item of permissionInfo) {
          //     for (const value of data) {
          //       item.filter(key => {
          //         if (value.id == key.id) {
          //           console.log(key)
          //           if (data[value]) {
          //             key.read = true
          //             key.write = true
          //           } else {
          //             key.read = true
          //             key.write = false
          //           }
          //         }
          //       })
          //     }
          //   }
          //   commit('permissionListsFn', permissionInfo)
          // }).catch(error => {
          //   reject(error)
          // })
          projectMinesTructure().then(res => {
            commit('projectInfoFn', res.data)
            var arr = res.data
            if (rootState.defautProject.length <= 0) {
              if (arr[0].children != null) {
                if (arr[0].children.length > 0) {
                  // 默认项目id
                  commit('show', arr[0].children[0].id)
                  // 默认项目中心点
                  commit('projectCoordinateFn', arr[0].children[0].coordinate)
                  // 默认天气
                  commit('weather', arr[0].children[0].locationId)
                  // 默认项目选择第一项
                  let defautProject = []
                  defautProject.push(arr[0].id)
                  defautProject.push(arr[0].children[0].id)
                  commit('SET_DEFAUT_PROJECT', defautProject)
                  // Vue.ls.set('SET_PROJECT_ID', arr[i].children[0].id)
                }
              } else {
                arr[0].children = []
              }
            }
            resolve()
          }).catch(error => {
            reject(error)
          })
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetInfo1 ({ commit }) {
      return new Promise((resolve, reject) => {
        getUserCurrent().then(res => {
          var arr = []
          res.data.forEach(v => {
            if (v.id=="5e142f3273e44f2d59d43766") {
              commit('getOperationPermission',{name:v.write,key:0})
            }else if(v.id=="5e142f8373e44f2d59d43767"){
              commit('getOperationPermission',{name:v.write,key:1})
            }else if(v.id=="5e142f8e73e44f2d59d43768"){
              v.children.forEach(a => {
                if (a.id=="5e144bdfa96a47239fbf9d72") {
                  commit('getOperationPermission',{name:a.write,key:2})
                }else if(a.id=="5e15857aa96a47239fbf9dc5"){
                  commit('getOperationPermission',{name:a.write,key:3})
                }else if(a.id=="5e15858ba96a47239fbf9dc6"){
                  commit('getOperationPermission',{name:a.write,key:4})
                }else if(a.id=="5e1585d5a96a47239fbf9dc8"){
                  commit('getOperationPermission',{name:a.write,key:5})
                }else if(a.id=="5e1587f4a96a47239fbf9dc9"){
                  commit('getOperationPermission',{name:a.write,key:6})
                }else if(a.id=="5e158f06a96a47239fbf9dcf"){
                  commit('getOperationPermission',{name:a.write,key:7})
                }else if(a.id=="5e158f26a96a47239fbf9dd0"){
                  commit('getOperationPermission',{name:a.write,key:8})
                }else if(a.id=="5e158f37a96a47239fbf9dd1"){
                  commit('getOperationPermission',{name:a.write,key:9})
                }else if(a.id=="5e158f4ba96a47239fbf9dd2"){
                  commit('getOperationPermission',{name:a.write,key:10})
                }else if(a.id=="5e158f58a96a47239fbf9dd3"){
                  commit('getOperationPermission',{name:a.write,key:11})
                }else if(a.id=="5e158f67a96a47239fbf9dd4"){
                  commit('getOperationPermission',{name:a.write,key:12})
                }
                // else if(a.id=="5e1585b3a96a47239fbf9dc7"){
                //   commit('getOperationPermission',{name:a.write,key:5})
                // }
              });
            }
            arr.push(v.flag)
            if (v.children) {
              for (const item of v.children) {
                arr.push(item.flag)
              }
            }
            
          });
          
          const role ={

          }
          const result = role
          role.permissionList = arr
          commit('SET_ROLES', role)
          commit('SET_INFO', result)

          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetInfo({
      commit
    }) {
      return new Promise((resolve, reject) => {
        getUserCurrent().then(res => {
          console.log(res,'11111');
          var arr = []
          res.forEach(v => {
            arr.push(v.flag)
            if (v.children) {
              for (const item of v.children) {
                arr.push(item.flag)
              }
            }
            
          });
          console.log(arr);
          const result = userInfo
          const role ={

          }
          role.permissionList = arr
          
          
          commit('SET_ROLES', role)
          commit('SET_INFO', result)
          // if (result.role && result.role.permissions.length > 0) {
          //   const role = result.role
          //   role.permissions = result.role.permissions
          //   role.permissions.map(per => {
          //     if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
          //       const action = per.actionEntitySet.map(action => {
          //         return action.action
          //       })
          //       per.actionList = action
          //     }
          //   })
            
          //   role.permissionList = role.permissions.map(permission => {
          //     return permission.permissionId
          //   })
            
          // } else {
          //   reject(new Error('getInfo: roles must be a non-null array !'))
          // }

          commit('SET_NAME', {
            name: '',
            // name: result.name,
            welcome: welcome()
          })
          commit('SET_AVATAR', result.avatar)
          console.log('66666666666666666666666')
          console.log(response)
          resolve(response)

          // let data = res.data.permission
          // for (const item of permissionInfo) {
          //   for (const value of data) {
          //     item.filter(key => {
          //       if (value.id == key.id) {
          //         console.log(key)
          //         if (data[value]) {
          //           key.read = true
          //           key.write = true
          //         } else {
          //           key.read = true
          //           key.write = false
          //         }
          //       }
          //     })
          //   }
          // }
          // commit('permissionListsFn', permissionInfo)
        }).catch(error => {
          reject(error)
        })
      })
    },

    //登出
    Logout({
      commit,
      state
    }) {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      Vue.ls.remove(ACCESS_TOKEN)
      // return new Promise((resolve) => {
      //   logout(state.token).then(() => {
      //     resolve()
      //   }).catch(() => {
      //     resolve()
      //   }).finally(() => {
          
      //   })
      // })
    }

  }
}

export default user