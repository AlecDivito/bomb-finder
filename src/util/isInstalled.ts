
function isInstalled() {
    return  ((window.matchMedia
        && window.matchMedia('(display-mode: standalone)').matches))
        || ((window.navigator as any).standalone === true);
}

export default isInstalled;