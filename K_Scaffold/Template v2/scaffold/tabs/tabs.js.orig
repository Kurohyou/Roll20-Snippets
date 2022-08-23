
const _kSwitchTab = function ({ trigger }) {
    const [container, tab] = (
        trigger.name.match(/nav-tabs-(.+)--(.+)/) ||
        []
    ).slice(1);
    console.log([container, tab]);
    $20(`[data-container-tab="${container}"]`).removeClass('k-active-tab');
    $20(`[data-container-tab="${container}"][data-tab="${tab}"]`).addClass('k-active-tab');
}

registerFuncs({ _kSwitchTab });