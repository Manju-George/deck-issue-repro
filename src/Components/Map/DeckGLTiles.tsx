import { useEffect, useMemo, useRef } from "react";
import { MapboxOverlay as DeckOverlay } from '@deck.gl/mapbox';
import { MVTLayer } from '@deck.gl/geo-layers';
import {DataFilterExtension} from '@deck.gl/extensions';

interface DeckGLTilesProps {
    readonly map: mapboxgl.Map;
    selectedLGA: string;
}

const DeckGLTiles = ({ map, selectedLGA }: DeckGLTilesProps) => {
    const layerRef = useRef<DeckOverlay | undefined>();
// Lockhart, Coolamon, Narrandera, Wagga Wagga
    console.log({selectedLGA})

     const defaultProps = useMemo(() => {
        const systemFarmTileURL = `https://s3.ap-southeast-2.amazonaws.com/public.data.dasintel.io/deckgl-demo/farm_tiles_demo/{z}/{x}/{y}.pbf`;
        return {
            type: MVTLayer,
            id: "farm",
            data:systemFarmTileURL,
            // If there are no tiles available in the given zoom levels, they disappear.
            // This ensures that the tiles are visible at any zoom level
            minZoom: 7,
            maxZoom: 15,
            opacity: 1.0,
            tileSize: 256, // Mapbox supports 256x256 tiles
            // extent: [w, s, e, n],
            getFilterEnabled: true,
            extensions: [
                new DataFilterExtension({ categorySize: 1 }),
            ],
            getFilterCategory: (f: { properties: { lga_name: string } }) =>
                 selectedLGA === "All"? "all": f.properties.lga_name,
            // getFilterCategory:(f: any) => console.log({f}),
            filterCategories: [selectedLGA,"all"],
            updateTriggers: {
                // Recalculate fillColor when filterEnabled
                getFilterCategory: [selectedLGA],
            },
            debounceTime: 100,
            getFillColor:[255,0,0],
            getLineWidth: 1.0,
            lineWidthUnits: 'pixels',
            // extruded: false,
            pickable: true,
            // refinementStrategy: 'no-overlap',
            
        };
    }, [selectedLGA]);

    useEffect(() => {
        if (layerRef.current) {
            layerRef.current.setProps({
                layers: [new MVTLayer({ ...(defaultProps as any) })],
            });
        }
    }, [defaultProps]);

    useEffect(() => {
        const layer = new MVTLayer({ ...(defaultProps as any) });
        console.log({layer});

        const deckOverlay = new DeckOverlay({
            layers: [layer],
        });

        map.addControl(deckOverlay);
        layerRef.current = deckOverlay;

        return () => {
            map.removeControl(deckOverlay);
            layerRef.current = undefined;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return null;
}

export default DeckGLTiles;