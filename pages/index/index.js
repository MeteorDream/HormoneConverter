// index.js
Page({
  data: {
    inputValue: "",
    outputValue: "",
    q_index: 0,
    oq_index: 0,
    quality: [
      {name: "pg", value: 1},
      {name: "ng", value: 1000},
      {name: "μg", value: 1000000},
      {name: "pmol", value: "mol"},
      {name: "nmol", value: "mol1000"},
      {name: "mIU", value: "mIU"},
      {name: "μIU", value: "uIU"}
    ],
    v_index: 0,
    ov_index: 0,
    volume: [
      {name: "mL", value: 1},
      {name: "dL", value: 100},
      {name: "L", value: 1000}
    ],
    m_index: 0,
    molar: [
      {name: "雌二醇", value: 272.38, formula: "C18H24O2"}, // https://en.wikipedia.org/wiki/Estradiol
      {name: "睾酮", value: 288.43, formula: "C19H28O2"}, // https://en.wikipedia.org/wiki/Testosterone
      // 泌乳素的浓度采用摩尔浓度是不科学的
      {name: "泌乳素", value: 23000, formula: "199amino acid"}, // http://www.a-hospital.com/w/%E5%9E%82%E4%BD%93%E6%B3%8C%E4%B9%B3%E7%B4%A0, https://en.wikipedia.org/wiki/Prolactin
      {name: "孕酮", value: 314.46, formula: "C21H30O2"}, // https://en.wikipedia.org/wiki/Progesterone
      {name: "泌乳素（IU)", value: 47170},
      {name: "卵泡刺激素", value: 113880},
      {name: "促黄体素", value: 46.56}
    ],
  },

  getInput: function(input) {
    this.setData({
      inputValue: input.detail.value
    })
    this.change();
  },

  getOutput: function(input) {
    return this.data.outputValue;
  },

  getQuality: function(input) {
    this.setData({
      q_index: input.detail.value
    });
    this.change();
  },

  getOutQuality: function(input) {
    this.setData({
      oq_index: input.detail.value
    });
    this.change();
  },

  getVolume: function(input) {
    this.setData({
      v_index: input.detail.value
    });
    this.change();
  },

  getOutVolume: function(input) {
    this.setData({
      ov_index: input.detail.value
    });
    this.change();
  },

  getMolar: function(input) {
    this.setData({
      m_index: input.detail.value
    });
    this.change();
  },

  reset: function(e) {
    this.setData({
      inputValue: "",
      outputValue: "",
    })
  },

  change: function() {
    var x = this.data.inputValue, 
    q = this.data.quality[this.data.q_index].value, 
    v = this.data.volume[this.data.v_index].value,
    m = this.data.molar[this.data.m_index].value,
    oq = this.data.quality[this.data.oq_index].value,
    ov = this.data.volume[this.data.ov_index].value;

    if (x == "") {
      this.setData({"outputValue": ""});
      return
    }

    // 先将输入转换为基本单位pg
    switch (q) {
      case "mol": x = x * m; ;break;
      case "mol1000": x = x * 1000 * m; break;
      case "mIU": x = x * m; break;
      case "uIU": x = x * m / 1000; break;
      default: x = x * q;
    }
   
    // 再从基本单位pg转换为输出单位
    switch (oq) {
      case "mol": x = x / m; break;
      case "mol1000": x = x / 1000 / m; break;
      case "mIU": x = x / m; break;
      case "uIU": x = x * 1000 / m; break;
      default: x = x / oq;
    }

    // 体积转换比较简单
    x = x * ov / v;

    // IU 和 mol 的转换不对，写个不支持吧
    // q yu oq 的 index: 0,1,2 是基本质量单位，3,4 是摩尔质量单位，5,6 是 IU 单位
    const q_idx = this.data.q_index, oq_idx = this.data.oq_index, m_idx = this.data.m_index;
    const q_mol = q_idx == 3 || q_idx == 4, oq_mol = oq_idx == 3 || oq_idx == 4,
          q_IU = q_idx == 5 || q_idx == 6, oq_IU = oq_idx == 5 || oq_idx == 6;
    if ((q_mol && oq_IU) || (q_IU && oq_mol)) x = "不支持";
    // 还需要判断一下单位选项卡和物质选项卡是否匹配
    // m_index < 4 是摩尔浓度
    else if (((q_mol || oq_mol) && m_idx > 3) || ((q_IU || oq_IU) && m_idx < 4)) x = "激素/单位不匹配";
    else if (isNaN(x)) x = "数值错误";
    else if (x < 0) x = "出错辣";

    // 保留两位有效数字的
    else if (x == 0) x = "";
    else if (x < 100000 && x >= 0.01) {
      x = Number(x.toFixed(4))  // 强制转换以排除精度问题
      // 避免整数也给加上多余的两位小数
      if (Math.round(x) != x) {
        if (x >= 0.1) x = x.toFixed(2); // 大于 0.1 的保留两位
        else x = x.toFixed(3);  // 小于 0.1 但大于 0.01 的保留三位小数
      }
      else x = x.toFixed(0);
    }
    else x = x.toExponential(2);
    this.setData({"outputValue": x});
  }
})

