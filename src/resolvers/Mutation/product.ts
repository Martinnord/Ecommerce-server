// import shortid from 'shortid'
import { createWriteStream } from 'fs'

import { getUserId, Context } from '../../utils'

const storeUpload = async ({ stream, filename }): Promise<any> => {
    // const path = `images/${shortid.generate()}`
    const path = `images/test`
  
    return new Promise((resolve, reject) =>
      stream
        .pipe(createWriteStream(path))
        .on('finish', () => resolve({ path }))
        .on('error', reject),
    )
  }

const processUpload = async upload => {
    const { stream, filename, mimetype, encoding } = await upload
    const { path } = await storeUpload({ stream, filename })
    return path
}

export const product = {
  async createProduct(parent, { name, description, price, image }, ctx: Context, info) {
    console.log('os htdsad s')
    // const userId = getUserId(ctx)
    const userId = 1;
    console.log(image);
    const imageUrl = await processUpload(image);
    console.log(imageUrl);
    return ctx.db.mutation.createProduct(
      {
        data: {
            name,
            description,
            price,
            imageUrl,
            seller: {
                connect: { id: userId },
            },
        },
      },
      info
    )
  },
}