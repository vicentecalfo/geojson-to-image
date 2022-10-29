# Geojsons-to-images --- WIP
Gera a imagem de um mapa a partir de um arquivo GeoJson.

## Instalação

```bash
npm i @vicentecalfo/geojson-to-image
```
## Utilização

```javascript

const mapOptions = {
    width: 1200,
    height: 700,
    paddingX: 30,
    paddingY: 30,
    tileUrl: 'https://map1.vis.earthdata.nasa.gov/wmts-webmerc/BlueMarble_NextGeneration/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg',
    tileSubdomains: ['a', 'b', 'c']
}

const geojson2image = new Geojson2image(mapOptions)
geojson2image.convert({
    type: 'polygon',
    geojson: polygon,
    fill: '#cc000050',
    color: '#666666',
    width: 1,
    outputDir: 'sample-data/output/',
    filename: 'polygon',
    extension: 'png',
    compressionLevel: 1,
    layout: {
        direction: 'vb',
        image: 'assets/footer-cncflora-white.png',
        filename: 'polygon-layout',
        extension: 'png',
    }
})

```

