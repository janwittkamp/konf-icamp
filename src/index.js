import checkWebp from "./js/check-webp"
import "./styles"
import "./js/mobile-nav"
import observeDeferredImages from "./js/deferImages"
import initContentSliders from "./js/content-slider"
import initMediaLightbox from "./js/media-lightbox"

if (!checkWebp()) {
	document.documentElement.classList.remove("webp")
}

observeDeferredImages()
initContentSliders()
initMediaLightbox()

// enable the following lines to enable the privacy popup

// this event is fired by our privacy-modal when user accepts
// useful for enabling analytics only when user did consent
window.addEventListener("__acceptPrivacy", function (event) {
})
// import("./js/privacy").then(({ default: init }) => init())
