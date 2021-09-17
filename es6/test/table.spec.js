var Table = require('../table');

const dataObj = {
  body: JSON.stringify({
  "name": "usdjpy",
  "bestBid": 106.7297012204255,
  "bestAsk": 107.25199883791178,
  "openBid": 107.22827132623534,
  "openAsk": 109.78172867376465,
  "lastChangeAsk": -4.862314256927661,
  "lastChangeBid": -2.8769211401569663
})
};  

describe("table class", () => {
    let tableObj;
    beforeEach(() => {
      tableObj = new Table();
      document.body.innerHTML = '<table id="table">\n  <thead id="table-heading">\n      <tr>\n          <th>name</th>\n          <th>bestBid</th>\n          <th>bestAsk</th>\n          <th>openBid</th>\n          <th>openAsk</th>\n          <th>lastChangeAsk</th>\n          <th>lastChangeBid</th>\n          <th>sparkLine</th>\n      </tr>\n  </thead>\n  <tbody id="table-body">\n\n  </tbody>\n\n</table>';
      window.Sparkline = {draw: jest.fn()};
      jest.spyOn(tableObj, 'append');
      jest.spyOn(tableObj, 'renderData');
      jest.spyOn(tableObj, 'getPrevSparklineData');
      jest.spyOn(tableObj, 'filterSparkLineData');
    });
    test("addData function", () => {
      tableObj.addData(dataObj);
      expect(tableObj.data[0].name).toBe('usdjpy');
      expect(tableObj.renderData).toHaveBeenCalled();
      expect(tableObj.append).toHaveBeenCalled();
      expect(tableObj.filterSparkLineData).toHaveBeenCalled();
      expect(tableObj.getPrevSparklineData).toHaveBeenCalled();
      tableObj.addData(dataObj); //adding more data
    });
    test("removeExistingDataObj function", () => {
      tableObj.data = [{name: "test1"}, {name: "test2"}];
      tableObj.data = tableObj.removeExistingDataObj({name: "test2"});
      expect(tableObj.data).toHaveLength(1);
      // it will not filter if name doesnt exists in array
      tableObj.data = tableObj.removeExistingDataObj({name: "test2"});
      expect(tableObj.data).toHaveLength(1);
    });
    test("getPrevSparklineData function", () => {
      const sparklineData = [1,2,3];
      tableObj.data = [{name: "test1", sparklineData}];
      let prevSparkLine = tableObj.getPrevSparklineData({name: "test1", sparklineData});
      expect(prevSparkLine).toEqual(sparklineData);
      // it should return empty array if name doesnot exist
      prevSparkLine = tableObj.getPrevSparklineData({name: "test2"});
      expect(prevSparkLine).toEqual([]);
    });
    test("getSparklines function", () => {
      const sparkLines = tableObj.getSparklines([{midprice1: 1}, {midprice1: 2}, {midprice1: 3}]);
      expect(sparkLines).toEqual([1,2,3]);
    });
});