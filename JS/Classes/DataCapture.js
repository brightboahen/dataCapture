/**
 * Created by Bright on 06/08/2016.
 */
var DataClass = DataClass || {}; //DataClass namespace
(function(window,DataClass){
    'use strict';

    /**
     * @constructor  DataCapture
     * @param{object} domMappings - an instance of the mappings object
     * @param{object} dataReporter - an instance of the reporter class
     * */
    function DataCapture(domMappings,dataReporter){
        this.mappings = domMappings;
        this.reporter = dataReporter;
        this.staticValues = [];
    }

    /**
     * Objects prototype chain*/
    DataCapture.prototype = {
        /**
         * @name init - initiates the gathering of relevant DOM elements
         * */
        init : function(){
            this.getDOMElementsAndBindEventListeners();
        },

        /**
         * This method establishes a handler to the DOM element that matches the selector from the mapping array (object)
         * @name getDOMElementReference
         * @param {String} selector - value of the selector property (id or class name of a DOM element)
         * @returns DOM element
         * */
        getDOMElementReference : function(selector){
            var domEl;
            if(selector ==='input[name="sex"]'){
                //There is more than one element so lets query all
                domEl = document.querySelectorAll(selector);
            }else{
                domEl = document.querySelector(selector);
            }
            return domEl;
        },
        /**
         * This method accepts a DOM element and then attach an event listener to it
         * @name attachListenersToElementRef
         * @param{Object} element - DOM element
         * @param{Object} map - the element's corresponding map entry*/
        attachListenersToElementRef : function(element,map){
            var self = this;
            if(element !== undefined){
                var evtType = this.getEventType(map);
                if(element.length >=2 ){
                    element.forEach(function(el){
                        el.dataset.idNumber = map.id;
                        if(evtType === 'change'){
                            el.addEventListener(evtType,this.handleEvents.bind(self))
                        }else{
                            this.staticValues.push(el);
                        }
                    }.bind(this));
                }else {
                    element.dataset.idNumber = map.id;
                    if(evtType === 'change'){
                        element.addEventListener(evtType,self.handleEvents.bind(self));
                    }else{
                        self.staticValues.push(element);
                    }
                }
            }
        },
        /**
         * This method acquires a reference to DOM and attach event listeners to it
         * @name getDOMElementsAndBindEventListeners
         * */
        getDOMElementsAndBindEventListeners : function(){
            var self = this;
            if(self.mappings !== undefined){
                self.mappings.forEach(function (mapItem) {
                    self.attachListenersToElementRef(self.getDOMElementReference(mapItem.selector),mapItem);
                }.bind(self));
            }
        },

        /**
         * EventListener
         * @name handleEvents
         * */
        handleEvents : function(event){
            var mappedData = this.getMapping(event.target.dataset.idNumber),
                tmpArray = [this.getDataFromStaticElements(undefined), this.getDataFromDynamicElements(event.target,mappedData)];
            this.batchSendData(this.flattenArray(tmpArray));
        },
        /**
         * @name getEventType
         * @param{object} map - an object from the mapping array
         * @returns {string}
         * */
        getEventType : function(map){
            return map.event.substr(2).toLowerCase();
        },

        /**
         * This method takes the mapping id of the target element and returns the corresponding entry from the mapping object
         * @name getMapping
         * @param {string} id - the id that maps the event target to an entry/property in the mappings object
         * @returns {object} mapping object
         * */
        getMapping : function(id){
            if(id !== undefined){
                return this.findElementInMap(parseInt(id));
            }
        },

        /**
         * This method takes in a multidimensional array and returns a flattened copy of it
         * @name flattenArray
         * @param { Array } tmpArrayToHoldData - A temporary multidimensional array
         * @returns {Array} */
        flattenArray : function (tmpArrayToHoldData){
            if(tmpArrayToHoldData.length >=2){
                return tmpArrayToHoldData.reduce(function(arrayA, arrayB){
                    return arrayA.concat(arrayB);
                },[]);
            }
        },

        /**
         * This method reports the collected data to the DataReporter
         * @name batchSendData
         * @param{Array} arrayOfDataToReport
         * */
        batchSendData : function(arrayOfDataToReport){
            var self = this;
            if(arrayOfDataToReport !== undefined && arrayOfDataToReport.length >=1){
                arrayOfDataToReport.forEach(function(data){
                    self.reporter.send(data.id,data.data);
                });
            }
        },

        /**
         * This method returns an object from the mapping array based on the mapId passed to it
         * @name findElementInMap
         * @param{Number} mapId - the id of the mapped data in mapping array*/
        findElementInMap : function(mapId){
            var self = this;
            if(mapId !== undefined){
                return self.mappings.filter(function(mapItem){
                    return mapItem.id === mapId;
                });
            }
        },

        /**
         * Takes care of the DOM elements that are static and their values need captured on load
         * @name getDataFromStaticElements
         * @returns {Array}
         * */
        getDataFromStaticElements : function(elements){
            var tmpArr      = [],
                self        = this,
                elements    =  elements === undefined ? self.staticValues : elements;
            if(elements && elements.length >= 1){
                elements.forEach(function(el){
                    var mapId = el.dataset.idNumber,
                        mapObj = {id : mapId, data: el.textContent};
                    tmpArr.push(mapObj)
                });
            }
            return tmpArr;
        },

        /**
         * @name getDataFromDynamicElements
         * @param { Object } element - the DOM element that relates to the mapPosition and needs their data captured on value change
         * @param {Object} mapPosition - the location of the element in the mapping array
         * @returns{Array} returns an array of size 1 with the object id and data
         * */
        getDataFromDynamicElements : function(element,mapPosition){
            if(element !== undefined && mapPosition !== undefined){
                var dataObj = { id : mapPosition[0].id},
                    tmpObj = {};
                switch (mapPosition[0].attribute){
                    case 'radio':
                        tmpObj = { data : element['value']};
                        break;
                    case 'checkbox':
                        tmpObj = { data : element['checked']};
                        break;
                    default:
                        tmpObj = {data : element[mapPosition[0].attribute]};
                        break;
                }
                if(mapPosition[0].isEmail || mapPosition[0].isPhoneNumber){
                    if(this.validateEmail(tmpObj.data) || this.validatePhoneNumber(tmpObj.data)){
                        return [Object.assign({},dataObj,tmpObj)];
                    }
                    return [];
                }
                return [Object.assign({},dataObj,tmpObj)];
            }
            return [];
        },

        /**
         * @name validateEmail
         * @param {String} email - the email string to test against
         * @returns {Boolean} true/false
         * */
        validateEmail : function(email){
            var regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return regExp.test(email);
        },

        /**
         * @name validatePhoneNumber
         * @param {String} phone - the email string to test against
         * @returns {Boolean} true/false
         * */
        validatePhoneNumber : function(phone){
            var regExp = /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/; //Tested with mobile phones only
            return regExp.test(phone);
        }
    };

    DataClass.DataCapture = DataCapture;
})(window, DataClass);