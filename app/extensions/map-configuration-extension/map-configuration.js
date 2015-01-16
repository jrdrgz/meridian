define([

], function() {

  var mapConfiguration = {
    "defaultMapEngine" : "OpenLayers",
    "defaultBaseMap": "landscape",//Must be a valid name in basemaps.
    "initialMinLat": -16.341225619207417,
    "initialMinLon": -31.640624999999773,
    "initialMaxLat": 16.341225619207417,
    "initialMaxLon": 31.640624999999773,
    "maxAutoZoomLevel": 13,
    "projection": "EPSG:900913",
    "defaultVisualMode": "cluster",
    "defaultTileWidth": 256,
    "defaultTileHeight": 256,
    "basemaps" : [
      {
        "basemap" : "landscape",
        "type" : "osm",
        "url" : "http://a.tile3.opencyclemap.org/landscape/${z}/${x}/${y}.png",
        "thumbnail" : "/extensions/map-configuration-extension/images/basemaps/topographic.png",
        "label" : "OSM Landscape"
      },
      {
        "basemap" : "grey",
        "type" : "osm",
        "url" : "http://korona.geog.uni-heidelberg.de:8008/tms_rg.ashx?x=${x}&y=${y}&z=${z}",
        "thumbnail" : "/extensions/map-configuration-extension/images/basemaps/grey.png",
        "label" : "OSM Roads Grey"
      },
      {
        "basemap" : "basic",
        "type" : "osm",
        "url" : "http://korona.geog.uni-heidelberg.de:8001/tms_r.ashx?x=${x}&y=${y}&z=${z}",
        "thumbnail" : "/extensions/map-configuration-extension/images/basemaps/basic.png",
        "label" : "OSM Roads"
      },
      {
        "basemap" : "imagery",
        "type" : "wmts",
        "url" : "http://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/WMTS",
        "thumbnail" : "/extensions/map-configuration-extension/images/basemaps/satellite.png",
        "label" : "USGS Imagery",
        "wrapDateLine": true
      }
    ],
    "markerIcons" : {
      "default" : {
        "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAEmklEQVRIiaWQa1CUZRSAj+VMoDPVJGOloAzLglxcUiqbvOAlBhKIBJUgboFyMcUURSu00tEaZRI0Uxors1xvUDGLEzcNByGRWwgCC7LLLsu3u7C7XFrF/b7vvKcfrX+cakGfmffneZ73HAAH7Gg1TC/k+LQSs3CpfERoLB8RGkrM4oUTA3zKp2q1k6P5/yWfs8VfNInmcyaRjupFyuMEOswJLF8v0k9DIskHBWMeJ0Y9kvyQTsg9ZRRon45nhziRjhoFOjGIdMyImMeJtF/H4x6tQIUGgQ703986KXmuRgzP43jK1drwoE5gRwwiFg4h/mAh/NaErMAo4hecwPbqbJij4dlhnY1294wvn6h/yt6+cVVOH097+210QCdgvhHpJHefPvutlvaU1WEBZ6PPOQE/0Qm0S8vTdpWNfdxjbZ+Q/f1ua3COapx2amyU28/TPk7ED0pryUPqTbNmzqQXXVxQ4uNLWRWNuKefp10anrap7uO2Tiul3R5d5DCQ2fHX/izlPdrRZ8MPtTzuVlqYh8QT3V3dUDLXHaUeEib1kKC3v4zt6rXiTo0Nt94ZZ5nto5R2ayTHYSC9bexUZqeVbesdpxwtT3GnitB9titJPSQ0T+pFPlIv9PXxJV+pFyZdrKRslY22KO9ieusopbQMH3EYSG0ZOb6xbYRtUd6l7WobxXwtR885c2me1Iv8fHxpvp8/viQLIJmfPybIyyire5wy28YwpclMCTfNeQ4DiQ2WzalNZspoH8MtXVbcVK9h3hJP9PHyRn//+bhAFsAWLgjEVxe9xjY3GzHz9him/jnMkm6aKK52MMthYF3doGdC/RClNlso/dYobeq0YupJOcl8/ShAFkAvLwzEJYuXUMaPpZjRPkYbWoYp6aYJY68baF0NF+gwAAAQe91wNf6Gkb3XaMbUlmGW0TaKudeVmP3Vacz+5iz76A8VbmgdYSlNZkysH8LYGj1bX811TEgOALD2ysDr66v19G6tkeJvDGFig4mSG82U3Gyh5EYLJjWYKLF+COPqjPTONT1FXxmgNZXayAkHAADWVGjPRV8doJhrAxhbY6C4Gj3F1RoprkaPsTUGiqnW47rfByiqqp8iy/qKJiUHAIhQKF0iLmsskRVaFlWhpegrOoqu6qfoKh1GVWkpslyDEWUaClP06pb/on520gEAgJBfVYmhChWFKdQYrlBh+OU+DCtVsbBSNb6pULHQkl4KKbmz4pHkD1h5qat6VZGSgn/uoeDibgou7sFVRUpaWaRki45VFj6WHABgqbxLtlTeQQ/ekrMduPRcJy0+3WwBZ2dXAJgOAE8BwFQAmGIfm/Kfwn9jxfmeM0EXulmQvAuDznexlRfvkOvq5N0AMBMAZgDAMwAwDQCcAODJSW/xxpnbc0Iu9fKhxWoKKVazoMI6FQBIAMANAGbZQ88BwNMA4PzQNhNj2Zflx98q0VGkgqPZy97OBgBvAPAEAHd7ZAb8c66pk94AAOCVnd+/sFbB3Vv9XVMfAAQCwHx74Hm7ePKneZigfRcKPMM3HgQAP/uvpwHAE48tfoCzxN8NnJw87OIJ3fhv3aG4hmOcaG4AAAAASUVORK5CYII=",
        "iconLarge": "data:image/png;base64,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",
        "height": 24,
        "width": 24,
        "graphicYOffset": -15
      }
    },
    "clustering": {
      "colors": {
        "low":  "rgb(204, 0, 204)",
        "mid":  "rgb(153, 0, 153)",
        "high": "rgb(102, 0, 102"
      },
      "thresholds": {
        "clustering": {"distance": 25, "threshold": 2},
        "noClustering": {"distance": 1, "threshold": Number.MAX_VALUE}
      },
      "symbolizers": {
        "lowSymbolizer": {
          "fillColor": "rgb(204, 0, 204)",
          "fillOpacity": 0.9,
          "strokeColor": "rgb(204, 0, 204)",
          "strokeOpacity": 0.5,
          "strokeWidth": 12,
          "pointRadius": 10,
          "label": "${count}",
          "labelOutlineWidth": 1,
          "labelYOffset": 0,
          "fontColor": "#ffffff",
          "fontOpacity": 0.8,
          "fontSize": "12px"
        },
        "midSymbolizer": {
          "fillColor": "rgb(153, 0, 153)",
          "fillOpacity": 0.9,
          "strokeColor": "rgb(153, 0, 153)",
          "strokeOpacity": 0.5,
          "strokeWidth": 12,
          "pointRadius": 15,
          "label": "${count}",
          "labelOutlineWidth": 1,
          "labelYOffset": 0,
          "fontColor": "#ffffff",
          "fontOpacity": 0.8,
          "fontSize": "12px"
        },
        "highSymbolizer": {
          "fillColor": "rgb(102, 0, 102)",
          "fillOpacity": 0.9,
          "strokeColor": "rgb(102, 0, 102)",
          "strokeOpacity": 0.5,
          "strokeWidth": 12,
          "pointRadius": 20,
          "label": "${count}",
          "labelOutlineWidth": 1,
          "labelYOffset": 0,
          "fontColor": "#ffffff",
          "fontOpacity": 0.8,
          "fontSize": "12px"
        },
        "noClusterSymbolizer": {
          "externalGraphic": "${icon}",
          "graphicOpacity": 1,
          "pointRadius": 15,
          "graphicHeight": "${height}",
          "graphicWidth": "${width}"
        }
      }
    },
    "basemapGalleryMaxHeight": "40%",
    "cursorLocation": {
      "defaultDisplay": true
    }
  };

  return mapConfiguration;

});