var p_slider = document.getElementById("p_slider");
var p_output = document.getElementById("p_value");
p_output.innerHTML = p_slider.value; // Display the default slider value

var u_slider = document.getElementById("u_slider");
var u_output = document.getElementById("u_value");
var lnu = document.getElementById("lnu_value");
u_output.innerHTML = u_slider.value; // Display the default slider value
lnu.innerHTML = Math.log(u_slider.value).toFixed(4);

var K_slider = document.getElementById("K_slider");
var K_output = document.getElementById("K_value");
var lnK = document.getElementById("lnK_value");
K_output.innerHTML = K_slider.value; // Display the default slider value
lnK.innerHTML = Math.log(K_slider.value).toFixed(4);

var S0_slider = document.getElementById("S0_slider");
var S0_output = document.getElementById("S0_value");
var lnS0 = document.getElementById("lnS0_value");
S0_output.innerHTML = S0_slider.value; // Display the default slider value
lnS0.innerHTML = Math.log(S0_slider.value).toFixed(4);

var steps_slider = document.getElementById("steps_slider");
var steps_output = document.getElementById("steps_value");
steps_output.innerHTML = steps_slider.value; // Display the default slider value

var paths_slider = document.getElementById("paths_slider");
var paths_output = document.getElementById("paths_value");
paths_output.innerHTML = paths_slider.value; // Display the default slider value

var t1_slider = document.getElementById("t1_slider");
var t1_output = document.getElementById("t1_value");
t1_output.innerHTML = t1_slider.value; // Display the default slider value

var t2_slider = document.getElementById("t2_slider");
var t2_output = document.getElementById("t2_value");
t2_output.innerHTML = t2_slider.value; // Display the default slider value

var N_select = document.getElementById("simulation");
var N_output = document.getElementById("N_value");
N_output.innerHTML = N_select.value; // Display the default slider value

function openNav() {
  document.getElementById("menu").style.width = "25%";
}

function closeNav() {
  document.getElementById("menu").style.width = "0";
}

function rw() {
  var p = parseFloat(document.getElementById('p_slider').value);
  var u = parseFloat(document.getElementById('u_slider').value);
  var S0 = parseFloat(document.getElementById('S0_slider').value);
  var steps = parseFloat(document.getElementById('steps_slider').value);    
  var N = parseFloat(document.getElementById('simulation').value);
  var lnS = Math.log(S0);
  var lnu = Math.log(u);
  
  var rwm = Array2DVar(N, steps+1);
  for (var i = 0; i < N; i++){
      rwm[i][0] = lnS;
      for (var j = 1; j < steps+1; j++){
          rwm[i][j] = rwm[i][j-1] + lnu * getRandom(p);
      }
  }

  return rwm;
}

function update_rwPlot(rwm) {
  var t1 = parseFloat(document.getElementById('t1_slider').value);
  var t2 = parseFloat(document.getElementById('t2_slider').value);
  var paths = parseFloat(document.getElementById('paths_slider').value);
  var steps = parseFloat(document.getElementById('steps_slider').value);

  var bb = document.querySelector ('#rwPlot').getBoundingClientRect();
  var width = (bb.right - bb.left) - 20;

  var data1 = [];

  var xdata = [];
  for (var i = 0; i < paths; i++){
      xdata.push(range(0,1,steps));
  }

  var ydata = rwm.slice(0,paths);

  for(var i = 0; i < xdata.length; i++){
      var  result= {
          x: xdata[i],
          y: ydata[i],
          type: 'scatter',
          mode: 'lines',
          line: {
              dash: 'Solid',
              width: 1.5
          }
      };
      data1.push(result);
  }

  var layout1 = {
    title: {
      font: {size: 12},
      text: '<b>Asymmetric Random Walk</b>'
    },
    annotations: [{
      xref: 'paper',
      yref: 'paper',
      x: 0,
      xanchor: 'right',
      y: 1,
      yanchor: 'bottom',
      text: '<b>ln(S)</b>',
      font: {size: 10},
      showarrow: false
    }],
    xaxis: {
      title: {
        text: '<b>Steps</b>',
        font: {size: 10}
      },
      tickfont: {size: 10}
    },
    yaxis: {
      tickfont: {size: 10}
    },
    showlegend: false,
    shapes: [
      { 
          type: 'line', 
          yref: 'paper',
          x0: t1,
          y0: 0, 
          x1: t1, 
          y1: 1, 
          line: { 
              color: '#2f89a0', 
              width: 2.5, 
              dash: 'dash' 
          }
      },
      {
          type: 'line', 
          yref: 'paper',
          x0: t2,
          y0: 0, 
          x1: t2, 
          y1: 1, 
          line: { 
              color: '#eca62c', 
              width: 2.5, 
              dash: 'dash' 
          }
      }],
    width: width,
    height: width * 0.72,
    margin: {
      l: 30,
      r: 10,
      b: 25,
      t: 25,
    },
    paper_bgcolor: "#ffffff",
    plot_bgcolor:"#ffffff",
    hovermode: 'closest'
  };

  var config = {
    modeBarButtonsToRemove: ['zoom2d','select2d','pan2d','lasso2d','resetScale2d','zoomOut2d','zoomIn2d','toggleSpikelines'],
    modeBarButtonsToAdd: [{
      name: 'info',
      icon: Plotly.Icons.question,
      click: ()=>{
        $('#exampleModalCenter1').modal('show');
      }}]
  };

  Plotly.newPlot('rwPlot', data1, layout1, config);
}

