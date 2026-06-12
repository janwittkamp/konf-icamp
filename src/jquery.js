import jQuery from "jquery"
import "./js/flash"

window.jQuery = window.$ = jQuery

$(document).ready(function () {
	const deferredScripts = jQuery("[data-deferload]")

	deferredScripts.attr("async", true)
	deferredScripts.attr("src", deferredScripts.attr("data-src"))
})
