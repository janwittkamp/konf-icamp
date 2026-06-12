export function loadScript(type, id, src) {
	let tag
	switch (type) {
		case "css":
			tag = "link"
			break
		case "js":
			tag = "script"
			break
		default:
			throw new Error("unknown asset-type given")
	}

	const scopedId = `__${id}`

	if (document.getElementById(scopedId) !== null) {
		// element already existing
		return
	}

	const asset = document.createElement(tag)
	asset.id = scopedId
	if (type === "css") {
		asset.href = src
		asset.rel = "stylesheet"
	}

	if (type === "js") {
		asset.src = src
		asset.async = "async"
		asset.defer = "defer"
		asset.type = "text/javascript"
	}

	const promise = new Promise((resolve) => {
		asset.onload = resolve
	})

	document.head.append(asset)

	return promise
}