function update_rwdPlot(rwm) {
  var steps = parseFloat(document.getElementById('steps_slider').value);
  var N = parseFloat(document.getElementById('simulation').value);
  var u = parseFloat(document.getElementById('u_slider').value);

  var bb1 = document.querySelector ('#rwPlot').getBoundingClientRect();
  var width1 = (bb1.right - bb1.left) - 20;
  var bb2 = document.querySelector ('#rwdPlot').getBoundingClientRect();
  var width2 = (bb2.right - bb2.left) - 20;

  var yy = [];
  for (var i = 0; i < N; i++){
    yy.push(rwm[i][steps]);
  }

  var data2 = [{
    y: yy,
    type: 'histogram',
    histnorm: 'probability',
    marker: {
      color: '#628ea5',
    },
    autobiny: false,
    ybins:{
      start: Math.min(yy),
      size: Math.log(u) * 2
    }
  }];

  var layout2 = {
      title: {
        font: {size: 10},
        text: '<b>Asymmetric Random Walk Dist.</b>'
      },
      annotations: [{
        xref: 'paper',
        yref: 'paper',
        x: 0,
        xanchor: 'right',
        y: 1,
        yanchor: 'bottom',
        text: '<b>ln(S)</b>',
        font: {size: 10},
        showarrow: false
      }],
      xaxis: {
        title: {
          text: '<b>Probability</b>',
          font: {size: 10}
        },
        tickfont: {size: 10}
      },
      yaxis: {
        tickfont: {size: 10}
      },
      showlegend: false,
      bargroupgap: 0.1,
      width: width2,
      height: width1 * 0.72,
      margin: {
        l: 30,
        r: 10,
        b: 25,
        t: 30,
      },
      paper_bgcolor: "#ffffff",
      plot_bgcolor:"#ffffff"
  };

  var config = {
    modeBarButtonsToRemove: ['zoom2d','select2d','pan2d','lasso2d','resetScale2d','zoomOut2d','zoomIn2d','toggleSpikelines'],
    modeBarButtonsToAdd: [{
      name: 'info',
      icon: Plotly.Icons.question,
      click: ()=>{
        $('#exampleModalCenter2').modal('show');
      }}]
  };

  Plotly.newPlot('rwdPlot', data2, layout2, config);
}

