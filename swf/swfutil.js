/*!
 * @revision:
 */
/*
 * @author: zhengxie.lj@taobao.com
 * @version:1-0-0
 */
 YUI.add('k2-swfutil', function(Y) {

	Y.SWFUtils = {
		encode: function(data){

			if(!data || typeof data != "string"){
				return data;
			}
			// transforming \ into \\ doesn't work; just use a custom encoding
			data = data.replace("\\", "&custom_backslash;");
			// also use custom encoding for the null character to avoid problems 
			data = data.replace(/\0/g, "&custom_null;");
			return data;
		},

		// Decodes our data to get around ExternalInterface bugs that are still
		// present even in Flash 9.
		decode: function(data){
			if(data && data.length && typeof data != "string"){
				data = data[0];
			}

			if(!data || typeof data != "string"){
				return data;
			}

			// needed for IE; \0 is the NULL character 
			data = data.replace(/\&custom_null\;/g, "\0");

			// certain XMLish characters break Flash's wire serialization for
			// ExternalInterface; these are encoded on the 
			// DojoExternalInterface side into a custom encoding, rather than
			// the standard entity encoding, because otherwise we won't be able to
			// differentiate between our own encoding and any entity characters
			// that are being used in the string itself
			data = data.replace(/\&custom_lt\;/g, "<")
				.replace(/\&custom_gt\;/g, ">")
				.replace(/\&custom_backslash\;/g, '\\');

			return data;
		}
	};

}, '1.0.0', {requires:[]} );