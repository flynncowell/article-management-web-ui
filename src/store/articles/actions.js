/* ============
 * Actions for the Articles
 * ============
 *
 * The actions that are available on the
 * Articles.
 */

import Vue from "vue"
import store from "@/store"
import * as types from "./mutation-types"
import APIProxy from "../../proxies/APIProxy"

export const list = ({ commit }, query) => {
	if (store.state.articles.fetching) return
	commit(types.FETCHING, true)
	const loadingToast = Vue.toasted.global.loading_message({
		message: "Fetching articles..."
	})
	if (!store.state.auth.authToken) Vue.toasted.global.error_message()
	new APIProxy()
		.fetchArticles(store.state.auth.authToken, query)
		.then(response => response.json())
		.then(response => {
			console.log(response)
			if (response.error) Vue.toasted.show(`Error: ${response.error.error}`)
			else if (response instanceof Array) {
				commit(types.ARTICLES, response)
				loadingToast.goAway(0)
			} else {
				Vue.toasted.global.error_message()
			}
		})
		.catch(e => {
			console.log(e)
		})
		.then(() => commit(types.FETCHING, false))
}

export const setActive = ({ commit }, article) => {
	if (!article) Vue.toasted.global.error_message()
	commit(types.ACTIVEARTICLE, article)
}

export default {
	list,
	setActive
}