function update_rwddPlot(rwm) {
  var t1 = parseFloat(document.getElementById('t1_slider').value);
  var t2 = parseFloat(document.getElementById('t2_slider').value);
  var N = parseFloat(document.getElementById('simulation').value);
  var u = parseFloat(document.getElementById('u_slider').value);

  var bb = document.querySelector ('#rwddPlot').getBoundingClientRect();
  var width = (bb.right - bb.left) - 20;

  var xx1 = [];
  for (var i = 0; i < N; i++){
      xx1.push(rwm[i][t1]);
  }

  var xx2 = [];
  for (var i = 0; i < N; i++){
      xx2.push(rwm[i][t2]);
  }

  var data3 = [
      {
          x: xx1,
          type: 'histogram',
          histnorm: 'probability',            
          marker: {
              color: '#2f89a0',
          },
          autobinx: false,
          xbins:{
            start: Math.min(xx1),
            size: Math.log(u) * 2
          },
          opacity: 0.5
      },
      {
          x: xx2,
          type: 'histogram',
          histnorm: 'probability',            
          marker: {
              color: '#eca62c',
          },
          autobinx: false,
          xbins:{
            start: Math.min(xx2),
            size: Math.log(u) * 2
          },
          opacity: 0.5
      }
  ];

  var layout3 = {
      title: {
        font: {size: 12},
        text: '<b>Asymmetric Random Walk Distribution</b>'
      },
      annotations: [{
        xref: 'paper',
        yref: 'paper',
        x: 0,
        xanchor: 'right',
        y: 1,
        yanchor: 'bottom',
        text: '<b>Prob.</b>',
        font: {size: 10},
        showarrow: false
      }],
      xaxis: {
        title: {
          text: '<b>ln(S)</b>',
          font: {size: 10}
        },
        tickfont: {size: 10}
      },
      yaxis: {
        tickfont: {size: 10}
      },
      showlegend: false,
      bargroupgap: 0.1, 
      barmode: "overlay",
      width: width,
      height: width * 0.25,
      margin: {
        l: 35,
        r: 10,
        b: 25,
        t: 25,
      },
      paper_bgcolor: "#ffffff",
      plot_bgcolor:"#ffffff"
  }; 
  
  var config = {
    modeBarButtonsToRemove: ['zoom2d','select2d','pan2d','lasso2d','resetScale2d','zoomOut2d','zoomIn2d','toggleSpikelines'],
    modeBarButtonsToAdd: [{
      name: 'info',
      icon: Plotly.Icons.question,
      click: ()=>{
        $('#exampleModalCenter3').modal('show');
      }}]
  };
  
  Plotly.newPlot('rwddPlot', data3, layout3, config);
}

function grw(){
  var p = parseFloat(document.getElementById('p_slider').value);
  var u = parseFloat(document.getElementById('u_slider').value);
  var d = 1/u;
  var S0 = parseFloat(document.getElementById('S0_slider').value);
  var steps = parseFloat(document.getElementById('steps_slider').value);
  var N = parseFloat(document.getElementById('simulation').value);

  var grwm = Array2DVar(N, steps+1);
	for (var i = 0; i < N; i++){
    grwm[i][0] = S0;
    for (var j = 1; j < steps+1; j++){
      var z = Math.random();
      if (z < p) {
        grwm[i][j] = grwm[i][j-1] * u;
      }
      else {
        grwm[i][j] = grwm[i][j-1] * d;
      }      
    }
  }

  return grwm;
}

function update_grwPlot(grwm) {   
  var paths = parseFloat(document.getElementById('paths_slider').value);
  var steps = parseFloat(document.getElementById('steps_slider').value);
  var t1 = parseFloat(document.getElementById('t1_slider').value);
  var t2 = parseFloat(document.getElementById('t2_slider').value);

  var bb = document.querySelector ('#grwPlot').getBoundingClientRect();
  var width = (bb.right - bb.left) - 20; 

  var data1 = [];   
  
  var xdata = [];
  for (var i = 0; i < paths; i++){
      xdata.push(range(0,1,steps));
  }

  var ydata = grwm.slice(0,paths);

  for(var i = 0; i < xdata.length; i++){
      var  result= {
          x: xdata[i],
          y: ydata[i],
          type: 'scatter',
          mode: 'lines',
          line: {
              dash: 'Solid',
              width: 1.5
          }
      };
      data1.push(result);
  }

  var layout1 = {
    title: {
      font: {size: 12},
      text: '<b>Geometric Random Walk</b>'
    },
    annotations: [{
      xref: 'paper',
      yref: 'paper',
      x: 0,
      xanchor: 'right',
      y: 1,
      yanchor: 'bottom',
      text: '<b>S</b>',
      font: {size: 10},
      showarrow: false
    }],
    xaxis: {
      title: {
        text: '<b>Steps</b>',
        font: {size: 10}
      },
      tickfont: {size: 10}
    },
    yaxis: {
      tickfont: {size: 10}
    },
    showlegend: false,
    shapes: [
      { 
          type: 'line', 
          yref: 'paper',
          x0: t1,
          y0: 0, 
          x1: t1, 
          y1: 1, 
          line: { 
              color: '#2f89a0', 
              width: 2.5, 
              dash: 'dash' 
          }
      },
      {
          type: 'line', 
          yref: 'paper',
          x0: t2,
          y0: 0, 
          x1: t2, 
          y1: 1, 
          line: { 
              color: '#eca62c', 
              width: 2.5, 
              dash: 'dash' 
          }
      }],
    width: width,
    height: width * 0.72,
    margin: {
      l: 30,
      r: 10,
      b: 25,
      t: 25,
    },
    paper_bgcolor: "#ffffff",
    plot_bgcolor:"#ffffff",
    hovermode: 'closest'
  };

  var config = {
    modeBarButtonsToRemove: ['zoom2d','select2d','pan2d','lasso2d','resetScale2d','zoomOut2d','zoomIn2d','toggleSpikelines'],
    modeBarButtonsToAdd: [{
      name: 'info',
      icon: Plotly.Icons.question,
      click: ()=>{
        $('#exampleModalCenter4').modal('show');
      }}]
  };

  Plotly.newPlot('grwPlot', data1, layout1, config);
}

