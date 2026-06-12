const visibleClass = "header-nav--show"
const navSelector = ".header-nav"
const buttonSelector = ".header-trigger-nav"
const activeButtonClass ="header-trigger-nav--active"

const onLoad = function () {
	if (document.readyState === "loading") {
		return
	}

	window.removeEventListener("DOMContentLoaded", onLoad)

	const navigation = document.querySelector(navSelector)
	const triggerButton = document.querySelector(buttonSelector)

	triggerButton.addEventListener("click", function () {
		navigation.classList.toggle(visibleClass)
		triggerButton.classList.toggle(activeButtonClass)
	})
}

window.addEventListener("DOMContentLoaded", onLoad)
onLoad()
