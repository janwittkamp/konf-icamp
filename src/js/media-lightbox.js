const lightboxSelector = "[data-media-lightbox]"
let lightbox
let image
let title
let meta
let counter
let activeItems = []
let activeIndex = 0
let previousFocus

function createLightbox() {
	const node = document.createElement("div")
	node.className = "camp-lightbox"
	node.hidden = true
	node.setAttribute("role", "dialog")
	node.setAttribute("aria-modal", "true")
	node.setAttribute("aria-label", "Bildansicht")
	node.innerHTML = `
		<div class="camp-lightbox-panel">
			<button class="camp-lightbox-close" type="button" data-lightbox-close aria-label="Schliessen">x</button>
			<button class="camp-lightbox-nav camp-lightbox-nav--prev" type="button" data-lightbox-prev aria-label="Vorheriges Bild">&lt;</button>
			<figure class="camp-lightbox-figure">
				<img class="camp-lightbox-image" alt="">
				<figcaption class="camp-lightbox-caption">
					<span class="camp-lightbox-meta"></span>
					<strong class="camp-lightbox-title"></strong>
					<span class="camp-lightbox-counter"></span>
				</figcaption>
			</figure>
			<button class="camp-lightbox-nav camp-lightbox-nav--next" type="button" data-lightbox-next aria-label="Naechstes Bild">&gt;</button>
		</div>
	`

	document.body.appendChild(node)

	node.addEventListener("click", (event) => {
		if (event.target === node || event.target.closest("[data-lightbox-close]")) {
			closeLightbox()
			return
		}

		if (event.target.closest("[data-lightbox-prev]")) {
			goToImage(activeIndex - 1)
			return
		}

		if (event.target.closest("[data-lightbox-next]")) {
			goToImage(activeIndex + 1)
		}
	})

	return node
}

function getLightbox() {
	if (!lightbox) {
		lightbox = createLightbox()
		image = lightbox.querySelector(".camp-lightbox-image")
		title = lightbox.querySelector(".camp-lightbox-title")
		meta = lightbox.querySelector(".camp-lightbox-meta")
		counter = lightbox.querySelector(".camp-lightbox-counter")
	}

	return lightbox
}

function getGalleryItems(trigger) {
	const section = trigger.closest(".media-gallery-section")
	const scope = section || document

	return Array.from(scope.querySelectorAll(lightboxSelector))
}

function getItemData(item) {
	return {
		src: item.dataset.mediaSrc || item.getAttribute("href"),
		title: item.dataset.mediaTitle || item.querySelector("img")?.getAttribute("alt") || "",
		meta: item.dataset.mediaMeta || ""
	}
}

function renderImage() {
	const item = activeItems[activeIndex]
	const data = getItemData(item)

	image.src = data.src
	image.alt = data.title
	title.textContent = data.title
	meta.textContent = data.meta
	meta.hidden = !data.meta
	counter.textContent = `${activeIndex + 1} / ${activeItems.length}`
}

function goToImage(index) {
	if (!activeItems.length) {
		return
	}

	activeIndex = (index + activeItems.length) % activeItems.length
	renderImage()
}

function openLightbox(trigger) {
	activeItems = getGalleryItems(trigger)
	activeIndex = Math.max(0, activeItems.indexOf(trigger))
	previousFocus = document.activeElement

	getLightbox().hidden = false
	document.documentElement.classList.add("has-camp-lightbox")
	renderImage()

	lightbox.querySelector("[data-lightbox-close]").focus()
}

function closeLightbox() {
	if (!lightbox || lightbox.hidden) {
		return
	}

	lightbox.hidden = true
	document.documentElement.classList.remove("has-camp-lightbox")
	image.removeAttribute("src")

	if (previousFocus && typeof previousFocus.focus === "function") {
		previousFocus.focus()
	}
}

function onKeydown(event) {
	if (!lightbox || lightbox.hidden) {
		return
	}

	if (event.key === "Escape") {
		event.preventDefault()
		closeLightbox()
	}

	if (event.key === "ArrowLeft") {
		event.preventDefault()
		goToImage(activeIndex - 1)
	}

	if (event.key === "ArrowRight") {
		event.preventDefault()
		goToImage(activeIndex + 1)
	}
}

export default function initMediaLightbox() {
	document.addEventListener("click", (event) => {
		const trigger = event.target.closest(lightboxSelector)

		if (!trigger) {
			return
		}

		event.preventDefault()
		openLightbox(trigger)
	})

	document.addEventListener("keydown", onKeydown)
}