function update_grwdPlot(grwm) {
  var steps = parseFloat(document.getElementById('steps_slider').value);
  var N = parseFloat(document.getElementById('simulation').value);
  var u = parseFloat(document.getElementById('u_slider').value);

  var bb1 = document.querySelector ('#grwPlot').getBoundingClientRect();
  var width1 = (bb1.right - bb1.left) - 20;
  var bb2 = document.querySelector ('#grwdPlot').getBoundingClientRect();
  var width2 = (bb2.right - bb2.left) - 20;

  var yy = [];
  for (var i = 0; i < N; i++){
      yy.push(grwm[i][steps]);
  }

  var data2 = [{
      y: yy,
      type: 'histogram',
      histnorm: 'probability',
      marker: {
          color: '#628ea5',
      },
      autobiny: false,
      ybins:{
        start: Math.min(yy),
        size: Math.exp(Math.pow(u, 2 * u))
      }
  }];

  var layout2 = {
      title: {
        font: {size: 10},
        text: '<b>Geometric Random Walk Dist.</b>'
      },
      annotations: [{
        xref: 'paper',
        yref: 'paper',
        x: 0,
        xanchor: 'right',
        y: 1,
        yanchor: 'bottom',
        text: '<b>S</b>',
        font: {size: 10},
        showarrow: false
      }],
      xaxis: {
        title: {
          text: '<b>Probability</b>',
          font: {size: 10}
        },
        tickfont: {size: 10}
      },
      yaxis: {
        tickfont: {size: 10}
      },
      bargroupgap: 0.1,
      showlegend: false,
      width: width2,
      height: width1 * 0.72,
      margin: {
        l: 30,
        r: 10,
        b: 25,
        t: 30,
      },
      paper_bgcolor: "#ffffff",
      plot_bgcolor:"#ffffff"
  };

  var config = {
    modeBarButtonsToRemove: ['zoom2d','select2d','pan2d','lasso2d','resetScale2d','zoomOut2d','zoomIn2d','toggleSpikelines'],
    modeBarButtonsToAdd: [{
      name: 'info',
      icon: Plotly.Icons.question,
      click: ()=>{
        $('#exampleModalCenter5').modal('show');
      }}]
  };

  Plotly.newPlot('grwdPlot', data2, layout2, config);
}

