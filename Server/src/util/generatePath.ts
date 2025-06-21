
const generatePath: (idx: number)=> string = (idx: number): string=>{
    // We just need to convert this number into base62 encoding
    const str: string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let encodedPath: string = "";

    do {
        encodedPath = str[idx%62]+encodedPath;
        idx = Math.floor(idx/62);
    } while (idx !== 0);

    return encodedPath;
}

export default generatePath;