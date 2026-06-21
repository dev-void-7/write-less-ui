const enum Classes {
	FocusedClass = "wl--focused"
};


export function makeArrowUpDownNavigateOpts(
    dropdown: HTMLElement,
    opts: HTMLElement,
) {
    const children = opts.children;

    dropdown.addEventListener("toggle", (e) => {
        switch (e.newState) {
            case "open":
                document.addEventListener("keydown", keydown);
                break;
            case "closed":
                document.removeEventListener("keydown", keydown);
                break;
        }
    });

    function keydown(e: KeyboardEvent) {
        // TODO: try to find another solution since this condition will be run each time a key is pressed
        if (!dropdown.isConnected)
            return document.removeEventListener("keydown", keydown);

        switch (e.key) {
            case "ArrowUp":
                focusPreOpt(children);
                break;
            case "ArrowDown":
                focusNextOpt(children);
                break;
            case "Enter":
                clickFocused(children);
                break;
        }
    }
}

function focusNextOpt(opts: HTMLCollection) {
    const len = opts.length;
    if (len < 0) {
        return -1;
    }
    let idx = unFocusCurFocusedAndGetIdx(opts);
    if (idx == undefined || idx > len - 2) {
        idx = 0;
    } else {
        idx++;
    }

    let opt: Element;
    for (let i = idx; i < len; i++) {
        opt = opts[i];
        if (opt.checkVisibility()) {
            opt.classList.add(Classes.FocusedClass);
            scrollIntoViewIfNeeded(opt);
            return;
        }
    }

    for (let i = 0; i < idx; i++) {
        opt = opts[i];
        if (opt.checkVisibility()) {
            opt.classList.add(Classes.FocusedClass);
            scrollIntoViewIfNeeded(opt);
            return;
        }
    }
}

function focusPreOpt(opts: HTMLCollection) {
    const len = opts.length;
    if (len < 0) {
        return -1;
    }
    let idx = unFocusCurFocusedAndGetIdx(opts);
    if (idx == undefined || idx < 1) {
        idx = len - 1;
    } else {
        idx--;
    }

    let opt: Element;
    for (let i = idx; i > -1; i--) {
        opt = opts[i];
        if (opt.checkVisibility()) {
            opt.classList.add(Classes.FocusedClass);
            scrollIntoViewIfNeeded(opt);
            return;
        }
    }

    for (let i = len - 1; i > idx; i--) {
        opt = opts[i];
        if (opt.checkVisibility()) {
            opt.classList.add(Classes.FocusedClass);
            scrollIntoViewIfNeeded(opt);
            return;
        }
    }
}

export function focusOnMouseEnter(
    e: MouseEvent & {
        currentTarget: HTMLButtonElement;
        target: Element;
    },
) {
    const curTarget = e.currentTarget;
    if (curTarget.classList.contains(Classes.FocusedClass)) return;

    const parent = curTarget.parentElement;
    if (parent == null) return;

    for (const child of parent.children) {
        if (child.classList.contains(Classes.FocusedClass)) {
            child.classList.remove(Classes.FocusedClass);
            break;
        }
    }
    curTarget.classList.add(Classes.FocusedClass);
}

function clickFocused(opts: HTMLCollection) {
    for (const opt of opts) {
        if (opt.classList.contains(Classes.FocusedClass)) {
            if (opt instanceof HTMLElement) {
                opt.click();
            }
            return;
        }
    }
}

function unFocusCurFocusedAndGetIdx(opts: HTMLCollection): number | undefined {
    let opt;
    for (let i = 0; i < opts.length; i++) {
        opt = opts[i];
        if (opt.classList.contains(Classes.FocusedClass)) {
            opt.classList.remove(Classes.FocusedClass);
            return i;
        }
    }
}

function scrollIntoViewIfNeeded(opt: Element) {
    const parent = opt.parentElement;
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    const optRect = opt.getBoundingClientRect();
    if (optRect.top >= parentRect.top && optRect.bottom <= parentRect.bottom)
        return;
    opt.scrollIntoView({ behavior: "instant", block: "nearest" });
}
