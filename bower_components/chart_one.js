// Send request
var request = new XMLHttpRequest();

request.open('GET', 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&apikey=ZYVKYF0NSPIXY9A1', true);
request.onload = function () {

  // Begin accessing JSON data here
  var data = JSON.parse(this.response);

  if (request.status >= 200 && request.status < 400) {
    var metadata = Object.keys(data["Meta Data"]);
    var sx = metadata[1];
    var date = metadata[2];
    var symb = data["Meta Data"][sx];
    var latest = data["Meta Data"][date];

    var daily = Object.keys(data["Time Series (Daily)"]);
    var day = [];
    var close = [];
    var length = 50;

    for (var i = length - 1; i >= 0; i--) {
      day.push(daily[i]);
    }

    var open = parseFloat(data["Time Series (Daily)"][day[length-1]]["1. open"]);
    var high = parseFloat(data["Time Series (Daily)"][day[length-1]]["2. high"]);
    var low = parseFloat(data["Time Series (Daily)"][day[length-1]]["3. low"]);
    var closenew = parseFloat(data["Time Series (Daily)"][day[length-1]]["4. close"]);
    var closeold = parseFloat(data["Time Series (Daily)"][day[length-2]]["4. close"]);
    var percent = ((closenew/closeold)-1)*100;

    for (var i = length - 1; i >= 0; i--) {
      close.push(+ data["Time Series (Daily)"][day[i]]["4. close"]);
    }

  for(var i=0; i<length;i++) close[i] = parseFloat(close[i], 10);
  close.reverse();

  console.log(symb);
  console.log(latest);
  console.log(open);
  console.log(high);
  console.log(low);
  console.log(closenew);
  console.log(closeold); 
  console.log(percent); 
  console.log(daily);
  console.log(day);
  console.log(length);
  console.log(close);
  } else {
    console.log('error');
  }


var chart = new Chartist.Line('.ct-chart', {
  labels: day,
  series: [close]
}, {
  AutoScaleAxis: true,
  fullWidth: true,
  axisX: {
    offset: 150,
  }
});

// Let's put a sequence number aside so we can use it in the event callbacks
var seq = 0,
  delays = 10,
  durations = 500;

// Once the chart is fully created we reset the sequence
chart.on('created', function() {
  seq = 0;
});

// On each drawn element by Chartist we use the Chartist.Svg API to trigger SMIL animations
chart.on('draw', function(data) {
  seq++;

  if(data.type === 'line') {
    // If the drawn element is a line we do a simple opacity fade in. This could also be achieved using CSS3 animations.
    data.element.animate({
      opacity: {
        // The delay when we like to start the animation
        begin: seq * delays + 1000,
        // Duration of the animation
        dur: durations,
        // The value where the animation should start
        from: 0,
        // The value where it should end
        to: 1
      }
    });
  } else if(data.type === 'label' && data.axis === 'x') {
    data.element.animate({
      y: {
        begin: seq * delays,
        dur: durations,
        from: data.y + 100,
        to: data.y,
        // We can specify an easing function from Chartist.Svg.Easing
        easing: 'easeOutQuart'
      }
    });
  } else if(data.type === 'label' && data.axis === 'y') {
    data.element.animate({
      x: {
        begin: seq * delays,
        dur: durations,
        from: data.x - 100,
        to: data.x,
        easing: 'easeOutQuart'
      }
    });
  } else if(data.type === 'point') {
    data.element.animate({
      x1: {
        begin: seq * delays,
        dur: durations,
        from: data.x - 10,
        to: data.x,
        easing: 'easeOutQuart'
      },
      x2: {
        begin: seq * delays,
        dur: durations,
        from: data.x - 10,
        to: data.x,
        easing: 'easeOutQuart'
      },
      opacity: {
        begin: seq * delays,
        dur: durations,
        from: 0,
        to: 1,
        easing: 'easeOutQuart'
      }
    });
  } else if(data.type === 'grid') {
    // Using data.axis we get x or y which we can use to construct our animation definition objects
    var pos1Animation = {
      begin: seq * delays,
      dur: durations,
      from: data[data.axis.units.pos + '1'] - 30,
      to: data[data.axis.units.pos + '1'],
      easing: 'easeOutQuart'
    };

    var pos2Animation = {
      begin: seq * delays,
      dur: durations,
      from: data[data.axis.units.pos + '2'] - 100,
      to: data[data.axis.units.pos + '2'],
      easing: 'easeOutQuart'
    };

    var animations = {};
    animations[data.axis.units.pos + '1'] = pos1Animation;
    animations[data.axis.units.pos + '2'] = pos2Animation;
    animations['opacity'] = {
      begin: seq * delays,
      dur: durations,
      from: 0,
      to: 1,
      easing: 'easeOutQuart'
    };

    data.element.animate(animations);
  }
});


}

request.send();

