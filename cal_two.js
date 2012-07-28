function Calendar(containingDiv,date,mode,action){
	/* 
	
	Calendar PARAMETERS EXPLAINED
	
	containingDiv
		- The div element that the calendar table will be drawn in.
		
		
	date
		date object for the target date. If not provided, defaults to the current day.
	*/
	
	/* EDIT COLOR PARAMETERS HERE */
	
	this.backgroundColor = "#008E00";
	this.cellColor = "#00CC00";
	this.cellColorLight = "#80FE80";
	this.highlightColor = "red";
	
	this.action = action;
	
	/* craftElement and error functions required for initialization, and is being declared early. */
	
	this.craftElement = function(type,content,id,style,otherType,otherValue){
		/*
		craftElement PARAMETERS EXPLAINED
		
			type 
				What type of element this will be.
			content
				Text content of the element.
				
				** IMPORTANT **
				For the moment, additional elements within elements
				will require that the great and powerful designer
				manipulate the result of this method.
			id
				id tag of element
			style
				style additions of element
			otherType
				other set attributes
			otherValue
				value of other set attributes
			
		*/
		if(type == null){
			this._error("Element Creation Failure: type not defined.");
			return null;
		}
		var el = document.createElement(type);
		
		if(content){
			
			t = document.createTextNode(content);
			el.appendChild(t);
			
		} else {
			//this._error("No text specified in created element.");	
		}
		
		if(id){
			el.setAttribute("id",id);	
		}
		
		if(style){
			el.setAttribute("style",style);
		}
		
		if(otherType){
			if(otherValue){
				el.setAttribute(otherType,otherValue);
			} else {
				this._error("Extra Type Specified, But With No Properties");
			}
		}
		//console.log(el);
		return el;
	}
	
	this._error = function(string){
		if(string){
			console.log("Calendar Error: " + string);
		} else {
			console.log("Calendar Error: No error message specified.");	
		}
	}
	
	this.isFunction = function(functionToCheck) {
		// Source: http://stackoverflow.com/questions/5999998/how-can-i-check-if-a-javascript-variable-is-function-type
		var getType = {};
		return functionToCheck && getType.toString.call(functionToCheck) == '[object Function]';
	}
	
	/* Initialization */
	
	containerElement = document.getElementById(containingDiv);
	
	if(containerElement == null){
		this._error(containingDiv + " div not found!");
		return null;
	}
	
	tableElement = this.craftElement("table","","","table-layout: fixed; text-align: center; width: 300px; background-color: " + this.backgroundColor + "; font-weight = 500; border-radius: 10px;");
	
	
	
	// Date objects.
	tableElement._currentHighlightDate = null;
	tableElement._currentHighlightMode;
	tableElement._previousHighlightDate;
	
	tableElement.backgroundColor = this.backgroundColor;
	tableElement.cellColor = this.cellColor;
	tableElement.cellColorLight = this.cellColorLight;
	tableElement.highlightColor = this.highlightColor;
	
	// Dateview object.
	tableElement._currentView = new DateView(date);
	
	tableElement.previousMonthShift = function(){
		this._currentView.previousMonthInner();
		this.draw();
	}
	
	tableElement.nextMonthShift = function(){
		this._currentView.nextMonthInner();
		this.draw();
	}
	
	tableElement.craftBasicCell = function(content, light, otherType, otherValue){
	
	// This method cuts down on repetitive crafting of similarly-sized cells.
		
		if(content == undefined || content.length == 0){
			content = "";
			light = null;
			// Intentional override for filler cell.
		}
		
		if(light == true){
			var backgroundColor = this.cellColorLight;
		} else if(light == null){
			var backgroundColor = this.backgroundColor;
		} else {
			var backgroundColor = this.cellColor;
		}
		// light != undefined && 
		
		// 
		
		return this.craftElement("td",content,"","width: 12.4%; border-radius: 20px; background-color: " + backgroundColor + ";",otherType, otherValue);
		// Need to add on-click functionality at a later point in the script.
	}
	
	tableElement.draw = function(){
		if(!this.isValidDate(this._currentHighlightDate)){
			/*
			First invocation. No current highlight is selected,
			so we will be using the current day. 
			*/
			this._currentHighlightDate = new Date();
			this._currentHighlightMode = "day";
		}
		
		// Clearing existing display.
		this.clearElement(this);
		
		var viewDate = this._currentView.getDate();
		
		var tempDate = new Date(viewDate.getFullYear(),viewDate.getMonth(),1,0,0,0,0);
		
		/////
		// Crafting the first row. Contains the title and shift buttons.
		/////
		
		var tempRow = this.craftElement("tr");
		
		
		tempRow.appendChild(this.craftElement("td","<<","","width: 12.4%; border-radius: 10px;","onclick","this.parentElement.parentElement.previousMonthShift();"));
		// Month banner
		var temp = this.craftElement("td",viewDate.getMonthString() + ", " + viewDate.getFullYear(),"","width: 200px; border-radius: 10px; background-color: " + this.cellColor + ";","colspan",6);
		temp.setAttribute("onclick","this.parentElement.parentElement.select(this.mode,this.date)");
		temp.date = tempDate;
		temp.mode = "month";
		
		if(this._currentHighlightMode == "month" && temp.date.getMonth() == this._currentHighlightDate.getMonth() && temp.date.getFullYear() == this._currentHighlightDate.getFullYear()){
				temp.style.backgroundColor = this.highlightColor;	
			}
		tempRow.appendChild(temp);
		
		// Next Month
		tempRow.appendChild(this.craftElement("td",">>","","width: 34px; border-radius: 10px;","onclick","this.parentElement.parentElement.nextMonthShift();"));
		
		this.appendChild(tempRow);
		
		//////
		// Crafting second row, for listing the days of the week.
		//////
		
		tempRow = this.craftElement("tr");
		temp = new Array("","Sun","Mon","Tues","Wed","Thu","Fri","Sat");
		for(var i = 0; i < temp.length; i++){
			if(temp[i].length == 0){
			var lightStatus = false;
			} else {
				var lightStatus = true;	
			}
		
			tempRow.appendChild(this.craftBasicCell(temp[i],lightStatus));
			
		}
		
		this.appendChild(tempRow);
		
		//console.log("Generating a calendar for "+ viewDate.getMonthString() + ", " + viewDate.getFullYear());
		var weekCount = 0;
		tempRow = this.craftElement("tr");
		
		temp = this.craftBasicCell("W"+tempDate.getWeek(),true,"onclick","this.parentElement.parentElement.select(this.mode,this.date)");
		temp.date = tempDate;
		temp.mode = "week";
		if(this._currentHighlightMode == "week" && temp.date.getWeek() == this._currentHighlightDate.getWeek() && temp.date.getFullYear() == this._currentHighlightDate.getFullYear()){
			temp.style.backgroundColor = this.highlightColor;
		}
		tempRow.appendChild(temp);
		
		for(var prevIndex = 0; prevIndex < tempDate.getDay(); prevIndex++){
			tempRow.appendChild(this.craftBasicCell("",null));
			weekCount++;
		}
		//tempRow.appendChild(this.craftBasicCell("test"));
		
		for(var dayIndex = 1; dayIndex <= viewDate.getMonthDays(); dayIndex++){
			//console.log(monthIndex);
			temp = this.craftBasicCell(dayIndex,false,"onclick","this.parentElement.parentElement.select(this.mode,this.date)");
			temp.date = new Date(viewDate.getFullYear(),viewDate.getMonth(),dayIndex,0,0,0,0);
			temp.mode = "day";
			
			if(this._currentHighlightMode == "day" && temp.date.getDate() == this._currentHighlightDate.getDate() && temp.date.getMonth() == this._currentHighlightDate.getMonth() && temp.date.getFullYear() == this._currentHighlightDate.getFullYear()){
				temp.style.backgroundColor = this.highlightColor;	
			}			
			
			tempRow.appendChild(temp);
			
			weekCount++;
			
			if(weekCount > 6 && dayIndex != viewDate.getMonthDays()){
				weekCount = 0;
				this.appendChild(tempRow);
				tempRow = this.craftElement("tr");
				
				tempDate = new Date(viewDate.getFullYear(),viewDate.getMonth(),dayIndex + 1,0,0,0,0);
				
				temp = this.craftBasicCell("W"+tempDate.getWeek(),true,"onclick","this.parentElement.parentElement.select(this.mode,this.date)");
				
				temp.date = tempDate;
				temp.mode = "week";
				
				
				if(this._currentHighlightMode == "week" && temp.date.getWeek() == this._currentHighlightDate.getWeek()){
					temp.style.backgroundColor = this.highlightColor;
				}
				
				tempRow.appendChild(temp);
			}
			//this.appendChild(tempRow);
		
		}
		
		//////
		// Buffer any remaining days. Add final row.
		//////
		if(weekCount > 0){
		for(;weekCount < 6; weekCount++){
			tempRow.appendChild(this.craftBasicCell());
		}
		}
		this.appendChild(tempRow);
		//console.log();
		//this.appendChild(this.craftElement("p","zoinks"));
		
		//console.log("Generation complete.");
	}
	
	tableElement.select = function(mode,date,noDraw){
		//console.log("selected");
		if(mode !== undefined && date !== undefined){
			this._currentHighlightDate = date;
			this._currentHighlightMode = mode;	
		}
		
		if(!noDraw){
			this.draw();
			this.action();
		}
	}
	
	tableElement.craftElement = this.craftElement;	
	
	tableElement.clearElement = function(element){
		/* 
			Exterminates all child elements of provided node.
		*/
		if(element){
			while (element.firstChild){
				element.removeChild(element.firstChild);
			}
		} else {
			this._error("No node specified to be cleared.");
		}
	}
	
	tableElement.clearElementById = function(id){
		/*
			Exterminates all child elements of the element with the 
			provided id.
		*/
		if(id){
		element = document.getElementById(id)
		} else {
			this._error("No element id specified to be cleared.");	
		}
	}
	
	if(this.action == undefined || !this.isFunction(this.action)){
		
		tableElement.action = function(){
			var message;
			switch(this._currentHighlightMode){
			case "day":
				message = "Default: You have selected the " + this._currentHighlightMode+ " of " + this.pad(this._currentHighlightDate.getDate(),2) + "/" + this.pad(this._currentHighlightDate.getMonth(),2) + "/" + this._currentHighlightDate.getFullYear() + ".";
				break;
			case "month":
				message = "Default: You have selected the " + this._currentHighlightMode + " of " + this.pad(this._currentHighlightDate.getMonthString(),2) + ", " + this._currentHighlightDate.getFullYear() + ".";
				break;
			case "week":
				if(this._currentHighlightDate.getMonth() == 11 && this._currentHighlightDate.getWeek() == 1){
					var answer = this._currentHighlightDate.getFullYear() + 1;	
				} else {
					var answer = this._currentHighlightDate.getFullYear();
				}
				message = "Default: You have selected " + this._currentHighlightMode + " #" + this.pad(this._currentHighlightDate.getWeek(),2) + " of " + answer + ".";
				break;
			}
			//alert(message);
			console.log(message);
		}
		
	}
	
	tableElement.isValidDate = this.isValidDate;
	
	tableElement.pad = function (number, length) {
	   
		// Source: http://www.electrictoolbox.com/pad-number-zeroes-javascript/
		
	    var str = '' + number;
	    while (str.length < length) {
		str = '0' + str;
	    }
	   
	    return str;
	
	}
	
	this.isValidMode = function(mode){
		if(mode == "week" || mode == "month"){
			return mode;	
		}
		return "day";
	}
	
	tableElement._error = this._error;
	
	containerElement.appendChild(tableElement);
	tableElement.select(this.isValidMode(mode),tableElement._currentView.getDate(),true);
	tableElement.draw();
	
	
	
	
	/*	
	t = this.craftElement("p","calendar test" + 5,null,null,"onclick","console.log(this.parentNode);");
	//this.craftElement("strong","bold")
	c.appendChild(t);
	*/
	
	
	
}

