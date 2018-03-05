const shortid = require('shortid');
import { createWriteStream } from 'fs'

import { getUserId, Context } from '../../utils'

const storeUpload = async ({ stream, filename }): Promise<any> => {
    const path = `images/${shortid.generate()}`
  
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
    const userId = getUserId(ctx)
    const imageUrl = await processUpload(image);
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