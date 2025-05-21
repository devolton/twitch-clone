import Upload from 'graphql-upload/Upload.mjs'

export async function getBufferFromFile(file: Upload) {
    const chanks: Buffer[] = [];
    for await (const ch of file.createReadStream()) {
        chanks.push(ch);
    }
    return Buffer.concat(chanks);
}