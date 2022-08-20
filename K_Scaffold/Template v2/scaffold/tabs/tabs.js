
(
    function registerTabHandlers(storage) {
        storage.forEach(
            ({ name, tabs }) => {
                kFuncs.log(`Registering handler for tab "${name}"`);
                $20(`.tab.tab-${name} .tab-header.tab-header-${name} .tab-button.tab-button-${name}`).on("click", (event) => {
                    const container_tab = event.htmlAttributes["data-container-tab"];
                    const tab = event.htmlAttributes["data-tab"];
                    kFuncs.log(`Clicked tab ${tab} in ${container_tab}`);
                    $20(`.tab.tab-${name} div[data-tab]`).removeClass("active");
                    $20(`.tab.tab-${name} div[data-tab=${tab}]`).addClass("active");
                });
            }
        );
    }
)(tabDetails);