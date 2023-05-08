// index.js
Page({
  data: {
    inputValue: undefined,
    outputValue: undefined,
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
    u_index: 0,
    UI: [
      {name: "泌乳素", value: 47170},
      {name: "卵泡刺激素", value: 113880},
      {name: "促黄体素", value: 46.56}
    ],
    show_mol: "display: none;",
    show_UI: "display: none;",
    show_mol_UI: "display: none;",
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

  getUI: function(input) {
    this.setData({
      u_index: input.detail.value
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
    // u = this.data.UI[this.data.u_index].value,
    oq = this.data.quality[this.data.oq_index].value,
    ov = this.data.volume[this.data.ov_index].value,
    empty = false;

    if (x == undefined || x == "") {
      this.setData({"outputValue": ""});
      empty = true;
    }

    // 动态显示 摩尔单位和 UI 单位
    var s = {"show_mol": "display: none;", "show_UI": "display: none;", "show_mol_UI": "display: none;",};
    // 先将输入转换为基本单位pg
    switch (q) {
      case "mol": x = x * m; s["show_mol"] = "display: inline-block;", s["show_mol_UI"] = "display: inline-block;";break;
      case "mol1000": x = x * 1000 * m; s["show_mol"] = "display: inline-block;", s["show_mol_UI"] = "display: inline-block;"; break;
      case "mIU": x = x * m; s["show_UI"] = "display: inline-block;", s["show_mol_UI"] = "display: inline-block;"; break;
      case "uIU": x = x * m / 1000; s["show_UI"] = "display: inline-block;", s["show_mol_UI"] = "display: inline-block;"; break;
      default: x = x * q;
    }

    // 再从基本单位pg转换为输出单位
    switch (oq) {
      case "mol": x = x / m; s["show_mol"] = "display: inline-block;", s["show_mol_UI"] = "display: inline-block;"; break;
      case "mol1000": x = x / 1000 / m; s["show_mol"] = "display: inline-block;", s["show_mol_UI"] = "display: inline-block;"; break;
      case "mIU": x = x / m; s["show_UI"] = "display: inline-block;", s["show_mol_UI"] = "display: inline-block;"; break;
      case "uIU": x = x / m / 1000; s["show_UI"] = "display: inline-block;", s["show_mol_UI"] = "display: inline-block;"; break;
      default: x = x / oq;
    }

    // 体积转换比较简单
    x = x * ov / v;

    this.setData(s);

    if (empty) return;
    else if (isNaN(q) && isNaN(oq)) {
      if ((q.match("mol") && oq.match("IU")) || (oq.match("mol") && q.match("IU")))
        x = "不支持";
    }
    else if (isNaN(x)) x = "数值错误";
    else if (x < 0) x = "出错辣";

    // 保留两位有效数字的
    else if (x == 0) x = "";
    else if (x < 10000 && x >= 0.1) x = x.toFixed(2);
    else x = x.toExponential(2);
    this.setData({"outputValue": x});
  }
})