function DateView(startDate){
	if(!this.isValidDate(startDate)){
		this._date = new Date();
	} else {
		this._date = startDate;	
	}
	
	this._month = this._date.getMonth();
	this._year = this._date.getFullYear();
	
	this.getDate = function(){
		return this._date;	
	}
	
	this.getMonth = function(){
		return this._month;	
	}
	
	this.getYear = function(){
		return this._year;	
	}
	
	this.nextMonthInner = function(){
		this._month++;
		if(this._month > 11){
			this._month = 0;
			this._year++;
		}
		this._refreshDate();
	}
	
	this.previousMonthInner = function(){
		this._month--;
		if(this._month < 0){
			this._month = 11;
			this._year--;
		}		
		this._refreshDate();
	}
	
	this._refreshDate = function(){
		this._date = new Date(this._year, this._month+1, 0, 0, 0, 0, 0);	
	}
	
}

Calendar.prototype.isValidDate = DateView.prototype.isValidDate = function(d) {
	// Source: http://stackoverflow.com/questions/1353684/detecting-an-invalid-date-date-instance-in-javascript
  if ( Object.prototype.toString.call(d) !== "[object Date]" )
    return false;
  return !isNaN(d.getTime());
}


Date.prototype.getMonthString = function(){
	
	var r;
	
	switch(this.getMonth()){
	
	case 0:
		r = "January";
		break;
	case 1: 
		r = "February";
		break;
	case 2: 
		r = "March";
		break;
	case 3: 
		r = "April";
		break;
	case 4: 
		r = "May";
		break;
	case 5: 
		r = "June";
		break;
	case 6: 
		r = "July";
		break;
	case 7: 
		r = "August";
		break;
	case 8: 
		r = "September";
		break;
	case 9: 
		r = "October";
		break;
	case 10: 
		r = "November";
		break;
	case 11: 
		r = "December";
		break;
		
	}
	return r;
}

