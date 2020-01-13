const config = {
  "states": {
    "url": "https://services1.arcgis.com/aT1T0pU1ZdpuDk1t/arcgis/rest/services/Cont_US_Boundary/FeatureServer/0",
    "title": "States",
    "layerid": "StatesLyr",
    "symbolflag": "true",
    "labelflag": "true",
    "outfields": ["NAME"],
    "symbol": {
      "line_color": [255,255,255],
      "line_width": 0.5,
      "fill_color": [0,0,0]
    },
    "label": {
      "font_size": "11pt",
      "font_family": "arial",
      "text_color": "#fff",
      "label_field": "NAME"
    },
    "symbol_hightlight": {
      "line_color": [255,0,0],
      "line_width": 2,
      "fill_color": [125,125,125,0.35]
    },
    "symbol_select": {
      "line_color": [255,255,255],
      "line_width": 1,
    }
  },
  "counties": {
    "url": "https://services1.arcgis.com/aT1T0pU1ZdpuDk1t/arcgis/rest/services/Cont_US_Counties_2010/FeatureServer/0",
    "title": "Counties",
    "layerid": "CountiesLyr",
    "symbolflag": "true",
    "labelflag": "true",
    "outfields": ["*"],
    "symbol": {
      "line_color": [255,255,255],
      "line_width": 1,
      "fill_color": [0,0,0]
    },
    "label": {
      "font_size": "9pt",
      "font_family": "arial",
      "text_color": "#ffffff",
      "label_field": "NAME10"
    },
    "symbol_hightlight": {
      "line_color": [255,255,255],
      "line_width": 1,
      "fill_color": [0,0,0],
      "font_size": "9pt",
      "font_family": "arial",
      "text_color": "#ffffff",
      "label_field": "NAME10"
    } 
  },
  "census_block": {
    "url": "https://services1.arcgis.com/aT1T0pU1ZdpuDk1t/arcgis/rest/services/Cont_US_Block_Groups_2010_2000/FeatureServer/0",
    "title": "Census Block",
    "layerid": "CensusBlockLyr",
    "symbolflag": "false",
    "labelflag": "false",
    "outfields": ["*"]
  },
  "urban_area": {
    "url": "https://services1.arcgis.com/aT1T0pU1ZdpuDk1t/arcgis/rest/services/Urban_Area_2010_simplified/FeatureServer/0",
    "title": "Urban Area",
    "layerid": "UrbanAreaLyr",
    "symbolflag": "false",
    "labelflag": "false",
    "outfields": [""]
  },
  "megaregion": {
    "url": "https://services1.arcgis.com/aT1T0pU1ZdpuDk1t/arcgis/rest/services/Cont_US_Megaregions_generalized/FeatureServer/0",
    "title": "Megaregion",
    "layerid": "MegaregionLyr",
    "symbolflag": "false",
    "labelflag": "false",
    "outfields": ["Megaregion"]
  },
  "table": {
    "columns": [
      {"name": "Field", "data": "fieldName"},
      {"name": "Description", "data": "description"}
    ]
  }
};

