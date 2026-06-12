export default function initContentSliders() {
	const autoPlayDelay = 5000
	const reducedMotionQuery = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null

	document.querySelectorAll("[data-camp-slider]").forEach((slider) => {
		const slides = Array.from(slider.querySelectorAll("[data-camp-slider-slide]"))
		const dots = Array.from(slider.querySelectorAll("[data-camp-slider-dot]"))
		const prev = slider.querySelector("[data-camp-slider-prev]")
		const next = slider.querySelector("[data-camp-slider-next]")

		if (slides.length < 2) {
			return
		}

		let current = 0
		let autoPlayTimer = null
		let isVisible = false
		let isPaused = false

		const show = (index) => {
			current = (index + slides.length) % slides.length
			slides.forEach((slide, slideIndex) => {
				slide.classList.toggle("camp-slider-slide--active", slideIndex === current)
			})
			dots.forEach((dot, dotIndex) => {
				dot.classList.toggle("camp-slider-dot--active", dotIndex === current)
				dot.toggleAttribute("aria-current", dotIndex === current)
			})
		}

		show(current)

		const stopAutoPlay = () => {
			if (autoPlayTimer) {
				window.clearTimeout(autoPlayTimer)
				autoPlayTimer = null
			}
		}

		const shouldAutoPlay = () => {
			return isVisible && !isPaused && !document.hidden && !reducedMotionQuery?.matches
		}

		const scheduleAutoPlay = () => {
			stopAutoPlay()

			if (!shouldAutoPlay()) {
				return
			}

			autoPlayTimer = window.setTimeout(() => {
				show(current + 1)
				scheduleAutoPlay()
			}, autoPlayDelay)
		}

		const goTo = (index) => {
			show(index)
			scheduleAutoPlay()
		}

		prev?.addEventListener("click", () => goTo(current - 1))
		next?.addEventListener("click", () => goTo(current + 1))
		dots.forEach((dot, index) => dot.addEventListener("click", () => goTo(index)))

		slider.addEventListener("mouseenter", () => {
			isPaused = true
			stopAutoPlay()
		})
		slider.addEventListener("mouseleave", () => {
			isPaused = false
			scheduleAutoPlay()
		})
		slider.addEventListener("focusin", () => {
			isPaused = true
			stopAutoPlay()
		})
		slider.addEventListener("focusout", () => {
			isPaused = false
			scheduleAutoPlay()
		})

		document.addEventListener("visibilitychange", scheduleAutoPlay)

		if ("IntersectionObserver" in window) {
			const observer = new IntersectionObserver(
				(entries) => {
					const entry = entries[0]
					isVisible = entry.isIntersecting && entry.intersectionRatio >= 0.25

					if (!isVisible) {
						stopAutoPlay()
						return
					}

					scheduleAutoPlay()
				},
				{ threshold: [0, 0.25, 0.6] },
			)

			observer.observe(slider)
		} else {
			isVisible = true
			scheduleAutoPlay()
		}
	})
}
