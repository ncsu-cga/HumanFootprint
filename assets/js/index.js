/*
Human Footprint data visualization and data download web application
PI: John Vogler
Authour: Makiko Shukunobe
Organization: Center for Geospatial Analytics, North Carolina State University
Date: November, 2018

The application uses following libraries:
jQuery v3.3.1 - https://jquery.com/
d3.js v5 - https://d3js.org/
Colorbrewer - https://github.com/d3/d3-scale-chromatic
Jquery.sumoselect - https://hemantnegi.github.io/jquery.sumoselect
ion.rangeSlider.js - http://ionden.com/a/plugins/ion.rangeSlider/en.html
interact.js - http://interactjs.io
BootSideMenu - https://github.com/AndreaLombardo/BootSideMenu
ArcGIS Javascript API v4.9- https://developers.arcgis.com/javascript/index.html
Now UI - https://demos.creative-tim.com/now-ui-kit/index.html
Font Awesome - https://fontawesome.com/icons?d=gallery
*/



///////////////////////
// GLOBAL VARIABLES //
//////////////////////
/*appdconfig = config.js */
/*hpdata = hp.data.js */
/*censusblockinfo = censusblockinfo.js */
/*megaregion_data = megaregion.data.js */
/*uniquevalue = uniquevalue.js */

