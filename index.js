const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const find = require('find-process');
const cors = require('cors')

const app = express();
const port = 3377;
const plat = process.platform;
var lastPid = null;

app.use(cors());

app.get('/print-file', async(req, res) => {
	console.log(req.query);
	
	/* var filePath = "D:\\test-print.pdf" */
	var tgtPrint = req.query.type;
	var filePath = "C:\\laragon-6.0.0\\www\\POS-Goodfellas-main\\public\\asset\\assets\\bill\\"+req.query.filename;
	const commandPrinterKitchen = `"C:\\Program Files\\Adobe\\Acrobat DC\\Acrobat\\Acrobat.exe" /N /T "${filePath}" "EPSON TM-T82 Receipt"`;
	const commandPrinterBill = `"C:\\Program Files\\Adobe\\Acrobat DC\\Acrobat\\Acrobat.exe" /N /T "${filePath}" "EPSON TM-T82 Receipt"`; //nanti ini diganti kalo udah connect printer moka
   
	find('name', 'Acrobat', true).then( function(list){
		if(list.length > 1){
			var tgtPid = list[1].pid;
			exec(`taskkill /pid ${tgtPid} /t`, function(err, stdout, stderr){
				if (err) {
				  throw err
				}
				console.log('stdout', stdout)
				console.log('stderr', err)
				
				
				setTimeout(() => {
					if(tgtPrint == 'kitchen'){
						printKitchen();
					}else{
						printKasir();
					}
				},2000);
				
			})
		}else{
			if(tgtPrint == 'kitchen'){
				printKitchen();
			}else{
				printKasir()
			}
		}
	}).catch( function(err){
		if(tgtPrint == 'kitchen'){
			printKitchen();
		}else{
			printKasir()
		}
	})
	
	function printKitchen(){
		
		var command =  exec(commandPrinterKitchen, function(error, stdout, stderr){
			console.log(this.pid);
			if (error) {
				console.error(`Error printing PDF: ${error.message}`);
				res.status(406).send({
					error: 'Error printing PDF: ${error.message}'
				})
				return;
			}
			if (stderr) {
				console.error(`Printing Error: ${stderr}`);
				res.status(406).send({
					error: 'Printing Error: ${stderr}'
				})
				return;
			}
			
			if (stdout){
				console.log(`PDF printed successfully`);
				setTimeout(() => {
					res.status(200).send({
						ok: 'print kitchen'
					})
				}, 3000);
				return;
			}

		});
		
		lastPid = command.pid;
		
	}
	
	function printKasir(){
		var command = exec(commandPrinterBill, function(error, stdout, stderr){
			console.log(this.pid);
			if (error) {
				console.error(`Error printing PDF: ${error.message}`);
				res.status(406).send({
					error: 'Error printing PDF: ${error.message}'
				})
				return;
			}
			if (stderr) {
				console.error(`Printing Error: ${stderr}`);
				res.status(406).send({
					error: 'Printing Error: ${stderr}'
				})
				return;
			}
			
			if (stdout){
				console.log(`PDF printed successfully`);
				setTimeout(() => {
					res.status(200).send({
						ok: 'print kasir'
					})
				}, 3000);
				
				return;
			}
		});
		
		lastPid = command.pid;
		
	}
});

app.get('/list-printer', async(req, res) =>{
	res.status(200).send({
		ok: 'true'
	})
})

app.listen(port, () => {
    console.log(`PDF Printing Service listening on port ${port}`)
});