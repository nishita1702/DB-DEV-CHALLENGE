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

describe("table", () => {
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
    test("validate adding data", () => {
      tableObj.addData(dataObj);
      expect(tableObj.data[0].name).toBe('usdjpy');
      expect(tableObj.renderData).toHaveBeenCalled();
      expect(tableObj.append).toHaveBeenCalled();
      expect(tableObj.filterSparkLineData).toHaveBeenCalled();
      expect(tableObj.getPrevSparklineData).toHaveBeenCalled();
      tableObj.addData(dataObj); //adding more data
    });
});
  