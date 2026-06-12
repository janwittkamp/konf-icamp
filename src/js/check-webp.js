function canUseWebP() {
	try {
		const elem = document.createElement("canvas")

		if (!!(elem.getContext && elem.getContext("2d"))) {
			return elem.toDataURL("image/webp").includes("data:image/webp")
		}

		// very old browser like IE 8, canvas not supported
		return false
	} catch (e) {
		return false
	}
}

export default canUseWebP
