import { ROLES } from './constant'

const Utils = {
  checkIfIsUser: roleList => {
    return (
      roleList.findIndex(
        role =>
          role.name === ROLES.USER ||
          role.name === ROLES.MANAGER_USER ||
          role.name === ROLES.CSR_USER
      ) !== -1
    )
  },
  getRolesInText: roleList => {
    let rolesInText = ''
    roleList.forEach(role => {
      rolesInText += `${role.name}, `
    })
    rolesInText = rolesInText.slice(0, rolesInText.lastIndexOf(','))
    return rolesInText.trim()
  },
  getRolesInArray: roleList => {
    const rolesInArray = []
    roleList.forEach(role => {
      rolesInArray.push(role.name)
    })
    return rolesInArray
  },
  formatRolesToSubmit: roleList => {
    const roles = []
    roleList.forEach(role => {
      if (role.isSelected) roles.push({ name: role.name })
    })
    return roles
  },
  parameterizeObject: (obj, prefix) => {
    if (!obj) return ''
    const str = []
    Object.keys(obj).forEach(key => {
      if (obj[key]) {
        const formarKey = prefix ? `${prefix}[${key}]` : key
        const value = obj[key]
        str.push(
          value !== null && typeof value === 'object'
            ? this.parameterizeObject(value, formarKey)
            : `${encodeURIComponent(formarKey)}=${encodeURIComponent(value)}`
        )
      }
    })
    if (str.length === 0) return ''
    return `${str.join('&')}`
  },
  parameterizeArray: (key, arr) => {
    if (!arr || arr.length === 0) return ''
    const array = arr.map(encodeURIComponent)
    return `&${key}[]=${array.join(`&${key}[]=`)}`
  },
  removePropertyFromObject: (obj, property) => {
    const result = JSON.parse(JSON.stringify(obj))
    if (typeof obj === 'object' && Object.prototype.hasOwnProperty.call(result, property)) {
      delete result[property]
    }
    return result
  },
  removePropertiesFromObject: (obj, properties) => {
    let result = JSON.parse(JSON.stringify(obj))
    if (typeof obj === 'object' && Array.isArray(properties)) {
      properties.forEach(property => {
        result = Utils.removePropertyFromObject(result, property)
      })
    }
    return result
  },
  sortArr: (arr, sortFunc) => {
    const result = JSON.parse(JSON.stringify(arr))
    return result.sort(sortFunc)
  },
}

export default Utils