function update_grwddPlot(grwm) {
  var t1 = parseFloat(document.getElementById('t1_slider').value);
  var t2 = parseFloat(document.getElementById('t2_slider').value);
  var N = parseFloat(document.getElementById('simulation').value);
  var u = parseFloat(document.getElementById('u_slider').value);

  var bb = document.querySelector ('#grwddPlot').getBoundingClientRect();
  var width = (bb.right - bb.left) - 20;

  var xx1 = [];
  for (var i = 0; i < N; i++){
      xx1.push(grwm[i][t1]);
  }

  var xx2 = [];
  for (var i = 0; i < N; i++){
      xx2.push(grwm[i][t2]);
  }

  var data3 = [
      {
          x: xx1,
          type: 'histogram',
          histnorm: 'probability',            
          marker: {
              color: '#2f89a0',
          },
          autobinx: false,
          xbins:{
            start: Math.min(xx1),
            size: Math.exp(Math.pow(u, 2 * u))
          },
          opacity: 0.5
      },
      {
          x: xx2,
          type: 'histogram',
          histnorm: 'probability',            
          marker: {
              color: '#eca62c',
          },
          autobinx: false,
          xbins:{
            start: Math.min(xx2),
            size: Math.exp(Math.pow(u, 2 * u))
          },
          opacity: 0.5
      }
  ];

  var layout3 = {
      title: {
        font: {size: 12},
        text: '<b>Geometric Random Walk Distribution</b>'
      },
      annotations: [{
        xref: 'paper',
        yref: 'paper',
        x: 0,
        xanchor: 'right',
        y: 1,
        yanchor: 'bottom',
        text: '<b>Prob.</b>',
        font: {size: 10},
        showarrow: false
      }],
      xaxis: {
        title: {
          text: '<b>S</b>',
          font: {size: 10}
        },
        tickfont: {size: 10}
      },
      yaxis: {
        tickfont: {size: 10}
      },
      showlegend: false,
      bargroupgap: 0.1, 
      barmode: "overlay",
      width: width,
      height: width * 0.25,
      margin: {
        l: 35,
        r: 10,
        b: 25,
        t: 25,
      },
      paper_bgcolor: "#ffffff",
      plot_bgcolor:"#ffffff"
  };

  var config = {
    modeBarButtonsToRemove: ['zoom2d','select2d','pan2d','lasso2d','resetScale2d','zoomOut2d','zoomIn2d','toggleSpikelines'],
    modeBarButtonsToAdd: [{
      name: 'info',
      icon: Plotly.Icons.question,
      click: ()=>{
        $('#exampleModalCenter6').modal('show');
      }}]
  };
  
  Plotly.newPlot('grwddPlot', data3, layout3, config);
}

function update_Simulated(rwm,grwm) {
  var steps = parseFloat(document.getElementById('steps_slider').value);
  var N = parseFloat(document.getElementById('simulation').value);
  var K = parseFloat(document.getElementById('K_slider').value);

  var yy1 = [];
  for (var i = 0; i < N; i++){
      yy1.push(rwm[i][steps]);
  }

  var mean1 = yy1.reduce((a, b) => a += b) / yy1.length;
  var var1 = yy1.map(x => Math.pow(x - mean1, 2)).reduce((a, b) => a+b) / yy1.length;
  var skew1 = yy1.map(x => Math.pow((x - mean1)/Math.sqrt(var1), 3)).reduce((a, b) => a+b) / yy1.length;
  var kurt1 = yy1.map(x => Math.pow((x - mean1)/Math.sqrt(var1), 4)).reduce((a, b) => a+b) / yy1.length;
  var call1 = yy1.map(x => Math.max(x - Math.log(K), 0)).reduce((a, b) => a+b) / yy1.length;
  var put1 = yy1.map(x => Math.max(Math.log(K) - x, 0)).reduce((a, b) => a+b) / yy1.length;

  mean_1s.innerHTML = mean1.toFixed(4);
  var_1s.innerHTML = var1.toFixed(4);
  skew_1s.innerHTML = skew1.toFixed(4);
  kurt_1s.innerHTML = kurt1.toFixed(4);
  call_1s.innerHTML = call1.toFixed(4);
  put_1s.innerHTML = put1.toFixed(4);

  var yy2 = [];
  for (var i = 0; i < N; i++){
      yy2.push(grwm[i][steps]);
  }

  var mean2 = yy2.reduce((a, b) => a += b) / yy2.length;
  var var2 = yy2.map(x => Math.pow(x - mean2, 2)).reduce((a, b) => a+b) / yy2.length;
  var skew2 = yy2.map(x => Math.pow((x - mean2)/Math.sqrt(var2), 3)).reduce((a, b) => a+b) / yy2.length;
  var kurt2 = yy2.map(x => Math.pow((x - mean2)/Math.sqrt(var2), 4)).reduce((a, b) => a+b) / yy2.length;
  var call2 = yy2.map(x => Math.max(x - K, 0)).reduce((a, b) => a+b) / yy2.length;
  var put2 = yy2.map(x => Math.max(K - x, 0)).reduce((a, b) => a+b) / yy2.length;

  mean_2s.innerHTML = mean2.toFixed(4);
  var_2s.innerHTML = var2.toFixed(4);
  skew_2s.innerHTML = skew2.toFixed(4);
  kurt_2s.innerHTML = kurt2.toFixed(4);
  call_2s.innerHTML = call2.toFixed(4);
  put_2s.innerHTML = put2.toFixed(4);
}

