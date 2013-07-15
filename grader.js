#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
//var HTMLFILE_DEFAULT = "http://sheltered-coast-8104.herokuapp.com/"; 
var CHECKSFILE_DEFAULT = "checks.json";
var URL_DEFAULT = "http://www.google.com";


var rest = require('./node_modules/restler');
var checkHtmlUrl = require('./node_modules/restler');

var outGlob={};

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var ressFileExists = function(inurl)
{
    var instr = inurl.toString();
    //var response = require(
//    var response = rest.get(instr).on('complete', function(result){
//        if (result instanceof Error)
//	 {   console.log('Error url: '+result.message); console.log(result);}
//	else
//	 { response = result;
	 // console.log(' result: '+result)
//	 }
//	return result;
  // }); 
    //console.log('ressFileExistxs: '+response );
    //return instr;
    return inurl;
}; 

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};
var cheerioHtmlUrl = function(htmlurl){
    //console.log("cheerio htmlurl: "+cheerio.load(htmlurl));
  //return cheerio.load(htmlurl);
    //var response2 = require('./node_modules/restler');
//    var response2=" "; 
    //var response = require('./node_modules/restler');
//    var response = rest.get(htmlurl).on('complete', function(result) {
//	if(result instanceof Error){ }
//	else{
  //        response2 = result;
	  //return result;
//	}    
   //}
   //   console.log('response:  response2: ');
   /// return instr;			    
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
 
    return out;
};

var checkHtmlUrl = function(htmlurl, checksfile)
{
    var checks = loadChecks(checksfile).sort();
    var out = {};
    var out2={};
    
    var response = rest.get(htmlurl).on('complete', function(result){
	if ( result instanceof Error)
	    { console.log('Rest error'); }
	else {
            var cheerio = require('cheerio'), $ = cheerio.load(result);
	//    console.log('RESULT: \n'+result);
	    for(var ii in checks)
		{ 
		    var present = $(checks[ii]).length > 0;
		    out[checks[ii]]=JSON.stringify(present);
		    out2[ii]=present;
		    //outGlob[ii]=present;
		    console.log('present: '+present+' check: '+checks[ii]+' $checks: '+$(checks[ii]).length);
 	    }
	    console.log('OUT for:'+ out);
	  }  
    });
//    console.log('OUT:'+out2+' response: '+response);
//    var outJ = JSON.parse(out);
 //   return out;
///    console.log('JSON out: '+outJ);
   for(var ii in response)
   { outGlob[ii]=ii; }
    console.log('array Global: '+outGlob);
    return out;
} 


var checkHtmlUrl2 = function(htmlurl, checksfile)
{   //$ = cheerioHtmlUrl(htmlurl);
    var checks = loadChecks(checksfile).sort();
    //console.log('checks : '+checks);
    var out = {};
    
    for(var ii in checks) {
         //var present = $(checks[ii]).lenghth>0;
         var present =  
	 out[checks[ii]]=present;
         //console.log('present: '+present+' check: '+checks[ii]+'  $check: '+$(checks[ii]));
    }
    console.log('OUT: '+out);
    
    var out2={};
    var response = rest.get(htmlurl).on('complete', function(result) {
	if(result instanceof Error)
	{ console.log('Error url: '+result.message);}
	else{
	    for(var ii in checks)
		{ var present =$(checks[ii]).length >0;
		  out2[checks[ii]] = present;
		  console.log('present: '+present+' check'+checks[ii]+' $checks: '+$(checks[ii]));
                }
        }
     });
     return out2;     		     
    //return out;

};


var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-u, --url <html_url>', 'Path to url', clone(ressFileExists), URL_DEFAULT)
        .parse(process.argv);
    var resURL2 = "http://sheltered-coast-8104.herokuapp.com/";
    //var resURL = rest.get(program.url).on('complete', function(result) {
     //if (result instanceof Error) {
    //      sys.puts('Error: '+result.message);
   //      } else {
   //       resURL2 = "http://sheltered-coast-8104.herokuapp.com/";}
   //    });
    console.log(resURL2);
    //console.log(URL_DEFAULT);
    var checkJson = checkHtmlUrl(program.url,program.checks);
    console.log('check Main:'+checkJson+'out glob: '+outGlob);
    for(var ii in checkJson)
    {  console.log(ii+': '+checkJson[ii]);
     }
    var outJson = JSON.stringify(outGlob, null, 4);
    //var outJson = JSON.stringify(URL_DEFAULT, null,4);
    console.log('outJSON: '+outJson+'\n 1.'+outJson[1]);
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
