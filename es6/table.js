class calculateData{
    constructor(){
        this.data = [];
        this.addData = this.addData.bind(this);
        this.renderData = this.renderData.bind(this);
    }

    // To append the data received from fx/prices to this.data array.
    addData(data) {
        const newData = JSON.parse(data.body); 
        const date = new Date();
        const milliseconds = Date.parse(date);
        //adding midprice and time in newData object
        newData.midprice = (newData.bestBid + newData.bestAsk)/2;
        newData.milliseconds = milliseconds;

        const prevSparklineData = this.getPrevSparklineData(newData);
        const interval = milliseconds - 30000;
        var obj = {
            milliseconds1: milliseconds,
            midprice1: newData.midprice
        }
        newData.sparklineData = this.filterSparkLineData([...prevSparklineData, obj], interval);
        this.data = this.removeExistingDataObj(newData);
        let i;
        for(i = 0; i<this.data.length; i++){
            if(this.data[i].lastChangeBid > newData.lastChangeBid){
                this.data.splice(i, 0, newData);
                break;
            }
        }

        if(i === this.data.length){
            this.data.push(newData);
        }
            
        this.renderData();

    }

    // To  replace the record with the updated data assuming the name is unique
    removeExistingDataObj(data) {
        return this.data.filter((obj) => {
            return obj.name !== data.name;
        }); 
    }

    // To keep record of midprice for last 30 seconds
    getPrevSparklineData(data) {
        var existingObj = this.data.filter((obj) => {
            return obj.name === data.name;
        }); 
        if(existingObj.length !== 0){
            return existingObj[0].sparklineData;
        }else {
            return [];
        }
        
    }

     //To remove midprice data of records which are not within 30 sec
    filterSparkLineData(totalSparklineData, interval) {
        return totalSparklineData.filter((obj) => {
            return obj.milliseconds1 > interval;
        })
        
    }

    getSparklines(data){
        return data.reduce((acc, curr) => {
                acc.push(curr.midprice1);
                return acc;
            }, []);
    }


    // To render this.data array to the screen.
    renderData(){
        const table = document.getElementById('table-body'); 
        table.innerHTML = '';
        this.data.forEach((e, i) => {
            var tableRow = document.createElement("tr");
            tableRow.setAttribute("id", `table-data-${i}`);
            table.appendChild(tableRow);

            this.append(e.name, i);
            this.append(e.bestBid, i);
            this.append(e.bestAsk, i);
            this.append(e.openBid, i);
            this.append(e.openAsk, i);
            this.append(e.lastChangeAsk, i);
            this.append(e.lastChangeBid, i);
            

            const sparkCell = document.createElement("div");
            Sparkline.draw(sparkCell, this.getSparklines(e.sparklineData));
            document.getElementById(`table-data-${i}`).appendChild(sparkCell);

        })
    }

    append(value, i) {
        var node = document.createElement("td");
        var textnode = document.createTextNode(value);
        node.appendChild(textnode);
        document.getElementById(`table-data-${i}`).appendChild(node);
    }

}

module.exports = calculateData;