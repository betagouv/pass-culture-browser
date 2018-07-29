import get from 'lodash.get'
import { parse } from 'query-string'
import uuid from 'uuid'
import {version} from '../../package.json'
import { API_URL } from './config'
import { getData, putData } from '../workers/dexie/data'

export async function fetchData(method, path, config = {}) {
  // unpack
  const { body, token } = config
  // init
  const init = {
    method,
    credentials: 'include',
  }
  if (method && method !== 'GET') {
    init.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'AppVersion': version,
      'X-Request-ID': uuid()
    }
    // body
    init.body = JSON.stringify(body || {})
  }
  // token
  if (token) {
    if (!init.headers) {
      init.headers = {}
    }
    init.headers.Authorization = `Bearer ${token}`
  }
  // fetch
  const result = await fetch(`${API_URL}/${path}`, init)
  // const collectionName = path.split('?')[0]
  if (result.status === 200 || result.status === 201) {
    if (get(window, 'cordova.plugins.CookieManagementPlugin.flush')) {
      window.cordova.plugins.CookieManagementPlugin.flush()
    } else if (window.cordova) {
      console.warn('CookieManagementPlugin.flush is not available here')
    }
    // FIX TODO
    let data = await result.json()
    console.log('>>> data', data.length)
    if (path === 'recommendations?') {
      data = data.filter( r => !r.thingId || (!r.thingId  && !r.eventId ) )
      console.log('>>> data', data)

    }
    return { data }
  } else {
    return { errors: await result.json() }
  }
}

export async function localData(method, path, config = {}) {
  // unpack
  const { body } = config
  // check the table
  const [pathWithoutQuery, queryString] = path.split('?')
  const collectionName = pathWithoutQuery.split('/')[0]
  // call the good protocol api
  if (method === 'GET') {
    return await getData(collectionName, parse(queryString))
  } else {
    return await putData('update', collectionName, body)
  }
}