Date.prototype.getMonthDays = function(){
	
	var r;
	
	switch(this.getMonth()){
	
	case 0:
		r = 31;
		break;
	case 1: 
		if(this.getFullYear() % 4 == 0){
			r = 29;	
		} else {
			r = 28;	
		}
		break;
	case 2: 
		r = 31;
		break;
	case 3: 
		r = 30;
		break;
	case 4: 
		r = 31;
		break;
	case 5: 
		r = 30;
		break;
	case 6: 
		r = 31;
		break;
	case 7: 
		r = 31;
		break;
	case 8: 
		r = 30;
		break;
	case 9: 
		r = 31;
		break;
	case 10: 
		r = 30;
		break;
	case 11: 
		r = 31;
		break;
		
	}
	return r;
}

/**
* Returns the week number for this date. dowOffset is the day of week the week
* "starts" on for your locale - it can be from 0 to 6. If dowOffset is 1 (Monday),
* the week returned is the ISO 8601 week number.
* @param int dowOffset
* @return int
* Found @ http://www.epoch-calendar.com/support/getting_iso_week.html
*/
Date.prototype.getWeek = function () {
/*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */

var dowOffset = 0

dowOffset = typeof(dowOffset) == 'int' ? dowOffset : 0; //default dowOffset to zero
var newYear = new Date(this.getFullYear(),0,1);
var day = newYear.getDay() - dowOffset; //the day of week the year begins on
day = (day >= 0 ? day : day + 7);
var daynum = Math.floor((this.getTime() - newYear.getTime() -
(this.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;
var weeknum;
//if the year starts before the middle of a week
if(day < 4) {
weeknum = Math.floor((daynum+day-1)/7) + 1;
if(weeknum > 52) {
nYear = new Date(this.getFullYear() + 1,0,1);
nday = nYear.getDay() - dowOffset;
nday = nday >= 0 ? nday : nday + 7;
/*if the next year starts before the middle of
the week, it is week #1 of that year*/
weeknum = nday < 4 ? 1 : 53;
}
}
else {
weeknum = Math.floor((daynum+day-1)/7);
}
return weeknum;
};
