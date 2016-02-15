'use strict';
/**
 * This package contains a classical string truncate function and a function 
 * to truncate an array of strings to a truncated string  
 * e.g: ["tobi","manfred","hubert von der sohle","otto","hildergrad"]
 * will become:  "tobi, manfred, ....3 more" with the default settings
 * 
 * @param {Object} [options] - all options are optional
 * @param {Number} [options.maxLength=25] the maximal number of chars of the created string
 * @param {String} [options.truncateString="..."] the string that is used when truncating 
 * @param {Object} [options.nodes] options for truncateNodes (optional)
 * @param {String} [options.nodes.separator=", "] the string used to concate the strings of the array
 * @param {String} [options.nodes.minWordLength=3] if the lenght of the next string is bigger that this value the more string will be added immediately
 * @param {String} [options.nodes.moreSuffix=", %d more"] the string used to display hidden elements, must contain %d which will be replaced with the number of hidden elements
 * @param {String} [options.nodes.paddingChar="."] character used together with the number of hidden items to pad the string to maxLength, set to null to disable 
 * @return {String} truncated string
 */



var StringTruncate = function(options){
	var DEFAULT_MAX_LENGTH = 25,
		DEFUALT_SEPARATOR = ", ",
		DEFAULT_MIN_WORD_LENGTH = 3,
		DEFAULT_TRUNCATE_STRING_VAULE="...",
		DEFAULT_MORE_SUFFIX = ", %d more",
		DEFAULT_PADDING_CHAR = ".";

    options = options || {};
    options.nodes = options.nodes || {};

    return {
	  // the maximal number of chars of the total string, including the 'moreNodesSuffix' string
	  // so a good rule is to have a minimum value of 
	  // moreNodesSuffix.length(8) +  truncateStringValue(3) + minWordLength (3) ~ 14 
	  // this way no output like '..., 3 more' is possible  
	  maxLength: (undefined !== options.maxLength) ? options.maxLength : DEFAULT_MAX_LENGTH,
	  // string used to truncate the last item if all items can be displayed
	  truncateStringValue: 	(undefined !== options.truncateString) ? options.truncateString : DEFAULT_TRUNCATE_STRING_VAULE,
	  
	  // used to concate the strings 
	  separator: (undefined !== options.nodes.separator) ? options.nodes.separator : DEFUALT_SEPARATOR,
	  // do not add item if less than this number of chars are left (+ length of separator )
	  minWordLength: (undefined !== options.nodes.minWordLength) ? options.nodes.minWordLength : DEFAULT_MIN_WORD_LENGTH, 
	  // pattern used used when not all items can be displayed
	  // %d will be replaced with the number of hidden items and padded to maxLength if required 
	  moreNodesSuffix: (undefined !== options.nodes.moreSuffix) ? options.nodes.moreSuffix : DEFAULT_MORE_SUFFIX,
	  // character used together with the number of hidden items to pad the string to maxLength
	  // only used when not all items could be displayed
	  // set to null to disable this behaviour
	  truncateChar: (undefined !== options.nodes.paddingChar) ? options.nodes.paddingChar : DEFAULT_PADDING_CHAR,
	  
	  /**
	  * Takes and array of strings and tranforms it to a string with a limited number of charaters
	  * The returned string contains the items concatinated and truncated at the end  
	  * If not all items can be added to the string, the number of hidden items will be added 
	  * to the end. 
	  * In this case the string will be padded to the maximum number of charaters by default
	  */
	  arrayOfStrings: function(nodes){
	  	var result="";
	    var separatorLength = this.separator.length;
	    var currentLength = 0;
	    var moreNodesSuffixLength= this.moreNodesSuffix.length-2; //remove placeholder length
	    var hiddenItems = nodes.length;
	    var digits = (hiddenItems + "").length;
	    var charsLeft = this.maxLength - currentLength - moreNodesSuffixLength - digits;
	    
			for (var i = 0; i < nodes.length; i++) {
	    	var node = nodes[i];
	    	var nodeLength = node.length;
	      digits = (hiddenItems+"").length;

	      if(i==0){ // 1st item, just truncate
	  			result=result+this.string(node, charsLeft);
	      }else{
	      	if(hiddenItems > 1 ){ // all items after first item 
	          charsLeft = this.maxLength - currentLength - moreNodesSuffixLength - digits;
	      	}else{  //it's the last item, the moreNodesSuffix will not be added
	          charsLeft = this.maxLength - currentLength;
	        }
	        if(charsLeft >= (this.minWordLength+separatorLength)){
	      		result=result+this.string(this.separator+node,charsLeft);
	      	}else{
	      		break;
	        }
	      }
				currentLength = result.length;
	      hiddenItems--;
			}
	    if(hiddenItems>0){
	    	var dots="";
	      if(this.truncateChar!==null && charsLeft > 0)
		   		dots = Array(charsLeft+1).join(this.truncateChar);
	    
	    	result = result + this.moreNodesSuffix.replace('%d',dots+hiddenItems);
	    }
	    return result;
	  },
	  //Truncate string, uses truncateStringValue 
	  string: function(str, maxLength){
	  	if(str.length <= maxLength){
	    	return str;
	    }
	    if(maxLength <= this.truncateStringValue.length)
	    	return this.truncateStringValue;
	    return str.slice(0,maxLength-this.truncateStringValue.length)+this.truncateStringValue;
	  }
	};
}
if(typeof(module) !== 'undefined')
	module.exports = StringTruncate;
