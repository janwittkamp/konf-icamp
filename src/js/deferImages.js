/**
 * @param {HTMLImageElement} image
 * @return (HTMLImageElement|HTMLSourceElement)[]
 */
function getImageSiblings(image) {
	const parent = image.parentElement

	if (!parent || !(parent instanceof HTMLPictureElement)) {
		return [image]
	}

	return Array.from(parent.querySelectorAll("img, source"))
}

export default function observeDeferredImages() {
	if (!("IntersectionObserver" in window)) {
		return
	}

	/** @type IntersectionObserverCallback */
	const handleImageIntersection = (entries, observer) => {
		for (const entry of entries) {
			if (!entry.isIntersecting) {
				continue
			}

			const target = entry.target

			if (!(target instanceof HTMLImageElement)) {
				continue
			}

			if (target.dataset.active === "true") {
				continue
			}

			const elements = getImageSiblings(target)

			for (const element of elements) {
				const { srcset, src, originalStyle } = element.dataset

				// restore original style (or remove style attribute when no style was applied)
				if (originalStyle) {
					const obj = JSON.parse(originalStyle);

					for (const key of obj) {
						element.style[key] = obj[key]
					}

					element.removeAttribute("data-original-style")
				} else {
					element.removeAttribute("style")
				}

				if (srcset && srcset !== "") {
					element.srcset = srcset

					element.removeAttribute("data-srcset")
				}

				if (src && src !== "") {
					element.src = src

					element.removeAttribute("data-src")
				}

				element.dataset.active = "true"
			}

			target.dispatchEvent(new Event("local.imageLoaded", {
				bubbles: true,
			}));

			observer.unobserve(target)
		}
	}

	const observer = new IntersectionObserver(handleImageIntersection, {
		rootMargin: "20%",
		threshold: 0,
	})

	const images = document.querySelectorAll("img[data-srcset], img[data-src]")

	for (const image of images) {
		if (!(image instanceof HTMLImageElement)) {
			continue
		}

		if (
			((image.src && image.src !== "") ||
				(image.srcset && image.srcset !== "")) &&
			image.complete
		) {
			continue
		}

		// store old style. force image to have max dimensions while not loaded
		if (image.height && image.width) {
			if (image.getAttribute("style")) {
				image.dataset.originalStyle = JSON.stringify(image.style)
			}

			image.removeAttribute("style")
			image.style.width = `${image.width}px`;
			image.style.height = `${image.height}px`;
			image.style.visibility = "hidden";
		}

		observer.observe(image)
	}
}
