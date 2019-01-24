export default function guid() {
    return (
        "ss-s-s-s-sss".replace(/s/g, () => (
            Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
        ) )
    );
}
