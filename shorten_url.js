/**
 *
 * The Bipio Google Pod.  shorten_url action definition
 * ---------------------------------------------------------------
 *
 * @author Michael Pearson <michael@cloudspark.com.au>
 * Copyright (c) 2010-2013 CloudSpark pty ltd http://www.cloudspark.com.au
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
var gapi = require('googleapis');

function ShortenURL(podConfig) {
    this.name = 'shorten_url';
    this.description = 'Shorten a URL',
    this.description_long = 'Create a new shortened URL. The Google URL Shortener API allows you to shorten URLs just as you would on goo.gl.',
    this.trigger = false;
    this.singleton = true;
    this.podConfig = podConfig;
}

ShortenURL.prototype = {};

ShortenURL.prototype.getSchema = function() {
    return {
        'exports' : {        
            properties : {
                'short_url' : {
                    type : 'string',
                    description : 'Short URL (URL ID)'
                },
                'long_url' : {
                    type : 'string',
                    description : 'Long URL'
                }
            }
        },
        "imports": {        
            properties : {            
                'long_url' : {
                    type : 'string',
                    description : 'Long URL'
                }
            }
        }
    }
}

/**
 * Invokes (runs) the action.
 */
ShortenURL.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
    var exports = {}, log = this.$resource.log;
    
    if (imports.long_url) {
        gapi.discover('urlshortener', 'v1').discover('plus', 'v1').execute(function(err, client) {
            var params = {
                longUrl: imports.long_url
            };

            var req = client.urlshortener.url.insert(params);

            req.execute(function (err, response) {
                if (!err) {
                    exports.short_url = response.id;
                    exports.long_url = response.longUrl
                } else {
                    log(err, channel, 'error');
                }
                next(err, exports);
            });

        });
    } else {
        // silent passthrough
        next(false, exports);
    }
}

// -----------------------------------------------------------------------------
module.exports = ShortenURL;