function update_Analytical() {
  var p = parseFloat(document.getElementById('p_slider').value);
  var u = parseFloat(document.getElementById('u_slider').value);
  var S0 = parseFloat(document.getElementById('S0_slider').value);
  var steps = parseFloat(document.getElementById('steps_slider').value);
  var K = parseFloat(document.getElementById('K_slider').value);
  var x0 = Math.log(S0);
  var dx = Math.log(u);

  var mean1 = x0 - steps * dx * (1 - 2 * p);
  var var1 = 4 * Math.pow(dx, 2) * steps * p * (1 - p);
  var skew1 = 8 * Math.pow(dx, 3) * steps * p * (1 - p) * (1 - 2 * p) / Math.pow(var1, 3 / 2);
  var kurt1 = 16 * Math.pow(dx, 4) * steps * p * (1 - p) * (1 + 3 * (steps - 2) * p - 3 * (steps - 2) * Math.pow(p, 2)) / Math.pow(var1, 2);    
  var call1 = 0;
  for (var m = Math.max(0, Math.round((Math.log(K) - x0) / (2*dx) + steps / 2)); m <= steps; m++) {
    call1 += C(steps, m) * Math.pow(p, m) * Math.pow(1 - p, steps - m) * ((2 * m - steps) * dx + x0 - Math.log(K));
  }
  var put1 = 0;
  for (var m = 0; m <= Math.round((Math.log(K) - x0) / (2*dx) + steps / 2); m++) {
    put1 += C(steps, m) * Math.pow(p, m) * Math.pow(1 - p, steps - m) * (Math.log(K) - x0 - (2 * m - steps) * dx);
  }

  var mean2 = S0 / Math.pow(u, steps) * A(u, 2, p, steps);
  var var2 = Math.pow(S0 / Math.pow(u, steps), 2) * (A(u, 4, p, steps) - A(u, 2, p, 2 * steps));
  var skew2 = Math.pow(S0 / Math.pow(u, steps), 3) * (A(u, 6, p, steps) - 3 * A(u, 4, p, steps) * A(u, 2, p, steps) + 2 * A(u, 2, p, 3 * steps)) / Math.pow(var2, 3 / 2);
  var kurt2 = Math.pow(S0 / Math.pow(u, steps), 4) * (A(u, 8, p, steps) - 4 * A(u, 6, p, steps) * A(u, 2, p, steps)) / Math.pow(var2, 2) + Math.pow(S0 / Math.pow(u, steps), 4) * (6 * A(u, 4, p, steps) * A(u, 2, p, 2 * steps) - 3 * A(u, 2, p, 4 * steps)) / Math.pow(var2, 2);
  var call2 = 0;
  for (var m = Math.max(0,  Math.round((Math.log(K) - x0) / (2*dx) + steps / 2)); m <= steps; m++) {
    call2 += C(steps, m) * Math.pow(p, m) * Math.pow(1 - p, steps - m) * (S0 * Math.pow(u, 2 * m - steps) - K);
  }
  var put2 = 0;
  for (var m = 0; m <= Math.round((Math.log(K) - x0) / (2*dx) + steps / 2); m++) {
    put2 += C(steps, m) * Math.pow(p, m) * Math.pow(1 - p, steps - m) * (K - S0 * Math.pow(u, 2 * m - steps));
  }

  mean_1a.innerHTML = mean1.toFixed(4);
  var_1a.innerHTML = var1.toFixed(4);
  skew_1a.innerHTML = skew1.toFixed(4);
  kurt_1a.innerHTML = kurt1.toFixed(4);
  call_1a.innerHTML = call1.toFixed(4);
  put_1a.innerHTML = put1.toFixed(4);

  mean_2a.innerHTML = mean2.toFixed(4);
  var_2a.innerHTML = var2.toFixed(4);
  skew_2a.innerHTML = skew2.toFixed(4);
  kurt_2a.innerHTML = kurt2.toFixed(4);
  call_2a.innerHTML = call2.toFixed(4);
  put_2a.innerHTML = put2.toFixed(4);
}