require([
  'esri/Map',
  'esri/views/MapView',
  'esri/layers/FeatureLayer',
  'esri/geometry/Extent',
  'esri/renderers/smartMapping/statistics/classBreaks',
  'esri/renderers/ClassBreaksRenderer',
  'esri/renderers/UniqueValueRenderer',
  'esri/widgets/Legend',
  'esri/widgets/BasemapGallery',
  'esri/widgets/Expand',
  'esri/widgets/LayerList',
  'esri/core/watchUtils'
], function(
  Map, 
  MapView,
  FeatureLayer,
  Extent,
  ClassBreaks,
  ClassBreaksRenderer,
  UniqueValueRenderer,
  Legend,
  BasemapGallery,
  Expand,
  LayerList,
  watchUtils
  ) {
    const MEGAREGION = ['Arizona Sun Corridor', 'Cascadia', 'Florida', 
    'Front Range', 'Great Lakes', 'Gulf Coast', 'Northeast', 'Northern California',
  'Piedmont Atlantic', 'Southern California', 'Texas Triangle'];

    let statesLyr, urbanLyr, megaLyr, countiesLyr, censusblockLyr, 
    map, view, basemapGallery, bgExpand, customize, defaultMapSettings,
    selectionTab, ionInstance, mainWidth;


    defaultMapSettings = {
      category: 'Per Capita Consumption',
			fieldName: 'IMPHAPP10',
			dataType: 'Float',
			numClasses: 5,
			method: 'natural-breaks',
      colorScheme: ["#f0f9e8","#bae4bc","#7bccc4","#43a2ca","#0868ac"],
      colorId: '#GnBu'
    }
    
    selectionTab = '#query-state';

    function init(){
      customize = $.extend(true, {}, defaultMapSettings);
      cache();
      bindEvents();
      createLayers();
      initSettings();
      loading();
      $('#loading').show();
      setTimeout(() => {
        $('#loading').hide();
      }, 5000);
      setColorSchemeByCategoryNum(5);
    }

 
    function initSettings() {
      customize = $.extend(true, {}, defaultMapSettings);
      censusblockLyr.visible = false;
      countiesLyr.visible = false;
      megaLyr.visible = true;
      urbanLyr.visible = true;
      statesLyr.visible = true;
      censusblockLyr.opacity = 1;
      ionInstance = $opacity.data('ionRangeSlider');
      view.popup.close();
      stateTabBackToPlaceholder();
      megaregionTabBackToPlaceholder();
      sessionStorage.clear();
      setStateDropdown();
      setMegaregionDropdown();
      setNumClassesDropdown(7, defaultMapSettings.numClasses);
      setDefaultCategory();
      removeLegend();
      removeTable();
      $method[0].sumo.selectItem('natural-breaks');
			$('.nav-tabs a[href="#fields"]').tab('show');
      $colorTab.attr('class', 'nav-link disabled');
      $cbNumOne.hide();
      $cbNumTwo.hide();
      $fdPanel.hide();
      sessionStorage.clear();
      goToExtent(statesLyr.fullExtent);
    }

    function cache() {
      $selectCategory = $('#select-category');
			// Main
			$stateMegaBtn = $('#state-mega-btn');
			$selectState = $('#select-state');
      $selectCounty = $('#select-county');
      $cbNumOne = $('#block-count-one');
      $cbAlert = $('#censusblock-alert');
			// $countyRefresh = $('#btn-countyRefresh');
			// $getBlock = $('#btn-getBlock');
			$ddStates = $('#dd-states');
			$ddCounties = $('#dd-counties');
			// Megaregion
			$ddMegaregion = $('#dd-megaregion');
			$ddMegaStates = $('#dd-megastates');
			$ddMegaCounties = $('#dd-megacounties');
      $getMegaBlock = $('#btn-getMegaBlock');
      $cbNumTwo = $('#block-count-two');
      // Color Tab Panel
      $fdPanel = $('#fields-design');
      $opacity = $('#opacity-slider');
      $colorTab = $('#color-tab');
      $metricsTab = $('#metrics-tab');
			$numClasses = $('#select-num-class');
			$method = $('#classificationMethod');
			//$colorScheme = $('#colroScheme'); 
      $btnMap = $('#btn-map');
      $gcolor = $('#group-border');
      // Modal
      $infoModal = $('#info-modal');
      // Reset buttons
      $btnStateReset = $('#btn-state-reset');
      $btnCountyReset = $('#btn-county-reset');
      $btnMegaregionReset = $('#btn-megaregion-reset');
      $btnMegastateReset = $('#btn-megastate-reset');
      $btnMegacountyReset = $('#btn-megacounty-reset');
    }
    

		function bindEvents() {
      /*========== SumoSelect Dropdowns ========== */
      $ddStates.SumoSelect({
        search: true,
        searchText: 'Search state',
        placeholder: 'I. Select state'
      });
      
      $ddCounties.SumoSelect({
        search: true,
        searchText: 'Select county',
        placeholder: 'II. Select county'
      });

      $ddMegaregion.SumoSelect({
        search: true,
        searchText: 'Select megaregion',
        placeholder: 'I. Select megaregion'
      });
      
			$ddMegaStates.SumoSelect({
        search: true,
        searchText: 'Select state',
        placeholder: 'II. Select state'
      });
      
			$ddMegaCounties.SumoSelect({
				search: true,
        searchText: 'Select county',
        placeholder: 'III. Select county'
      });

      $selectCategory.SumoSelect();
      $numClasses.SumoSelect();
      $method.SumoSelect();

      // TABs
      $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        let target = $(e.target).attr("href"); // activated tab
        let tabs = ['#query-state', '#query-megaregion'];
				if (tabs.includes(target)){
          selectionTab = target;
          initSettings();
				}
			});
      // Dropdown events
      // Tab - State
      $ddStates.on('change', () => {
        let selected = $ddStates.find(":selected");
        let state = selected.text();
        let stateFip = selected.val();

        sessionStorage.setItem('state', state)
        sessionStorage.setItem('stateFip', stateFip)
        let expression = `STCNTYFP10 LIKE '${stateFip}%'`;

				if (selected != null){
          setCountiesDropdown(state);
          stateChange(state, expression);
				}
      });

      $ddCounties.on('change', () => {
        let selected =$ddCounties.find(':selected');
        countyOnChange(selected);
			});
      
      // Tab - Megaregion
      $ddMegaregion.on('change', () => {
				let selected = $ddMegaregion.find(":selected").text(),
        extent = getMegaregionExtent(selected, megaregion_data);
        sessionStorage.setItem('megaregion', selected);
        goToExtent(extent);
        setMegaStateDropdown(selected);
        $ddMegaCounties.html('');
        $ddMegaCounties[0].sumo.reload();
        removeTable();
        setDefaultCategory();
        customize = $.extend(true, {}, defaultMapSettings);
        censusblockLyr.visible = false;
        view.popup.close();
        countiesLyr.visible = false;
        megaLyr.visible = true;
        urbanLyr.visible = true;
        statesLyr.visible = true;
        view.graphics.removeAll();
        hideFieldDesign();
        removeLegend();
      });

			$ddMegaStates.on('change', () => {
				let selected =$ddMegaStates.find(':selected'),
        state = selected.text(),
        stateFip = selected.val(),
        expression = `STCNTYFP10 LIKE '${stateFip}%'`;
        sessionStorage.setItem('state', state);
        sessionStorage.setItem('stateFip', stateFip);
				if (selected != null){ 
          setMegaCountiesDropdown(sessionStorage.getItem('megaregion'), state);
          stateChange(state, expression);
				}
      });      
      
      $ddMegaCounties.on('change', evt => {
        let selected = $ddMegaCounties.find(':selected');
        countyOnChange(selected);
			});

      $infoModal.modal('hide');

      $opacity.ionRangeSlider({
        min: 0,
        max: 1,
        from: 1,
        step: 0.1,
        onFinish: function(data){
          censusblockLyr.opacity = data.from;
        }
      });

			$numClasses.on('change', () => {
        customize.numClasses = Number($numClasses.find(':selected').text()); 
        setColorSchemeByCategoryNum(customize.numClasses);
      });
      
			$method.on('change', () => {
				customize.method = ($method.find(':selected').text()).toLowerCase();
      });

			$selectCategory.on('change', () => { 
        let category = $selectCategory.find(":selected").text();
        let field = '#' + config.default_censusblock_data[category];

				if (category != 'Select category'){
						if ('#table-data'.length) {
							$('#table-data').remove();
            } 
            tabulate(censusblockinfo[0][category], config.table.columns);
            $(field).trigger('click');
        }
			});
      
			
			$btnMap.on('click', () => {
        let colorscheme = [],
        childs = $(customize.colorId);
        childs[0].childNodes.forEach(d => {
          if(d.attributes.fill){
            colorscheme.push(d.attributes.fill.value);
          }
        });
        customize.colorScheme = colorscheme;
        
        setThematicMapRenderer(customize);
        // BUG: mending -> After clicking Map button deletes 'active' class.
        $(customize.colorId).addClass('active');
      });

      // Reset buttons
      $btnStateReset.on('click', () => {
        view.goTo(statesLyr.fullExtent);
        initSettings();
      });

      $btnCountyReset.on('click', () => {
        $ddCounties.html('');
        $ddCounties[0].sumo.reload();
        countyReset('State');
      });

      $btnMegaregionReset.on('click', () => {
        initSettings();
      });

      $btnMegastateReset.on('click', () => {
        //setMegaregionDropdown();
        let megaregion = sessionStorage.getItem('megaregion');
        $ddMegaStates.html('');
        $ddMegaStates[0].sumo.reload();
        setMegaStateDropdown(megaregion);
        $ddMegaCounties.html('');
        $ddMegaCounties[0].sumo.reload();
        // $ddMegaregion[0].sumo.unSelectItem(megaregion);
        // $ddMegaregion[0].sumo.selectItem(megaregion);
        $cbNumTwo.hide();
      });

      $btnMegacountyReset.on('click', () => {
        $ddMegaCounties.html('');
        $ddMegaCounties[0].sumo.reload();
        countyReset('Megaregion');
      });

    } // bindEvents
    
