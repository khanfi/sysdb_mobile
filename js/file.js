//////////////////////////////////////////////////////////////////////////////////////
// Example on working with the native file storage system.
// If the directory does not exsist then it will be created with onErrorGetDir
// Note fileReader.readAsArrayBuffer nor FileWriter.write(blob) is not supported on Windows.

// Don't change 
var attemptsToCreateDir = 0;
var listOfFiles = [];

// JSON values can be changed 
var fileCreate = {};
fileCreate["dirObject"] = null;
fileCreate["appDirName"] = "powerForms1";
fileCreate["appSubDirName"] = "formResults1";
fileCreate["createDirName"] = false;
fileCreate["writeDataToFile"] = null;
fileCreate["fileExtension"] = ".json";
fileCreate["fileType"] = "text/plain";
fileCreate["fileName"] = "testfile2";
fileCreate["createFile"] = true;



// Add some data can be written to a file
var jsonString = JSON.stringify('[ {"name":"Ford","models":[ "Fiesta", "Focus", "Mustang" ] },{ "name":"BMW", "models":[ "320", "X3", "X5" ] },{ "name":"Fiat", "models":[ "500", "Panda" ] }]');
var jsonParsed = JSON.parse(jsonString);
fileCreate["writeDataToFile"] = jsonParsed;



///////////////////////////////////////////////////////////////////	
// Creat a new directory, sub directory and a file
// FYI if directory has not been created then onErrorGetDir will try to create it.
function createDirectory(rootDirEntry) {
	console.log("Create directory:" + fileCreate.createDirName + " Create file:" + fileCreate.createFile);
	rootDirEntry.getDirectory(fileCreate.appDirName, { create: fileCreate.createDirName }, function (dirEntry) {
		dirEntry.getDirectory(fileCreate.appSubDirName, { create: fileCreate.createDirName }, function (subDirEntry) {
			console.log("Got directory: "); 
			// Create a file with the name of that file
			subDirEntry.getFile(fileCreate.fileName + fileCreate.fileExtension, { create: fileCreate.createFile },
				function (file) {
					// Adding to JSON so the file object can be used get this directory agian some where else.
					fileCreate["dirObject"] = subDirEntry
					writeLog(file);
					console.log("File created");
				}, onErrorCreateFile);
		}, onErrorGetDir);
	}, onErrorGetDir);
}


///////////////////////////////////////////////////////////////////	
// Write data to the file
function writeLog(fileEntry) {

	var log = fileCreate.writeDataToFile;
	fileEntry.createWriter(function (fileWriter) {

		fileWriter.seek(fileWriter.length);
		var blob = new Blob([log], { type: fileCreate.fileExtension });
		fileWriter.write(blob);

		//writting is complete
		fileWriter.onwriteend = function () {
			console.log("writting complete");
			read();
		}
	});
}


///////////////////////////////////////////////////////////////////	
// Read and Loop the directory
function read() {
	var reader = fileCreate.dirObject.createReader();
	var myArray = [];
	//read it
	reader.readEntries(function (entries) {
		//# of entries
		console.log("Number of entries: " + entries.length);
		//alert(entries.length)
		entries.forEach(function (entry) {
			var name = entry.name;
			listOfFiles.push(name);
			console.log("File name: " + name);
			entry.getMetadata(function (meta) {
				console.log(meta.modificationTime.toDateString())
			}, onErrorMetadata);
		});
		// End of loop 

		// Helpful information about the directory
		console.log("isFile: " + fileCreate.dirObject.isFile);
		console.log("isDirectory: " + fileCreate.dirObject.isDirectory);
		console.log("directory name: " + fileCreate.dirObject.name);
		console.log("directory fullPath: " + fileCreate.dirObject.fullPath);
		console.log("filesystem location: " + JSON.stringify(fileCreate.dirObject.filesystem));
		console.log("nativeURL path: " + fileCreate.dirObject.nativeURL);
		console.log(listOfFiles[0]);

		// Test that the file can be opened in the inAppBrowser -- close the inappBrowser before a reload or an error in reading can accour
		window.open(fileCreate.dirObject.nativeURL + listOfFiles[0], "_blank");

		// Delete the file we just created
		deleteFile("testfile1.json");
	});
	//end of read
}


///////////////////////////////////////////////////////////////////	
// Delete a file
function deleteFile(fileToDelete) {

	'use strict';
	fileCreate.dirObject.getFile(fileToDelete, { create: false },
		function (fileEntry) {
			fileEntry.remove();
			console.log("file removed");
		});
}


//////////////////////////////////////////////////////////////////////////////////////
// INIT --- Get access to the file system and locations
// You can change the to tempDirectory or dataDirectory as this location will work in chrome
// Once the file system has been requested, the success handler is passed a FileSystem object
function initNativeFileStorage() {
	window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dir) {

		createDirectory(dir);
	},
		onErrorLoadFs);
}


//////////////////////////////////////////////////////////////////////////////////////
// File system errors


// Error access to the file system  
function onErrorLoadFs(err) {
	console.log("onErrorLoadFs: " + JSON.stringify(err));
}

// Error when creating a new directory or a file
function onErrorGetDir(err) {

	// Get the code number --example {"code":1}
	var errCode = JSON.stringify(err);
	var errCodes = JSON.parse(errCode);

	//If directory was not created then try to create it
	if (errCodes.code === 1 && attemptsToCreateDir < 2) {
		// Make to 2 attempts to create the directory 
		// Directory may need to be set up for the first time
		attemptsToCreateDir++
		console.log("onErrorGetDir trying to create dir attemp: " + attemptsToCreateDir);
		fileCreate["createDirName"] = true;
		initNativeFileStorage();
	}
	else {
		console.log("onErrorGetDir check error code list for code: " + errCodes.code);
	}
}

// Error creating file. FYI- createFile may have be set to false
function onErrorCreateFile(err) {
	console.log("onErrorCreateFile: " + JSON.stringify(err));
}


function onErrorMetadata(err) {
	console.log("onErrorMetadata: " + err)
}

//////////////////////////////////////////////////////////////////////////////////////
// Error codes
/*
1	NOT_FOUND_ERR
2	SECURITY_ERR
3	ABORT_ERR
4	NOT_READABLE_ERR
5	ENCODING_ERR
6	NO_MODIFICATION_ALLOWED_ERR
7	INVALID_STATE_ERR
8	SYNTAX_ERR
9	INVALID_MODIFICATION_ERR
10	QUOTA_EXCEEDED_ERR
11	TYPE_MISMATCH_ERR
12	PATH_EXISTS_ERR
*/