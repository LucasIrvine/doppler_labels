var width = 960,
  height = 800,
  labelWidth = 185,
  labelHeight = 28,
  colors = ['#61c6d9', '#61d99c', '#a8d54c', '#adaf30', '#c49846', '#c46e46', '#c4464c', '#bf4280', '#bb46c4', '#976dff', '#6d85ff', '#81c2ff', '#83ba99', '#a0ad90', '#ad9090', '#9b90ad', '#88a4b5', '#0ca48a', '#bdbdbd', '#545454'],
  
  optColors = ['#83ba99', '#a0ad90', '#ad9090', '#9b90ad'],
  
  labelObj = [
    {
      'name':'edit',
      'x':-55,
      'click':function(){
       console.log('you clicked edit you turkey!!');
      }
    },
    {
      'name':'color',
      'x':-18,
      'click':function(){
       console.log('you clicked color you turkey!!');
      }
    },
    {
      'name':'arrow',
      'x':18,
      'click':function(){
       console.log('you clicked arrow you turkey!!');
      }
    },
    {
      'name':'delete',
      'x':55,
      'click':function(){
       console.log('you clicked delete you turkey!!');
      }
    }
  ];

var svg =
  d3.select('.labelWrap')
    .append('svg')
    .attr({
      'width':width,
      'height':height
    });

var showOptions = function(item){
  classCheck = d3.select(item).attr('class');

  var centerPointX =item.x.baseVal.value + (item.width.baseVal.value / 2),
  centerPointY = item.y.baseVal.value + (item.height.baseVal.value / 2);

  if(classCheck != 'labelRect optionsOpen'){
    d3.select(item).attr('class', 'labelRect optionsOpen');
   
  //add text
    svg.selectAll('.optionText')
      .data(labelObj)
      .enter()
        .append('svg:text')
        .attr({
          'class':'optionText',
          'x':centerPointX,
          'y':centerPointY,
          "text-anchor":"middle"
        })
        .style({'opacity':'0','fill':d3.rgb('#333'),'font-size':'10px'
        })
        .transition()
        .attr({
          'x':function(d,i){return centerPointX + d.x;},
          'y':function(d,i){return centerPointY - 28;}
        })
        .style({'opacity':'1','font-size':'10px'})
        .text(function(d,i){return d.name;});

    //add icons
    svg.selectAll('.optionIcon')
      .data(labelObj)
      .enter()
        .append('svg:image')
        .attr({
          'xlink:href':function(d,i){return '../img/' + d.name + '.png';},
          'class':'optionIcon',
          'x':centerPointX,
          'y':centerPointY,
          'width':0,
          'height':0
        })
        .style({'opacity':'0'})
        .transition()
        .attr({
          'x':function(d,i){return centerPointX + d.x - 10;},
          'y':function(d,i){return centerPointY - 65;},
          'width':20,
          'height':20
        })
        .style({'opacity':'1'});

    //add bubbles
    svg.selectAll('circle')
      .data(labelObj)
      .enter()
        .append('svg:circle')
        .attr({
          'class':'labelOptCirc',
          'r':1,
          'cx':centerPointX,
          'cy':centerPointY
        })
        .style({'opacity':'0','fill':d3.rgb('#666')})
        .on('mouseover', function(d,i){
          d3.select(this).style('stroke', d3.rgb('#666').darker(2));
        })
         .on('mouseout', function(d,i){
          d3.select(this).style('stroke', 'none');
        })
        .on('click', function(d,i){
          d.click();
        })
        .transition()
        .attr({
          'r':15,
          'cx':function(d,i){return centerPointX + d.x;},
          'cy':function(d,i){return centerPointY - 55;}
        })
        .style({'opacity':'0.5'});

    } else {
      //remove circles
      svg.selectAll('.labelOptCirc')
        .transition()
          .attr({
            'r':1,
            'cx':centerPointX,
            'cy':centerPointY
          })
          .style({'opacity':'0'})
          .remove();
      //remove text    
      svg.selectAll('.optionText')
        .transition()
          .attr({
            'x':centerPointX,
            'y':centerPointY,
          })
          .style({'opacity':'0','font-size':'1px'})
          .remove();
      //remove icons
      svg.selectAll('.optionIcon')
        .transition()
          .attr({
           'x':centerPointX,
            'y':centerPointY,
            'width':0,
            'height':0
          })
          .style({'opacity':'0'})
          .remove();

      //remove optionsOpen class
      d3.select(item).attr('class', 'labelRect');
    }
};

//get label data form server
d3.json('data/labels.json', function(labelData){

 //label text
  var labelText =
  svg.selectAll('text')
    .data(labelData.labels)
    .enter()
      .append('svg:text')
      .text(function(d,i){return d.name;})
      .attr({
        'class':'labelText',
        'x':function(d,i){len = this.getComputedTextLength(); return d.x + 5;},
        'y':function(d,i){return d.y + 20;}
      })
      .style('fill', '#000');

//grab text size alternative
//var bbox = labelText.node().getBBox();  then --- bbox.width

  //label rect
  svg.selectAll('rect')
    .data(labelData.labels)
    .enter()
      .append('svg:rect')
      .attr({
        'class':'labelRect',
        'width':len + 10,
        'height':labelHeight,
        'x':function(d,i){return d.x;},
        'y':function(d,i){return d.y;},
        'rx':6,
        'ry':6
      })
      .style({
        'fill':function(d,i){
          var rectColor = d3.rgb(d.color);
          return rectColor;
        },
        'stroke':function(d,i){
          var rectColor = d3.rgb(d.color);
          return rectColor.darker(2);
        },
        'stroke-width':1
      })
      .on('click', function(){
        showOptions(this);
        
      });
});




