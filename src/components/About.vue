<template>
    <div class="about">
        <div class="container">
            <h2 class="text-white mt-0">Book a Flight</h2>

            <div data-skyscanner-widget="FlightSearchWidget" data-locale="en-US"></div>

        </div>
    </div>

</template>


<style>
    div.about {
        padding-top: 10rem;
        padding-bottom: calc(10rem - 72px);
        background: linear-gradient(to bottom, rgba(92, 77, 66, 0.8) 0%, rgba(92, 77, 66, 0.8) 100%), url("../../public/img/portfolio/fullsize/9.jpg");
        background-position: center;
        background-repeat: no-repeat !important;
        background-attachment: scroll;
        background-size: cover !important;
        height: 100vh
    }
</style>

<script>
    export default {
        mounted: function () {
            /* eslint no-var:0, no-console:0 */
            (function (root) {

                function getGlobals() {
                    var skyscanner = root.skyscanner = root.skyscanner || {};
                    var widgets = skyscanner.widgets = skyscanner.widgets || {};
                    widgets.renderCache = widgets.renderCache || {};
                    widgets.requests = widgets.requests || {};

                    return {
                        widgets: widgets
                    };
                }

                var globals = getGlobals();

                var OBJECT_MAPPED_PARAM_REGEX = /^\{(.+)\}$/;
                var OBJECT_MAPPED_KEY_REGEX = /^([^(]+)\(([^)]+)\)$/;

                function buildUrl(base, path, queryParameters) {
                    path = path || '';
                    queryParameters = queryParameters || {};

                    queryParameters.v = 'a7d49a';

                    var queryString = Object.keys(queryParameters)
                        .filter(function (key) {
                            return key && queryParameters[key] !== null && queryParameters[key] !== undefined;
                        })
                        .map(function (key) {
                            return encodeURIComponent(key) + '=' + encodeURIComponent(queryParameters[key]);
                        })
                        .join('&');

                    return base + path + '?' + queryString;
                }

                function getWidgetUrl(path, queryParameters) {
                    return buildUrl('https://www.skyscanner.net/g/widget-server', path, queryParameters);
                }

                function getGatewayProxyUrl(path, queryParameters) {
                    return buildUrl('https://www.skyscanner.net/g/widget-server', path, queryParameters);
                }

                function WidgetElement(domElement, scope) {

                    this.scope = scope || globals;

                    this.xhr = root && root.XMLHttpRequest;

                    this.element = domElement;
                    this.locale = this.element.dataset.locale || 'en-GB';
                    this.market = this.element.dataset.market || 'any';
                    this.currency = this.element.dataset.currency || 'any';
                    this.widgetType = this.element.dataset.skyscannerWidget;
                    this.params = {};
                    this.xhrParams = [];
                    this.errors = [];
                    this.serverUrl = 'https://www.skyscanner.net/g/widget-server';
                }

                var widgetElementPrototype = WidgetElement.prototype;

                widgetElementPrototype.removeXhr = function (url) {
                    delete this.scope.widgets.requests[url];
                };

                function getReferrer(root) {
                    if (root.document) {
                        return (window.location === window.parent.location)
                            ? document.location.href
                            : document.referrer;
                    }
                    if (root.location) {
                        return root.location.href;
                    }
                    return null;
                }

                widgetElementPrototype.getXhr = function (url, skipHeader, withCredentials) {
                    if (!this.scope.widgets.requests[url]) {
                        var xhr = new this.xhr();
                        xhr.addEventListener('loadend', this.removeXhr.bind(this, url));
                        xhr.open('GET', url, true);

                        if (!skipHeader) {
                            xhr.setRequestHeader('Widget-Referrer', getReferrer(root));
                        }

                        if (withCredentials) {
                            xhr.withCredentials = true;
                        }

                        xhr.send(null);
                        this.scope.widgets.requests[url] = xhr;
                    }
                    return this.scope.widgets.requests[url];
                };

                widgetElementPrototype.addError = function (message, error) {
                    this.errors.push({
                        message: message,
                        error: error
                    });
                };

                widgetElementPrototype.lookupLocation = function (queryParams, widgetType) {
                    for (var key in queryParams) {
                        if (!queryParams[key]) {
                            return;
                        }
                    }
                    if (widgetType) {
                        queryParams.widgetType = widgetType;
                    }

                    return this.getXhr(getWidgetUrl('/v1.0/' + this.locale + '/' + this.market + '/' + this.currency + '/location', queryParams));
                };

                widgetElementPrototype.unregisterXhrParam = function (xhr) {
                    this.xhrParams = this.xhrParams.filter(function (param) {
                        return param.request !== xhr;
                    });
                };

                widgetElementPrototype.handleXhrParamLoad = function (key, xhr) {

                    this.unregisterXhrParam(xhr);

                    if (xhr.readyState !== 4 || xhr.status !== 200) {
                        this.setParam(key, null);
                    } else {
                        this.setParam(key, xhr.responseText);
                    }

                    this.beginRender();
                };

                widgetElementPrototype.registerXhrParam = function (key, xhr) {

                    this.xhrParams.push({
                        key: key,
                        request: xhr
                    });

                    xhr.addEventListener('load', this.handleXhrParamLoad.bind(this, key, xhr));
                };

                widgetElementPrototype.setSimpleParam = function (key, value) {
                    if (value === undefined) {
                        this.addError('Undefined parameter value for key "' + key + '"');
                        return;
                    }

                    this.params[key] = value;
                };

                widgetElementPrototype.setComplexParams = function (keys, value) {

                    var widget = this;
                    var dataObject = null;

                    if (typeof value === 'string') {
                        try {
                            dataObject = JSON.parse(value);
                        } catch (e) {
                            this.addError('Error parsing JSON data: ' + value);
                        }
                    } else {
                        dataObject = value;
                    }

                    keys.forEach(function (key) {
                        widget.setSimpleParam(key.paramKey, dataObject && dataObject[key.objectKey] || null);
                    });
                };

                widgetElementPrototype.setParam = function (key, value) {

                    if (value instanceof this.xhr) {
                        this.registerXhrParam(key, value);

                    } else {

                        var objectMappedParamMatch = key.match(OBJECT_MAPPED_PARAM_REGEX);
                        if (objectMappedParamMatch) {

                            var keys = objectMappedParamMatch[1]
                                .split(',')
                                .map(function (key) {
                                    return key.trim();
                                })
                                .map(function (key) {
                                    var objectMappedKeyMatch = key.match(OBJECT_MAPPED_KEY_REGEX);
                                    if (objectMappedKeyMatch) {
                                        return {paramKey: objectMappedKeyMatch[1], objectKey: objectMappedKeyMatch[2]};
                                    }
                                    return {paramKey: key, objectKey: key};
                                });

                            this.setComplexParams(keys, value);

                        } else {
                            this.setSimpleParam(key, value);
                        }
                    }
                };

                widgetElementPrototype.parseParamString = function (params) {
                    var obj = {};

                    params.split(';').forEach(function (pair) {
                        var parts = pair.split(':');
                        if (pair && parts.length > 1) {
                            obj[parts[0]] = parts[1];
                        }
                    });

                    return obj;
                };

                widgetElementPrototype.parseFixedParams = function () {
                    var widget = this;
                    var params = [];

                    if (this.element.dataset.params) {
                        params = this.parseParamString(this.element.dataset.params);
                    }

                    Object.keys(params).forEach(function (key) {
                        widget.setParam(key, params[key]);
                    });
                };

                widgetElementPrototype.parseScriptedParams = function () {

                    var widget = this;
                    var element = this.element;
                    var scriptParams = element.dataset.scriptParams;

                    if (scriptParams) {

                        try {

                            var parsedScriptParams = JSON.parse(scriptParams);
                            Object.keys(parsedScriptParams).forEach(function (key) {

                                var value = parsedScriptParams[key];
                                if (key && value) {

                                    try {

                                        if (Array.isArray(value)) {
                                            value = value.join('\n');
                                        }

                                        var scriptResult = (function () {
                                            return eval('(' + value + ')');
                                        }).apply(widget);

                                        widget.setParam(key, scriptResult);

                                    } catch (e) {
                                        widget.addError('Error parsing scripted parameter "' + key + '"', e);
                                    }
                                }

                            });

                        } catch (e) {
                            this.addError('Error parsing data-script-parameters: ' + scriptParams, e);
                        }

                    }
                };

                widgetElementPrototype.parseLocationParams = function () {


                    var widget = this;

                    function getDestinationKey(widgetType) {
                        const destinationKeys = {
                            HotelSearchWidget: 'q',
                            MultiVerticalWidget: ['destination', 'q'],
                            CarHireWidget: 'destination', // TODO: add car hire location keys
                        };
                        return destinationKeys[widgetType] || 'destination';
                    }

                    // Values may be specified as strings or arrays - a string is converted to a single element array
                    // Multiple values are handled in order - latter values will override
                    // so a valid data-location-name will override data-location-param
                    const destinationKey = getDestinationKey(widget.widgetType);
                    var locationAttributeDefinitions = {
                        types: {
                            [destinationKey]: ['location', 'destination'],
                            origin: 'origin'
                        },
                        attributes: {
                            name: ['param', 'name'],
                            latlon: 'coords',
                            phrase: 'phrase',
                            iataCode: 'iata-code',
                            geo: 'geo-lookup'
                        }
                    };

                    function asArray(value) {
                        return Array.isArray(value) ? value : [value];
                    }

                    function getTypeNames(typeKey) {
                        return asArray(locationAttributeDefinitions.types[typeKey]);
                    }

                    function getAttributeNames(attributeKey) {
                        return asArray(locationAttributeDefinitions.attributes[attributeKey]);
                    }

                    // Parse single location attribute by typeName and attributeName
                    // e.g. data-location-name
                    function parseAttribute(typeName, attributeName) {
                        var dataKey = typeName + '-' + attributeName;

                        var attributeValue = widget.element.getAttribute('data-' + dataKey);
                        if (attributeValue) {
                            try {
                                var parsedValue = (function () {
                                    return eval('(' + attributeValue + ')');
                                }).apply(widget);
                                if (parsedValue === undefined || parsedValue === 'undefined') {
                                    throw 'Undefined value';
                                }
                                widget.element.removeAttribute('data-' + dataKey);
                                return parsedValue;
                            } catch (e) {
                                console.warn('Failed to evaluate location ' + dataKey + ' script: ' + e);
                            }
                        }

                        return undefined;
                    }

                    // Parse all attributes for typeName and attributeKey and set parsedAttributes
                    // e.g. attributeKey "name" has attributeNames "param" and "name",
                    //      so data-location-param and data-location-name both get parsed
                    //      and parsedAttributes['name'] assigned their result.
                    //      As both are parsed and *could* be present, order is important
                    function parseAttributesForAttributeKey(parsedAttributes, typeName, attributeKey) {
                        return getAttributeNames(attributeKey)
                            .reduce(function (parsedattributes, attributeName) {
                                var parsedAttributeValue = parseAttribute(typeName, attributeName);
                                if (parsedAttributeValue !== undefined) {
                                    parsedAttributes[attributeKey] = parsedAttributeValue;
                                }
                                return parsedAttributes;
                            }, parsedAttributes);
                    }

                    // Parse all defined attributes for typeName
                    // e.g. data-location-*
                    function parseAttributesForLocationTypeName(parsedAttributes, typeName) {
                        return Object.keys(locationAttributeDefinitions.attributes)
                            .reduce(function (parsedAttributes, attributeKey) {
                                return parseAttributesForAttributeKey(parsedAttributes, typeName, attributeKey);
                            }, parsedAttributes);
                    }

                    function generateLocationParamKey(locationType) {
                        const locationTypes = locationType.split(',');
                        if (locationTypes.length === 1) {
                            return '{' + locationTypes[0] + '(name),' + locationTypes[0] + 'Id(id)}';
                        }
                        return '{' + locationTypes.reduce((acc, x) => acc + `${x}(${x}Name), ${x}Id(${x}Id),`, '') + '}';

                    }

                    function lookupLocations(locationType, query) {
                        var locationParamKey = generateLocationParamKey(locationType);
                        var locationRequest = widget.lookupLocation(query, widget.widgetType);
                        if (locationRequest) {
                            widget.setParam(locationParamKey, locationRequest);
                        }
                    }

                    // Parse and lookup all defined names for a location typeKey
                    // e.g. location type "location" could have both "location" and "destination" names
                    //      which would allow both data-location-* and data-destination-* attributes
                    //      to be parsed
                    function parseAttributesForLocationType(typeKey) {
                        var parsedLocationAttributes = getTypeNames(typeKey)
                            .reduce(parseAttributesForLocationTypeName, {});

                        if (Object.keys(parsedLocationAttributes).length > 0) {
                            lookupLocations(typeKey, parsedLocationAttributes);
                        }
                    }

                    Object.keys(locationAttributeDefinitions.types)
                        .forEach(parseAttributesForLocationType);

                };

                widgetElementPrototype.parseAffiliateParams = function () {
                    var affiliateParams = this.element.dataset.affiliate;
                    if (affiliateParams) {
                        var encoded = JSON.stringify(this.parseParamString(affiliateParams));
                        this.setParam('tracking', encoded);
                    }
                };

                widgetElementPrototype.mergeAttributesIntoParams = function () {
                    var widget = this;
                    var excludedDatasetParams = ['skyscannerWidget', 'skyscannerWidgetLoading', 'locale', 'market', 'currency', 'params', 'affiliate'];
                    Object.keys(this.element.dataset)
                        .filter(function (key) {
                            return excludedDatasetParams.indexOf(key) === -1;
                        })
                        .forEach(function (key) {
                            widget.params[key] = widget.params[key] || widget.element.dataset[key];
                        });
                };

                widgetElementPrototype.beginRender = function () {

                    if (this.xhrParams.length > 0) {
                        return;
                    }

                    if (this.errors.length > 0) {
                        console.log('Error(s) occured while loading widget', this);
                        this.errors.forEach(function (error) {
                            console.log(error.message);
                            if (error.error) {
                                console.log(error.error);
                            }
                        });
                        return;
                    }

                    this.mergeAttributesIntoParams();

                    var url = getWidgetUrl('/v1.0/' + this.locale + '/' + this.market + '/' + this.currency + '/widgets/' + this.widgetType, this.params);

                    if (typeof this.scope.widgets.renderCache[url] !== 'undefined') {
                        var cached = this.scope.widgets.renderCache[url];
                        this.render(cached.code, cached.personalise);
                    } else {
                        var request = this.getXhr(url);
                        request.addEventListener('load', this.handleRenderLoad.bind(this, url, request));
                        request.addEventListener('error', this.handleRenderLoadError.bind(this, url, request));
                    }
                };

                widgetElementPrototype.handleRenderLoad = function (url, xhr) {

                    if (xhr.readyState !== 4) {
                        // XHR not complete
                        return;
                    }
                    if (xhr.status !== 200) {
                        this.handleRenderLoadError(url, xhr);
                        return;
                    }

                    var widgetCode = xhr.responseText;
                    var widgetPersonalisationEnabled = xhr.getResponseHeader('Widget-Personalisation-Enabled') === 'true';

                    this.scope.widgets.renderCache[url] = {
                        code: widgetCode,
                        personalise: widgetPersonalisationEnabled
                    };

                    this.render(widgetCode, widgetPersonalisationEnabled);
                };

                widgetElementPrototype.dispatchEvent = function (name, data) {
                    if (root.CustomEvent) {
                        var event = null;
                        if (typeof root.CustomEvent === 'function') {
                            event = new root.CustomEvent(name, data);
                        } else {
                            if (root.document && root.document.createEvent) {
                                event = root.document.createEvent('CustomEvent');
                                event.initCustomEvent(name, false, false, data && data.detail || {});
                            }
                        }
                        if (event) {
                            this.element.dispatchEvent(event);
                        }
                    }
                };

                widgetElementPrototype.render = function (widgetCode, usePersonalisation) {
                    var widget = this;

                    try {
                        // eslint-disable-next-line no-unused-vars
                        (function (__widget) {
                            eval(widgetCode);
                        }).call(this, this);
                        this.replaceScriptNodes();

                        if (usePersonalisation) {
                            this.personalise();
                        }

                        Object.keys(widget.element.dataset)
                            .forEach(function (key) {
                                delete widget.element.dataset[key];
                            });

                        widget.element.dataset.skyscannerWidgetLoaded = true;

                        this.dispatchEvent('skyscanner-widget-load', {detail: {widget: widget}});

                    } catch (e) {

                        widget.element.dataset.skyscannerWidgetError = true;

                        console.error('Error rendering widget:', e);

                        this.dispatchEvent('skyscanner-widget-render-error', {detail: {widget: widget, error: e}});
                    }
                };

                widgetElementPrototype.handleRenderLoadError = function (url, xhr) {

                    this.element.dataset.skyscannerWidgetError = true;

                    console.error('Error rendering widget:', xhr);

                    this.dispatchEvent('skyscanner-widget-load-error', {
                        detail: {
                            widget: this,
                            status: xhr.status,
                            error: xhr.responseText
                        }
                    });

                };

                widgetElementPrototype.personalise = function () {

                    var widget = this;
                    var params = {};

                    Object.keys(widget.params).forEach(function (key) {
                        params[key] = widget.params[key];
                    });
                    params.locale = widget.locale;
                    params.market = widget.market;
                    params.currency = widget.currency;
                    params.widgetType = widget.widgetType;

                    var personalisationUrl = getGatewayProxyUrl('/personalise', params);
                    var xhr = this.getXhr(personalisationUrl, true, true);
                    xhr.addEventListener('load', this.handlePersonalisationData.bind(this, xhr));
                };

                widgetElementPrototype.handlePersonalisationData = function (xhr) {
                    if (xhr.readyState !== 4 || xhr.status !== 200) {
                        return;
                    }

                    var data = JSON.parse(xhr.responseText);
                    if (!data.personalise) {
                        return;
                    }

                    if (data.message !== undefined) {
                        this.element.querySelector('.skyscanner-widget-text').innerHTML = data.message;
                    }

                    if (data.referralUrl !== undefined) {
                        this.element.querySelector('a').href = data.referralUrl;
                    }
                };

                widgetElementPrototype.replaceScriptNodes = function () {
                    var scriptNodes = this.element.querySelectorAll('script');
                    Array.prototype.forEach.call(scriptNodes, function (node) {
                        if (node.tagName === 'SCRIPT') {
                            var script = root.document.createElement('script');
                            script.text = node.innerHTML;
                            Array.prototype.forEach.call(node.attributes, function (attribute) {
                                if (attribute.name !== 'replace') {
                                    script.setAttribute(attribute.name, attribute.value);
                                }
                            });
                            node.parentNode.replaceChild(script, node);
                        }
                    });
                };

                function documentQuerySelectorAll(selector) {
                    if (!root.document || !root.document.querySelectorAll) {
                        return;
                    }
                    var elements = root.document.querySelectorAll(selector);
                    return Array.prototype.slice.call(elements);
                }

                globals.widgets.load = function (selectorFunc) {

                    selectorFunc = selectorFunc || documentQuerySelectorAll;

                    var widgetElements = selectorFunc('[data-skyscanner-widget]');

                    if (!widgetElements) {
                        return;
                    }

                    widgetElements.forEach(function (element) {

                        if (element.dataset.skyscannerWidgetLoading ||
                            element.dataset.skyscannerWidgetLoaded ||
                            element.dataset.skyscannerWidgetError) {
                            return;
                        } else {
                            element.dataset.skyscannerWidgetLoading = true;
                        }

                        var widget = new WidgetElement(element);

                        widget.parseFixedParams();
                        widget.parseScriptedParams();
                        widget.parseLocationParams();
                        widget.parseAffiliateParams();
                        widget.beginRender();
                    });
                };

                var autoLoader = function (autoLoad) {
                    if (autoLoad === 'true') {
                        globals.widgets.load();
                    }
                };

                autoLoader('true');

                if (typeof module !== 'undefined' && module.exports) {
                    module.exports = {
                        getWidgetUrl: getWidgetUrl,
                        WidgetElement: WidgetElement,
                        globals: globals
                    };
                }

// eslint-disable-next-line no-undef
            })(typeof window === 'undefined' ? global : window);
        }
    }
</script>
