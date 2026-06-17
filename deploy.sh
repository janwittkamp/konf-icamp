#!/usr/bin/env bash
set -euo pipefail

THEME_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REMOTE="${DEPLOY_REMOTE:-p221814@178.16.62.187}"
REMOTE_PATH="${DEPLOY_PATH:-/home/www/p221814/html/KonfiCamp2026/themes/konficamp}"
METHOD="${DEPLOY_METHOD:-auto}"

usage() {
	cat <<'USAGE'
Build and deploy the Konfi-Camp theme.

Usage:
  ./deploy.sh
  ./deploy.sh --method=tar
  ./deploy.sh --skip-build

Environment:
  DEPLOY_REMOTE=p221814@178.16.62.187
  DEPLOY_PATH=/home/www/p221814/html/KonfiCamp2026/themes/konficamp
  DEPLOY_METHOD=auto|rsync|tar

Options:
  --method=auto|rsync|tar  Upload method. Default: auto.
  --skip-build             Deploy without running yarn build.
  --help                   Show this help.
USAGE
}

SKIP_BUILD=0

while [[ $# -gt 0 ]]; do
	case "$1" in
		--method=*)
			METHOD="${1#*=}"
			;;
		--method)
			shift
			METHOD="${1:-}"
			;;
		--skip-build)
			SKIP_BUILD=1
			;;
		--help|-h)
			usage
			exit 0
			;;
		*)
			echo "Unknown option: $1" >&2
			usage
			exit 1
			;;
	esac
	shift
done

if [[ "$METHOD" != "auto" && "$METHOD" != "rsync" && "$METHOD" != "tar" ]]; then
	echo "Invalid method: ${METHOD}" >&2
	usage
	exit 1
fi

cd "$THEME_ROOT"

if [[ "$SKIP_BUILD" -eq 0 ]]; then
	echo "building theme"
	yarn build
fi

if [[ "$METHOD" == "auto" ]]; then
	if ssh "$REMOTE" "command -v rsync >/dev/null 2>&1"; then
		METHOD="rsync"
	else
		METHOD="tar"
		echo "Remote rsync was not found. Falling back to tar upload."
	fi
fi

echo "preparing remote folder"
ssh "$REMOTE" "mkdir -p '$REMOTE_PATH'"

if [[ "$METHOD" == "rsync" ]]; then
	echo "syncing theme with rsync"
	rsync -a --progress --delete --exclude-from=.rsync-ignore ./ "$REMOTE:$REMOTE_PATH/"
else
	echo "syncing theme with tar over SSH"
	COPYFILE_DISABLE=1 tar --no-xattrs -czf - --exclude-from=.rsync-ignore --exclude='._*' --exclude='.DS_Store' . \
		| ssh "$REMOTE" "tar -xzf - -C '$REMOTE_PATH'"
fi

echo "theme deploy finished"
