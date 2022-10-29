import StaticMaps from 'staticmaps'
import joinImages from 'join-images'

interface IGeojson2imageConvertOptions {
    type: string
    geojson: any
    fill: string
    color: string
    width: number
    outputDir: string
    filename: string
    extension: string
    compressionLevel: number
    layout?: {
        direction: string
        image: string
        filename: string
        extension: string
    }
}


export class Geojson2image {

    constructor(private mapOptions: StaticMaps.StaticMapsOptions) { }

    public async convert({ type, geojson, fill, color, width, filename, outputDir, extension, layout, compressionLevel }: IGeojson2imageConvertOptions) {
        const outputPath = `${outputDir}${filename}`
        const filenamePath = `${outputPath}.${extension}`
        const convertTo = await this._convertType(type)
        const map = new StaticMaps(this.mapOptions)
        convertTo({ map, geojson, fill, color, width })
        await map.render()
        await map.image.save(filenamePath, { compressionLevel })
        if (layout !== undefined) {
            await this._generateLayout({ layout, mapImage: filenamePath, outputDir })
        }
    }

    private async _convertType(type: string) {
        const convertOptions: any = {
            pointCircle: async () => await this._addPointCircle,
            polygon: async () => await this._addPolygon
        }
        return convertOptions[type]()
    }

    private _addPointCircle({ map, geojson, fill, color, width }: any) {
        return new Promise((resolve, reject) => {
            geojson.features.forEach((point: any) => {
                const circle = {
                    coord: point.geometry.coordinates,
                    radius: 2500,
                    fill,
                    color,
                    width,
                }
                map.addCircle(circle)
            })
            resolve(true)
        })
    }

    private _addPolygon({ map, geojson, fill, color, width }: any) {
        return new Promise((resolve, reject) => {
            geojson.features.forEach((polygon: any) => {
                const poly = {
                    coords: polygon.geometry.coordinates,
                    fill,
                    color,
                    width,
                }
                map.addMultiPolygon(poly)
            })
            resolve(true)
        })
    }

    private _generateLayout({ layout, mapImage, outputDir }: any) {
        return new Promise(async (resolve, reject) => {
            const position: any = {
                vt: ['vertical', 'unshift'],
                vb: ['vertical', 'push'],
                hl: ['horizontal', 'unshift'],
                hr: ['horizontal', 'push']
            }
            const insertInArrayImages = position[layout.direction][1]
            const imagesToMerge: any = [mapImage]
            imagesToMerge[insertInArrayImages](layout.image)
            const image = await joinImages(imagesToMerge, {
                direction: position[layout.direction][0]
            })
            const { filename, extension } = layout
            image.toFile(`${outputDir}${filename}.${extension}`)
            resolve(true)
        })
    }
}