import Cookies from "js-cookie"

const COOKIE_NAME = "surkus_schulte_cookie_consent"

let state = {
	initialized: false,
}

export default function initWhenReady() {
	window.addEventListener("DOMContentLoaded", init)
	init()
}

const init = () => {
	if (document.readyState === "loading") {
		return
	}

	if (state.initialized) {
		return
	}

	state.initialized = true
	window.removeEventListener("DOMContentLoaded", init)

	const consent = Cookies.get(COOKIE_NAME)

	if (consent === "true") {
		onAccept()
		return
	}

	if (consent === "false") {
		return
	}

	openConsentModal()
}

function getModalElements() {
	const consentModal = document.getElementById("cookie_consent_modal")
	const acceptButton = document.getElementById("cookie_consent_modal_accept")
	const declineButton = document.getElementById(
		"cookie_consent_modal_decline"
	)

	return {
		consentModal,
		acceptButton,
		declineButton,
	}
}

function openConsentModal() {
	const { consentModal, acceptButton, declineButton } = getModalElements()

	consentModal.removeAttribute("hidden")
	consentModal.classList.remove("hidden")

	state.acceptCb = setConsent(true)
	state.declineCb = setConsent(false)

	acceptButton.addEventListener("click", state.acceptCb)
	declineButton.addEventListener("click", state.declineCb)
}

const setConsent = (accept) => () => {
	Cookies.set(COOKIE_NAME, accept)

	closeConsentModal(accept)
}

function closeConsentModal(accepted) {
	const { consentModal, acceptButton, declineButton } = getModalElements()

	acceptButton.removeEventListener("click", state.acceptCb)
	declineButton.removeEventListener("click", state.declineCb)
	state.acceptCb = undefined
	state.delclineCb = undefined

	consentModal.setAttribute("hidden", "hidden")
	consentModal.classList.add("hidden")

	if (!accepted) {
		return
	}

	onAccept()
}

function onAccept() {
	window.dispatchEvent(new Event("__acceptPrivacy"))
}