/*========== Dropdowns ========== */
    // States 
		function setStateDropdown() {
      $ddStates.html('');
      $ddStates[0].sumo.reload();

      hpdata.forEach(d => {
				$ddStates[0].sumo.add(`${d.StateFIP}`, `${d.State}`);
      });
    }

    // Counties
    function setCountiesDropdown(state) {
			$ddCounties.html('');
			$ddCounties[0].sumo.reload();
			hpdata.forEach(d => {
				if(d.State == state) {
					d.Counties.forEach(c => {
						$ddCounties[0].sumo.add(`${c.CountyFIP}`, `${c.County}`);
					});
				}
			});
    }

    function setMegaregionDropdown() {
      $ddMegaregion.html('');
      $ddMegaregion[0].sumo.reload();
      
      MEGAREGION.forEach(d => {
        $ddMegaregion[0].sumo.add(d);
      });
    }
   
		function setMegaStateDropdown(megaregion) {
			$ddMegaStates.html('');
			$ddMegaStates[0].sumo.reload();
			megaregion_data.forEach(d => {
				if (d.Megaregion == megaregion){
					d.States.forEach(s => {
            let state = s.split(' (')[0];
            let stateFip = s.match(/\((.*)\)/)[1];
            console.log(state, stateFip);
						$ddMegaStates[0].sumo.add(stateFip, state);
					});
				}
      });
    }

    function setMegaCountiesDropdown(megaregion, state) {
			$ddMegaCounties.html('');
			$ddMegaCounties[0].sumo.reload();
			
			hpdata.forEach(d => {
				if (d.State == sessionStorage.getItem('state')){
					d.Counties.forEach(c => {
						if (c.Megaregion == megaregion){
							$ddMegaCounties[0].sumo.add(c.CountyFIP, c.County);
						}
					});
				}
      });
    }
    
    function setNumClassesDropdown(numclasses, selectItem) {
      $numClasses.html('');
      $numClasses[0].sumo.reload();
      for (let i=1; i<=numclasses; i++){
        let num = i.toString();
        $numClasses[0].sumo.add(num);
      }
      $numClasses[0].sumo.selectItem(`${selectItem}`);
    }

    function countyOnChange(selected) {
      let county = selected.text(),
      countyFip = selected.val(),
      stcntyfp = sessionStorage.getItem('stateFip') + countyFip,
      expression = `STCNTYFP10 = '${stcntyfp}'`;
      sessionStorage.setItem('county', county);
      sessionStorage.setItem('countyFip', countyFip);
      countyChange(sessionStorage.getItem('state'), county, expression);
        // Get Census Block data
      getCensusBlock(expression);
      $fdPanel.show();
    }

    function countyReset(tab) {
      let state = sessionStorage.getItem('state');
        
      if (state != ''){
        let state = sessionStorage.getItem('state'),
        stateFip = sessionStorage.getItem('stateFip'),
        expression = `STCNTYFP10 LIKE '${stateFip}%'`;
        stateChange(state, expression);
        if (tab == 'State'){
          setCountiesDropdown(state);
        } else if (tab == 'Megaregion'){
          setMegaCountiesDropdown(sessionStorage.getItem('megaregion'), state);
        }
        sessionStorage.setItem('county', '');
        sessionStorage.setItem('countyFip', '');
        sessionStorage.setItem('category', defaultMapSettings.category);
        sessionStorage.setItem('field', defaultMapSettings.field);
        sessionStorage.setItem('blockCount', '');
      }
    }


    function setDefaultCategory() {
      $('#select-category option[value=""]').removeAttr('disabled');
			$selectCategory[0].sumo.selectItem(customize.category);
			$('#select-category option[value=""]').attr('disabled', 'disabled');
    }


    /*========== Dropdown change events ========== */

    function stateChange(state, expression) {
      let extent = getStateMapExtent(state);
      goToExtent(extent);
      countiesLyr.definitionExpression = expression;
      countiesLyr.visible = true;
      megaLyr.visible = true;
      urbanLyr.visible = true;
      statesLyr.visible = false;
      censusblockLyr.visible = false;
      view.popup.close();
      removeLegend();
      removeTable();
      setDefaultCategory();
      customize = $.extend(true, {}, defaultMapSettings);
      $method[0].sumo.selectItem('natural-breaks');
      $('.nav-tabs a[href="#fields"]').tab('show');
      $cbNumOne.hide();
      $cbNumTwo.hide();
      hideFieldDesign();
    }


    function countyChange(state, county, expression) {
      let extent = getCountyExtent(state, county);
      goToExtent(extent);
      let blockCount = getCensusBlockCount(state, county, hpdata);
      sessionStorage.setItem('blockCount', blockCount);
      // userselect.blockCount = getCensusBlockCount(state, county, hpdata);
      if(selectionTab == '#query-state'){
        $cbNumOne.html('');
        $cbNumOne.text(`Number of Census block groups: ${blockCount}`);
        $cbNumOne.show();
      }
      else if(selectionTab == '#query-megaregion') {
        $cbNumTwo.html('');
        $cbNumTwo.text(`Number of Census block groups: ${blockCount}`);
        $cbNumTwo.show();
      }
      countiesLyr.visible = true;
      countiesLyr.definitionExpression = expression;

      removeLegend();

      setDefaultCategory();
      customize = $.extend(true, {}, defaultMapSettings);
      censusblockLyr.visible = false;
      $method[0].sumo.selectItem('natural-breaks');
      view.popup.close();
      removeTable();
      tabulate(censusblockinfo[0][customize.category], config.table.columns);
      //getCensusBlock();
      // hideFieldDesign();
    }

    function getCensusBlock(expression) {
      //$selectCategory[0].sumo.selectItem('Per Capita Consumption');
      $colorTab.removeClass('disabled');
      censusblockLyr.definitionExpression = expression
      censusblockLyr.visible = true;

      setThematicMapRenderer(customize);
      setTimeout(function waitCB_data(){
        $(`#data-fields tr[data-value='${customize.fieldName}']`).addClass('highlight');
      }, 1000);
      modalShowHide();
    }

    function stateTabBackToPlaceholder() {
      $ddStates.html('');
      $ddStates[0].sumo.reload();
      $ddCounties.html('');
      $ddCounties[0].sumo.reload();
    }

    function megaregionTabBackToPlaceholder() {
      $ddMegaregion.html('');
      $ddMegaregion[0].sumo.reload();
      $ddMegaStates.html('');
      $ddMegaStates[0].sumo.reload();
      $ddMegaCounties.html('');
      $ddMegaCounties[0].sumo.reload();
    }

    function modalShowHide() {
      let blockCount = sessionStorage.getItem('blockCount');
      if(blockCount > 3500){
        $infoModal.modal('show');
      } else {
        $infoModal.modal('hide');
      }
    }

    function hideFieldDesign(){
      $metricsTab.click();
      $fdPanel.hide();
      defaultOpacity();
      view.graphics.removeAll();
      setNumClassesDropdown(7, defaultMapSettings.numClasses);
      setColorSchemeByCategoryNum(defaultMapSettings.numClasses);
      onOffColorTab(defaultMapSettings.dataType, defaultMapSettings.fieldName);
    }


    /*========== Extent ========== */
    function goToExtent(extent) {
      view.goTo(extent).then(evt => {
        if(!view.extent.contains(extent)){
          view.zoom -= 1;
        }
      });
    }

    function getStateMapExtent(state) {
			let stateExtent = null;
			hpdata.forEach(d => {
				if(d.State == state){
					let se = d.Extent;
					stateExtent = new Extent({
						xmin: se[0],
						ymin: se[1],
						xmax: se[2],
						ymax: se[3],
						spatialReference: {wkid: 102100}
					});
				} 
			});
			return stateExtent;
    }
    
    
		function getCountyExtent(state, county) {
			let countyExtent = null;
			hpdata.forEach(d => {
				if (d.State == state){
					d.Counties.forEach(c => {
						if (c.County == county){
							let ce = c.Extent;
							countyExtent = new Extent({
								xmin: ce[0],
								ymin: ce[1],
								xmax: ce[2],
								ymax: ce[3],
								spatialReference: {wkid: 3857}
							});
						}
					});
				} 
			});
			return countyExtent;
    }


    function getMegaregionExtent(megaregion, data) {
			let megaregionExtent;
			data.forEach(m => {
				if (m.Megaregion == megaregion){
					let me = m.Extent;
					megaregionExtent = new Extent({
						xmin: me[0],
						ymin: me[1],
						xmax: me[2],
						ymax: me[3],
						spatialReference: {wkid: 3857}						
					});
				}
			});
			return megaregionExtent;
    }

    
    /*========== Event related ========== */
    // Set opacity to default: 1
    function defaultOpacity() {
      ionInstance.update({from: 1});
      censusblockLyr.opacity = 1;
    }

    // Trying to not show loading page by user interaction (zoom and pan).
    // Zooming in still shows loading page.  It may require improvement.
    function interactExtent() {
      let flag = false;
      watchUtils.whenTrue(view, 'interacting', evt => {
        flag = true;
      });
      return flag;
    }

    // Show and hide (number of class/classification/color in Colot tab)
    function onOffColorTab(dataType, fieldName){
			let fieldsException = ['HDC1Y90', 'HDC1Y00', 'HDC1Y10',
        'HDC2Y90', 'HDC2Y00', 'HDC2Y10'];
			if(dataType != 'Text'){
				if(fieldsException.includes(fieldName)){
          $gcolor.hide();
				} else {
          $gcolor.show();
				}
			}
			else {
        $gcolor.hide();
			}
		}


    function getCensusBlockCount(state, county, hpdata) {
      let blockcount;
      hpdata.forEach(d => {
        if(d.State == state){
          d.Counties.forEach(c => {
            if(c.County == county){
              blockcount = c.BlockCount;
            }
          });
        }
      });
      return blockcount;
    }


    function loading(){
      view.watch('updating', updating => {
        let flag = interactExtent();
        if(updating && flag){
          $('#loading').hide();
        } 
        else if(updating && !flag){
          $('#loading').show();
        }
        else {
          $('#loading').hide();
        }
      });
    }

    
    /*========== Census Block Group data mapping by field ========== */
    function setThematicMapRenderer(args) {
      let renderer, popupTemplate,
      county = sessionStorage.getItem('county'),
      countyFip = sessionStorage.getItem('countyFip'),
      state = sessionStorage.getItem('state'),
      popupTitle = `<b>${county} (${countyFip}), ${state}</b>`;
      
        if (args.dataType != 'Text'){
          ClassBreaks({
            layer: censusblockLyr,
            field: args.fieldName,
            classificationMethod: args.method,
            numClasses: args.numClasses
          })
          .then(response => {
            let classbreakinfo = [],
            numBreaks = response.classBreakInfos.length,
            popupTemplate = {
              title: popupTitle,
              content: `<b>ID:</b> {GEOID10}</br>
              <b>${args.fieldName}:</b> {${args.fieldName}:NumberFormat}</br>`
            };
            censusblockLyr.popupTemplate = popupTemplate;

            if (numBreaks < customize.numclasses){
              setNumClassesDropdown(numBreaks, numBreaks);
              customize.numClasses = numBreaks;
            }
            // BUG? added this for selectItem 1 since 'else' statement doen't work for value 1
            else if (customize.numClasses == 1) {
              $numClasses[0].sumo.selectItem('1');
            }
            else {
              setNumClassesDropdown(7, numBreaks);
            }

            response.classBreakInfos.forEach((d, i) => {
              let symbol = {
                type: 'simple-fill',
                color: args.colorScheme[i],
                style: 'solid',
                outline: {
                  width: 0.5,
                  color: 'white'
                }
              };

              classbreakinfo.push({
                maxValue: d.maxValue,
                minValue: d.minValue,
                symbol: symbol,
                label: d.label
              });
            });
  
            renderer = new ClassBreaksRenderer({
              field: args.fieldName
            });
            renderer.classBreakInfos = classbreakinfo;
            censusblockLyr.renderer = renderer;
          });
        } else {
          let uniquevalueinfo = [],
          popupTemplate = {
            title: popupTitle,
            content: `<b>ID:</b> {GEOID10}</br>
            <b>${args.fieldName}:</b> {${args.fieldName}}`
          };
          censusblockLyr.popupTemplate = popupTemplate;
          console.log(uniquevalue[args.fieldName]);
          uniquevalue[args.fieldName].forEach(d => {
            let symbol = {
              type: 'simple-fill', 
              color: d.rgba,
              style: 'solid',
              outline: {
                width: 0.5,
                color: 'white'                
              }
            };

            uniquevalueinfo.push({
              value: d.value,
              symbol: symbol,
              label: d.value
            });
          });

          renderer = new UniqueValueRenderer({
            field: args.fieldName
          });
          renderer.uniqueValueInfos = uniquevalueinfo;
          censusblockLyr.renderer = renderer;
      }

      urbanLyr.visible = false;
      megaLyr.visible = false;
      countiesLyr.visible = false;
      createLegend();
    }

    /*========== Legend ========== */
    function createLegend(){
      removeLegend();
      let legend = new Legend({
        id: 'legendWrapper',
        view: view,
        layerInfos: [
        {
          layer: censusblockLyr,
          title: 'Census Block Group:'
        }]
      }, 'legendDiv');
      view.ui.add(legend, 'bottom-left');

      interact(legend.container).draggable({
        restrict: {
          restriction: view.container,
          endOnly: true,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        // enable autoScroll
        autoScroll: true,
        // call this function on every dragmove event
        onmove: dragMoveListener
      });
    }

    function dragMoveListener(evt) {
      var target = evt.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute("data-x")) || 0) + evt.dx,
        y = (parseFloat(target.getAttribute("data-y")) || 0) + evt.dy;
  
      // translate the element
      target.style.webkitTransform = target.style.transform =
        "translate(" + x + "px, " + y + "px)";
  
      // update the posiion attributes
      target.setAttribute("data-x", x);
      target.setAttribute("data-y", y);
    }


    function removeLegend(){
      view.ui.empty('bottom-left');
    }

    /*========== Field table ========== */ 
    function tabulate(data, columns) {
      //let ch = $('#content-container').height();
      console.log(data);
      let table = d3.select('#data-fields')
			.append('table')
			.attr('class', 'table table-hover table-bordered')
			.attr('id', 'table-data');
			
			let thead = table.append('thead'),
      tbody = table.append('tbody'),
      rows;
			// append the header row
			thead.append('tr')
				.selectAll('th')
				.data(() => {
					return columns.map(item => {
							return item.name;
					});
				})
				.enter()
				.append('th')
					.text(function (column) { return column; });
	
			// create a row for each object in the data
			rows = tbody.selectAll('tr')
				.data(data)
				.enter()
        .append('tr')
        .attr('id', d => {
          return d.fieldName;
        })
				.attr('data-value', d => {
					return d.fieldName;
				})
				.on('click', function mouseOver(d, i){
          let selected = $(this).hasClass('highlight');
          console.log($(this));
					$("#table-data tr").removeClass('highlight');
					if(!selected)
						$(this).addClass('highlight');
					customize.fieldName = d.fieldName;
					customize.dataType = d.dataType;
					// Census Block Thematic Map (Field parameter setup)
					setThematicMapRenderer(customize);
					// Color Tab control
					onOffColorTab(d.dataType, d.fieldName);
				});
				// create a cell in each row for each column
				rows.selectAll('td')
					.data(function (row) {
						return columns.map(function (column) {
							return {[column.data]: column.data, value: row[column.data]};
						});
					})
					.enter()
					.append('td')
						.text(function (d) { return d.value; });
				return table;
    }
    

		function removeTable() {
			if($('#data-fields table').length) {
				$('#data-fields table').remove();
			}
    }


    /*========== Color scheme ========== */
    function setColorSchemeByCategoryNum(catNum) {
      $('#colorScheme').empty();
      let d3brewer = d3.entries(colorbrewer);
			let colors = d3brewer.map(d => {
        if(catNum === 1){
          return {key: d.key, value: [d.value[3][2]]};
        }
        else if(catNum === 2){
          return {key: d.key, value: [d.value[3][0], d.value[3][2]]}
        }
				else if(d.value[catNum]){
					return {key: d.key, value: d.value[catNum]};
				}
			}),
	
      svgHeight =  30 * colors.length + 30,
			colorScaleWidth = 200,
      colorScaleHeight = '20px';
      
			let svg = d3.select('#colorScheme')
			.append('svg')
				.attr('id', 'svgColor')
				.attr('height', svgHeight)
        .attr('width', colorScaleWidth)
                 
				for (let c=0; c<colors.length; c++) {
          let one = svg.append('g')
            .attr('id', colors[c].key)
            .attr('class', 'inactive')
						.attr('transform', () => {
						let row = (c+1)*30;
						return `translate(0, ${row})`;
          })
						for (let p=0; p<colors[c].value.length; p++){
							one.append('rect')
								.attr('x', () => {
									return p * (colorScaleWidth/catNum);
								})
								// .attr('y', 0)
								.attr('width', () => {
									let width = colorScaleWidth/catNum
									return `${width}px`
								})
								.attr('height', colorScaleHeight)
								.attr('fill', () => {
									return colors[c].value[p];
                })
                
            }
            
            // Set default color selection
            $(`${customize.colorId}`).attr('class', 'active');
	
						one.append('rect')
							.attr('class', 'outer')
							.attr('width', colorScaleWidth)
              .attr('height', '20px')
              .attr('cursor', 'pointer')
              .on('click', () => {
                
                let e = d3.event,
                id = `#${e.target.parentNode.id}`;
                
                $(id).removeClass('inactive');
                
                //isSelected = d3.select(d3.event.target.parentNode).classed('active');
                customize.colorId = `#${e.target.parentNode.id}`;
								if( !e.ctrlKey) {
                  d3.selectAll( 'g.active').classed('inactive', true);
                  d3.selectAll( 'g.active').classed('active', false);
								}
                //d3.select(d3.event.target.parentNode).classed('active', !isSelected);
                
                $(id).addClass('active');
                // let childs = e.target.parentNode.childNodes,
                // colorscheme = [];
								// childs.forEach(d => {
								// 	if(d.attributes.fill){
								// 		colorscheme.push(d.attributes.fill.value);
								// 	}
								// });
                // customize.colorScheme = colorscheme;
                // console.log(customize.colorScheme);
              })
            one.append('title')
              .text(colors[c].key)
        }
    }
    
    // function colorSchemeActive(id, colorscheme){
    //   $(id).addClass('active');
    //   let childs = e.target.parentNode.childNodes;
    //   childs.forEach(d => {
    //     if(d.attributes.fill){
    //       colorscheme.push(d.attributes.fill.value);
    //     }
    //   });
    //   customize.colorScheme = colorscheme;
    //   console.log(customize.colorScheme);
    // }
    
    /*========== Map/View/Layers ========== */
    function createLayers(){
      /*========== States Layer========== */
      statesLyr = new FeatureLayer(config.states.url, {
        title: config.states.title,
        outFields: config.states.outfields,
        visible: true,
        opacity: 1,
      });
      // Symbol
      statesLyr.renderer = {
        type: 'simple',
        symbol: {
          type: 'simple-fill',
          color: config.states.symbol.fill_color,
          outline: {
            color: config.states.symbol.line_color,
            width: config.states.symbol.line_width
          }
        }
      }
      // Label
      statesLyr.labelingInfo = [{
        symbol:{
          type: 'text',
          color: config.states.label.text_color,
          font: {
            family: config.states.label.font_family,
            size: config.states.label.font_size,
            weight: 'bold'
          }
        },
        labelExpressionInfo: {
          expression: `$feature.${config.states.label.label_field}`
        }
      }];

        /*========== Urban Area Layer ========== */
        urbanLyr = new FeatureLayer(config.urban_area.url, {
          title: config.urban_area.title,
          opacity: 0.5
        });

        /*========== Megaregion Layer ========= */
        megaLyr = new FeatureLayer(config.megaregion.url, {
          title: config.megaregion.title,
          opacity: 0.5,
          popupTemplate: {
            title: 'Megaregion',
            content: '<b>{Megaregion}</b>'
          }
        });

        /*========== Counties Layer ========== */
        countiesLyr = new FeatureLayer(config.counties.url, {
          title: config.counties.title,
          outFields: config.counties.outfields,
          visible: false,
          opacity: 1,
          listMode: 'hide'
        });
        // Symbol
        countiesLyr.renderer = {
          type: 'simple',
          symbol: {
            type: 'simple-fill',
            color: config.counties.symbol.fill_color,
            outline: {
              color: config.counties.symbol.line_color,
              width: config.counties.symbol.line_width
            }
          }
        }
        // Label
        countiesLyr.labelingInfo = [{
          symbol:{
            type: 'text',
            color: config.counties.label.text_color,
            font: {
              family: config.counties.label.font_family,
              size: config.counties.label.font_size,
              weight: 'bold'
            }
          },
          labelExpressionInfo: {
            expression: `$feature.${config.counties.label.label_field}`
          }
        }];

        /*========== Census Block Layer ========== */
        censusblockLyr = new FeatureLayer(config.census_block.url, {
          title: config.census_block.title,
          outFields: config.census_block.outfields,
          visible: false,
          opacity: 1,
          listMode: 'hide'
        });

        map = new Map({
          basemap: 'streets'
        });
      
        view = new MapView({
          container: 'viewDiv',
          map: map,
          padding: {
            right: mainWidth
          }
        });

        basemapGallery = new BasemapGallery({
          view: view,
          container: document.createElement('div')
        });

        bgExpand = new Expand({
          view: view,
          content: basemapGallery
        });

        view.ui.add(bgExpand, {
          position: 'top-left'
        });
        
        const layerList = new LayerList({
          view: view,
          listItemCreatedFunction: function(event) {
            const item = event.item;
            if (item.layer.type != 'group') { // don't show legend twice
              item.panel = {
                content: 'legend',
                open: true
              };
            }
          }
        });

        let llExpand = new Expand({
          view: view,
          content: layerList
        });
        view.ui.add(llExpand, 'top-left');
    
        map.addMany([statesLyr, countiesLyr, censusblockLyr, megaLyr, urbanLyr]);
        statesLyr.when(() => {
          goToExtent(statesLyr.fullExtent);
        });
    }


    /*========== Side menue ========== */
    $('#main').BootSideMenu(
      {
        side: 'right',
        width: '28%',
        autoClose: false,
        closeOnClick: false,
        pushBody: true,
        duration: '500',
        icons: {
          left: 'fas fa-angle-double-left',
          right: 'fas fa-angle-double-right',
          down: 'fas fa-angle-double-right',
        }
    });
    mainWidth = $('#main').width() - 50;



    $(document).ready(function() {
      init();
    });
});


