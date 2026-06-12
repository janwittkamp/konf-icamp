echo "syncing template"
rsync -a --progress --delete --exclude-from=.rsync-ignore ./ surkus-schulte.de@ssh.strato.de:octobercms/surkus-schulte/themes/surkus-schulte-2022/