// Update the current slider value (each time you drag the slider handle)
p_slider.oninput = function() {
  p_output.innerHTML = this.value;
}
// p_slider.onchange = function() {
//   rwm = rw();
//   grwm = grw();  
//   update_rwPlot(rwm);
//   update_rwdPlot(rwm);
//   update_rwddPlot(rwm);
//   update_grwPlot(grwm);
//   update_grwdPlot(grwm);
//   update_grwddPlot(grwm);
//   update_Simulated(rwm,grwm);
//   update_Analytical();
// }

// Update the current slider value (each time you drag the slider handle)
u_slider.oninput = function() {
  u_output.innerHTML = this.value;
  lnu.innerHTML = Math.log(this.value).toFixed(4);
}
// u_slider.onchange = function() {
//   rwm = rw();
//   grwm = grw();
//   update_rwPlot(rwm);
//   update_rwdPlot(rwm);
//   update_rwddPlot(rwm);
//   update_grwPlot(grwm);
//   update_grwdPlot(grwm);
//   update_grwddPlot(grwm);
//   update_Simulated(rwm,grwm);
//   update_Analytical();
// }

// Update the current slider value (each time you drag the slider handle)
steps_slider.oninput = function() {
  steps_output.innerHTML = this.value;
  t1_slider.max = this.value;
  t2_slider.max = this.value;
}
// steps_slider.onchange = function() {
//   rwm = rw();
//   grwm = grw();
//   update_rwPlot(rwm);
//   update_rwdPlot(rwm);
//   update_rwddPlot(rwm);
//   update_grwPlot(grwm);
//   update_grwdPlot(grwm);
//   update_grwddPlot(grwm);
//   update_Simulated(rwm,grwm);
//   update_Analytical();
// }

// Update the current slider value (each time you drag the slider handle)
paths_slider.oninput = function() {
  paths_output.innerHTML = this.value;
}
paths_slider.onchange = function() {
  update_rwPlot(rwm);
  update_grwPlot(grwm);
}

// Update the current slider value (each time you drag the slider handle)
K_slider.oninput = function() {
  K_output.innerHTML = this.value;
  lnK.innerHTML = Math.log(this.value).toFixed(4);
}
K_slider.onchange = function() {
  update_Simulated(rwm,grwm);
  update_Analytical();
}

// Update the current slider value (each time you drag the slider handle)
S0_slider.oninput = function() {
  S0_output.innerHTML = this.value;
  lnS0.innerHTML = Math.log(this.value).toFixed(4);
}
// S0_slider.onchange = function() {
//   rwm = rw();
//   grwm = grw();
//   update_rwPlot(rwm);
//   update_rwdPlot(rwm);
//   update_rwddPlot(rwm);
//   update_grwPlot(grwm);
//   update_grwdPlot(grwm);
//   update_grwddPlot(grwm);
//   update_Simulated(rwm,grwm);
//   update_Analytical();
// }

// Update the current slider value (each time you drag the slider handle)
t1_slider.oninput = function() {
  t1_output.innerHTML = this.value;
  update_rwPlot(rwm);
  update_rwddPlot(rwm);
  update_grwPlot(grwm);
  update_grwddPlot(grwm);
}

// Update the current slider value (each time you drag the slider handle)
t2_slider.oninput = function() {
  t2_output.innerHTML = this.value;
  update_rwPlot(rwm);
  update_rwddPlot(rwm);
  update_grwPlot(grwm);
  update_grwddPlot(grwm);
}
  
simulation.onchange = function() {
  N_output.innerHTML = this.value;
  // rwm = rw();
  // grwm = grw();
  // update_rwPlot(rwm);
  // update_rwdPlot(rwm);
  // update_rwddPlot(rwm);
  // update_grwPlot(grwm);
  // update_grwdPlot(grwm);
  // update_grwddPlot(grwm);
  // update_Simulated(rwm,grwm);
  // update_Analytical();
}

function update_allPlot() {  
  update_rwPlot(rwm);
  update_rwdPlot(rwm);
  update_rwddPlot(rwm);
  update_grwPlot(grwm);
  update_grwdPlot(grwm);
  update_grwddPlot(grwm);
  update_Simulated(rwm,grwm);
  update_Analytical();
}

function simulate() {
  rwm = rw();
  grwm = grw();
  update_allPlot();
}

var rwm = rw();
var grwm = grw();
update_allPlot();

