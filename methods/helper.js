let fs = require('fs'); // Create Client Javascript Files.

/************************* In JS *************************/

Array.prototype.diff = function (a)
{
	return this.filter(function (i)
	{
		return a.indexOf(i) < 0;
	});
}

/************************* Helper Functions *************************/

function createFile(fullFileAddress, data)
{
	fs.writeFile(fullFileAddress , data, function (err)
	{
		if(err)
		{
			console.error( new Error("#Space. Can not save file. message: %s".red, err) );
		}
		else
		{
			console.log("#eJS. %s created.".yellow, fullFileAddress);
		}
	});
}

function directoryListRecursive(dir, fileList)
{
	if(dir[dir.length-1] != '/')
	{
		dir += '/';
	}
	var files = fs.readdirSync(dir);
	fileList = fileList || [];
	files.forEach(function (file)
	{
		if(fs.statSync(dir + file).isDirectory())
		{
			fileList = directoryListRecursive(dir + file + '/', fileList);
		}
		else
		{
			fileList.push(dir+file);
		}
	});
	return fileList;
}

exports.createFile = createFile;
exports.directoryListRecursive = directoryListRecursive;
