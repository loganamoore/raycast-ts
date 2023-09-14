let keyBindings = new Map();

export function bindKey(key, cb){
    const hasKey = keyBindings.has(key);
    if(!hasKey)
        keyBindings.set(key, { active: false, callback: cb });
    return !hasKey;
}

export function handleInput(){
    for(let keyBind of keyBindings.values())
        if(keyBind.active)
            keyBind.callback();
}

document.addEventListener('keydown', (event) => {
    if(keyBindings.has(event.key))
        keyBindings.get(event.key).active = true;
});

document.addEventListener('keyup', (event) => {
    if(keyBindings.has(event.key))
        keyBindings.get(event.key).active = false;
});

document.addEventListener('focusout', () => {
    for(let key of keyBindings.values())
        key.active = false;
});